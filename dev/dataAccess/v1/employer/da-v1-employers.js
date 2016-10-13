define(['jquery', 'scripts/dataAccess', 'errors'], function ($, Da, errors) {
  var daAccounts = new Da(root + 'api/v1/employer/accounts', {
    registration: function (data) {
      return $.POST(this.controller + '/email', data).fail(errors.registration)
    },
    activate: function (data) {
      return $.PUT(this.controller + '/code/confirm', data).fail(errors.activation)
    },
    login: function (data) {
      return $.PUT(root + 'api/v1/employer/tokens', data).fail(errors.login)
    },
    recovery: function (data) {
      return $.POST(this.controller + '/email/recover', data).fail(errors.recovery)
    },
    logout: function () {
      // TODO костыль для кривого апи
      return $.DELETE(root + 'api/v1/employer/tokens/current').fail(errors.logout)
    },
    acceptInvite: function (data) {
      return $.PUT(this.controller + '/email/accept-invite', data).fail(errors.acceptInvite)
    },
    recoveryConfirm: function (data) {
      return $.POST(this.controller + '/code/password', data).fail(errors.recoveryConfirm)
    }
  })
  // TODO супер костыль для кривого апи
  var daCompanies = new Da(root + 'api/v1/employer/companies')
  daAccounts.save = daCompanies.save

  // TODO супер костыль для кривого апи
  var daCurrent = new Da(root + 'api/v1/employer/companies/current')
  daAccounts.get = daCurrent.get
  daAccounts.update = daCurrent.update
  return daAccounts
})
