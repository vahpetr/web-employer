define(['jquery', 'ko', 'da/employers/drivers', 'da/employers/countries', 'da/employers/cars', 'moment', 'mediator', 'utils', 'vm/base'],
function ($, ko, da, daCountries, daCars, moment, mediator, utils, baseVm) {
  var KEY = 'employer-deriver'
  function EmployerDriver (params) {
    var storage = !params.id && (ko.utils.parseJson(window.localStorage.getItem(KEY)) || {}) || {}
    storage = ko.utils.extend({
      view: 'default',
      id: 0,
      // surname: '',
      name: '',
      // patronymic: '',
      phone: '',
      email: '',
      birthDate: null,
      passport: '',
      country: null, // страна
      region: null, // регион
      city: null, // город рождения
      currentCity: null, // город проживания
      citizenship: null, // гражданство
      locality: '', // населённый пункт
      street: '', // улица
      home: '', // номер дома
      building: '', // номер строения
      room: '', // номер комнаты
      phone2: '',
      inn: '',
      driverExperienceDate: null,
      driverLicenseDate: null,
      workBeginDate: moment().utc().startOf('day').toDate(),
      gender: null,
      cars: [],
      selectedCars: [],
      allowedVehicleIds: [],

      loading: false,
      showAll: false
    }, storage)
    params = ko.utils.extend(storage, params || {})

    if (params.fio) {
      var arr = params.fio.split(' ')
      params.surname = arr[0] || params.surname
      params.name = arr[1] || params.name
      params.patronymic = arr[2] || params.patronymic
    }

    if (params.birthDate) {
      params.birthDate = moment(params.birthDate).toDate()
    }

    if (params.driverBeginDate) {
      params.driverBeginDate = moment(params.driverBeginDate).toDate()
    }

    if (params.driverExperienceDate) {
      params.driverExperienceDate = moment(params.driverExperienceDate).toDate()
    }

    if (params.driverLicenseDate) {
      params.driverLicenseDate = moment(params.driverLicenseDate).toDate()
    }

    if (params.workBeginDate) {
      params.workBeginDate = moment(params.workBeginDate).toDate()
    }

    var vm = this

    vm.view = params.view

    vm.loading = ko.observable(params.loading)
    vm.showAll = ko.observable(params.showAll || !!params.id)
    vm.showAll.on = showAllOn
    vm.showAll.off = showAllOff

    vm.save = save
    vm.cancel = cancel

    vm.loadCountries = loadCountries
    vm.loadCities = loadCities
    vm.loadRegions = loadRegions
    vm.loadCurrentCities = loadCurrentCities
    vm.loadRoles = loadRoles

    vm.disposables = []

    vm.roles = ko.observableArray(params.roles)
    vm.countries = ko.observableArray(params.countries)
    vm.cities = ko.observableArray(params.cities)
    vm.regions = ko.observableArray(params.regions)
    vm.currentCities = ko.observableArray(params.currentCities)
    vm.citizenships = [// заглушка
      {
        id: 1, caption: 'Гражданство 1'
      },
      {
        id: 2, caption: 'Гражданство 2'
      }
    ]

    vm.id = params.id

    // vm.surname = ko.observable(params.surname).extend({
    //   // required: true,
    //   maxLength: 64,
    //   pattern: '^[ёЁа-яА-Яa-zA-Z]+$'
    // })
    // vm.name = ko.observable(params.name).extend({
    //   // required: true,
    //   maxLength: 64,
    //   pattern: '^[ёЁа-яА-Яa-zA-Z]+$'
    // })
    // vm.patronymic = ko.observable(params.patronymic).extend({
    //   // required: true,
    //   maxLength: 64,
    //   pattern: '^[ёЁа-яА-Яa-zA-Z]+$'
    // })
    vm.name = ko.observable(params.name).extend({
      required: true,
      maxLength: 256
    })
    // vm.fio = ko.computed({ // pureComputed
    //   read: function () {
    //     var fio = vm.surname() + ' ' + vm.name() + ' ' + vm.patronymic()
    //     return fio.trim()
    //   },
    //   write: function (val) {
    //     var arr = val.replace('/ /g', ' ').split(' ')
    //     vm.surname(arr[0] || '')
    //     vm.name(arr[1] || '')
    //     vm.patronymic(arr[2] || '')
    //   }
    // }).extend({
    //   required: true,
    //   maxLength: 192,
    //   pattern: '^[ёЁа-яА-Яa-zA-Z ]+$',
    //   validation: [{
    //     validator: function (val) {
    //       var arr = val.replace('/ /g', ' ').split(' ')
    //       return arr.length === 3
    //     },
    //     message: 'ФИО заполнено не полностью'
    //   }, {
    //     validator: function (val) {
    //       var arr = val.replace('/ /g', ' ').split(' ')
    //       return !arr.some(function (val) {
    //         return utils.isEmpty(val)
    //       })
    //     },
    //     message: 'ФИО заполнено не полностью'
    //   }]
    // })
    vm.phone = ko.observable(params.phone).extend({
      required: true,
      minLength: 11,
      maxLength: 11,
      number: true,
      max: 99999999999
    })

    vm.email = ko.observable(params.email).extend({
      maxLength: 64,
      email: true
    })
    vm.birthDate = ko.observable(params.birthDate).extend({
      date: true,
      min: moment().subtract(100, 'year').toDate(),
      max: moment().subtract(18, 'year').toDate()
    })
    vm.passport = ko.observable(params.passport).extend({
      minLength: 12,
      maxLength: 12
    })
    vm.country = ko.observable(params.country)
    vm.region = ko.observable(params.region).extend()
    vm.city = ko.observable(params.city).extend()
    vm.currentCity = ko.observable(params.currentCity).extend()
    vm.citizenship = ko.observable(params.citizenship)
    vm.locality = ko.observable(params.locality).extend({// поидее нужно выберать из списка
      maxLength: 128
    })
    vm.street = ko.observable(params.street).extend({// поидее нужно выберать из списка
      maxLength: 128
    })
    vm.home = ko.observable(params.home).extend({
      maxLength: 10
    })
    vm.building = ko.observable(params.building).extend({
      maxLength: 10
    })
    vm.room = ko.observable(params.room).extend({
      maxLength: 10
    })
    vm.phone2 = ko.observable(params.phone2).extend({
      minLength: 11,
      maxLength: 11,
      number: true,
      max: 99999999999
    })
    vm.inn = ko.observable(params.inn).extend({// 10 - ФЛ, ИП //12 - ЮЛ
      minLength: 10,
      maxLength: 12,
      number: true,
      validation: [{
        validator: function (val) {
          if (!val) return true
          return !(val.length === 11)
        },
        message: 'Номер заполнен некорректно'
      }]
    })

    // TODO добавить валидацию - водительский стаж не может быть меньше чем дата рождения + 16 лет
    vm.driverExperienceDate = ko.observable(params.driverExperienceDate).extend({
      date: true,
      min: moment().subtract(100, 'year').toDate(),
      max: moment().toDate()
    })
    vm.driverLicenseDate = ko.observable(params.driverLicenseDate).extend({
      date: true,
      min: moment().subtract(100, 'year').toDate(),
      max: moment().toDate()
    })
    // TODO добавить валидацию - дата начала работы в такси не может быть раньше чем дата начала водительсного стажа
    vm.workBeginDate = ko.observable(params.workBeginDate).extend({
      date: true,
      min: moment().subtract(70, 'year').toDate(),
      max: moment().toDate()
    })
    vm.gender = ko.observable(params.gender)
    vm.role = ko.observable(params.role)

    vm.cars = ko.observableArray(params.cars)
    vm.selectedCars = ko.observableArray(params.selectedCars)
    vm.errors = ko.validation.group(vm)
    vm.isValid = ko.computed(function () {
      var errors = vm.errors()
      var loading = vm.loading()
      var isValid = errors.length === 0
      vm.errors.showAllMessages(!isValid)
      return isValid && !loading
    })

    function showAllOn (e) {
      if (vm.id) return
      vm.showAll(true)
    }

    function showAllOff (e) {
      if (vm.id) return
      vm.showAll(false)
    }

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
      // нормальное dto
      var dto = item.toJS()
      // серверное дто треш
      var serverDto = {
        id: dto.id,
        profile: {
          name: dto.name
        },
        login: dto.phone
      }
      return da.save(serverDto).always(function () {
        vm.loading(false)
      }).done(function () {
        cancel()
      })
    }

    function loadCountries (filter) {
      return daCountries.get(filter).done(function (result) {
        vm.countries(result.items)
        return result
      })
    }

    function loadCities (filter) {
      return daCountries.getCities(filter).done(function (result) {
        vm.cities(result.items)
        return result
      })
    }

    function loadRegions (filter) {
      return daCountries.getRegions(filter).done(function (result) {
        vm.regions(result.items)
        return result
      })
    }

    function loadCurrentCities (filter) {
      return daCountries.getCities(filter).done(function (result) {
        vm.currentCities(result.items)
        return result
      })
    }

    function loadRoles (filter) {
      return da.getRoles(filter).done(function (result) {
        vm.roles(result.items)
        return result
      })
    }

    function loadCars (filter) {
      return daCars.get(filter).done(function (result) {
        vm.cars(result.items)
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
        loadCountries(),
        loadRoles(),
        loadCars()
      ]

      var country = vm.country.peek()
      if (country) {
        var region = vm.region.peek()
        if (region) {
          var regionsQuery = loadRegions({
            countryId: country.id
          })
          queries.push(regionsQuery)

          var city = vm.city.peek()
          if (city) {
            var citiesQuery = loadCities({
              countryId: country.id,
              regionId: region.id
            })
            queries.push(citiesQuery)
          }
        }

        var currentCity = vm.currentCity.peek()
        if (currentCity) {
          var currentCitiesQuery = loadCurrentCities({
            countryId: country.id
          })
          queries.push(currentCitiesQuery)
        }
      }

      return $.when.apply($, queries).done(function (countries, roles, cars, regions, cities, currentCities) {
        // TODO допилить биндинг что бы так не извращаться
        var country = vm.country.peek()
        if (country) {
          country = countries[0].items.find(function (p) {
            return p.id === country.id
          })
          if (country) {
            vm.country(country)
          }
        }

        var role = vm.role.peek()
        if (role) {
          role = roles[0].items.find(function (p) {
            return p.id === role.id
          })
          if (role) {
            vm.role(role)
          }
        }

        var selectedCars = []
        params.allowedVehicleIds.forEach(function (id) {
          var car = cars[0].items.find(function (car) {
            return car.id === id
          })
          if (car) {
            selectedCars.push(car)
          }
        })
        vm.selectedCars(selectedCars)

        var region = vm.region.peek()
        if (region) {
          region = regions[0].items.find(function (p) {
            return p.id === region.id
          })
          if (region) {
            vm.region(region)
          }
        }

        if (cities) {
          var city = vm.city.peek()
          if (city) {
            city = cities[0].items.find(function (p) {
              return p.id === city.id
            })
            if (city) {
              vm.city(city)
            }
          }
        }

        if (currentCities) {
          var currentCity = vm.currentCity.peek()
          if (currentCity) {
            currentCity = currentCities[0].items.find(function (p) {
              return p.id === currentCity.id
            })
            if (currentCity) {
              vm.currentCity(currentCity)
            }
          }
        }

        vm.disposables.push(vm.country.subscribe(countryChanged))
        vm.disposables.push(vm.region.subscribe(regionChanged))

        function countryChanged (country) {
          if (country) {
            loadRegions({
              countryId: country.id
            })
            loadCurrentCities({
              countryId: country.id
            })
          } else {
            vm.regions([])
            vm.region(null)
          }
        }

        function regionChanged (region) {
          if (region) {
            var country = vm.country.peek()
            loadCities({
              countryId: country.id,
              regionId: region.id
            })
          } else {
            vm.cities([])
            vm.city(null)
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
      state.showAll = vm.showAll.peek()
      window.localStorage.setItem(KEY, ko.toJSON(state))
    }

    return vm
  };
  var prototype = EmployerDriver.prototype = {
    toJS: function () {
      var country = this.country.peek()
      if (country) {
        country = { id: country.id }
      }

      var role = this.role.peek()
      if (role) {
        role = { id: role.id }
      }

      var region = this.region.peek()
      if (region) {
        region = { id: region.id }
      }

      var city = this.city.peek()
      if (city) {
        city = { id: city.id }
      }

      var currentCity = this.currentCity.peek()
      if (currentCity) {
        currentCity = { id: currentCity.id }
      }

      var citizenship = this.citizenship.peek()
      if (citizenship) {
        citizenship = { id: citizenship.id }
      }

      var birthDate = this.birthDate.peek()
      if (birthDate) {
        birthDate = moment(birthDate).utc().startOf('day').format()
      }

      var driverExperienceDate = this.driverExperienceDate.peek()
      if (driverExperienceDate) {
        driverExperienceDate = moment(driverExperienceDate).utc().startOf('day').format()
      }

      var driverLicenseDate = this.driverLicenseDate.peek()
      if (driverLicenseDate) {
        driverLicenseDate = moment(driverLicenseDate).utc().startOf('day').format()
      }

      var workBeginDate = this.workBeginDate.peek()
      if (workBeginDate) {
        workBeginDate = moment(workBeginDate).utc().startOf('day').format()
      }

      var selectedCars = this.selectedCars.peek()
      var allowedCarsIds = selectedCars.map(function (car) {
        return car.id
      })

      var dto = {
        id: this.id,
        // surname: this.surname.peek(),
        name: this.name.peek(),
        // patronymic: this.patronymic.peek(),
        phone: this.phone.peek(),
        email: this.email.peek(),
        birthDate: birthDate,
        passport: this.passport.peek(),
        country: country,
        region: region,
        city: city,
        currentCity: currentCity,
        locality: this.locality.peek(),
        street: this.street.peek(),
        home: this.home.peek(),
        building: this.building.peek(),
        room: this.room.peek(),
        phone2: this.phone2.peek(),
        inn: this.inn.peek(),
        driverExperienceDate: driverExperienceDate,
        driverLicenseDate: driverLicenseDate,
        workBeginDate: workBeginDate,
        citizenship: citizenship,
        gender: this.gender.peek(),
        allowedVehicleIds: allowedCarsIds
        // role: role,
        // fio: this.fio.peek()
      }
      return dto
    }
  }

  baseVm.addDisposePrototypes(prototype)

  return EmployerDriver
})
