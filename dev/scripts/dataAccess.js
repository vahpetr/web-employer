define(['jquery', 'errors'],
function ($, errors) {
  $.GET = $.getJSON
  $.POST = $.post
  $.PUT = function (url, data, callback) {
    return $.ajax(url, {
      type: 'PUT',
      data: data,
      dataType: 'json',
      statusCode: {
        200: callback
      }
    })
  }
  $.DELETE = function (url, data, callback) {
    return $.ajax(url, {
      type: 'DELETE',
      data: data,
      dataType: 'text json',
      statusCode: {
        200: callback
      },
      converters: {
        'text json': function (data) {
          if (data === '') return null
          return $.parseJSON(data)
        }
      }
    })
  }
    // $.ajaxSettings.traditional = false;
  var DataAccess = function (controller) {
    var da = this
    da.controller = controller

    da.get = function (method, data) {
      return (function () {
        if (!method) {
          return $.GET(da.controller)
        }
        if (typeof data === 'number') {
          return $.GET(da.controller + '/' + method + '/' + data)
        }
        if (typeof method === 'string') {
          return $.GET(da.controller + '/' + method, data)
        }
        if (typeof method === 'object') {
          return $.GET(da.controller, method)
        }
        return $.GET(da.controller + '/' + method)
      })().fail(errors.load)
    }
    da.save = function (data) {
      if (data.id === 0) {
        return $.POST(da.controller, data).fail(errors.create)
      } else {
        return $.PUT(da.controller + '/' + data.id, data).fail(errors.update)
      }
    }
    da.create = function (data) {
      return $.POST(da.controller, data).fail(errors.create)
    }
    da.update = function (method, data) {
      if (typeof method === 'object') {
        return $.PUT(da.controller, method).fail(errors.update)
      } else {
        return $.PUT(da.controller + '/' + method, data).fail(errors.update)
      }
    }
    da.remove = function (data) {
      return (function () {
        if (Array.isArray(data)) {
          var ids = typeof data[0] === 'number' ? data : data.filter(function (i) { return i.id })
          return $.DELETE(da.controller, ids)
        }
        var id = typeof data === 'number' ? data : data.id
        return $.DELETE(da.controller + '/' + id)
      })().fail(errors.remove)
    }
    da.set = function (method, data) {
      return (function () {
        if (typeof data === 'number') {
          return $.PUT(da.controller + '/' + method + '/' + data)
        }
        return $.PUT(da.controller + '/' + method, data)
      })().fail(errors.set)
    }
    da.request = function (method, data) {
      return $.POST(da.controller + '/' + method, data).fail(errors.request)
    }
    da.jsnop = function (method, data) {
      return $.GET(da.controller + '/' + method + da.toJsnop(data)).fail(errors.jsnop)
    }
    da.toJsnop = function (data) {
      return '?callback=?&' + $.param(data)
    }
    da.toQuery = function (data) {
      return '?' + $.param(data)
    }

    return da
  }
// function getBaseUrl() {
//     return new RegExp(/^.*\//).exec(window.location.href);
// }
  return function (controller, methods) {
    if (!controller) {
      throw new Error('Не задан контроллер')
    }
    var Base = function () { }
    Base.prototype = new DataAccess(controller)
    for (var method in methods) {
      Base.prototype[method] = methods[method]
    }
    return new Base()
  }
})
