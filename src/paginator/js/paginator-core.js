function PaginatorCore () {}

PaginatorCore.NAME = 'paginator-core';

PaginatorCore.ATTRS = {
    /**
     Index of the first item on the page. 0-based
     @readOnly
     @attribute index
     @type Number
     **/
    index: {
        readOnly: true,
        getter: '_getIndex'
    },

    /**
     Index of the first item on the page. 1-based.
     @readonly
     @attribute itemIndex
     @type Number
     */
    itemIndex: {
        readOnly: true,
        getter: '_getItemIndex'
    },

    /**
     Maximum number of items per page. A value of negative one (-1) indicates
         all items on one page.
     @attribute itemsPerPage
     @type Number
     **/
    itemsPerPage: {
        value: 1,
        setter: '_itemsPerPageSetterFn'
    },

    /**
     Current page count. First page is 1
     @attribute page
     @type Number
     **/
    page: {
        value: 1,
        setter: '_pageSetterFn'
    },

    /**
     Total number of pages to display
     @readOnly
     @attribute pages
     @type Number
     **/
    pages: {
        readOnly: true,
        getter: '_getPages'
    },

    /**
     Total number of items in all pages.
     @attribute totalItems
     @type Number
     **/
    totalItems: {
        value: 1,
        setter: '_totalItemsSetterFn'
    },

    /**
     Allows next() and prev() when on the last and first pages.
     @attribute circular
     @type Boolean
     **/
    circular: {
        value: false
    }

};

PaginatorCore.prototype = {

    /**
     Sets the page to the designated page in the set.
     @method page
     */
    page: function (pageNumber) {
        if (pageNumber) {
            if (this.get('circular')) {
                pageNumber %= this.get('pages');
            }

            if (pageNumber >= 1 && pageNumber <= this.get('pages')){
                this.set('page', pageNumber);
            }
        }
    },

    /**
     Sets the page to the first page in the set.
     @method first
     */
    first: function () {
        if (this.hasPrev()) {
            this.page(1);
        }
    },

    /**
     Sets the page to the last page in the set.
     @method last
     */
    last: function () {
        if (this.hasNext()) {
            this.page(this.get('pages'));
        }
    },

    /**
     Sets the page to the previous page in the set.
     @method prev
     */
    prev: function () {
        if (this.hasPrev()) {
            this.page(this.get('page') - 1);
        }
    },

    /**
     Sets the page to the next page in the set.
     @method next
     */
    next: function () {
        if (this.hasNext()) {
            this.page(this.get('page') + 1);
        }
    },

    /**
     Sets the number of items per page and then tracks to page one.
     @method perPage
     */
    perPage: function (itemsPerPage) {
        if (!itemsPerPage) {
            return;
        }
        this.set('itemsPerPage', itemsPerPage);
        this.page(1);
    },

    /**
     Returns True if there is a previous page in the set.
     @method hasPrev
     @returns Boolean
     */
    hasPrev: function () {
        return this.get('circular') || (this.get('page') > 1);
    },

    /**
     Returns True if there is a previous page in the set.
     @method hasNext
     @returns Boolean
     */
    hasNext: function () {
        return this.get('circular') || (this.get('page') + 1 <= this.get('pages'));
    },

    ////////////////
    // PROTECTED
    ////////////////

    /**
     Returns the total number of pages based on the total number of
       items provided and the number of items per page
     @protected
     @method _getPages
     @returns Number
     */
    _getPages: function () {
        var itemsPerPage = this.get('itemsPerPage');

        if (itemsPerPage < 1) {
            return 1;
        } else {
            return Math.ceil(this.get('totalItems') / itemsPerPage);
        }
    },

    /**
     Returns the zero-based index of the first item on the page.
     @protected
     @method _getIndex
     @returns Number
     */
    _getIndex: function () {
        return (this.get('page') - 1) * this.get('itemsPerPage');
    },

    /**
     Returns the one-based index of the first item on the page.
     @protected
     @method _getItemIndex
     @returns Number
     */
    _getItemIndex: function () {
        return (this.get('page') - 1) * this.get('itemsPerPage') + 1;
    },

    /**
     Sets the current page to the value provided.
     @protected
     @method _pageSetterFn
     @returns Number
     */
    _pageSetterFn: function (val) {
        return parseInt(val, 10);
    },

    /**
     Sets the number of items to be displayed per page
     @protected
     @method _itemsPerPageSetterFn
     @returns Number
     */
    _itemsPerPageSetterFn: function (val) {
        if (!val) {
            return Y.Attribute.INVALID_VALUE;
        }

        if (val.toString().toLowerCase() === 'all' || val === '*') {
            val = this.get('totalItems');
            val = -1;
        }

        return parseInt(val, 10);
    },

    /**
     Sets the total number of items in the set.
     @protected
     @method _totalItemsSetterFn
     @returns Number
     */
    _totalItemsSetterFn: function (val) {
        return parseInt(val, 10);
    }

};

Y.namespace('Paginator').Core = PaginatorCore;
