define(['es5-shim', 'es5-sham', 'json3', 'es6-shim', 'es6-sham'], function () {
  if (!window.Array.prototype.includes) {
    window.Array.prototype.includes = function (searchElement) {
      var O = Object(this)
      var len = parseInt(O.length) || 0
      if (len === 0) return false
      var n = parseInt(arguments[1]) || 0
      var k
      if (n >= 0) {
        k = n
      } else {
        k = len + n
        if (k < 0) {
          k = 0
        }
      }
      while (k < len) {
        var currentElement = O[k]
        if (searchElement === currentElement) return true
        k++
      }
      return false
    }
  }
}) // TODO добавить print polyfill
