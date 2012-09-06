if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/scrollview-paginator/scrollview-paginator.js",
    code: []
};
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].code=["YUI.add('scrollview-paginator', function (Y, NAME) {","","/**"," * Provides a plugin that adds pagination support to ScrollView instances"," *"," * @module scrollview-paginator"," */","var getClassName = Y.ClassNameManager.getClassName,","    SCROLLVIEW = 'scrollview',","    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),","    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),","    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : 'ui',","    INDEX = 'index',","    SCROLL_X = 'scrollX',","    SCROLL_Y = 'scrollY',","    TOTAL = 'total',","    HOST = 'host',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    SELECTOR = 'selector',","    FLICK = 'flick',","    DRAG = 'drag',","    AXIS = 'axis',","    DIM_X = 'x',","    DIM_Y = 'y';","","/**"," * Scrollview plugin that adds support for paging"," *"," * @class ScrollViewPaginator"," * @namespace Plugin"," * @extends Plugin.Base"," * @constructor"," */","function PaginatorPlugin() {","    PaginatorPlugin.superclass.constructor.apply(this, arguments);","}","","Y.extend(PaginatorPlugin, Y.Plugin.Base, {","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var paginator = this,","            host = paginator.get(HOST);","","        paginator._pageDims = [];","        paginator.padding = 1;","        paginator.optimizeMemory = false;","","        // Initialize & default","        if (config.optimizeMemory) {","            paginator.optimizeMemory = config.optimizeMemory;","        }","        ","        if (config.padding) {","            paginator.padding = config.padding;","        }","","        // Cache some values","        paginator._host = host;","        paginator._bb = host._bb;","        paginator._cb = host._cb;","        paginator._cIndex = paginator.get(INDEX);","        paginator._cAxis = paginator.get(AXIS);","","        paginator._bindAttrs();","    },","","    /**","     * ","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var paginator = this;","","        // Event listeners","        paginator.after({","            'indexChange': paginator._afterIndexChange,","            'axisChange': paginator._afterAxisChange","        });","","        // Host method listeners","        paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);","        paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);","        paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);","        paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);","        paginator.afterHostMethod('syncUI', paginator._afterHostSyncUI);","        ","        // Host event listeners","        paginator.afterHostEvent('render', paginator._afterHostRender);","        paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);","    },","","    /**","     * After host render","     *","     * @method _afterHostRender","     * @param {Event.Facade}","     * @protected","     */","    _afterHostRender: function (e) {","        var paginator = this,","            bb = paginator._bb,","            host = paginator._host,","            index = paginator._cIndex,","            paginatorAxis = paginator._cAxis,","            pageNodes = paginator._getPageNodes(),","            size = pageNodes.size(),","            maxScrollX = paginator._pageDims[index].maxScrollX,","            maxScrollY = paginator._pageDims[index].maxScrollY;","","        if (paginatorAxis[DIM_Y]) {","            host._maxScrollX = maxScrollX;","        }","        else if (paginatorAxis[DIM_X]) {","            host._maxScrollY = maxScrollY;","        }","","        // Set the page count","        paginator.set(TOTAL, size);","","        // Jump to the index","        if (index !== 0) {","            paginator.scrollToIndex(index, 0);","        }","","        // Add the paginator class","        bb.addClass(CLASS_PAGED);","","        paginator._optimize();","    },","","    /**","     * After host syncUI","     *","     * @method _afterHostSyncUI","     * @param {Event.Facade}","     * @protected","     */","    _afterHostSyncUI: function (e) {","        var paginator = this,","            host = paginator._host,","            hostFlick = host.get(FLICK),","            paginatorAxis;","","        // If paginator's 'axis' property is to be automatically determined, inherit host's property","        if (paginator._cAxis === undefined) {","            paginator._set(AXIS, host.get(AXIS));","        }","","        paginatorAxis = paginator.get(AXIS);","","        // Don't allow flicks on the paginated axis","        if (paginatorAxis[hostFlick.axis]) {","            host.set(FLICK, false);","        }","    },","","    /**","     * After host _uiDimensionsChange","     *","     * @method _afterHostUIDimensionsChange","     * @param {Event.Facade}","     * @protected","     */","    _afterHostUIDimensionsChange: function (e) {","","        var paginator = this,","            host = paginator._host,","            bb = paginator._bb,","            widgetWidth = bb.get('offsetWidth'),","            widgetHeight = bb.get('offsetHeight'),","            pageNodes = paginator._getPageNodes();","","        // Inefficient. Should not reinitialize every page every syncUI","        pageNodes.each(function (node, i) {","            var scrollWidth = node.get('scrollWidth'),","                scrollHeight = node.get('scrollHeight'),","                maxScrollX = Math.max(0, scrollWidth - widgetWidth), // Math.max to ensure we don't set it to a negative value","                maxScrollY = Math.max(0, scrollHeight - widgetHeight);","","            // Don't initialize any page _pageDims that already have been.","            if (!paginator._pageDims[i]) {","","                paginator._pageDims[i] = {","","                    // Current scrollX & scrollY positions (default to 0)","                    scrollX: 0,","                    scrollY: 0,","","                    // Minimum scrollable values","                    _minScrollX: 0,","                    _minScrollY: 0,","","                    // Maximum scrollable values","                    maxScrollX: maxScrollX,","                    maxScrollY: maxScrollY","                };","","            } else {","                paginator._pageDims[i].maxScrollX = maxScrollX;","                paginator._pageDims[i].maxScrollY = maxScrollY;","            }","","        });","    },","","    /**","     * Executed before host.scrollTo","     *","     * @method _beforeHostScrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] Duration, in ms, of the scroll animation (default is 0)","     * @param {String} [easing] An easing equation if duration is set","     * @param {String} [node] The node to move","     * @protected","     */","    _beforeHostScrollTo: function (x, y, duration, easing, node) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            index = paginator._cIndex,","            paginatorAxis = paginator._cAxis,","            pageNodes = this._getPageNodes(),","            gestureAxis;","","        if (gesture) {","            gestureAxis = gesture.axis;","","            // Null the opposite axis so it won't be modified by host.scrollTo","            if (gestureAxis === DIM_Y) {","                x = null;","            } else {","                y = null;","            }","","            // If they are scrolling against the specified axis, pull out the page's node to have its own offset","            if (paginatorAxis[gestureAxis] === false) {","                node = pageNodes.item(index);","            }","","        }","","        // Return the modified argument list","        return new Y.Do.AlterArgs(\"new args\", [x, y, duration, easing, node]);","    },","","    /**","     * Executed after host._gestureMoveEnd","     * Determines if the gesture should page prev or next (if at all)","     *","     * @method _afterHostGestureMoveEnd","     * @param {Event.Facade}","     * @protected","     */","    _afterHostGestureMoveEnd: function (e) {","        var paginator = this,","            host = paginator._host,","            gesture = host._gesture,","            paginatorAxis = paginator._cAxis,","            gestureAxis = gesture && gesture.axis;","","        if (paginatorAxis[gestureAxis]) {","            if (gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')] > 0) {","                paginator[host.rtl ? 'prev' : 'next']();","            } else {","                paginator[host.rtl ? 'next' : 'prev']();","            }","        }","    },","","    /**","     * Executed before host._mousewheel","     * Prevents mousewheel events in some conditions","     *","     * @method _beforeHostMousewheel","     * @param {Event.Facade}","     * @protected","     */","    _beforeHostMousewheel: function (e) {","        var paginator = this,","            host = paginator._host,","            bb = host._bb,","            isForward = e.wheelDelta < 0, // down (negative) is forward. @TODO Should revisit.","            paginatorAxis = paginator._cAxis;","","        // Set the axis for this event.","        // @TODO: This is hacky, it's not a gesture. Find a better way","        host._gesture = {","            axis: DIM_Y","        };","","        // Only if the mousewheel event occurred on a DOM node inside the BB","        if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {","","            if (isForward) {","                paginator.next();","            } else {","                paginator.prev();","            }","","            // prevent browser default behavior on mousewheel","            e.preventDefault();","","            // Block host._mousewheel from running","            return new Y.Do.Prevent();","        }","    },","","    /**","     * Executes after host's 'scrollEnd' event","     * Runs cleanup operations","     *","     * @method _afterHostScrollEnded","     * @param {Event.Facade}","     * @protected","     */","    _afterHostScrollEnded: function (e) {","        var paginator = this,","            host = paginator._host,","            index = paginator._cIndex,","            scrollX = host.get(SCROLL_X),","            scrollY = host.get(SCROLL_Y),","            paginatorAxis = paginator._cAxis;","","        if (paginatorAxis[DIM_Y]) {","            paginator._pageDims[index].scrollX = scrollX;","        } else {","            paginator._pageDims[index].scrollY = scrollY;","        }","","        paginator._optimize();","    },","","    /**","     * index attr change handler","     *","     * @method _afterIndexChange","     * @param {Event.Facade}","     * @protected","     */","    _afterIndexChange: function (e) {","        var paginator = this,","            host = this._host,","            index = e.newVal,","            maxScrollX = paginator._pageDims[index].maxScrollX,","            maxScrollY = paginator._pageDims[index].maxScrollY,","            gesture = host._gesture,","            gestureAxis = gesture && gesture.axis;","","        // Cache the new index value","        paginator._cIndex = index;","","        if (gestureAxis === DIM_Y) {","            host._maxScrollX = maxScrollX;","            host.set(SCROLL_X, paginator._pageDims[index].scrollX, { src: UI });","        } else if (gestureAxis === DIM_X) {","            host._maxScrollY = maxScrollY;","            host.set(SCROLL_Y, paginator._pageDims[index].scrollY, { src: UI });","        }","","        if (e.src !== UI) {","            paginator.scrollToIndex(index);","        }","    },","","    /**","     * Hides page nodes not near the viewport","     *","     * @method _optimize","     * @protected","     */","    _optimize: function () {","","        if (!this.optimizeMemory) {","            return false;","        }","console.log('_optimize');","        var paginator = this,","            host = paginator._host,","            optimizeMemory = paginator.optimizeMemory,","            currentIndex = paginator._cIndex,","            pageNodes;","","        // Show the pages in/near the viewport & hide the rest","        pageNodes = paginator._getStage(currentIndex);","        console.log(pageNodes);","        paginator._showNodes(pageNodes.visible);","        paginator._hideNodes(pageNodes.hidden);","    },","","    /**","     * Determines which nodes should be visible, and which should be hidden.","     *","     * @method _getStage","     * @param index {Number} The page index # intended to be in focus.","     * @returns {object}","     * @protected","     */","    _getStage: function (index) {","        var padding = this.padding,","            pageNodes = this._getPageNodes(),","            pageCount = this.get(TOTAL),","            start = Math.max(0, index - padding),","            end = Math.min(pageCount, index + 1 + padding); // noninclusive","","        return {","            visible: pageNodes.splice(start, end - start),","            hidden: pageNodes","        };","    },","","    /**","     * A utility method to show node(s)","     *","     * @method _showNodes","     * @param nodeList {Object} The list of nodes to show","     * @protected","     */","    _showNodes: function (nodeList) {","        if (nodeList) {","            nodeList.removeClass(CLASS_HIDDEN).setStyle('visibility', '');","        }","    },","","    /**","     * A utility method to hide node(s)","     *","     * @method _hideNodes","     * @param nodeList {Object} The list of nodes to hide","     * @protected","     */","    _hideNodes: function (nodeList) {","        if (nodeList) {","            nodeList.addClass(CLASS_HIDDEN).setStyle('visibility', 'hidden');","        }","    },","","    /**","     * Gets a nodeList for the \"pages\"","     *","     * @method _getPageNodes","     * @protected","     * @returns {nodeList}","     */","    _getPageNodes: function () {","        var paginator = this,","            host = paginator._host,","            cb = host._cb,","            pageSelector = paginator.get(SELECTOR),","            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');","","        return pageNodes;","    },","","    /**","     * Scroll to the next page in the scrollview, with animation","     *","     * @method next","     */","    next: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index + 1,","            total = this.get(TOTAL);","","        if (target >= total) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","","    /**","     * Scroll to the previous page in the scrollview, with animation","     *","     * @method prev","     */","    prev: function () {","        var paginator = this,","            index = paginator._cIndex,","            target = index - 1;","","        if (target < 0) {","            return;","        }","","        // Update the index","        paginator.set(INDEX, target);","    },","    ","    /** ","     * Deprecated for 3.7.0.","     * @deprecated","     */","    scrollTo: function () {","        return this.scrollToIndex.apply(this, arguments);","    },","","    /**","     * Scroll to a given page in the scrollview","     *","     * @method scrollToIndex","     * @param index {Number} The index of the page to scroll to","     * @param {Number} [duration] The number of ms the animation should last","     * @param {String} [easing] The timing function to use in the animation","     */","    scrollToIndex: function (index, duration, easing) {","        var paginator = this,","            host = paginator._host,","            pageNode = paginator._getPageNodes().item(index),","            scrollAxis = (paginator._cAxis[DIM_X] ? SCROLL_X : SCROLL_Y),","            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');","","        duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;","        easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;","","        // Set the index ATTR to the specified index value","        paginator.set(INDEX, index);","","        // Makes sure the viewport nodes are visible","        paginator._showNodes(pageNode);","","        // Scroll to the offset","        host.set(scrollAxis, scrollOffset, {","            duration: duration,","            easing: easing","        });","    },","","    /**","     * Setter for 'axis' attribute","     *","     * @method _axisSetter","     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on","     * @param name {String} The attribute name","     * @return {Object} An object to specify scrollability on the x & y axes","     * ","     * @protected","     */","    _axisSetter: function (val, name) {","","        // Turn a string into an axis object","        if (Y.Lang.isString(val)) {","            return {","                x: val.match(/x/i) ? true : false,","                y: val.match(/y/i) ? true : false","            };","        }","    },"," ","","    /**","     * After listener for the axis attribute","     *","     * @method _afterAxisChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterAxisChange: function (e) {","        this._cAxis = e.newVal;","    }","","    // End prototype properties","","}, {","    ","    // Static properties","","    /**","     * The identity of the plugin","     *","     * @property NAME","     * @type String","     * @default 'pluginScrollViewPaginator'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'pluginScrollViewPaginator',","","    /**","     * The namespace on which the plugin will reside","     *","     * @property NS","     * @type String","     * @default 'pages'","     * @static","     */","    NS: 'pages',","","    /**","     * The default attribute configuration for the plugin","     *","     * @property ATTRS","     * @type {Object}","     * @static","     */","    ATTRS: {","","        /**","         * Specifies ability to scroll on x, y, or x and y axis/axes.","         *","         * @attribute axis","         * @type String","         */","        axis: {","            setter: '_axisSetter',","            writeOnce: 'initOnly'","        },","","        /**","         * CSS selector for a page inside the scrollview. The scrollview","         * will snap to the closest page.","         *","         * @attribute selector","         * @type {String}","         * @default null","         */","        selector: {","            value: null","        },","","        /**","         * The active page number for a paged scrollview","         *","         * @attribute index","         * @type {Number}","         * @default 0","         */","        index: {","            value: 0,","            validator: function (val) {","                // TODO: Remove this?","                // return val >= 0 && val < this.get(TOTAL);","                return true;","            }","        },","","        /**","         * The total number of pages","         *","         * @attribute total","         * @type {Number}","         * @default 0","         */","        total: {","            value: 0","        }","    },","        ","    /**","     * The default snap to current duration and easing values used on scroll end.","     *","     * @property SNAP_TO_CURRENT","     * @static","     */","    TRANSITION: {","        duration: 300,","        easing: 'ease-out'","    }","","    // End static properties","","});","","Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;","","}, '@VERSION@', {\"requires\": [\"plugin\", \"classnamemanager\"]});"];
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].lines = {"1":0,"8":0,"35":0,"36":0,"39":0,"48":0,"51":0,"52":0,"53":0,"56":0,"57":0,"60":0,"61":0,"65":0,"66":0,"67":0,"68":0,"69":0,"71":0,"81":0,"84":0,"90":0,"91":0,"92":0,"93":0,"94":0,"97":0,"98":0,"109":0,"119":0,"120":0,"122":0,"123":0,"127":0,"130":0,"131":0,"135":0,"137":0,"148":0,"154":0,"155":0,"158":0,"161":0,"162":0,"175":0,"183":0,"184":0,"190":0,"192":0,"208":0,"209":0,"227":0,"235":0,"236":0,"239":0,"240":0,"242":0,"246":0,"247":0,"253":0,"265":0,"271":0,"272":0,"273":0,"275":0,"289":0,"297":0,"302":0,"304":0,"305":0,"307":0,"311":0,"314":0,"327":0,"334":0,"335":0,"337":0,"340":0,"351":0,"360":0,"362":0,"363":0,"364":0,"365":0,"366":0,"367":0,"370":0,"371":0,"383":0,"384":0,"386":0,"387":0,"394":0,"395":0,"396":0,"397":0,"409":0,"415":0,"429":0,"430":0,"442":0,"443":0,"455":0,"461":0,"470":0,"475":0,"476":0,"480":0,"489":0,"493":0,"494":0,"498":0,"506":0,"518":0,"524":0,"525":0,"528":0,"531":0,"534":0,"553":0,"554":0,"570":0,"645":0,"676":0};
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].functions = {"PaginatorPlugin:35":0,"initializer:47":0,"_bindAttrs:80":0,"_afterHostRender:108":0,"_afterHostSyncUI:147":0,"(anonymous 2):183":0,"_afterHostUIDimensionsChange:173":0,"_beforeHostScrollTo:226":0,"_afterHostGestureMoveEnd:264":0,"_beforeHostMousewheel:288":0,"_afterHostScrollEnded:326":0,"_afterIndexChange:350":0,"_optimize:381":0,"_getStage:408":0,"_showNodes:428":0,"_hideNodes:441":0,"_getPageNodes:454":0,"next:469":0,"prev:488":0,"scrollTo:505":0,"scrollToIndex:517":0,"_axisSetter:550":0,"_afterAxisChange:569":0,"validator:642":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].coveredLines = 124;
_yuitest_coverage["build/scrollview-paginator/scrollview-paginator.js"].coveredFunctions = 25;
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 1);
YUI.add('scrollview-paginator', function (Y, NAME) {

/**
 * Provides a plugin that adds pagination support to ScrollView instances
 *
 * @module scrollview-paginator
 */
_yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 8);
var getClassName = Y.ClassNameManager.getClassName,
    SCROLLVIEW = 'scrollview',
    CLASS_HIDDEN = getClassName(SCROLLVIEW, 'hidden'),
    CLASS_PAGED = getClassName(SCROLLVIEW, 'paged'),
    UI = (Y.ScrollView) ? Y.ScrollView.UI_SRC : 'ui',
    INDEX = 'index',
    SCROLL_X = 'scrollX',
    SCROLL_Y = 'scrollY',
    TOTAL = 'total',
    HOST = 'host',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    SELECTOR = 'selector',
    FLICK = 'flick',
    DRAG = 'drag',
    AXIS = 'axis',
    DIM_X = 'x',
    DIM_Y = 'y';

/**
 * Scrollview plugin that adds support for paging
 *
 * @class ScrollViewPaginator
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 */
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 35);
function PaginatorPlugin() {
    _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "PaginatorPlugin", 35);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 36);
PaginatorPlugin.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 39);
Y.extend(PaginatorPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "initializer", 47);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 48);
var paginator = this,
            host = paginator.get(HOST);

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 51);
paginator._pageDims = [];
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 52);
paginator.padding = 1;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 53);
paginator.optimizeMemory = false;

        // Initialize & default
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 56);
if (config.optimizeMemory) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 57);
paginator.optimizeMemory = config.optimizeMemory;
        }
        
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 60);
if (config.padding) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 61);
paginator.padding = config.padding;
        }

        // Cache some values
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 65);
paginator._host = host;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 66);
paginator._bb = host._bb;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 67);
paginator._cb = host._cb;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 68);
paginator._cIndex = paginator.get(INDEX);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 69);
paginator._cAxis = paginator.get(AXIS);

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 71);
paginator._bindAttrs();
    },

    /**
     * 
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_bindAttrs", 80);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 81);
var paginator = this;

        // Event listeners
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 84);
paginator.after({
            'indexChange': paginator._afterIndexChange,
            'axisChange': paginator._afterAxisChange
        });

        // Host method listeners
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 90);
paginator.beforeHostMethod('scrollTo', paginator._beforeHostScrollTo);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 91);
paginator.beforeHostMethod('_mousewheel', paginator._beforeHostMousewheel);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 92);
paginator.afterHostMethod('_onGestureMoveEnd', paginator._afterHostGestureMoveEnd);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 93);
paginator.afterHostMethod('_uiDimensionsChange', paginator._afterHostUIDimensionsChange);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 94);
paginator.afterHostMethod('syncUI', paginator._afterHostSyncUI);
        
        // Host event listeners
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 97);
paginator.afterHostEvent('render', paginator._afterHostRender);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 98);
paginator.afterHostEvent('scrollEnd', paginator._afterHostScrollEnded);
    },

    /**
     * After host render
     *
     * @method _afterHostRender
     * @param {Event.Facade}
     * @protected
     */
    _afterHostRender: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostRender", 108);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 109);
var paginator = this,
            bb = paginator._bb,
            host = paginator._host,
            index = paginator._cIndex,
            paginatorAxis = paginator._cAxis,
            pageNodes = paginator._getPageNodes(),
            size = pageNodes.size(),
            maxScrollX = paginator._pageDims[index].maxScrollX,
            maxScrollY = paginator._pageDims[index].maxScrollY;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 119);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 120);
host._maxScrollX = maxScrollX;
        }
        else {_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 122);
if (paginatorAxis[DIM_X]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 123);
host._maxScrollY = maxScrollY;
        }}

        // Set the page count
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 127);
paginator.set(TOTAL, size);

        // Jump to the index
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 130);
if (index !== 0) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 131);
paginator.scrollToIndex(index, 0);
        }

        // Add the paginator class
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 135);
bb.addClass(CLASS_PAGED);

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 137);
paginator._optimize();
    },

    /**
     * After host syncUI
     *
     * @method _afterHostSyncUI
     * @param {Event.Facade}
     * @protected
     */
    _afterHostSyncUI: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostSyncUI", 147);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 148);
var paginator = this,
            host = paginator._host,
            hostFlick = host.get(FLICK),
            paginatorAxis;

        // If paginator's 'axis' property is to be automatically determined, inherit host's property
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 154);
if (paginator._cAxis === undefined) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 155);
paginator._set(AXIS, host.get(AXIS));
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 158);
paginatorAxis = paginator.get(AXIS);

        // Don't allow flicks on the paginated axis
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 161);
if (paginatorAxis[hostFlick.axis]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 162);
host.set(FLICK, false);
        }
    },

    /**
     * After host _uiDimensionsChange
     *
     * @method _afterHostUIDimensionsChange
     * @param {Event.Facade}
     * @protected
     */
    _afterHostUIDimensionsChange: function (e) {

        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostUIDimensionsChange", 173);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 175);
var paginator = this,
            host = paginator._host,
            bb = paginator._bb,
            widgetWidth = bb.get('offsetWidth'),
            widgetHeight = bb.get('offsetHeight'),
            pageNodes = paginator._getPageNodes();

        // Inefficient. Should not reinitialize every page every syncUI
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 183);
pageNodes.each(function (node, i) {
            _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "(anonymous 2)", 183);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 184);
var scrollWidth = node.get('scrollWidth'),
                scrollHeight = node.get('scrollHeight'),
                maxScrollX = Math.max(0, scrollWidth - widgetWidth), // Math.max to ensure we don't set it to a negative value
                maxScrollY = Math.max(0, scrollHeight - widgetHeight);

            // Don't initialize any page _pageDims that already have been.
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 190);
if (!paginator._pageDims[i]) {

                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 192);
paginator._pageDims[i] = {

                    // Current scrollX & scrollY positions (default to 0)
                    scrollX: 0,
                    scrollY: 0,

                    // Minimum scrollable values
                    _minScrollX: 0,
                    _minScrollY: 0,

                    // Maximum scrollable values
                    maxScrollX: maxScrollX,
                    maxScrollY: maxScrollY
                };

            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 208);
paginator._pageDims[i].maxScrollX = maxScrollX;
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 209);
paginator._pageDims[i].maxScrollY = maxScrollY;
            }

        });
    },

    /**
     * Executed before host.scrollTo
     *
     * @method _beforeHostScrollTo
     * @param x {Number} The x-position to scroll to. (null for no movement)
     * @param y {Number} The y-position to scroll to. (null for no movement)
     * @param {Number} [duration] Duration, in ms, of the scroll animation (default is 0)
     * @param {String} [easing] An easing equation if duration is set
     * @param {String} [node] The node to move
     * @protected
     */
    _beforeHostScrollTo: function (x, y, duration, easing, node) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_beforeHostScrollTo", 226);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 227);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            index = paginator._cIndex,
            paginatorAxis = paginator._cAxis,
            pageNodes = this._getPageNodes(),
            gestureAxis;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 235);
if (gesture) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 236);
gestureAxis = gesture.axis;

            // Null the opposite axis so it won't be modified by host.scrollTo
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 239);
if (gestureAxis === DIM_Y) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 240);
x = null;
            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 242);
y = null;
            }

            // If they are scrolling against the specified axis, pull out the page's node to have its own offset
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 246);
if (paginatorAxis[gestureAxis] === false) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 247);
node = pageNodes.item(index);
            }

        }

        // Return the modified argument list
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 253);
return new Y.Do.AlterArgs("new args", [x, y, duration, easing, node]);
    },

    /**
     * Executed after host._gestureMoveEnd
     * Determines if the gesture should page prev or next (if at all)
     *
     * @method _afterHostGestureMoveEnd
     * @param {Event.Facade}
     * @protected
     */
    _afterHostGestureMoveEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostGestureMoveEnd", 264);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 265);
var paginator = this,
            host = paginator._host,
            gesture = host._gesture,
            paginatorAxis = paginator._cAxis,
            gestureAxis = gesture && gesture.axis;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 271);
if (paginatorAxis[gestureAxis]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 272);
if (gesture[(gestureAxis === DIM_X ? 'deltaX' : 'deltaY')] > 0) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 273);
paginator[host.rtl ? 'prev' : 'next']();
            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 275);
paginator[host.rtl ? 'next' : 'prev']();
            }
        }
    },

    /**
     * Executed before host._mousewheel
     * Prevents mousewheel events in some conditions
     *
     * @method _beforeHostMousewheel
     * @param {Event.Facade}
     * @protected
     */
    _beforeHostMousewheel: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_beforeHostMousewheel", 288);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 289);
var paginator = this,
            host = paginator._host,
            bb = host._bb,
            isForward = e.wheelDelta < 0, // down (negative) is forward. @TODO Should revisit.
            paginatorAxis = paginator._cAxis;

        // Set the axis for this event.
        // @TODO: This is hacky, it's not a gesture. Find a better way
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 297);
host._gesture = {
            axis: DIM_Y
        };

        // Only if the mousewheel event occurred on a DOM node inside the BB
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 302);
if (bb.contains(e.target) && paginatorAxis[DIM_Y]) {

            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 304);
if (isForward) {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 305);
paginator.next();
            } else {
                _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 307);
paginator.prev();
            }

            // prevent browser default behavior on mousewheel
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 311);
e.preventDefault();

            // Block host._mousewheel from running
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 314);
return new Y.Do.Prevent();
        }
    },

    /**
     * Executes after host's 'scrollEnd' event
     * Runs cleanup operations
     *
     * @method _afterHostScrollEnded
     * @param {Event.Facade}
     * @protected
     */
    _afterHostScrollEnded: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterHostScrollEnded", 326);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 327);
var paginator = this,
            host = paginator._host,
            index = paginator._cIndex,
            scrollX = host.get(SCROLL_X),
            scrollY = host.get(SCROLL_Y),
            paginatorAxis = paginator._cAxis;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 334);
if (paginatorAxis[DIM_Y]) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 335);
paginator._pageDims[index].scrollX = scrollX;
        } else {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 337);
paginator._pageDims[index].scrollY = scrollY;
        }

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 340);
paginator._optimize();
    },

    /**
     * index attr change handler
     *
     * @method _afterIndexChange
     * @param {Event.Facade}
     * @protected
     */
    _afterIndexChange: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterIndexChange", 350);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 351);
var paginator = this,
            host = this._host,
            index = e.newVal,
            maxScrollX = paginator._pageDims[index].maxScrollX,
            maxScrollY = paginator._pageDims[index].maxScrollY,
            gesture = host._gesture,
            gestureAxis = gesture && gesture.axis;

        // Cache the new index value
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 360);
paginator._cIndex = index;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 362);
if (gestureAxis === DIM_Y) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 363);
host._maxScrollX = maxScrollX;
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 364);
host.set(SCROLL_X, paginator._pageDims[index].scrollX, { src: UI });
        } else {_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 365);
if (gestureAxis === DIM_X) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 366);
host._maxScrollY = maxScrollY;
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 367);
host.set(SCROLL_Y, paginator._pageDims[index].scrollY, { src: UI });
        }}

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 370);
if (e.src !== UI) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 371);
paginator.scrollToIndex(index);
        }
    },

    /**
     * Hides page nodes not near the viewport
     *
     * @method _optimize
     * @protected
     */
    _optimize: function () {

        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_optimize", 381);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 383);
if (!this.optimizeMemory) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 384);
return false;
        }
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 386);
console.log('_optimize');
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 387);
var paginator = this,
            host = paginator._host,
            optimizeMemory = paginator.optimizeMemory,
            currentIndex = paginator._cIndex,
            pageNodes;

        // Show the pages in/near the viewport & hide the rest
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 394);
pageNodes = paginator._getStage(currentIndex);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 395);
console.log(pageNodes);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 396);
paginator._showNodes(pageNodes.visible);
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 397);
paginator._hideNodes(pageNodes.hidden);
    },

    /**
     * Determines which nodes should be visible, and which should be hidden.
     *
     * @method _getStage
     * @param index {Number} The page index # intended to be in focus.
     * @returns {object}
     * @protected
     */
    _getStage: function (index) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_getStage", 408);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 409);
var padding = this.padding,
            pageNodes = this._getPageNodes(),
            pageCount = this.get(TOTAL),
            start = Math.max(0, index - padding),
            end = Math.min(pageCount, index + 1 + padding); // noninclusive

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 415);
return {
            visible: pageNodes.splice(start, end - start),
            hidden: pageNodes
        };
    },

    /**
     * A utility method to show node(s)
     *
     * @method _showNodes
     * @param nodeList {Object} The list of nodes to show
     * @protected
     */
    _showNodes: function (nodeList) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_showNodes", 428);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 429);
if (nodeList) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 430);
nodeList.removeClass(CLASS_HIDDEN).setStyle('visibility', '');
        }
    },

    /**
     * A utility method to hide node(s)
     *
     * @method _hideNodes
     * @param nodeList {Object} The list of nodes to hide
     * @protected
     */
    _hideNodes: function (nodeList) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_hideNodes", 441);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 442);
if (nodeList) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 443);
nodeList.addClass(CLASS_HIDDEN).setStyle('visibility', 'hidden');
        }
    },

    /**
     * Gets a nodeList for the "pages"
     *
     * @method _getPageNodes
     * @protected
     * @returns {nodeList}
     */
    _getPageNodes: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_getPageNodes", 454);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 455);
var paginator = this,
            host = paginator._host,
            cb = host._cb,
            pageSelector = paginator.get(SELECTOR),
            pageNodes = pageSelector ? cb.all(pageSelector) : cb.get('children');

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 461);
return pageNodes;
    },

    /**
     * Scroll to the next page in the scrollview, with animation
     *
     * @method next
     */
    next: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "next", 469);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 470);
var paginator = this,
            index = paginator._cIndex,
            target = index + 1,
            total = this.get(TOTAL);

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 475);
if (target >= total) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 476);
return;
        }

        // Update the index
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 480);
paginator.set(INDEX, target);
    },

    /**
     * Scroll to the previous page in the scrollview, with animation
     *
     * @method prev
     */
    prev: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "prev", 488);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 489);
var paginator = this,
            index = paginator._cIndex,
            target = index - 1;

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 493);
if (target < 0) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 494);
return;
        }

        // Update the index
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 498);
paginator.set(INDEX, target);
    },
    
    /** 
     * Deprecated for 3.7.0.
     * @deprecated
     */
    scrollTo: function () {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "scrollTo", 505);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 506);
return this.scrollToIndex.apply(this, arguments);
    },

    /**
     * Scroll to a given page in the scrollview
     *
     * @method scrollToIndex
     * @param index {Number} The index of the page to scroll to
     * @param {Number} [duration] The number of ms the animation should last
     * @param {String} [easing] The timing function to use in the animation
     */
    scrollToIndex: function (index, duration, easing) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "scrollToIndex", 517);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 518);
var paginator = this,
            host = paginator._host,
            pageNode = paginator._getPageNodes().item(index),
            scrollAxis = (paginator._cAxis[DIM_X] ? SCROLL_X : SCROLL_Y),
            scrollOffset = pageNode.get(scrollAxis === SCROLL_X ? 'offsetLeft' : 'offsetTop');

        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 524);
duration = (duration !== undefined) ? duration : PaginatorPlugin.TRANSITION.duration;
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 525);
easing = (easing !== undefined) ? duration : PaginatorPlugin.TRANSITION.easing;

        // Set the index ATTR to the specified index value
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 528);
paginator.set(INDEX, index);

        // Makes sure the viewport nodes are visible
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 531);
paginator._showNodes(pageNode);

        // Scroll to the offset
        _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 534);
host.set(scrollAxis, scrollOffset, {
            duration: duration,
            easing: easing
        });
    },

    /**
     * Setter for 'axis' attribute
     *
     * @method _axisSetter
     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on
     * @param name {String} The attribute name
     * @return {Object} An object to specify scrollability on the x & y axes
     * 
     * @protected
     */
    _axisSetter: function (val, name) {

        // Turn a string into an axis object
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_axisSetter", 550);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 553);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 554);
return {
                x: val.match(/x/i) ? true : false,
                y: val.match(/y/i) ? true : false
            };
        }
    },
 

    /**
     * After listener for the axis attribute
     *
     * @method _afterAxisChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterAxisChange: function (e) {
        _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "_afterAxisChange", 569);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 570);
this._cAxis = e.newVal;
    }

    // End prototype properties

}, {
    
    // Static properties

    /**
     * The identity of the plugin
     *
     * @property NAME
     * @type String
     * @default 'pluginScrollViewPaginator'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'pluginScrollViewPaginator',

    /**
     * The namespace on which the plugin will reside
     *
     * @property NS
     * @type String
     * @default 'pages'
     * @static
     */
    NS: 'pages',

    /**
     * The default attribute configuration for the plugin
     *
     * @property ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {

        /**
         * Specifies ability to scroll on x, y, or x and y axis/axes.
         *
         * @attribute axis
         * @type String
         */
        axis: {
            setter: '_axisSetter',
            writeOnce: 'initOnly'
        },

        /**
         * CSS selector for a page inside the scrollview. The scrollview
         * will snap to the closest page.
         *
         * @attribute selector
         * @type {String}
         * @default null
         */
        selector: {
            value: null
        },

        /**
         * The active page number for a paged scrollview
         *
         * @attribute index
         * @type {Number}
         * @default 0
         */
        index: {
            value: 0,
            validator: function (val) {
                // TODO: Remove this?
                // return val >= 0 && val < this.get(TOTAL);
                _yuitest_coverfunc("build/scrollview-paginator/scrollview-paginator.js", "validator", 642);
_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 645);
return true;
            }
        },

        /**
         * The total number of pages
         *
         * @attribute total
         * @type {Number}
         * @default 0
         */
        total: {
            value: 0
        }
    },
        
    /**
     * The default snap to current duration and easing values used on scroll end.
     *
     * @property SNAP_TO_CURRENT
     * @static
     */
    TRANSITION: {
        duration: 300,
        easing: 'ease-out'
    }

    // End static properties

});

_yuitest_coverline("build/scrollview-paginator/scrollview-paginator.js", 676);
Y.namespace('Plugin').ScrollViewPaginator = PaginatorPlugin;

}, '@VERSION@', {"requires": ["plugin", "classnamemanager"]});
