define(['jquery', 'ko', 'da/employers/drivers', 'mediator', 'vm/base'],
    function ($, ko, da, mediator, baseVm) {
      function EmployerDriversInvite (params) {
        params = ko.utils.extend({
          content: 'РОДИНА-МАТЬ зовёт! Вступай в ряды Т! На веки твой новый Boss.',
          driver: null
        }, params || {})

        var vm = this

        vm.cancel = cancel

        vm.content = ko.observable(params.driver.name + '. ' + params.content).extend({
          required: true,
          maxLength: 255
        })
        vm.driver = params.driver

        vm.loading = ko.observable(false)

        vm.invite = invite

        function invite () {
          var reject = $.Deferred().reject()
          if (!params.driver) return reject
          var isValid = vm.isValid()
          if (!isValid) return reject
          var loading = vm.loading.peek()
          if (loading) return reject
          vm.loading(true)
          var data = vm.toJS()
          return da.invite(data).always(function () {
            vm.loading(false)
          }).done(function () {
            vm.content('')
            cancel()
          })
        }

        function cancel () {
          mediator.broadcast('Canceled')
          window.history.back()
        }

        vm.errors = ko.validation.group(vm)
        vm.isValid = ko.computed(function () {
          var errors = vm.errors()
          var loading = vm.loading()
          var isValid = errors.length === 0
          vm.errors.showAllMessages(!isValid)
          return isValid && !loading
        })

        return vm
      }

      var prototype = EmployerDriversInvite.prototype = {
        toJS: function () {
          var content = this.content.peek()
          var dto = {
            content: content ? content.trim() : '',
            driverId: this.driver.id
          }
          return dto
        }
      }

      baseVm.addDisposePrototypes(prototype)

      return EmployerDriversInvite
    })
