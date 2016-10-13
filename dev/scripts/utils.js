define(function () {
  var rnd = Math.random

  return {
    isEmpty: isEmpty,
    format: format,
    guid: guid,
    char16b: char16b
  }

  function isEmpty (text) {
    return !text.replace(/ /g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '')
  }
  function format (text, arg) {
    for (var i = 0, l = arg.length; i < l; i++) {
      text = text.replace(new RegExp('\\{' + i + '\\}', 'g'), arg[i])
    }
    return text
  }
  function guid () {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, char16b)
  }
  function char16b () {
    return (rnd() * 16 | 0).toString(16)
  }
})
