define(['jquery', 'ko', 'da/employers', 'mediator'],
function ($, ko, da, mediator) {
  function CommonLogout () {
    var vm = this

    vm.loading = ko.observable(false)

    vm.logout = logout
    vm.cancel = cancel

    function logout () {
      var reject = $.Deferred().reject()
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      return da.logout().always(function () {
        vm.loading(false)
      }).done(function () {
        mediator.broadcast('Logout')
      })
    }

    function cancel () {
      mediator.broadcast('Canceled')
      window.history.back()
    }

    return vm
  }
  return CommonLogout
})
