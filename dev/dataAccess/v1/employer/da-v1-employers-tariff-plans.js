define(['jquery', 'scripts/dataAccess', 'errors'], function ($, Da, errors) {
  return new Da(root + 'api/v1/employer/tariff-plans', {
    getMethods: function (data) {
      return $.GET(root + 'api/v1/employer/price-calculation-methods', data).fail(errors.getMethods)
    }
  })
})
