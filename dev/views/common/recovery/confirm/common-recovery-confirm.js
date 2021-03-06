define(['jquery', 'ko', 'da/employers', 'vm/base'],
function ($, ko, da, baseVm) {
  function CommonRecoveryConfirm (params) {
    params = ko.utils.extend({
      code: ''
    }, params || {})

    var vm = this

    vm.code = ko.observable(params.code).extend({
      required: true,
      minLength: 32,
      maxLength: 32,
      pattern: '^[a-z0-9]+$'
    })
    vm.password = ko.observable().extend({
      required: true,
      maxLength: 32,
      minLength: 8
    })
    vm.passwordConfirm = ko.observable().extend({
      required: true,
      maxLength: 32,
      minLength: 8,
      equal: vm.password
    })

    vm.loading = ko.observable(false)

    vm.recoveryConfirm = recoveryConfirm

    function recoveryConfirm () {
      var reject = $.Deferred().reject()
      var isValid = vm.isValid()
      if (!isValid) return reject
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      var data = vm.toJS()
      return da.recoveryConfirm(data).always(function () {
        vm.loading(false)
      }).done(function () {
        vm.code('')
        vm.password('')
      })
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

  var prototype = CommonRecoveryConfirm.prototype = {
    toJS: function () {
      var dto = {
        code: this.code.peek(),
        password: this.password.peek()
      }
      return dto
    }
  }

  baseVm.addDisposePrototypes(prototype)

  return CommonRecoveryConfirm
})
