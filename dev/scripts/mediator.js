define([], function () {
  function Mediator () {
    this.components = {}
  }

  Mediator.prototype = {
    broadcast: function (event, args, context) {
      var e = event || false
      var a = args || []
      if (!e) return

      if (a.constructor !== Array) {
        a = [a]
      }
      console.log('mediator received', e, a)
      for (var c in this.components) {
        if (typeof this.components[c]['on' + e] === 'function') {
          var s = context || this.components[c]
          console.log('mediator calling ' + e + ' on ' + c)
          this.components[c]['on' + e].apply(s, a)
        }
      }
    },
    add: function (name, component, extend) {
      if (name in this.components) {
        if (extend) {
          for (var prop in component) {
            this.components[name][prop] && console.log(prop + ' overwriten!')
            this.components[name][prop] = component[prop]
          }
          return
        } else {
          throw new Error('mediator name conflict: ' + name)
        }
      }
      this.components[name] = component
    },
    remove: function (name) {
      if (!(name in this.components)) return
      delete this.components[name]
    },
    get: function (name) {
      return this.components[name]
    },
    contains: function (name) {
      return name in this.components
    }
  }

  var mediator = new Mediator()

  return mediator
})
