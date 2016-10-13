define(['knockout', 'crossroads', 'hasher', 'authorization', 'mediator', 'utils', 'polyfill'],
function (ko, crossroads, hasher, authorization, mediator, utils) {
  function Route (params) {
    params = ko.utils.extend({
      sections: [],
      others: []
    }, params || {})
    var self = this

    self.sections = params.sections
    self.section = ko.observable(params.section)

    self.others = [
      { href: 'settings', name: 'common-settings' },
      { href: 'logout', name: 'common-logout' },
      { href: 'registration', name: 'common-registration' },
      { href: 'activation', name: 'common-activation' },
      { href: 'login', name: 'common-login' },
      { href: 'recovery', name: 'common-recovery' },
      {href: 'recovery-confirm', name: 'common-recovery-confirm'}
    ]

    self.others.push.apply(self.others, params.others)

    // todo необходимо перехватывать запрос и если не авторизован - редиректить
    function bind (routes, cb) {
      routes.forEach(function (route) {
        crossroads.addRoute(route.href + '/:action:/:id:/:?params:', function (action, id, params) {
          params = params || {}
          id && (params.id = id)
          action && (params.action = action)
          cb({
            route: route,
            params: params
          })
        }).rules = {
          id: /^[0-9]+$/,
          action: /^[a-z-]+$/
        }
      })
    }

    bind(self.sections, self.section)
    bind(self.others, self.section)

    crossroads.shouldTypecast = true
    crossroads.routed.add(console.log, console)
    crossroads.bypassed.add(console.log, console)

    var free = ['activation', 'login', 'recovery', 'registration']
    var parse = function (hash) {
      mediator.broadcast('Canceled')

      crossroads.parse(hash)

      var resource = hash.split('?')[0]
      if (free.includes(resource)) return
      
      if (authorization.isAuthorized()) {
        if (!utils.isEmpty(resource)) return
        hasher.setHash('messages')
        return
      }

      hasher.setHash('login')
    }
    hasher.initialized.add(parse)
    hasher.changed.add(parse)
    hasher.init()

    // TODO реализовать dispose
    mediator.add('route', {
      onActivation: function () {
        hasher.setHash('activation')
      },
      onLogin: function (token) {
        // TODO получается не универсально, переделать
        hasher.setHash('messages')
      },
      onLogout: function () {
        hasher.setHash('login')
      }
    })
  }

  return Route
})
