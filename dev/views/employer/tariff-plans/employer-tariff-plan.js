define(['jquery', 'ko', 'da/employers/tariff-plans', 'moment', 'mediator', 'vm/base'],
function ($, ko, da, moment, mediator, baseVm) {
  var KEY = 'employer-tariff-plan'
  function EmployerDriver (params) {
    var storage = !params.id && (ko.utils.parseJson(window.localStorage.getItem(KEY)) || {}) || {}
    storage = ko.utils.extend({
      id: 0,
      name: '',
      description: '',
      acceptedAt: null,
      pricePerMinute: undefined,
      pricePerKilometer: undefined,
      trafficJamVelocity: undefined,
      method: null,
      arrivalPrice: undefined,
      includedMinutes: undefined,
      freeWaitingMinutes: undefined,
      isEnabled: true
    }, storage)
    params = ko.utils.extend(storage, params || {})

    if (params.acceptedAt) {
      params.acceptedAt = moment(params.acceptedAt).toDate()
    }

    var vm = this

    vm.loading = ko.observable(false)

    vm.save = save
    vm.cancel = cancel

    vm.methods = ko.observableArray([])
    vm.methods.load = loadMethods

    vm.disposables = []

    vm.id = params.id

    vm.name = ko.observable(params.name).extend({
      required: true,
      maxLength: 128
    })
    vm.description = ko.observable(params.description).extend({
      required: true,
      maxLength: 2048
    })
    // TODO сделать валидатов в зависимости от метода
    vm.pricePerMinute = ko.observable(params.pricePerMinute).extend({
      number: true,
      min: 0,
      max: 10000
    })
    vm.pricePerKilometer = ko.observable(params.pricePerKilometer).extend({
      number: true,
      min: 0,
      max: 10000
    })
    vm.trafficJamVelocity = ko.observable(params.trafficJamVelocity).extend({
      required: true,
      number: true,
      min: 0,
      max: 100
    })
    vm.acceptedAt = ko.observable(params.acceptedAt).extend({
      required: true,
      date: true,
      min: moment().subtract(10, 'year').toDate(),
      max: moment().add(10, 'year').toDate()
    })
    vm.method = ko.observable(params.method).extend({
      required: true
    })
    vm.arrivalPrice = ko.observable(params.arrivalPrice).extend({
      number: true,
      min: 0,
      max: 10000
    })
    vm.includedMinutes = ko.observable(params.includedMinutes).extend({
      digit: true,
      min: 0,
      max: 100
    })
    vm.freeWaitingMinutes = ko.observable(params.freeWaitingMinutes).extend({
      digit: true,
      min: 0,
      max: 100
    })
    vm.isEnabled = ko.observable(params.isEnabled).extend({
      required: true
    })

    vm.errors = ko.validation.group(vm)
    vm.isValid = ko.computed(function () {
      var errors = vm.errors()
      var loading = vm.loading()
      var isValid = errors.length === 0
      vm.errors.showAllMessages(!isValid)
      return isValid && !loading
    })

    function cancel () {
      mediator.broadcast('Canceled', KEY)
      window.history.back()
    }

    function save (item) {
      var reject = $.Deferred().reject()
      var isValid = item.isValid()
      if (!isValid) return reject
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      var dto = item.toJS()
      return da.save(dto).always(function () {
        vm.loading(false)
      }).done(function () {
        cancel()
      })
    }

    function loadMethods (filter) {
      return da.getMethods(filter).done(function (result) {
        vm.methods(result.items)
        return result
      })
    }

    function load () {
      // $.Deferred(function(d) { d.resolve(vm.bodies.peek()); }).promise()
      var reject = $.Deferred().reject()
      var loading = vm.loading.peek()
      if (loading) return reject
      vm.loading(true)
      var queries = [
        loadMethods()
      ]

      return $.when.apply($, queries).done(function (methods) {
        // TODO допилить биндинг что бы так не извращаться
        var method = vm.method.peek()
        if (method) {
          method = methods.items.find(function (p) {
            return p.id === method.id
          })
          if (method) {
            vm.method(method)
          }
        }
      }).always(function () {
        vm.loading(false)
      })
    }

    load()

    if (vm.id) return vm

    vm.disposables.push(ko.computed(saveState).extend({rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }}))

    function saveState () {
      for (var key in vm) {
        if (!ko.isObservable(vm[key])) continue
        vm[key]()
      }
      var state = vm.toJS()
      window.localStorage.setItem(KEY, ko.toJSON(state))
    }

    return vm
  };

  var prototype = EmployerDriver.prototype = {
    toJS: function () {
      var method = this.method.peek()
      if (method) {
        method = {
          id: method.id
        }
      }
      var acceptedAt = this.acceptedAt.peek()
      if (acceptedAt) {
        acceptedAt = moment(acceptedAt).utc().startOf('day').format()
      }
      var dto = {
        id: this.id,
        name: this.name.peek(),
        description: this.description.peek(),
        acceptedAt: acceptedAt,
        pricePerMinute: this.pricePerMinute.peek(),
        pricePerKilometer: this.pricePerKilometer.peek(),
        trafficJamVelocity: this.trafficJamVelocity.peek(),
        method: method,
        arrivalPrice: this.arrivalPrice.peek(),
        includedMinutes: this.includedMinutes.peek(),
        freeWaitingMinutes: this.freeWaitingMinutes.peek(),
        isEnabled: this.isEnabled.peek()
      }
      return dto
    }
  }

  baseVm.addDisposePrototypes(prototype)

  return EmployerDriver
})
