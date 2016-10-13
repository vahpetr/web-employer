define(['jquery', 'authorization', 'progress', 'errors', 'mediator', 'bootstrap', 'polyfill'],
function ($, authorization, progress, errors, mediator) {
  window.onerror = function (errorMsg, url, lineNumber) {
    if (typeof errorMsg === 'string') {
      errors.page(errorMsg)
    }
    return false
  }

  $.xhrPool = []
  $.xhrPool.abortAll = function () {
    $(this).each(function (idx, jqXHR) {
      jqXHR.abort()
    })
    $.xhrPool.length = 0
  }
  $.support.cors = true
  $.ajaxSetup({
    beforeSend: function (jqXHR, settings) {
      progress.start()
      $.xhrPool.push(jqXHR)

      var token = authorization.token.peek()
      if (!token) return

      jqXHR.setRequestHeader('Authorization', 'bearer ' + token.access_token)
    },
    complete: function (jqXHR) {
      var index = $.xhrPool.indexOf(jqXHR)
      if (index > -1) {
        $.xhrPool.splice(index, 1)
        progress.inc()
      }
      if ($.xhrPool.length === 0) {
        progress.done(true)
      }
    }
  })

  $(document).ajaxError(function (event, res, settings, exception) {
    switch (res.status) {
      case 401:
      case 403:
      case 407: {
        mediator.broadcast('Logout')
        break
      }
      default: {
        break
      }
    }
  })

  function cancel (key) {
    $.xhrPool.abortAll()
    key && window.localStorage.removeItem(key)
  }

  mediator.add('startup', {
    onCanceled: cancel,
    onAccountCanceled: function (key) {
      cancel(key)
      if (authorization.isAuthorized()) {
        window.history.back()
      } else {
        mediator.broadcast('Logout')
      }
    },
    onLogin: function (token) {
      authorization.login(token)
    },
    onLogout: function () {
      authorization.logout()
    }
  })

  // for debug
  window.mediator = mediator
})
