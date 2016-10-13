define(['jquery', 'knockout', 'mediator'],
function ($, ko, mediator) {
  function addPrototypes (target) {
    ko.utils.extend(target, {
      add: function () {
        this.edit()
      },
      edit: function (item) {
        item = ko.utils.parseJson(ko.toJSON(item || {}))
        this.item(item)
      },
      cancel: function () {
        mediator.broadcast('Canceled')
        window.history.back()
      },
      editSelected: function () {
        var item = this.selected.peek()
        if (!item) return
        this.edit(item)
      },
      removeSelected: function () {
        var reject = $.Deferred().reject()
        var item = this.selected.peek()
        if (!item) return reject
        return this.remove(item)
      },
      toggleSelected: function (item) {
        var selected = this.selected.peek()
        if (selected && selected.id === item.id) {
          this.selected(null)
        } else {
          this.selected(item)
        }
      },
      isSelected: function (item) {
        var selected = this.selected()
        if (!selected) return false
        return selected.id === item.id
      },
      load: function (filter) {
        var reject = $.Deferred().reject()
        var loading = this.loading.peek()
        if (loading) return reject
        this.loading(true)
        var self = this
        return this._da.get(filter).always(function () {
          self.loading(false)
        }).done(function (result) {
          self.items(result.items)
          return result
        })
      },
      get: function (id) {
        var reject = $.Deferred().reject()
        var loading = this.loading.peek()
        if (loading) return reject
        this.loading(true)
        var self = this
        return this._da.get(id).always(function () {
          self.loading(false)
        }).done(function (item) {
          self.item(item)
          return item
        })
      },
      remove: function () {
        var reject = $.Deferred().reject()
        var item = this.item.peek()
        if (!item.id) return reject
        var loading = this.loading.peek()
        if (loading) return reject
        this.loading(true)
        var removing = this.removing.peek()
        if (removing) return reject
        this.removing(true)
        var self = this
        return this._da.remove(item.id).always(function () {
          self.loading(false)
          self.removing(false)
          self.cancel()
        })
      }
    })
    addDisposePrototypes(target)
  }
  function addDisposePrototypes (target) {
    ko.utils.extend(target, {
      dispose: function () {
        this.timers && ko.utils.arrayForEach(this.timers, function (timer) {
          clearTimeout(timer)
        })
        this.disposables && ko.utils.arrayForEach(this.disposables, this.disposeOne)
        this.disposeOne(this.isValid)
        ko.utils.objectForEach(this, this.disposeOne)
        this.mediatorId && mediator.remove(this.mediatorId)
      },
      disposeOne: function (propOrValue, value) {
        var disposable = value || propOrValue
        if (disposable && typeof disposable.dispose === 'function') {
          disposable.dispose()
        }
      }
    })
  }
  return {
    addPrototypes: addPrototypes,
    addDisposePrototypes: addDisposePrototypes
  }
})
