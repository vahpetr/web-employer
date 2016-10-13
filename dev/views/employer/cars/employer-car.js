define(['jquery', 'ko', 'da/employers/cars', 'da/employers/tariff-plans', 'da/employers/drivers', 'moment', 'mediator', 'vm/base'],
function ($, ko, da, daTariffPlans, daDrivers, moment, mediator, baseVm) {
  var KEY = 'employer-car'
  function EmployerCar (params) {
    var storage = !params.id && (ko.utils.parseJson(window.localStorage.getItem(KEY)) || {}) || {}
    storage = ko.utils.extend({
      id: 0,

      registrationPlate: '',
      photoRegistrationCertificate: '',

      manufactureYear: null,

      // лучше сделать отдельными объектом
      licenseNumber: '',
      licenseOwner: '',
      licenseIssued: '',
      licenseDate: null,
      photoLicense: '',

      insurance: '',
      photoInsurance: '',

      vehicleColor: null,
      vehicleBody: null,
      brand: null,
      vehicleModel: null,
      // чем просто тарифный план был плох?
      tariffPlanDescriptor: null,
      tariffPlanId: 0,
      isEnabled: true,

      colors: [],
      bodies: [],
      brands: [],
      models: [],
      tariffPlans: [],

      drivers: [],
      allowedDriverIds: [],
      selectedDrivers: []

    }, storage)
    params = ko.utils.extend(storage, params || {})

    if (params.manufactureYear) {
      params.manufactureYear = moment(params.manufactureYear, 'YYYY').utc().toDate()
    }

    if (params.licenseDate) {
      params.licenseDate = moment(params.licenseDate).toDate()
    }

    // TODO костыль из за серверного апи
    if (params.brandId) {
      params.brand = {
        id: params.brandId,
        name: 'loading'
      }
    }

    var vm = this

    vm.colors = ko.observableArray(params.colors)
    vm.bodies = ko.observableArray(params.bodies)
    vm.models = ko.observableArray(params.models)
    vm.brands = ko.observableArray(params.brands)
    vm.tariffPlans = ko.observableArray(params.tariffPlans)

    vm.loading = ko.observable(false)

    vm.save = save
    vm.cancel = cancel

    vm.loadColors = loadColors
    vm.loadBodies = loadBodies
    vm.loadBrands = loadBrands
    vm.loadModels = loadModels
    vm.loadTariffPlans = loadTariffPlans
    vm.loadDrivers = loadDrivers

    vm.disposables = []

    vm.id = params.id

    vm.registrationPlate = ko.observable(params.registrationPlate).extend({
      required: true
    })
    vm.photoRegistrationCertificate = ko.observable(params.photoRegistrationCertificate)

    vm.manufactureYear = ko.observable(params.manufactureYear).extend({
      required: true,
      date: true,
      min: moment().subtract(50, 'year').toDate(),
      max: moment().toDate()
    })

    vm.licenseNumber = ko.observable(params.licenseNumber).extend({
      required: true,
      minLength: 6,
      maxLength: 6
    })
    vm.licenseOwner = ko.observable(params.licenseOwner).extend({
      required: true
    })
    vm.licenseIssued = ko.observable(params.licenseIssued).extend({
      required: true
    })
    vm.licenseDate = ko.observable(params.licenseDate).extend({
      required: true,
      date: true,
      min: moment().subtract(100, 'year').toDate(),
      max: moment().toDate()
    })
    vm.photoLicense = ko.observable(params.photoLicense)

    vm.insurance = ko.observable(params.insurance).extend({
      required: true
    })
    vm.photoInsurance = ko.observable(params.photoInsurance)

    vm.color = ko.observable(params.vehicleColor).extend({
      required: true
    })
    vm.body = ko.observable(params.vehicleBody).extend({
      required: true
    })
    vm.brand = ko.observable(params.brand).extend({
      required: true
    })

    vm.model = ko.observable(params.vehicleModel).extend({
      required: true
    })
    vm.tariffPlan = ko.observable(params.tariffPlanDescriptor).extend({
      required: true
    })

    vm.isEnabled = ko.observable(params.isEnabled)

    vm.drivers = ko.observableArray(params.drivers)
    vm.selectedDrivers = ko.observableArray(params.selectedDrivers)

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
      var data = item.toJS()
      return da.save(data).always(function () {
        vm.loading(false)
      }).done(function () {
        cancel()
      })
    }

    function loadColors (filter) {
      return da.getColors(filter).done(function (result) {
        vm.colors(result.items)
        return result
      })
    }

    function loadBodies (filter) {
      return da.getBodies(filter).done(function (result) {
        vm.bodies(result.items)
        return result
      })
    }

    function loadBrands (filter) {
      return da.getBrands(filter).done(function (result) {
        vm.brands(result.items)
        return result
      })
    }

    function loadModels (filter) {
      return da.getModels(filter).done(function (result) {
        vm.models(result.items)
        return result
      })
    }

    function loadTariffPlans (filter) {
      return daTariffPlans.get(filter).done(function (result) {
        vm.tariffPlans(result.items)
        return result
      })
    }

    function loadDrivers (filter) {
      return daDrivers.get(filter).done(function (result) {
        vm.drivers(result.items)
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
        loadBodies(),
        loadColors(),
        loadBrands(),
        loadTariffPlans(),
        loadDrivers()
      ]

      var brand = vm.brand.peek()
      if (brand) {
        var modelsQuery = loadModels({
          brandId: brand.id
        })
        queries.push(modelsQuery)
      }

      return $.when.apply($, queries).done(function (bodies, colors, brands, tariffPlans, drivers, models) {
        // TODO допилить биндинг что бы так не извращаться
        var color = vm.color.peek()
        if (color) {
          color = colors[0].items.find(function (p) {
            return p.id === color.id
          })
          if (color) {
            vm.color(color)
          }
        }

        var body = vm.body.peek()
        if (body) {
          body = bodies[0].items.find(function (p) {
            return p.id === body.id
          })
          if (body) {
            vm.body(body)
          }
        }

        var brand = vm.brand.peek()
        if (brand) {
          brand = brands[0].items.find(function (p) {
            return p.id === brand.id
          })
          if (brand) {
            vm.brand(brand)
          }
        }

        var model = vm.model.peek()
        if (brand && model) {
          model = models[0].items.find(function (p) {
            return p.id === model.id
          })
          if (model) {
            vm.model(model)
          }
        }

        var tariffPlan = vm.tariffPlan.peek()
        if (tariffPlan) {
          tariffPlan = tariffPlans[0].items.find(function (p) {
            // tariffPlanId - почему не айди!
            return p.id === tariffPlan.tariffPlanId
          })
          if (tariffPlan) {
            vm.tariffPlan(tariffPlan)
          }
        }

        var selectedDrivers = []
        params.allowedDriverIds.forEach(function (id) {
          var driver = drivers[0].items.find(function (driver) {
            return driver.id === id
          })
          if (driver) {
            selectedDrivers.push(driver)
          }
        })
        vm.selectedDrivers(selectedDrivers)

        vm.disposables.push(vm.brand.subscribe(brandChanged))

        function brandChanged (brand) {
          if (brand) {
            loadModels({
              brandId: brand.id
            })
          }

          vm.models([])
          vm.model(null)
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

  var prototype = EmployerCar.prototype = {
    toJS: function () {
      var manufactureYear = this.manufactureYear.peek()
      if (manufactureYear) {
        manufactureYear = moment(manufactureYear).utc().year()
      }

      var licenseDate = this.licenseDate.peek()
      if (licenseDate) {
        licenseDate = moment(licenseDate).utc().startOf('day').format()
      }

      var color = this.color.peek()
      if (color) {
        color = { id: color.id }
      }

      var body = this.body.peek()
      if (body) {
        body = { id: body.id }
      }

      var model = this.model.peek()
      if (model) {
        model = { id: model.id }
      }

      var tariffPlan = this.tariffPlan.peek()

      var selectedDrivers = this.selectedDrivers.peek()
      var allowedDriverIds = selectedDrivers.map(function (driver) {
        return driver.id
      })

      var dto = {
        id: this.id,

        registrationPlate: this.registrationPlate.peek(),
        photoRegistrationCertificate: this.photoRegistrationCertificate.peek(),

        manufactureYear: manufactureYear,
        licenseNumber: this.licenseNumber.peek(),
        licenseOwner: this.licenseOwner.peek(),
        licenseIssued: this.licenseIssued.peek(),
        licenseDate: licenseDate,
        photoLicense: this.photoLicense.peek(),

        insurance: this.insurance.peek(),
        photoInsurance: this.photoInsurance.peek(),

        vehicleColor: color,
        vehicleBody: body,
        vehicleModel: model,

        tariffPlanId: tariffPlan ? tariffPlan.id : 0,
        isEnabled: this.isEnabled.peek(),
        allowedDriverIds: allowedDriverIds
      }
      return dto
    }
  }

  baseVm.addDisposePrototypes(prototype)

  return EmployerCar
})
