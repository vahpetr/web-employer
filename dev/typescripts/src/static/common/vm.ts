import * as $ from "jquery";
import * as ko from "knockout";
import * as mediator from "mediator";

class BaseViewModel {
    _da: any;

    item: KnockoutObservable<any>;
    selected: KnockoutObservable<any>;
    items: KnockoutObservableArray<any>;
    loading: KnockoutObservable<boolean>;

    constructor(params: Object, da: any) {
        let config = ko.utils.extend({
          item: null,
          selected: null,
          items: [],
          loading: false
        }, params);

        this._da = da;
        this.item = ko.observable(config["item"]);
        this.selected = ko.observable(config["selected"]);
        this.items = ko.observableArray(config["items"]);
        this.loading = ko.observable(config["loading"]);
    }

    public add () {
        this.edit();
    }

    public edit (item?: any) {
        item = ko.utils.parseJson(ko.toJSON(item || {}));
        this.item(item);
    }

    public cancel () {
        mediator.broadcast("Canceled");
        window.history.back();
    }

    public editSelected () {
        let item = this.selected.peek();
        if (!item) return;
        this.edit(item);
    }

    public removeSelected ():  JQueryPromise<any> {
        let reject = $.Deferred<any>().reject();
        let item = this.selected.peek();
        if (!item) return reject;
        return this.remove(item);
    }

    public toggleSelected (item) {
        let selected = this.selected.peek();
        if (selected && selected.id === item.id) {
            this.selected(null);
        } else {
            this.selected(item);
        }
    }

    public isSelected (item) {
        let selected = this.selected();
        if (!selected) return false;
        return selected.id === item.id;
    }

    public load (filter): JQueryPromise<any> {
        let reject = $.Deferred<any>().reject();
        let loading = this.loading.peek();
        if (loading) return reject;
        this.loading(true);
        let self = this;
        return this._da.get(filter).always(function () {
            self.loading(false);
        }).done(function (result) {
            self.items(result.items);
            return result;
        });
    }

    public get (id): JQueryPromise<any> {
        let reject = $.Deferred<any>().reject();
        let loading = this.loading.peek();
        if (loading) return reject;
        this.loading(true);
        let self = this;
        return this._da.get(id).always(function () {
            self.loading(false);
        }).done(function (item) {
            self.item(item);
            return item;
        });
    }

    public remove (item): JQueryPromise<any> {
        let reject = $.Deferred<any>().reject();
        let result = window.confirm("Вы уверены что хотите удалить эту запись?");
        if (!result) {
        this.cancel();
        return reject;
        }
        if (!item.id) return reject;
        let loading = this.loading.peek();
        if (loading) return reject;
        this.loading(true);
        let self = this;
        return this._da.remove(item.id).always(function () {
            self.loading(false);
        }).fail(function () {
            self.cancel();
        });
    }
}

export = BaseViewModel;
