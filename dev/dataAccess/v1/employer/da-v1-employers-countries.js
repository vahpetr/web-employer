define(['jquery', 'scripts/dataAccess', 'errors'], function ($, Da, errors) {
  return new Da(root + 'api/v1/employer/countries', {
    getRegions: function (data) {
      var countryId = data.countryId
      delete data.countryId
      return $.GET(this.controller + '/' + countryId + '/regions', data).fail(errors.getRegions)
    },
    getCities: function (data) {
      var countryId = data.countryId
      delete data.countryId
      var regionId = data.regionId
      delete data.regionId
      if (!regionId) {
        return $.GET(this.controller + '/' + countryId + '/cities', data).fail(errors.getCities)
      } else {
        return $.GET(this.controller + '/' + countryId + '/regions/' + regionId + '/cities', data).fail(errors.getCities)
      }
    }
  })
})
