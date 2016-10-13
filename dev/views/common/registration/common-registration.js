define(['jquery', 'ko', 'da/employers', 'mediator', 'utils', 'vm/base'],
function ($, ko, da, mediator, utils, baseVm) {
  function CommonRegistration (params) {
    params = ko.utils.extend({
      login: ''
    }, params || {})

    var vm = this

    vm.login = ko.observable(params.login).extend({
      required: true,
      maxLength: 64,
      email: true
    })

    vm.profile = ko.observable(params.profile).extend({
      required: true
    })
    vm.loading = ko.observable(false)

    vm.registration = registration

    function registration () {
      var reject = $.Deferred().reject()
      var isValid = vm.isValid()
      if (!isValid) return reject
      vm.loading(true)
      var data = vm.toJS()
      return da.registration(data).always(function () {
        vm.loading(false)
      }).done(function () {
        vm.login('')
        mediator.broadcast('Activation')
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

    vm.mediatorId = utils.guid()
    mediator.add(vm.mediatorId, {
      onAccountChanged: function (employer) {
        vm.profile(employer)
      }
    })

    return vm
  }
  var prototype = CommonRegistration.prototype = {
    toJS: function () {
      var profile = this.profile.peek()
      if (profile) {
        profile = profile.toJS()
      }
      var dto = {
        login: this.login.peek(),
        profile: profile
      }
      return dto
    }
  }

  baseVm.addDisposePrototypes(prototype)

  return CommonRegistration
})
