define(['jquery', 'ko', 'da/employers', 'vm/base'],
function ($, ko, da, baseVm) {
  function CommonRecovery (params) {
    params = ko.utils.extend({
      email: ''
    }, params || {})

    var vm = this

    vm.email = ko.observable(params.email).extend({
      required: true,
      maxLength: 64,
      email: true
    })

    vm.loading = ko.observable(false)

    vm.recovery = recovery

    function recovery () {
      var reject = $.Deferred().reject()
      var isValid = vm.isValid()
      if (!isValid) return reject
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      var data = vm.toJS()
      return da.recoveryRequest(data)
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
  var prototype = CommonRecovery.prototype = {
    toJS: function () {
      var dto = {
        email: this.email.peek()
      }
      return dto
    }
  }

  baseVm.addDisposePrototypes(prototype)

  return CommonRecovery
})
