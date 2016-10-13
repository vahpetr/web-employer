define(['ko', 'utils', 'vm/base', 'css!styles/selectbox'],
function (ko, utils, baseVm) {
  function SelectBox (params) {
    params = ko.utils.extend({
      view: 'selected',
      items: [],
      selected: null,
      search: '',
      getCaption: function (item) {
        // return item.caption
        return item.vehicleModel.fullName + ', ' + item.registrationPlate
      },
      getKey: function (item) {
        return item.id
      }
    }, params || {})

    var vm = this

    vm.disposables = []

    vm.items = params.items
    vm.selected = params.selected // ko.observableArray()

    vm.view = ko.observable(params.view)
    vm.search = ko.observable(params.search)

    vm.getCaption = params.getCaption
    vm.getKey = params.getKey

    vm.remove = remove
    vm.add = add
    vm.showSelected = showSelected
    vm.showAvailable = showAvailable
    vm.clearSearch = clearSearch

    vm.available = ko.pureComputed(function () {
      var items = vm.items()
      var selected = vm.selected()
      var available = []
      items.forEach(function (item) {
        var exist = selected.some(function (selected) {
          return vm.getKey(selected) === vm.getKey(item)
        })
        if (exist) return
        available.push(item)
      })
      return available
    })

    vm.filtred = ko.pureComputed(function () {
      var search = vm.search().toLowerCase()
      var available = vm.available()

      if (utils.isEmpty(search)) return available

      var filtred = available.filter(function (item) {
        return vm.getCaption(item).toLowerCase().includes(search)
      })
      return filtred
    })

    vm.disposables.push(vm.selected.subscribe(selectedHandler))
    vm.disposables.push(vm.available.subscribe(availableHandler))

    function clearSearch () {
      vm.search('')
    }

    function selectedHandler (selected) {
      if (selected.length !== 0) return
      showAvailable()
    }

    function availableHandler (available) {
      if (available.length !== 0) return
      showSelected()
    }

    function showSelected () {
      vm.view('selected')
    }

    function showAvailable () {
      vm.view('available')
    }

    function remove (item) {
      vm.selected.remove(item)
    }

    function add (item) {
      vm.selected.push(item)
    }
  }

  baseVm.addDisposePrototypes(SelectBox.prototype)

  return SelectBox
})
