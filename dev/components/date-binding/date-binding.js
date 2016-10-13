define(['knockout', 'moment'], function (ko, moment) {
  function Nop (params) {
    return params
  };
  if (ko.bindingHandlers.date) return Nop
  ko.bindingHandlers.date = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      var value = valueAccessor()
      if (!ko.isObservable(value)) {
        if (value) {
          value = moment(value).format('DD.MM.YYYY') // HH:mm
        } else {
          value = '-'
        }
      }
      ko.bindingHandlers.text.init(element, valueAccessor, allBindings, viewModel, bindingContext)
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      var value = valueAccessor()
      var accessor = function () {
        var date = ko.unwrap(value)
        if (date) {
          return moment(date).format('DD.MM.YYYY') // HH:mm
        } else {
          return '-'
        }
      }
      ko.bindingHandlers.text.update(element, accessor, allBindings, viewModel, bindingContext)
    }
  }
  return Nop
})
