define(['jquery', 'ko', 'da/employers', 'mediator', 'vm/base'],
function ($, ko, da, mediator, baseVm) {
  function CommonLogin (params) {
    params = ko.utils.extend({
      grantType: 'password',
      username: '',
      password: ''
    }, params || {})

    var vm = this

    vm.grantType = params.grantType
    vm.username = ko.observable(params.username).extend({
      required: true,
      maxLength: 64,
      email: true
    })
    vm.password = ko.observable(params.password).extend({
      required: true,
      maxLength: 32
    })

    vm.loading = ko.observable(false)

    vm.enter = enter

    function enter () {
      var reject = $.Deferred().reject()
      var isValid = vm.isValid()
      if (!isValid) return reject
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      var data = vm.toJS()
      return da.login(data).always(function () {
        vm.loading(false)
      }).done(function (token) {
        vm.username('')
        vm.password('')
        mediator.broadcast('Login', token)
      })
    }

    vm.errors = ko.validation.group(vm)
    vm.isValid = ko.computed(function () {
      var errors = vm.errors()
      var loading = vm.loading()
      var isValid = errors.length === 0
    //   vm.errors.showAllMessages(!isValid)
      return isValid && !loading
    })

    return vm
  }

  var prototype = CommonLogin.prototype = {
    toJS: function () {
      var username = this.username.peek()
      var dto = {
        grant_type: this.grantType,
        username: username ? username.trim() : '',
        password: this.password.peek()
      }
      return dto
    }
  }

  baseVm.addDisposePrototypes(prototype)

  return CommonLogin
})
