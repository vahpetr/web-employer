define(['knockout', 'mediator'],
function (ko, mediator) {
  var KEY = 'employer-authorization'
  function Authorization (params) {
    var vm = this

    vm.intervalHandle = null
    vm.initInterval = initInterval
    vm.setExperieAt = setExperieAt

    vm.token = ko.observable()

    var token = rememberToken()
    vm.login(token)

    vm.isAuthorized = ko.computed(function () {
      var token = vm.token()
      return !!token
    })

    function rememberToken () {
      var value = window.sessionStorage.getItem(KEY)

      if (!value) return null

      var token = ko.utils.parseJson(value)
      if (Date.now() <= token.expireAt) return token

      window.sessionStorage.removeItem(KEY)
      return null
    }

    function setExperieAt (token) {
      if (token.expireAt) return
      token.expireAt = Date.now() + token.expires_in * 1000
    }

    function initInterval () {
      vm.intervalHandle = setInterval(function () {
        var token = vm.token.peek()
        if (Date.now() < token.expireAt) return
        vm.logout()
        mediator.broadcast('Logout')
      }, 1000)
    }

    return vm
  }
  Authorization.prototype = {
    login: function (token) {
      if (!token) return
      this.token(token)
      this.setExperieAt(token)
      var json = ko.toJSON(token)
      window.sessionStorage.setItem(KEY, json)
      this.initInterval()
    },
    logout: function () {
      clearInterval(this.intervalHandle)
      this.token(null)
      window.sessionStorage.removeItem(KEY)
    },
    dispose: function () {
      clearInterval(this.intervalHandle)
      this.isAuthorized.dispose()
    }
  }
  var authorization = new Authorization()
  return authorization
})
