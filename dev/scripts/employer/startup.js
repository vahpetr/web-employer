define(['ko', 'router', 'authorization', 'startup', 'scripts/employer/ko.components', 'domReady!'],
function (ko, Router, authorization) {
  function EmployerViewModel (params) {
    var vm = this
    vm.router = new Router({
      sections: [
        { href: 'messages', caption: 'Сообщения', icon: 'envelope', name: 'employer-messages' },
        { href: 'drivers', caption: 'Водители', icon: 'users', name: 'employer-drivers' },
        { href: 'cars', caption: 'Автомобили', icon: 'taxi', name: 'employer-cars' },
        { href: 'tariffs', caption: 'Тарифы', icon: 'tachometer', name: 'employer-tariff-plans' },
        { href: 'balance', caption: 'Баланс', icon: 'rub', name: 'employer-balance' },
        { href: 'reports', caption: 'Отчёты', icon: 'files-o', name: 'employer-reports' },
        { href: 'calendar', caption: 'Календарь', icon: 'calendar', name: 'employer-calendar' }
      ],
      others: [
        { href: 'profile', name: 'employer-account-self' }
      ]
    })
    vm.authorization = authorization
  }
  var vm = new EmployerViewModel()

  // for debug
  window.vm = vm
  window.ko = ko

  ko.applyBindings(vm)
})
