define(['knockout'], function (ko) {
  var register = ko.components.register
  register('employer-messages', {
    viewModel: { require: 'views/employer/messages/employer-messages' },
    template: { require: 'text!views/employer/messages/employer-messages.html' }
  })
  register('employer-drivers', {
    viewModel: { require: 'views/employer/drivers/employer-drivers' },
    template: { require: 'text!views/employer/drivers/employer-drivers.html' }
  })
  register('employer-drivers-invite', {
    viewModel: { require: 'views/employer/drivers/employer-drivers-invite' },
    template: { require: 'text!views/employer/drivers/employer-drivers-invite.html' }
  })
  register('employer-driver', {
    viewModel: { require: 'views/employer/drivers/employer-driver' },
    template: { require: 'text!views/employer/drivers/employer-driver.html' }
  })
  register('employer-driver-details', {
    viewModel: { require: 'views/employer/drivers/employer-driver' },
    template: { require: 'text!views/employer/drivers/employer-driver-details.html' }
  })
  register('employer-cars', {
    viewModel: { require: 'views/employer/cars/employer-cars' },
    template: { require: 'text!views/employer/cars/employer-cars.html' }
  })
  register('employer-car', {
    viewModel: { require: 'views/employer/cars/employer-car' },
    template: { require: 'text!views/employer/cars/employer-car.html' }
  })
  register('employer-balance', {
    viewModel: { require: 'views/employer/balance/employer-balance' },
    template: { require: 'text!views/employer/balance/employer-balance.html' }
  })
  register('employer-reports', {
    viewModel: { require: 'views/employer/reports/employer-reports' },
    template: { require: 'text!views/employer/reports/employer-reports.html' }
  })
  register('employer-calendar', {
    viewModel: { require: 'views/employer/calendar/employer-calendar' },
    template: { require: 'text!views/employer/calendar/employer-calendar.html' }
  })
  register('employer-account', {
    viewModel: { require: 'views/employer/account/employer-account' },
    template: { require: 'text!views/employer/account/employer-account.html' }
  })
  register('employer-account-self', {
    template: { require: 'text!views/employer/account/employer-account-self.html' }
  })
  register('employer-tariff-plans', {
    viewModel: { require: 'views/employer/tariff-plans/employer-tariff-plans' },
    template: { require: 'text!views/employer/tariff-plans/employer-tariff-plans.html' }
  })
  register('employer-tariff-plan', {
    viewModel: { require: 'views/employer/tariff-plans/employer-tariff-plan' },
    template: { require: 'text!views/employer/tariff-plans/employer-tariff-plan.html' }
  })
})
