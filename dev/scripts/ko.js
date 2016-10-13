define(['jquery', 'knockout', 'knockout-validation', 'knockout-switch-case',
'bootstrap-select-js', 'css!bootstrap-select-css', 'bootstrap-select-lang'], // TODO вынести bootstrap-select в компонент
function ($, ko) {
  ko.observable.fn.safe = function (prop, def) {
    def = def || '-'
    var item = this()
    if (item != null) {
      prop = item[prop]
      return (ko.isObservable(prop) ? prop() : prop) || def
    }
    return def
  };

  // TODO ни работает как компонент, пока глобально
  (function (binding) {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    var handler = function (e) {
      $(e.target).selectpicker('refresh')
    }
    ko.bindingHandlers.bs3options = {
      init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        binding.init(element, valueAccessor, allBindings, viewModel, bindingContext)
        var items = ko.unwrap(valueAccessor())
        // https://silviomoreto.github.io/bootstrap-select/options/
        var config = {
          liveSearch: items.length >= 7,
          mobile: isMobile,
          iconBase: 'fa',
          tickIcon: 'fa-check'
        }
        var el = $(element)
        el.on('change', handler)
        setTimeout(function () {
          el.selectpicker(config)
          el.selectpicker('refresh')
        }, 300)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
          el.off('change', handler)
          el.selectpicker('destroy')
        })
      },
      update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        binding.update(element, valueAccessor, allBindings, viewModel, bindingContext)
        var items = ko.unwrap(valueAccessor())
        var config = {
          liveSearch: items.length >= 7,
          mobile: isMobile,
          iconBase: 'fa',
          tickIcon: 'fa-check'
        }
        var el = $(element)
        setTimeout(function () {
          el.selectpicker('destroy')
          el.selectpicker(config)
          el.selectpicker('refresh')
        }, 300)
      }
    }
  })(ko.bindingHandlers.options)// не хорошо переписывать оригинальные функции, но я не хороший

  ko.bindingHandlers.detail = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      ko.bindingHandlers.text.init(element, function () {
        var value = ko.unwrap(valueAccessor())
        var item = ko.unwrap(value)
        if (item) {
          return item
        } else {
          return '-'
        }
      }, allBindings, viewModel, bindingContext)
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      ko.bindingHandlers.text.update(element, function () {
        var value = ko.unwrap(valueAccessor())
        var item = ko.unwrap(value)
        if (item) {
          return item
        } else {
          return '-'
        }
      }, allBindings, viewModel, bindingContext)
    }
  }

  ko.bindingHandlers.navigator = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      ko.bindingHandlers.attr.update(element, function () {
        var value = ko.unwrap(valueAccessor())
        var item = ko.unwrap(value.item)
        if (value.item) {
          return item ? { href: window.location.hash.split('/')[0] + '/' + value.action + '/' + item.id, disabled: false } : { href: 'javascript:;', disabled: true }// (window.root || '') +
        } else {
          return { href: window.location.hash.split('/')[0] + '/' + value.action, disabled: false }
        }
      }, allBindings, viewModel, bindingContext)
    }
  }

  var validationLocalization = {
    required: 'Необходимо заполнить поле',
    min: 'Значение должно быть больше или равно {0}',
    max: 'Значение должно быть меньше или равно {0}',
    minLength: 'Длина поля должна быть не меньше {0} символов',
    maxLength: 'Длина поля должна быть не больше {0} символов',
    pattern: 'Не допустимый символ или формат', // Пожалуйста проверьте это поле
    step: 'Значение поле должно изменяться с шагом {0}',
    email: 'Введите в поле правильный адрес email',
    date: 'Пожалуйста введите правильную дату',
    dateISO: 'Пожалуйста введите правильную дату в формате ISO',
    number: 'Поле должно содержать число',
    digit: 'Поле должно содержать цифры',
    phoneUS: 'Поле должно содержать правильный номер телефона',
    equal: 'Значения должны совпадать',
    notEqual: 'Пожалуйста выберите другое значение',
    unique: 'Значение должно быть уникальным'
  }

  ko.validation.rules.required = {
    validator: function (val, required) {
      if (!required) {
        return true
      }

      if (val === undefined || val === null) {
        return false
      }

      if (Array.isArray(val) && val.length) return true

      var stringTrimRegEx = /^\s+|\s+$/g
      var testVal = val

      if (typeof (val) === 'string') {
        testVal = val.replace(stringTrimRegEx, '')
      }

      return (testVal + '').length > 0
    },
    message: validationLocalization.required
  }

  ko.validation.localize(validationLocalization)

  // function rewriteRule(rule) {
  //     ko.validation.rules.date = {
  //         validator: rule.validator,
  //         message: function(params, observable) {
  //             var value = observable();
  //             if(!(value instanceof Date)) return rule.message;
  //             var text = moment(value).format('YYYY.MM.DD HH:mm');;
  //             return utils.format(rule.message, [text]);
  //         }
  //     };
  // }

  // rewriteRule(ko.validation.rules.min);
  // rewriteRule(ko.validation.rules.max);

  ko.validation.init({
    insertMessages: false,
    decorateElement: true,
    errorClass: 'has-error', // help-block not-valid
    errorElementClass: 'has-error',
    errorMessageClass: 'help-block', // validation-message
    errorsAsTitle: false,
    grouping: {
      deep: true,
      live: true,
      observable: true
    }
  }, true)

  var register = ko.components.register
  register('common-settings', {
    viewModel: { require: 'views/common/settings/common-settings' },
    template: { require: 'text!views/common/settings/common-settings.html' }
  })
  register('common-logout', {
    viewModel: { require: 'views/common/logout/common-logout' },
    template: { require: 'text!views/common/logout/common-logout.html' }
  })
  register('common-registration', {
    viewModel: { require: 'views/common/registration/common-registration' },
    template: { require: 'text!views/common/registration/common-registration.html' }
  })
  register('common-activation', {
    viewModel: { require: 'views/common/activation/common-activation' },
    template: { require: 'text!views/common/activation/common-activation.html' }
  })
  register('common-login', {
    viewModel: { require: 'views/common/login/common-login' },
    template: { require: 'text!views/common/login/common-login.html' }
  })
  register('common-recovery', {
    viewModel: { require: 'views/common/recovery/common-recovery' },
    template: { require: 'text!views/common/recovery/common-recovery.html' }
  })
  register('common-recovery-confirm', {
    viewModel: { require: 'views/common/recovery/confirm/common-recovery-confirm' },
    template: { require: 'text!views/common/recovery/confirm/common-recovery-confirm.html' }
  })
  register('news', {
    viewModel: { require: 'components/news/news' },
    template: { require: 'text!components/news/news.html' }
  })
  register('date-binding', {
    viewModel: { require: 'components/date-binding/date-binding' },
    template: { require: 'text!components/date-binding/date-binding.html' }
  })
  register('datetimepicker-binding', {
    viewModel: { require: 'components/datetimepicker-binding/datetimepicker-binding' },
    template: { require: 'text!components/datetimepicker-binding/datetimepicker-binding.html' }
  })
  register('spinner', {
    viewModel: { require: 'components/spinner/spinner' },
    template: { require: 'text!components/spinner/spinner.html' }
  })
  register('selectbox', {
    viewModel: { require: 'components/selectbox/selectbox' },
    template: { require: 'text!components/selectbox/selectbox.html' }
  })

  return ko
})
