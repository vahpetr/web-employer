define(['jquery', 'knockout', 'moment', 'bootstrap-datepicker', 'css!bootstrap-datepicker/css', 'moment/lang'],
    function ($, ko, moment) {
      function Noop (params) {
        return params
      };
      if (ko.bindingHandlers.dateTimePicker) return Noop
      ko.bindingHandlers.dateTimePicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
          // initialize datepicker with some optional options
          var options = allBindingsAccessor().dateTimePickerOptions || {}
          var config = {
            icons: {
              time: 'fa fa-clock-o',
              date: 'fa fa-calendar',
              up: 'fa fa-arrow-up',
              down: 'fa fa-arrow-down',
              previous: 'fa fa-chevron-left',
              next: 'fa fa-chevron-right',
              today: 'fa fa-deskto',
              clear: 'fa fa-trash',
              close: 'fa fa-times'
            },
            locale: 'ru',
            tooltips: {
              today: 'Перейти к сегодняшнему дню',
              clear: 'Очистить выбор',
              close: 'Закрыть',
              selectMonth: 'Выбрать месяц',
              prevMonth: 'Предидущий месяц',
              nextMonth: 'Следующий месяц',
              selectYear: 'Выбрать год',
              prevYear: 'Предидущий год',
              nextYear: 'Следующий год',
              selectDecade: 'Выбрать десятилетие',
              prevDecade: 'Предидущий десятилетие',
              nextDecade: 'Следующий десятилетие',
              prevCentury: 'Предидущий век',
              nextCentury: 'Следующий век',
              pickHour: 'Выбрать час',
              incrementHour: 'На час вперёд',
              decrementHour: 'На час назад',
              pickMinute: 'Выбрать минуту',
              incrementMinute: 'На минуту вперёд',
              decrementMinute: 'На минуту назад',
              pickSecond: 'Выбрать секунду',
              incrementSecond: 'На секунду вперёд',
              decrementSecond: 'На секунду назад',
              togglePeriod: 'Переключить период',
              selectTime: 'Выбрать время'
            },
            viewMode: 'years',
            format: 'DD.MM.YYYY'
          }
          ko.utils.extend(config, options)
          $(element).datetimepicker(config)

          // when a user changes the date, update the view model
          ko.utils.registerEventHandler(element, 'dp.change', function (event) {
            var value = valueAccessor()
            if (!ko.isObservable(value)) return

            var date = moment(event.date).startOf('day')

            // пока так
            // TODO добавить проерку не проставлять часы и минуты если они проставляются в компоненте
            var currDate = new Date()
            var hours = currDate.getHours()
            var minutes = currDate.getMinutes()
            date = date.add('h', hours).add('m', minutes).utc()

            // var date = moment(event.date)
            console.log(date.format())

            if (event.date != null && !(event.date instanceof Date)) {
              value(date.toDate())
            } else {
              value(date.format())
            }
          })

          ko.utils.registerEventHandler($(element).nextAll('.input-group-addon'), 'mousedown', function (event) {
            event.preventDefault()
            var picker = $(element).data('DateTimePicker')
            if (!picker) return
            picker.toggle()
          })

          ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var picker = $(element).data('DateTimePicker')
            if (!picker) return
            picker.destroy()
          })
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
          var picker = $(element).data('DateTimePicker')
          // when the view model is updated, update the widget
          if (!picker) return

          var value = ko.unwrap(valueAccessor())

          // in case return from server datetime i am get in this form for example /Date(93989393)/ then fomat this
          value = (typeof (value) !== 'object') ? new Date(parseFloat(value.replace(/[^0-9]/g, ''))) : value

          picker.date(value)
        }
      }
      return Noop
    })
