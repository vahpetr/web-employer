define(['jquery', 'scripts/dataAccess', 'errors'], function ($, Da, errors) {
  return new Da(root + 'api/v1/employer/drivers', {
    invite: function (data) {
      var driverId = data.driverId
      delete data.driverId
      return $.POST(this.controller + '/' + driverId + '/invite', data).fail(errors.inviteDriver)
    },
    getRoles: function (data) {
      return $.GET(root + 'api/v1/employer/roles', data).fail(errors.getRoles)
    }
  })
})
