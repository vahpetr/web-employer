define(['jquery', 'ko', 'da/employers', 'mediator', 'vm/base'],
function ($, ko, da, mediator, baseVm) {
  var KEY = 'employer-account'
  function EmployerAccount (params) {
    var storage = ko.utils.parseJson(window.localStorage.getItem(KEY)) || {}
    storage = ko.utils.extend({
      id: 0,
      name: '',
      view: 'default'
    }, storage)
    params = ko.utils.extend(storage, params || {})

    var vm = this

    vm.view = params.view

    vm.disposables = []

    vm.id = ko.observable(params.id)

    vm.name = ko.observable(params.name).extend({
      required: true,
      maxLength: 256,
      pattern: '^[ёЁа-яА-Яa-zA-Z "-]+$'
    })

    vm.loading = ko.observable(false)

    vm.load = load
    vm.save = save
    vm.update = update
    vm.cancel = cancel

    vm.errors = ko.validation.group(vm)
    vm.isValid = ko.computed(function () {
      var errors = vm.errors()
      var loading = vm.loading()
      var isValid = errors.length === 0
      vm.errors.showAllMessages(!isValid)
      var val = isValid && !loading
      return val
    })

    function cancel () {
      mediator.broadcast('AccountCanceled', KEY)
      window.history.back()
    }

    function save (item) {
      var reject = $.Deferred().reject()
      if (!item) return reject
      var isValid = item.isValid()
      if (!isValid) return reject
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      var data = item.toJS()
      return da.save(data).always(function () {
        vm.loading(false)
      }).done(function () {
        cancel()
      })
    }

    function update (item) {
      var reject = $.Deferred().reject()
      if (!item) return reject
      var isValid = item.isValid()
      if (!isValid) return reject
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      var data = item.toJS()
      return da.update(data).always(function () {
        vm.loading(false)
      }).done(function () {
        mediator.broadcast('Login')
      })
    }

    function load () {
      var reject = $.Deferred().reject()
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      return da.get().always(function () {
        vm.loading(false)
      }).done(function (user) {
        // TODO переделать
        vm.id(user.id)
        vm.name(user.name)
      })
      .fail(function () {
        cancel()
      })
    }

    // TODO решение не очень. переделать
    if (vm.view === 'current') {
      vm.load()
    }

    if (vm.id) return vm

    vm.disposables.push(ko.computed(saveState).extend({rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }}))

    function saveState () {
      for (var key in vm) {
        if (!ko.isObservable(vm[key])) continue
        vm[key]()
      }
      var employer = vm.toJS()
      mediator.broadcast('AccountChanged', vm)
      window.localStorage.setItem(KEY, ko.toJSON(employer))
    }

    return vm
  };

  var prototype = EmployerAccount.prototype = {
    toJS: function () {
      var name = this.name.peek()
      var dto = {
        id: this.id,
        name: name ? name.trim() : ''
      }
      return dto
    }
  }

  baseVm.addDisposePrototypes(prototype)

  return EmployerAccount
})
