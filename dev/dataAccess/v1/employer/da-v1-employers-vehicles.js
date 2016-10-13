define(['jquery', 'scripts/dataAccess', 'errors'], function ($, Da, errors) {
  return new Da(root + 'api/v1/employer/vehicles', {
    getColors: function (data) {
      return $.GET(root + 'api/v1/employer/vehicle-colors', data).fail(errors.getColors)
    },
    getBodies: function (data) {
      return $.GET(root + 'api/v1/employer/vehicle-bodies', data).fail(errors.getBodies)
    },
    getBrands: function (data) {
      return $.GET(root + 'api/v1/employer/vehicle-brands', data).fail(errors.getBrands)
    },
    getClasses: function (data) {
      return $.GET(root + 'api/v1/employer/vehicle-classes', data).fail(errors.getClasses)
    },
    getModels: function (data) {
      var brandId = data.brandId
      delete data.brandId
      return $.GET(root + 'api/v1/employer/vehicle-brands/' + brandId + '/vehicle-models', data).fail(errors.getModels)
    }
  })
})
