define(['ko', 'da/employers/cars', 'vm/base'],
function (ko, da, baseVm) {
  function EmployerCars (params) {
    params = ko.utils.extend({
      item: null,
      selected: null,
      items: [],
      loading: false
    }, params)

    var vm = this
    vm._da = da

    vm.action = params.action
    vm.item = ko.observable(params.item)
    vm.selected = ko.observable(params.selected)
    vm.items = ko.observableArray(params.items)
    vm.loading = ko.observable(params.loading)
    vm.removing = ko.observable(params.removing)
    vm.showItems = ko.computed(function () {
      var item = vm.item()
      var loading = vm.loading()
      return !(item || loading)
    })
    vm.showSpinner = ko.computed(function () {
      var loading = vm.loading()
      var removing = vm.removing()
      return loading && !removing
    })

    switch (params.action) {
      case 'add': {
        vm.add()
        break
      }
      case 'edit': {
        if (!params.id) return
        vm.get(params.id).done(function (item) {
          vm.edit(item)
        }).fail(function () {
          vm.cancel()
        })
        break
      }
      case 'remove': {
        vm.item({ id: params.id })
        break
      }
      default: {
        vm.load().fail(function () {
          vm.cancel()
        })
        break
      }
    }
    return vm
  }

  baseVm.addPrototypes(EmployerCars.prototype)

  return EmployerCars
})
