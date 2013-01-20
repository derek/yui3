function PaginatorUrl () {
    PaginatorUrl.superclass.constructor.apply(this, arguments);
}

PaginatorUrl.ATTRS = {
    url: {}
};

Y.extend(PaginatorUrl, Y.Base, {
    prevUrl: function () {
        if (this.hasPrev()) {
            return this.formatUrl(this.get('page') - 1);
        }
        return null;
    },

    nextUrl: function () {
        if (this.hasNext()) {
            return this.formatUrl(this.get('page') + 1);
        }
        return null;
    },

    formatUrl: function (page) {
        var url = this.get('url');
        if (url) {
            return Y.Lang.sub(this.get('url'), {
                page: page || this.get('page')
            });
        }
        return null;
    }
});

Y.namespace('Paginator').Url = PaginatorUrl;

if (Y.Lang.isFunction(Y.Paginator)) {
    Y.Base.mix(Y.Paginator, [PaginatorUrl]);
}
