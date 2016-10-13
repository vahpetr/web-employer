define([], function () {
  return {
    load: function (data) {
      error('Ошибка загрузки данных', data)
    },
    create: function (data) {
      error('Ошибка при сохранении', data)
    },
    update: function (data) {
      error('Ошибка при обновлении', data)
    },
    remove: function (data) {
      error('Ошибка при удалении', data)
    },
    upload: function (data) {
      error('Ошибка при отправке файлов', data)
    },
    download: function (data) {
      error('Ошибка при скачивании файла', data)
    },
    set: function (data) {
      error('Ошибка при изменении', data)
    },
    request: function (data) {
      error('Ошибка при запросе', data)
    },
    jsnop: function (data) {
      error('Ошибка при обращении к другому серверу', data)
    },
    forbidden: function (data) {
      error('Отказано в доступе', data)
    },
    badRequest: function (data) {
      error('Плохой запрос', data)
    },
    page: function (data) {
      error('Ошибка на странице', data)
    },
    registration: function (data) {
      error('Ошибка при запросе регистрации', data)
    },
    activation: function (data) {
      error('Ошибка при активации аккаунта', data)
    },
    login: function (data) {
      error('Ошибка при входе на аккаунт', data)
    },
    recoveryRequest: function (data) {
      error('Ошибка при запросе восстановлении аккаунта', data)
    },
    logout: function (data) {
      error('Ошибка при выходе с аккаунта', data)
    },
    acceptInvite: function (data) {
      error('Ошибка при принятии приглашения', data)
    },
    recoveryConfirm: function (data) {
      error('Ошибка при восстановлении пароля', data)
    },
    inviteDriver: function (data) {
      error('Ошибка при отправке приглашения', data)
    },
    getBodies: function (data) {
      error('Ошибка при получении кузовов тс', data)
    },
    getBrands: function (data) {
      error('Ошибка при вполучении марок тс', data)
    },
    getClasses: function (data) {
      error('Ошибка при вполучении классов тс', data)
    },
    getColors: function (data) {
      error('Ошибка при получении цветов тс', data)
    },
    getModels: function (data) {
      error('Ошибка при получении моделей тс', data)
    },
    getRegions: function (data) {
      error('Ошибка при получении регионов страны', data)
    },
    getCities: function (data) {
      error('Ошибка при получении городов страны', data)
    },
    server: function (data) {
      error('Ошибка на сервере', data)
    },
    getMethods: function (data) {
      error('Ошибка при получении методов вычисления стоимости поездки', data)
    },
    getRoles: function (data) {
      error('Ошибка при получении списка ролей', data)
    }
  }

  function error (header, data) {
    if (data.statusText === 'abort') return
    require(['toastr', 'css!toastr'], function (toastr) {
      var message = ''
      // на прямую доступа к запросу options нет
      // когда в cors падает ошибка возвращается 0
      if (data.status === 0) {
        message = 'Метод не реализован на сервере'
      } else if (typeof data === 'string') {
        message = data
      } else if (data.responseJSON) {
        var res = data.responseJSON
        if (res.exceptionMessage) {
          var exception = res
          while ('innerException' in exception) {
            exception = exception.innerException
          }
          message = exception.exceptionMessage
          header = 'Исключение'
        } else if (res.modelState) {
          var modelState = res.modelState
          for (var model in modelState) {
            message = modelState[model].reduce(function (str, text) {
              return str + '\r\n' + text
            }, message)
          }
        } else if (res.errors) {
          message = res.errors.map(function (i) {
            return i.title
          }).join('\r\n')
        } else if (res.message) {
          message = res.message
        }
      }

      if (!message) {
        message = data.responseText
      }

      toastr.error(message, header, {
        closeButton: true,
        escapeHtml: true,
        debug: false,
        newestOnTop: true,
        progressBar: false,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        onclick: null,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000,
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      })
    })
  }
})
