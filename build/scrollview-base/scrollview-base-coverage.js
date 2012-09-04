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
_yuitest_coverage["build/scrollview-base/scrollview-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/scrollview-base/scrollview-base.js",
    code: []
};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].code=["YUI.add('scrollview-base', function (Y, NAME) {","","/**"," * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators"," *"," * @module scrollview"," * @submodule scrollview-base"," */","var getClassName = Y.ClassNameManager.getClassName,","    DOCUMENT = Y.config.doc,","    WINDOW = Y.config.win,","    IE = Y.UA.ie,","    NATIVE_TRANSITIONS = Y.Transition.useNative,","    SCROLLVIEW = 'scrollview',","    CLASS_NAMES = {","        vertical: getClassName(SCROLLVIEW, 'vert'),","        horizontal: getClassName(SCROLLVIEW, 'horiz')","    },","    EV_SCROLL_END = 'scrollEnd',","    FLICK = 'flick',","    DRAG = 'drag',","    MOUSEWHEEL = 'mousewheel',","    UI = 'ui',","    TOP = 'top',","    RIGHT = 'right',","    BOTTOM = 'bottom',","    LEFT = 'left',","    PX = 'px',","    AXIS = 'axis',","    SCROLL_Y = 'scrollY',","    SCROLL_X = 'scrollX',","    BOUNCE = 'bounce',","    DISABLED = 'disabled',","    DECELERATION = 'deceleration',","    DIM_X = 'x',","    DIM_Y = 'y',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    GESTURE_MOVE = 'gesturemove',","    START = 'start',","    END = 'end',","    EMPTY = '',","    ZERO = '0s',","","    _constrain = function (val, min, max) {","        return Math.min(Math.max(val, min), max);","    };","","/**"," * ScrollView provides a scrollable widget, supporting flick gestures,"," * across both touch and mouse based devices."," *"," * @class ScrollView"," * @param config {Object} Object literal with initial attribute values"," * @extends Widget"," * @constructor"," */","function ScrollView() {","    ScrollView.superclass.constructor.apply(this, arguments);","}","","Y.ScrollView = Y.extend(ScrollView, Y.Widget, {","","    // *** Y.ScrollView prototype","","    /**","     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.","     * Used by the _transform method.","     *","     * @property _forceHWTransforms","     * @type boolean","     * @protected","     */","    _forceHWTransforms: Y.UA.webkit ? true : false,","","    /**","     * <p>Used to control whether or not ScrollView's internal","     * gesturemovestart, gesturemove and gesturemoveend","     * event listeners should preventDefault. The value is an","     * object, with \"start\", \"move\" and \"end\" properties used to","     * specify which events should preventDefault and which shouldn't:</p>","     *","     * <pre>","     * {","     *    start: false,","     *    move: true,","     *    end: false","     * }","     * </pre>","     *","     * <p>The default values are set up in order to prevent panning,","     * on touch devices, while allowing click listeners on elements inside","     * the ScrollView to be notified as expected.</p>","     *","     * @property _prevent","     * @type Object","     * @protected","     */","    _prevent: {","        start: false,","        move: true,","        end: false","    },","","    /**","     * Contains the distance (postive or negative) in pixels by which ","     * the scrollview was last scrolled. This is useful when setting up ","     * click listeners on the scrollview content, which on mouse based ","     * devices are always fired, even after a drag/flick. ","     * ","     * <p>Touch based devices don't currently fire a click event, ","     * if the finger has been moved (beyond a threshold) so this ","     * check isn't required, if working in a purely touch based environment</p>","     * ","     * @property lastScrolledAmt","     * @type Number","     * @public","     */","    lastScrolledAmt: null,","","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function (config) {","        var sv = this;","","        // Cache these values, since they aren't going to change.","        sv._bb = sv.get(BOUNDING_BOX);","        sv._cb = sv.get(CONTENT_BOX);","        sv._cDecel = sv.get(DECELERATION);","        sv._cBounce = sv.get(BOUNCE);","        sv._cAxis = sv.get(AXIS);","    },","","    /**","     * bindUI implementation","     *","     * Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function () {","        var sv = this;","","        sv._bindFlick(sv.get(FLICK));","        sv._bindDrag(sv.get(DRAG));","        console.log(ScrollView.MOUSEWHEEL);","        sv._bindMousewheel(ScrollView.MOUSEWHEEL);","        ","        sv._bindAttrs();","","        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.","        if (IE) {","            sv._fixIESelect(sv._bb, sv._cb);","        }","    },","","    /**","     * ","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var sv = this,","            scrollChangeHandler = sv._afterScrollChange,","            dimChangeHandler = sv._afterDimChange;","","        sv.after({","            'scrollEnd': sv._afterScrollEnd,","            'disabledChange': sv._afterDisabledChange,","            'flickChange': sv._afterFlickChange,","            'dragChange': sv._afterDragChange,","            'axisChange': sv._afterAxisChange,","            'scrollYChange': scrollChangeHandler,","            'scrollXChange': scrollChangeHandler,","            'heightChange': dimChangeHandler,","            'widthChange': dimChangeHandler","        });","","        // TODO: This should be throttled.","        Y.one(WINDOW).after('resize', dimChangeHandler, sv);","    },","","    /**","     * Bind (or unbind) gesture move listeners required for drag support","     *","     * @method _bindDrag","     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.","     * @private","     */","    _bindDrag: function (drag) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'drag' listeners","        bb.detach(DRAG + '|*');","","        if (drag) {","            bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));","        }","    },","","    /**","     * Bind (or unbind) flick listeners.","     *","     * @method _bindFlick","     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.","     * @private","     */","    _bindFlick: function (flick) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'flick' listeners","        bb.detach(FLICK + '|*');","","        if (flick) {","            bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);","        }","    },","","    /**","     * Bind (or unbind) mousewheel listeners.","     *","     * @method _bindMousewheel","     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.","     * @private","     */","    _bindMousewheel: function (mousewheel) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'mousewheel' listeners","        bb.detach(MOUSEWHEEL + '|*');","","        // Only enable for vertical scrollviews","        if (mousewheel) {","            // Bound to document, because that's where mousewheel events fire off of.","            Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));","        }","    },","","    /**","     * syncUI implementation.","     *","     * Update the scroll position, based on the current value of scrollX/scrollY.","     *","     * @method syncUI","     */","    syncUI: function () {","        var sv = this,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight;","","        // If the axis is undefined, auto-calculate it","        if (sv._cAxis === undefined) {","            // This should only ever be run once (for now).","            // In the future SV might post-loaded axis changes","            sv._set(AXIS, {","                x: (scrollWidth > width),","                y: (scrollHeight > height)","            });","        }","","        // get text direction on or inherited by scrollview node","        sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');","","        // Cache the disabled value","        sv._cDisabled = sv.get(DISABLED);","","        // Run this to set initial values","        sv._uiDimensionsChange();","","        // If we're out-of-bounds, snap back.","        if (sv._isOOB()) {","            sv._snapBack();","        }","    },","","    /**","     * Utility method to obtain widget dimensions","     * ","     * @method _getScrollDims","     * @returns {Object} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]","     * @private","     */","    _getScrollDims: function () {","        var sv = this,","            cb = sv._cb,","            bb = sv._bb,","            TRANS = ScrollView._TRANSITION,","            dims;","","        // TODO: Is this OK? Just in case it's called 'during' a transition.","        if (NATIVE_TRANSITIONS) {","            cb.setStyle(TRANS.DURATION, ZERO);","            cb.setStyle(TRANS.PROPERTY, EMPTY);","        }","","        dims = {","            'offsetWidth': bb.get('offsetWidth'),","            'offsetHeight': bb.get('offsetHeight'),","            'scrollWidth': bb.get('scrollWidth'),","            'scrollHeight': bb.get('scrollHeight')","        };","","        return dims;","    },","","    /**","     * This method gets invoked whenever the height or width attributes change,","     * allowing us to determine which scrolling axes need to be enabled.","     *","     * @method _uiDimensionsChange","     * @protected","     */","    _uiDimensionsChange: function () {","        var sv = this,","            bb = sv._bb,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight,","            rtl = sv.rtl,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y;","","        if (svAxisX) {","            bb.addClass(CLASS_NAMES.horizontal);","        }","","        if (svAxisY) {","            bb.addClass(CLASS_NAMES.vertical);","        }","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis","         *","         * @property _minScrollX","         * @type number","         * @protected","         */","        sv._minScrollX = (rtl) ? -(scrollWidth - width) : 0;","","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis","         *","         * @property _maxScrollX","         * @type number","         * @protected","         */","        sv._maxScrollX = (rtl) ? 0 : (scrollWidth - width);","","        /**","         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis","         *","         * @property _minScrollY","         * @type number","         * @protected","         */","        sv._minScrollY = 0;","","        /**","         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis","         *","         * @property _maxScrollY","         * @type number","         * @protected","         */","        sv._maxScrollY = scrollHeight - height;","    },","","    /**","     * Scroll the element to a given xy coordinate","     *","     * @method scrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] ms of the scroll animation. (default is 0)","     * @param {String} [easing] An easing equation if duration is set. (defaults to ScrollView.EASING)","     * @param {String} [node] The node to move.","     */","    scrollTo: function (x, y, duration, easing, node) {","        // Check to see if widget is disabled","        if (this._cDisabled) {","            return;","        }","","        var sv = this,","            cb = sv._cb,","            TRANS = ScrollView._TRANSITION,","            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this","            newX = 0,","            newY = 0,","            transition = {},","            transform;","","        // default the optional arguments","        duration = duration || 0;","        easing = easing || ScrollView.EASING;","        node = node || cb;","","        if (x !== null) {","            sv.set(SCROLL_X, x, {src:UI});","            newX = -(x);","        }","","        if (y !== null) {","            sv.set(SCROLL_Y, y, {src:UI});","            newY = -(y);","        }","","        transform = sv._transform(newX, newY);","","        if (NATIVE_TRANSITIONS) {","            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.","            node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);","        }","","        // Move","        if (duration === 0) {","            if (NATIVE_TRANSITIONS) {","                node.setStyle('transform', transform);","            }","            else {","                // TODO: If both set, batch them in the same update","                // Update: Nope, setStyles() just loops through each property and applies it.","                if (x !== null) {","                    node.setStyle(LEFT, newX + PX);","                }","                if (y !== null) {","                    node.setStyle(TOP, newY + PX);","                }","            }","        }","","        // Animate","        else {","            transition.easing = easing;","            transition.duration = duration / 1000;","","            if (NATIVE_TRANSITIONS) {","                transition.transform = transform;","            }","            else {","                transition.left = newX + PX;","                transition.top = newY + PX;","            }","","            node.transition(transition, callback);","        }","    },","","    /**","     * Utility method, to create the translate transform string with the","     * x, y translation amounts provided.","     *","     * @method _transform","     * @param {Number} x Number of pixels to translate along the x axis","     * @param {Number} y Number of pixels to translate along the y axis","     * @private","     */","    _transform: function (x, y) {","        // TODO: Would we be better off using a Matrix for this?","        var prop = 'translate(' + x + 'px, ' + y + 'px)';","","        if (this._forceHWTransforms) {","            prop += ' translateZ(0)';","        }","","        return prop;","    },","","    /**","     * Content box transition callback","     *","     * @method _onTransEnd","     * @param {Event.Facade} e The event facade","     * @private","     */","    _onTransEnd: function (e) {","        var sv = this;","","        /**","         * Notification event fired at the end of a scroll transition","         *","         * @event scrollEnd","         * @param e {EventFacade} The default event facade.","         */","        sv.fire(EV_SCROLL_END);","    },","","    /**","     * gesturemovestart event handler","     *","     * @method _onGestureMoveStart","     * @param e {Event.Facade} The gesturemovestart event facade","     * @private","     */","    _onGestureMoveStart: function (e) {","","        if (this._cDisabled) {","            return false;","        }","","        var sv = this,","            bb = sv._bb,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.start) {","            e.preventDefault();","        }","","        // if a flick animation is in progress, cancel it","        if (sv._flickAnim) {","            sv._flickAnim.cancel();","        }","","        // TODO: Review if neccesary (#2530129)","        e.stopPropagation();","","        // Reset lastScrolledAmt","        sv.lastScrolledAmt = 0;","","        // Stores data for this gesture cycle.  Cleaned up later","        sv._gesture = {","","            // Will hold the axis value","            axis: null,","","            // The current attribute values","            startX: currentX,","            startY: currentY,","","            // The X/Y coordinates where the event began","            startClientX: clientX,","            startClientY: clientY,","","            // The X/Y coordinates where the event will end","            endClientX: null,","            endClientY: null,","","            // The current delta of the event","            deltaX: null,","            deltaY: null,","","            // Will be populated for flicks","            flick: null,","","            // Create some listeners for the rest of the gesture cycle","            onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),","            onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))","        };","    },","","    /**","     * gesturemove event handler","     *","     * @method _onGestureMove","     * @param e {Event.Facade} The gesturemove event facade","     * @private","     */","    _onGestureMove: function (e) {","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            startX = gesture.startX,","            startY = gesture.startY,","            startClientX = gesture.startClientX,","            startClientY = gesture.startClientY,","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.move) {","            e.preventDefault();","        }","","        gesture.deltaX = startClientX - clientX;","        gesture.deltaY = startClientY - clientY;","","        // Determine if this is a vertical or horizontal movement","        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent","        if (gesture.axis === null) {","            gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;","        }","","        // Move X or Y.  @TODO: Move both if dualaxis.        ","        if (gesture.axis === DIM_X && svAxisX) {","            sv.set(SCROLL_X, startX + gesture.deltaX);","        }","        else if (gesture.axis === DIM_Y && svAxisY) {","            sv.set(SCROLL_Y, startY + gesture.deltaY);","        }","    },","","    /**","     * gesturemoveend event handler","     *","     * @method _onGestureMoveEnd","     * @param e {Event.Facade} The gesturemoveend event facade","     * @private","     */","    _onGestureMoveEnd: function (e) {","        var sv = this,","            gesture = sv._gesture,","            flick = gesture.flick,","            clientX = e.clientX,","            clientY = e.clientY,","            isOOB;","","        if (sv._prevent.end) {","            e.preventDefault();","        }","","        // Store the end X/Y coordinates","        gesture.endClientX = clientX;","        gesture.endClientY = clientY;","","        // Only if this gesture wasn't a flick, and there was movement","        if (!flick && gesture.deltaX !== null && gesture.deltaY !== null) {","            if (sv._isOOB()) {","                sv._snapBack();","            }","            else {","                // Don't fire scrollEnd on the gesture axis is the same as paginator's","                // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit","                if (sv.pages && !sv.pages.get(AXIS)[gesture.axis]) {","                    sv._onTransEnd();","                }","            }","        }","    },","","    /**","     * Execute a flick at the end of a scroll action","     *","     * @method _flick","     * @param e {Event.Facade} The Flick event facade","     * @private","     */","    _flick: function (e) {","        if (this._cDisabled) {","            return false;","        }","","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            flick = e.flick,","            flickAxis = flick.axis;","","        gesture.flick = flick;","","        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis","        if ((flickAxis === DIM_X && svAxisX) || (flickAxis === DIM_Y && svAxisY)) {","            sv._flickFrame(flick.velocity);","        }","    },","","    /**","     * Execute a single frame in the flick animation","     *","     * @method _flickFrame","     * @param velocity {Number} The velocity of this animated frame","     * @protected","     */","    _flickFrame: function (velocity) {","","        var sv = this,","            gesture = sv._gesture,","            flickAxis = gesture.flick.axis,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            maxX = sv._maxScrollX,","            minY = sv._minScrollY,","            maxY = sv._maxScrollY,","            deceleration = sv._cDecel,","            bounce = sv._cBounce,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            step = ScrollView.FRAME_STEP,","            newX = currentX - (velocity * step),","            newY = currentY - (velocity * step);","","        velocity *= deceleration;","","        // If we are out of bounds","        if (sv._isOOB()) {","            // We're past an edge, now bounce back","            sv._snapBack();","        }","        ","        // If the velocity gets slow enough, just stop","        else if (Math.abs(velocity).toFixed(4) <= 0.015) {","            sv._onTransEnd();","        }","","        // Otherwise, animate to the next frame","        else {","            if (flickAxis === DIM_X && svAxisX) {","                if (newX < minX || newX > maxX) {","                    velocity *= bounce;","                }","                sv.set(SCROLL_X, newX);","            }","            else if (flickAxis === DIM_Y && svAxisY) {","                if (newY < minY || newY > maxY) {","                    velocity *= bounce;","                }","                sv.set(SCROLL_Y, newY);","            }","","            // @TODO: maybe use requestAnimationFrame instead","            sv._flickAnim = Y.later(step, sv, '_flickFrame', [velocity]);","        }","    },","","    /**","     * Handle mousewheel events on the widget","     *","     * @method _mousewheel","     * @param e {Event.Facade} The mousewheel event facade","     * @private","     */","    _mousewheel: function (e) {","        var sv = this,","            scrollY = sv.get(SCROLL_Y),","            bb = sv._bb,","            scrollOffset = 10, // 10px","            isForward = (e.wheelDelta > 0),","            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);","","        scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);","","        if (bb.contains(e.target)) {","        ","            // Reset lastScrolledAmt","            sv.lastScrolledAmt = 0;","","            // Jump to the new offset","            sv.set(SCROLL_Y, scrollToY);","","            // if we have scrollbars plugin, update & set the flash timer on the scrollbar","            // @TODO: This probably shouldn't be in this module","            if (sv.scrollbars) {","                // @TODO: The scrollbars should handle this themselves","                sv.scrollbars._update();","                sv.scrollbars.flash();","                // or just this","                // sv.scrollbars._hostDimensionsChange();","            }","","            // Fire the 'scrollEnd' event","            sv._onTransEnd();","","            // prevent browser default behavior on mouse scroll","            e.preventDefault();","        }","    },","","    /**","     * Checks to see the current scrollX/scrollY position is out of bounds","     *","     * @method _isOOB","     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)","     * @private","     */","    _isOOB: function () {","        var sv = this,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY;","","        return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));","    },","","    /**","     * Bounces back","     * @TODO: Should be more generalized and support both X and Y detection","     *","     * @method _snapBack","     * @private","     */","    _snapBack: function () {","        var sv = this,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            minX = sv._minScrollX,","            minY = sv._minScrollY,","            maxX = sv._maxScrollX,","            maxY = sv._maxScrollY,","            newY = _constrain(currentY, minY, maxY),","            newX = _constrain(currentX, minX, maxX),","            duration = ScrollView.SNAP_DURATION;","","        if (newX !== currentX) {","            sv.set(SCROLL_X, newX, {duration:duration});","        }","        else if (newY !== currentY) {","            sv.set(SCROLL_Y, newY, {duration:duration});","        }","        else {","            // It shouldn't ever get here, but in case it does, fire scrollEnd","            sv._onTransEnd();","        }","    },","","    /**","     * After listener for changes to the scrollX or scrollY attribute","     *","     * @method _afterScrollChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollChange: function (e) {","","        if (e.src === ScrollView.UI_SRC) {","            return false;","        }","","        var sv = this,","            duration = e.duration,","            easing = e.easing,","            val = e.newVal,","            scrollToArgs = [];","","        // Set the scrolled value","        sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);","","        // Generate the array of args to pass to scrollTo()","        if (e.attrName === SCROLL_X) {","            scrollToArgs.push(val);","            scrollToArgs.push(sv.get(SCROLL_Y));","        }","        else {","            scrollToArgs.push(sv.get(SCROLL_X));","            scrollToArgs.push(val);","        }","","        scrollToArgs.push(duration);","        scrollToArgs.push(easing);","","        sv.scrollTo.apply(sv, scrollToArgs);","    },","","    /**","     * After listener for changes to the flick attribute","     *","     * @method _afterFlickChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterFlickChange: function (e) {","        this._bindFlick(e.newVal);","    },","","    /**","     * After listener for changes to the disabled attribute","     *","     * @method _afterDisabledChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDisabledChange: function (e) {","        // Cache for performance - we check during move","        this._cDisabled = e.newVal;","    },","","    /**","     * After listener for the axis attribute","     *","     * @method _afterAxisChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterAxisChange: function (e) {","        this._cAxis = e.newVal;","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDragChange: function (e) {","        this._bindDrag(e.newVal);","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterMousewheelChange: function (e) {","        this._bindMousewheel(e.newVal);","    },","","    /**","     * After listener for the height or width attribute","     *","     * @method _afterDimChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDimChange: function () {","        this._uiDimensionsChange();","    },","","    /**","     * After listener for scrollEnd, for cleanup","     *","     * @method _afterScrollEnd","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollEnd: function (e) {","        var sv = this,","            gesture = sv._gesture;","","        if (gesture && gesture.onGestureMove && gesture.onGestureMove.detach) {","            gesture.onGestureMove.detach();","        }","","        if (gesture && gesture.onGestureMoveEnd && gesture.onGestureMoveEnd.detach) {","            gesture.onGestureMoveEnd.detach();","        }","","        if (sv._flickAnim) {","            if (sv._flickAnim.cancel) {","                sv._flickAnim.cancel(); // Might as well?","            }","            delete sv._flickAnim;","        }","","        // Ideally this should be removed, but doing so causing some JS errors with fast swiping ","        // because _gesture is being deleted after the previous one has been overwritten","        // delete sv._gesture; // TODO: Move to sv.prevGesture?","    },","","    /**","     * Setter for 'axis' attribute","     *","     * @method _axisSetter","     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on","     * @param name {String} The attribute name","     * @return {Object} An object to specify scrollability on the x & y axes","     * ","     * @protected","     */","    _axisSetter: function (val, name) {","","        // Turn a string into an axis object","        if (Y.Lang.isString(val)) {","            return {","                x: val.match(/x/i) ? true : false,","                y: val.match(/y/i) ? true : false","            };","        }","    }","    ","    // End prototype properties","","}, {","","    // Static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'scrollview'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'scrollview',","","    /**","     * Static property used to define the default attribute configuration of","     * the Widget.","     *","     * @property ATTRS","     * @type {Object}","     * @protected","     * @static","     */","    ATTRS: {","","        /**","         * Specifies ability to scroll on x, y, or x and y axis/axes.","         *","         * @attribute axis","         * @type String","         */","        axis: {","            setter: '_axisSetter',","            writeOnce: 'initOnly'","        },","","        /**","         * The scroll position in the y-axis","         *","         * @attribute scrollY","         * @type Number","         * @default 0","         */","        scrollY: {","            value: 0","        },","","        /**","         * The scroll position in the x-axis","         *","         * @attribute scrollX","         * @type Number","         * @default 0","         */","        scrollX: {","            value: 0","        },","","        /**","         * Drag coefficent for inertial scrolling. The closer to 1 this","         * value is, the less friction during scrolling.","         *","         * @attribute deceleration","         * @default 0.93","         */","        deceleration: {","            value: 0.93","        },","","        /**","         * Drag coefficient for intertial scrolling at the upper","         * and lower boundaries of the scrollview. Set to 0 to","         * disable \"rubber-banding\".","         *","         * @attribute bounce","         * @type Number","         * @default 0.1","         */","        bounce: {","            value: 0.1","        },","","        /**","         * The minimum distance and/or velocity which define a flick. Can be set to false,","         * to disable flick support (note: drag support is enabled/disabled separately)","         *","         * @attribute flick","         * @type Object","         * @default Object with properties minDistance = 10, minVelocity = 0.3.","         */","        flick: {","            value: {","                minDistance: 10,","                minVelocity: 0.3","            }","        },","","        /**","         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)","         * @attribute drag","         * @type boolean","         * @default true","         */","        drag: {","            value: true","        }","    },","","    /**","     * List of class names used in the scrollview's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES,","","    /**","     * Flag used to source property changes initiated from the DOM","     *","     * @property UI_SRC","     * @type String","     * @static","     * @default 'ui'","     */","    UI_SRC: UI,","","    /**","     * The default bounce distance in pixels","     *","     * @property BOUNCE_RANGE","     * @type Number","     * @static","     * @default 150","     */","    BOUNCE_RANGE: 150,","","    /**","     * The interval used when animating the flick","     *","     * @property FRAME_STEP","     * @type Number","     * @static","     * @default 16","     */","    FRAME_STEP: 16,","","    /**","     * The default easing used when animating the flick","     *","     * @property EASING","     * @type String","     * @static","     * @default 'cubic-bezier(0, 0.1, 0, 1.0)'","     */","    EASING: 'cubic-bezier(0, 0.1, 0, 1.0)',","","    /**","     * The default easing to use when animating the bounce snap back.","     *","     * @property SNAP_EASING","     * @type String","     * @static","     * @default 'ease-out'","     */","    SNAP_EASING: 'ease-out',","","    /**","     * The default duration to use when animating the bounce snap back.","     *","     * @property SNAP_DURATION","     * @type Number","     * @static","     * @default 400","     */","    SNAP_DURATION: 400,","","    /**","     * Object map of style property names used to set transition properties.","     * Defaults to the vendor prefix established by the Transition module.","     * The configured property names are `_TRANSITION.DURATION` (e.g. \"WebkitTransitionDuration\") and","     * `_TRANSITION.PROPERTY (e.g. \"WebkitTransitionProperty\").","     *","     * @property _TRANSITION","     * @private","     */","    _TRANSITION: {","        DURATION: Y.Transition._VENDOR_PREFIX + 'TransitionDuration',","        PROPERTY: Y.Transition._VENDOR_PREFIX + 'TransitionProperty'","    },","","    /**","     * Enable/Disable scrolling content via mousewheel","     * @property mousewheel","     * @type boolean","     * @static","     * @default true","     */","    MOUSEWHEEL: {","        value: true","    }","    // End static properties","","});","","}, '@VERSION@', {\"requires\": [\"widget\", \"event-gestures\", \"event-mousewheel\", \"transition\"], \"skinnable\": true});"];
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].lines = {"1":0,"9":0,"46":0,"58":0,"59":0,"62":0,"128":0,"131":0,"132":0,"133":0,"134":0,"135":0,"145":0,"147":0,"148":0,"149":0,"150":0,"152":0,"155":0,"156":0,"167":0,"171":0,"184":0,"195":0,"199":0,"201":0,"202":0,"214":0,"218":0,"220":0,"221":0,"233":0,"237":0,"240":0,"242":0,"254":0,"262":0,"265":0,"272":0,"275":0,"278":0,"281":0,"282":0,"294":0,"301":0,"302":0,"303":0,"306":0,"313":0,"324":0,"336":0,"337":0,"340":0,"341":0,"351":0,"360":0,"369":0,"378":0,"393":0,"394":0,"397":0,"407":0,"408":0,"409":0,"411":0,"412":0,"413":0,"416":0,"417":0,"418":0,"421":0,"423":0,"425":0,"429":0,"430":0,"431":0,"436":0,"437":0,"439":0,"440":0,"447":0,"448":0,"450":0,"451":0,"454":0,"455":0,"458":0,"473":0,"475":0,"476":0,"479":0,"490":0,"498":0,"510":0,"511":0,"514":0,"521":0,"522":0,"526":0,"527":0,"531":0,"534":0,"537":0,"575":0,"587":0,"588":0,"591":0,"592":0,"596":0,"597":0,"601":0,"602":0,"604":0,"605":0,"617":0,"624":0,"625":0,"629":0,"630":0,"633":0,"634":0,"635":0,"640":0,"641":0,"655":0,"656":0,"659":0,"667":0,"670":0,"671":0,"684":0,"702":0,"705":0,"707":0,"711":0,"712":0,"717":0,"718":0,"719":0,"721":0,"723":0,"724":0,"725":0,"727":0,"731":0,"743":0,"750":0,"752":0,"755":0,"758":0,"762":0,"764":0,"765":0,"771":0,"774":0,"786":0,"797":0,"808":0,"819":0,"820":0,"822":0,"823":0,"827":0,"840":0,"841":0,"844":0,"851":0,"854":0,"855":0,"856":0,"859":0,"860":0,"863":0,"864":0,"866":0,"877":0,"889":0,"900":0,"911":0,"922":0,"933":0,"944":0,"947":0,"948":0,"951":0,"952":0,"955":0,"956":0,"957":0,"959":0,"980":0,"981":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].functions = {"_constrain:45":0,"ScrollView:58":0,"initializer:127":0,"bindUI:144":0,"_bindAttrs:166":0,"_bindDrag:194":0,"_bindFlick:213":0,"_bindMousewheel:232":0,"syncUI:253":0,"_getScrollDims:293":0,"_uiDimensionsChange:323":0,"scrollTo:391":0,"_transform:471":0,"_onTransEnd:489":0,"_onGestureMoveStart:508":0,"_onGestureMove:574":0,"_onGestureMoveEnd:616":0,"_flick:654":0,"_flickFrame:682":0,"_mousewheel:742":0,"_isOOB:785":0,"_snapBack:807":0,"_afterScrollChange:838":0,"_afterFlickChange:876":0,"_afterDisabledChange:887":0,"_afterAxisChange:899":0,"_afterDragChange:910":0,"_afterMousewheelChange:921":0,"_afterDimChange:932":0,"_afterScrollEnd:943":0,"_axisSetter:977":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredLines = 192;
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredFunctions = 32;
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1);
YUI.add('scrollview-base', function (Y, NAME) {

/**
 * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators
 *
 * @module scrollview
 * @submodule scrollview-base
 */
_yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 9);
var getClassName = Y.ClassNameManager.getClassName,
    DOCUMENT = Y.config.doc,
    WINDOW = Y.config.win,
    IE = Y.UA.ie,
    NATIVE_TRANSITIONS = Y.Transition.useNative,
    SCROLLVIEW = 'scrollview',
    CLASS_NAMES = {
        vertical: getClassName(SCROLLVIEW, 'vert'),
        horizontal: getClassName(SCROLLVIEW, 'horiz')
    },
    EV_SCROLL_END = 'scrollEnd',
    FLICK = 'flick',
    DRAG = 'drag',
    MOUSEWHEEL = 'mousewheel',
    UI = 'ui',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
    PX = 'px',
    AXIS = 'axis',
    SCROLL_Y = 'scrollY',
    SCROLL_X = 'scrollX',
    BOUNCE = 'bounce',
    DISABLED = 'disabled',
    DECELERATION = 'deceleration',
    DIM_X = 'x',
    DIM_Y = 'y',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    GESTURE_MOVE = 'gesturemove',
    START = 'start',
    END = 'end',
    EMPTY = '',
    ZERO = '0s',

    _constrain = function (val, min, max) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_constrain", 45);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 46);
return Math.min(Math.max(val, min), max);
    };

/**
 * ScrollView provides a scrollable widget, supporting flick gestures,
 * across both touch and mouse based devices.
 *
 * @class ScrollView
 * @param config {Object} Object literal with initial attribute values
 * @extends Widget
 * @constructor
 */
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 58);
function ScrollView() {
    _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "ScrollView", 58);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 59);
ScrollView.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/scrollview-base/scrollview-base.js", 62);
Y.ScrollView = Y.extend(ScrollView, Y.Widget, {

    // *** Y.ScrollView prototype

    /**
     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.
     * Used by the _transform method.
     *
     * @property _forceHWTransforms
     * @type boolean
     * @protected
     */
    _forceHWTransforms: Y.UA.webkit ? true : false,

    /**
     * <p>Used to control whether or not ScrollView's internal
     * gesturemovestart, gesturemove and gesturemoveend
     * event listeners should preventDefault. The value is an
     * object, with "start", "move" and "end" properties used to
     * specify which events should preventDefault and which shouldn't:</p>
     *
     * <pre>
     * {
     *    start: false,
     *    move: true,
     *    end: false
     * }
     * </pre>
     *
     * <p>The default values are set up in order to prevent panning,
     * on touch devices, while allowing click listeners on elements inside
     * the ScrollView to be notified as expected.</p>
     *
     * @property _prevent
     * @type Object
     * @protected
     */
    _prevent: {
        start: false,
        move: true,
        end: false
    },

    /**
     * Contains the distance (postive or negative) in pixels by which 
     * the scrollview was last scrolled. This is useful when setting up 
     * click listeners on the scrollview content, which on mouse based 
     * devices are always fired, even after a drag/flick. 
     * 
     * <p>Touch based devices don't currently fire a click event, 
     * if the finger has been moved (beyond a threshold) so this 
     * check isn't required, if working in a purely touch based environment</p>
     * 
     * @property lastScrolledAmt
     * @type Number
     * @public
     */
    lastScrolledAmt: null,

    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "initializer", 127);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 128);
var sv = this;

        // Cache these values, since they aren't going to change.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 131);
sv._bb = sv.get(BOUNDING_BOX);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 132);
sv._cb = sv.get(CONTENT_BOX);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 133);
sv._cDecel = sv.get(DECELERATION);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 134);
sv._cBounce = sv.get(BOUNCE);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 135);
sv._cAxis = sv.get(AXIS);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "bindUI", 144);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 145);
var sv = this;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 147);
sv._bindFlick(sv.get(FLICK));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 148);
sv._bindDrag(sv.get(DRAG));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 149);
console.log(ScrollView.MOUSEWHEEL);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 150);
sv._bindMousewheel(ScrollView.MOUSEWHEEL);
        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 152);
sv._bindAttrs();

        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 155);
if (IE) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 156);
sv._fixIESelect(sv._bb, sv._cb);
        }
    },

    /**
     * 
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindAttrs", 166);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 167);
var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 171);
sv.after({
            'scrollEnd': sv._afterScrollEnd,
            'disabledChange': sv._afterDisabledChange,
            'flickChange': sv._afterFlickChange,
            'dragChange': sv._afterDragChange,
            'axisChange': sv._afterAxisChange,
            'scrollYChange': scrollChangeHandler,
            'scrollXChange': scrollChangeHandler,
            'heightChange': dimChangeHandler,
            'widthChange': dimChangeHandler
        });

        // TODO: This should be throttled.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 184);
Y.one(WINDOW).after('resize', dimChangeHandler, sv);
    },

    /**
     * Bind (or unbind) gesture move listeners required for drag support
     *
     * @method _bindDrag
     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.
     * @private
     */
    _bindDrag: function (drag) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindDrag", 194);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 195);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'drag' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 199);
bb.detach(DRAG + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 201);
if (drag) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 202);
bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));
        }
    },

    /**
     * Bind (or unbind) flick listeners.
     *
     * @method _bindFlick
     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.
     * @private
     */
    _bindFlick: function (flick) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindFlick", 213);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 214);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'flick' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 218);
bb.detach(FLICK + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 220);
if (flick) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 221);
bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);
        }
    },

    /**
     * Bind (or unbind) mousewheel listeners.
     *
     * @method _bindMousewheel
     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.
     * @private
     */
    _bindMousewheel: function (mousewheel) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindMousewheel", 232);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 233);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'mousewheel' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 237);
bb.detach(MOUSEWHEEL + '|*');

        // Only enable for vertical scrollviews
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 240);
if (mousewheel) {
            // Bound to document, because that's where mousewheel events fire off of.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 242);
Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));
        }
    },

    /**
     * syncUI implementation.
     *
     * Update the scroll position, based on the current value of scrollX/scrollY.
     *
     * @method syncUI
     */
    syncUI: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "syncUI", 253);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 254);
var sv = this,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight;

        // If the axis is undefined, auto-calculate it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 262);
if (sv._cAxis === undefined) {
            // This should only ever be run once (for now).
            // In the future SV might post-loaded axis changes
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 265);
sv._set(AXIS, {
                x: (scrollWidth > width),
                y: (scrollHeight > height)
            });
        }

        // get text direction on or inherited by scrollview node
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 272);
sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');

        // Cache the disabled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 275);
sv._cDisabled = sv.get(DISABLED);

        // Run this to set initial values
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 278);
sv._uiDimensionsChange();

        // If we're out-of-bounds, snap back.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 281);
if (sv._isOOB()) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 282);
sv._snapBack();
        }
    },

    /**
     * Utility method to obtain widget dimensions
     * 
     * @method _getScrollDims
     * @returns {Object} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]
     * @private
     */
    _getScrollDims: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_getScrollDims", 293);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 294);
var sv = this,
            cb = sv._cb,
            bb = sv._bb,
            TRANS = ScrollView._TRANSITION,
            dims;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 301);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 302);
cb.setStyle(TRANS.DURATION, ZERO);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 303);
cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 306);
dims = {
            'offsetWidth': bb.get('offsetWidth'),
            'offsetHeight': bb.get('offsetHeight'),
            'scrollWidth': bb.get('scrollWidth'),
            'scrollHeight': bb.get('scrollHeight')
        };

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 313);
return dims;
    },

    /**
     * This method gets invoked whenever the height or width attributes change,
     * allowing us to determine which scrolling axes need to be enabled.
     *
     * @method _uiDimensionsChange
     * @protected
     */
    _uiDimensionsChange: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_uiDimensionsChange", 323);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 324);
var sv = this,
            bb = sv._bb,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight,
            rtl = sv.rtl,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 336);
if (svAxisX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 337);
bb.addClass(CLASS_NAMES.horizontal);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 340);
if (svAxisY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 341);
bb.addClass(CLASS_NAMES.vertical);
        }

        /**
         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis
         *
         * @property _minScrollX
         * @type number
         * @protected
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 351);
sv._minScrollX = (rtl) ? -(scrollWidth - width) : 0;

        /**
         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis
         *
         * @property _maxScrollX
         * @type number
         * @protected
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 360);
sv._maxScrollX = (rtl) ? 0 : (scrollWidth - width);

        /**
         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis
         *
         * @property _minScrollY
         * @type number
         * @protected
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 369);
sv._minScrollY = 0;

        /**
         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis
         *
         * @property _maxScrollY
         * @type number
         * @protected
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 378);
sv._maxScrollY = scrollHeight - height;
    },

    /**
     * Scroll the element to a given xy coordinate
     *
     * @method scrollTo
     * @param x {Number} The x-position to scroll to. (null for no movement)
     * @param y {Number} The y-position to scroll to. (null for no movement)
     * @param {Number} [duration] ms of the scroll animation. (default is 0)
     * @param {String} [easing] An easing equation if duration is set. (defaults to ScrollView.EASING)
     * @param {String} [node] The node to move.
     */
    scrollTo: function (x, y, duration, easing, node) {
        // Check to see if widget is disabled
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "scrollTo", 391);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 393);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 394);
return;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 397);
var sv = this,
            cb = sv._cb,
            TRANS = ScrollView._TRANSITION,
            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this
            newX = 0,
            newY = 0,
            transition = {},
            transform;

        // default the optional arguments
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 407);
duration = duration || 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 408);
easing = easing || ScrollView.EASING;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 409);
node = node || cb;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 411);
if (x !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 412);
sv.set(SCROLL_X, x, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 413);
newX = -(x);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 416);
if (y !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 417);
sv.set(SCROLL_Y, y, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 418);
newY = -(y);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 421);
transform = sv._transform(newX, newY);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 423);
if (NATIVE_TRANSITIONS) {
            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 425);
node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
        }

        // Move
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 429);
if (duration === 0) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 430);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 431);
node.setStyle('transform', transform);
            }
            else {
                // TODO: If both set, batch them in the same update
                // Update: Nope, setStyles() just loops through each property and applies it.
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 436);
if (x !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 437);
node.setStyle(LEFT, newX + PX);
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 439);
if (y !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 440);
node.setStyle(TOP, newY + PX);
                }
            }
        }

        // Animate
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 447);
transition.easing = easing;
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 448);
transition.duration = duration / 1000;

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 450);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 451);
transition.transform = transform;
            }
            else {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 454);
transition.left = newX + PX;
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 455);
transition.top = newY + PX;
            }

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 458);
node.transition(transition, callback);
        }
    },

    /**
     * Utility method, to create the translate transform string with the
     * x, y translation amounts provided.
     *
     * @method _transform
     * @param {Number} x Number of pixels to translate along the x axis
     * @param {Number} y Number of pixels to translate along the y axis
     * @private
     */
    _transform: function (x, y) {
        // TODO: Would we be better off using a Matrix for this?
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_transform", 471);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 473);
var prop = 'translate(' + x + 'px, ' + y + 'px)';

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 475);
if (this._forceHWTransforms) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 476);
prop += ' translateZ(0)';
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 479);
return prop;
    },

    /**
     * Content box transition callback
     *
     * @method _onTransEnd
     * @param {Event.Facade} e The event facade
     * @private
     */
    _onTransEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onTransEnd", 489);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 490);
var sv = this;

        /**
         * Notification event fired at the end of a scroll transition
         *
         * @event scrollEnd
         * @param e {EventFacade} The default event facade.
         */
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 498);
sv.fire(EV_SCROLL_END);
    },

    /**
     * gesturemovestart event handler
     *
     * @method _onGestureMoveStart
     * @param e {Event.Facade} The gesturemovestart event facade
     * @private
     */
    _onGestureMoveStart: function (e) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveStart", 508);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 510);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 511);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 514);
var sv = this,
            bb = sv._bb,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 521);
if (sv._prevent.start) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 522);
e.preventDefault();
        }

        // if a flick animation is in progress, cancel it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 526);
if (sv._flickAnim) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 527);
sv._flickAnim.cancel();
        }

        // TODO: Review if neccesary (#2530129)
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 531);
e.stopPropagation();

        // Reset lastScrolledAmt
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 534);
sv.lastScrolledAmt = 0;

        // Stores data for this gesture cycle.  Cleaned up later
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 537);
sv._gesture = {

            // Will hold the axis value
            axis: null,

            // The current attribute values
            startX: currentX,
            startY: currentY,

            // The X/Y coordinates where the event began
            startClientX: clientX,
            startClientY: clientY,

            // The X/Y coordinates where the event will end
            endClientX: null,
            endClientY: null,

            // The current delta of the event
            deltaX: null,
            deltaY: null,

            // Will be populated for flicks
            flick: null,

            // Create some listeners for the rest of the gesture cycle
            onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),
            onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))
        };
    },

    /**
     * gesturemove event handler
     *
     * @method _onGestureMove
     * @param e {Event.Facade} The gesturemove event facade
     * @private
     */
    _onGestureMove: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMove", 574);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 575);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            startX = gesture.startX,
            startY = gesture.startY,
            startClientX = gesture.startClientX,
            startClientY = gesture.startClientY,
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 587);
if (sv._prevent.move) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 588);
e.preventDefault();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 591);
gesture.deltaX = startClientX - clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 592);
gesture.deltaY = startClientY - clientY;

        // Determine if this is a vertical or horizontal movement
        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 596);
if (gesture.axis === null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 597);
gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;
        }

        // Move X or Y.  @TODO: Move both if dualaxis.        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 601);
if (gesture.axis === DIM_X && svAxisX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 602);
sv.set(SCROLL_X, startX + gesture.deltaX);
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 604);
if (gesture.axis === DIM_Y && svAxisY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 605);
sv.set(SCROLL_Y, startY + gesture.deltaY);
        }}
    },

    /**
     * gesturemoveend event handler
     *
     * @method _onGestureMoveEnd
     * @param e {Event.Facade} The gesturemoveend event facade
     * @private
     */
    _onGestureMoveEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveEnd", 616);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 617);
var sv = this,
            gesture = sv._gesture,
            flick = gesture.flick,
            clientX = e.clientX,
            clientY = e.clientY,
            isOOB;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 624);
if (sv._prevent.end) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 625);
e.preventDefault();
        }

        // Store the end X/Y coordinates
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 629);
gesture.endClientX = clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 630);
gesture.endClientY = clientY;

        // Only if this gesture wasn't a flick, and there was movement
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 633);
if (!flick && gesture.deltaX !== null && gesture.deltaY !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 634);
if (sv._isOOB()) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 635);
sv._snapBack();
            }
            else {
                // Don't fire scrollEnd on the gesture axis is the same as paginator's
                // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 640);
if (sv.pages && !sv.pages.get(AXIS)[gesture.axis]) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 641);
sv._onTransEnd();
                }
            }
        }
    },

    /**
     * Execute a flick at the end of a scroll action
     *
     * @method _flick
     * @param e {Event.Facade} The Flick event facade
     * @private
     */
    _flick: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_flick", 654);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 655);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 656);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 659);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            flick = e.flick,
            flickAxis = flick.axis;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 667);
gesture.flick = flick;

        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 670);
if ((flickAxis === DIM_X && svAxisX) || (flickAxis === DIM_Y && svAxisY)) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 671);
sv._flickFrame(flick.velocity);
        }
    },

    /**
     * Execute a single frame in the flick animation
     *
     * @method _flickFrame
     * @param velocity {Number} The velocity of this animated frame
     * @protected
     */
    _flickFrame: function (velocity) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_flickFrame", 682);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 684);
var sv = this,
            gesture = sv._gesture,
            flickAxis = gesture.flick.axis,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            maxX = sv._maxScrollX,
            minY = sv._minScrollY,
            maxY = sv._maxScrollY,
            deceleration = sv._cDecel,
            bounce = sv._cBounce,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            step = ScrollView.FRAME_STEP,
            newX = currentX - (velocity * step),
            newY = currentY - (velocity * step);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 702);
velocity *= deceleration;

        // If we are out of bounds
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 705);
if (sv._isOOB()) {
            // We're past an edge, now bounce back
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 707);
sv._snapBack();
        }
        
        // If the velocity gets slow enough, just stop
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 711);
if (Math.abs(velocity).toFixed(4) <= 0.015) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 712);
sv._onTransEnd();
        }

        // Otherwise, animate to the next frame
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 717);
if (flickAxis === DIM_X && svAxisX) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 718);
if (newX < minX || newX > maxX) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 719);
velocity *= bounce;
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 721);
sv.set(SCROLL_X, newX);
            }
            else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 723);
if (flickAxis === DIM_Y && svAxisY) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 724);
if (newY < minY || newY > maxY) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 725);
velocity *= bounce;
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 727);
sv.set(SCROLL_Y, newY);
            }}

            // @TODO: maybe use requestAnimationFrame instead
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 731);
sv._flickAnim = Y.later(step, sv, '_flickFrame', [velocity]);
        }}
    },

    /**
     * Handle mousewheel events on the widget
     *
     * @method _mousewheel
     * @param e {Event.Facade} The mousewheel event facade
     * @private
     */
    _mousewheel: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_mousewheel", 742);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 743);
var sv = this,
            scrollY = sv.get(SCROLL_Y),
            bb = sv._bb,
            scrollOffset = 10, // 10px
            isForward = (e.wheelDelta > 0),
            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 750);
scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 752);
if (bb.contains(e.target)) {
        
            // Reset lastScrolledAmt
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 755);
sv.lastScrolledAmt = 0;

            // Jump to the new offset
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 758);
sv.set(SCROLL_Y, scrollToY);

            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            // @TODO: This probably shouldn't be in this module
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 762);
if (sv.scrollbars) {
                // @TODO: The scrollbars should handle this themselves
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 764);
sv.scrollbars._update();
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 765);
sv.scrollbars.flash();
                // or just this
                // sv.scrollbars._hostDimensionsChange();
            }

            // Fire the 'scrollEnd' event
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 771);
sv._onTransEnd();

            // prevent browser default behavior on mouse scroll
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 774);
e.preventDefault();
        }
    },

    /**
     * Checks to see the current scrollX/scrollY position is out of bounds
     *
     * @method _isOOB
     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)
     * @private
     */
    _isOOB: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_isOOB", 785);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 786);
var sv = this,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 797);
return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));
    },

    /**
     * Bounces back
     * @TODO: Should be more generalized and support both X and Y detection
     *
     * @method _snapBack
     * @private
     */
    _snapBack: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_snapBack", 807);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 808);
var sv = this,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY,
            newY = _constrain(currentY, minY, maxY),
            newX = _constrain(currentX, minX, maxX),
            duration = ScrollView.SNAP_DURATION;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 819);
if (newX !== currentX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 820);
sv.set(SCROLL_X, newX, {duration:duration});
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 822);
if (newY !== currentY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 823);
sv.set(SCROLL_Y, newY, {duration:duration});
        }
        else {
            // It shouldn't ever get here, but in case it does, fire scrollEnd
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 827);
sv._onTransEnd();
        }}
    },

    /**
     * After listener for changes to the scrollX or scrollY attribute
     *
     * @method _afterScrollChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollChange: function (e) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollChange", 838);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 840);
if (e.src === ScrollView.UI_SRC) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 841);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 844);
var sv = this,
            duration = e.duration,
            easing = e.easing,
            val = e.newVal,
            scrollToArgs = [];

        // Set the scrolled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 851);
sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);

        // Generate the array of args to pass to scrollTo()
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 854);
if (e.attrName === SCROLL_X) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 855);
scrollToArgs.push(val);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 856);
scrollToArgs.push(sv.get(SCROLL_Y));
        }
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 859);
scrollToArgs.push(sv.get(SCROLL_X));
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 860);
scrollToArgs.push(val);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 863);
scrollToArgs.push(duration);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 864);
scrollToArgs.push(easing);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 866);
sv.scrollTo.apply(sv, scrollToArgs);
    },

    /**
     * After listener for changes to the flick attribute
     *
     * @method _afterFlickChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterFlickChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterFlickChange", 876);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 877);
this._bindFlick(e.newVal);
    },

    /**
     * After listener for changes to the disabled attribute
     *
     * @method _afterDisabledChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDisabledChange: function (e) {
        // Cache for performance - we check during move
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDisabledChange", 887);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 889);
this._cDisabled = e.newVal;
    },

    /**
     * After listener for the axis attribute
     *
     * @method _afterAxisChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterAxisChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterAxisChange", 899);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 900);
this._cAxis = e.newVal;
    },

    /**
     * After listener for changes to the drag attribute
     *
     * @method _afterDragChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDragChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDragChange", 910);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 911);
this._bindDrag(e.newVal);
    },

    /**
     * After listener for changes to the drag attribute
     *
     * @method _afterDragChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterMousewheelChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterMousewheelChange", 921);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 922);
this._bindMousewheel(e.newVal);
    },

    /**
     * After listener for the height or width attribute
     *
     * @method _afterDimChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDimChange: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDimChange", 932);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 933);
this._uiDimensionsChange();
    },

    /**
     * After listener for scrollEnd, for cleanup
     *
     * @method _afterScrollEnd
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollEnd", 943);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 944);
var sv = this,
            gesture = sv._gesture;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 947);
if (gesture && gesture.onGestureMove && gesture.onGestureMove.detach) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 948);
gesture.onGestureMove.detach();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 951);
if (gesture && gesture.onGestureMoveEnd && gesture.onGestureMoveEnd.detach) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 952);
gesture.onGestureMoveEnd.detach();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 955);
if (sv._flickAnim) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 956);
if (sv._flickAnim.cancel) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 957);
sv._flickAnim.cancel(); // Might as well?
            }
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 959);
delete sv._flickAnim;
        }

        // Ideally this should be removed, but doing so causing some JS errors with fast swiping 
        // because _gesture is being deleted after the previous one has been overwritten
        // delete sv._gesture; // TODO: Move to sv.prevGesture?
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
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_axisSetter", 977);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 980);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 981);
return {
                x: val.match(/x/i) ? true : false,
                y: val.match(/y/i) ? true : false
            };
        }
    }
    
    // End prototype properties

}, {

    // Static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'scrollview'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'scrollview',

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ATTRS
     * @type {Object}
     * @protected
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
         * The scroll position in the y-axis
         *
         * @attribute scrollY
         * @type Number
         * @default 0
         */
        scrollY: {
            value: 0
        },

        /**
         * The scroll position in the x-axis
         *
         * @attribute scrollX
         * @type Number
         * @default 0
         */
        scrollX: {
            value: 0
        },

        /**
         * Drag coefficent for inertial scrolling. The closer to 1 this
         * value is, the less friction during scrolling.
         *
         * @attribute deceleration
         * @default 0.93
         */
        deceleration: {
            value: 0.93
        },

        /**
         * Drag coefficient for intertial scrolling at the upper
         * and lower boundaries of the scrollview. Set to 0 to
         * disable "rubber-banding".
         *
         * @attribute bounce
         * @type Number
         * @default 0.1
         */
        bounce: {
            value: 0.1
        },

        /**
         * The minimum distance and/or velocity which define a flick. Can be set to false,
         * to disable flick support (note: drag support is enabled/disabled separately)
         *
         * @attribute flick
         * @type Object
         * @default Object with properties minDistance = 10, minVelocity = 0.3.
         */
        flick: {
            value: {
                minDistance: 10,
                minVelocity: 0.3
            }
        },

        /**
         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)
         * @attribute drag
         * @type boolean
         * @default true
         */
        drag: {
            value: true
        }
    },

    /**
     * List of class names used in the scrollview's DOM
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES,

    /**
     * Flag used to source property changes initiated from the DOM
     *
     * @property UI_SRC
     * @type String
     * @static
     * @default 'ui'
     */
    UI_SRC: UI,

    /**
     * The default bounce distance in pixels
     *
     * @property BOUNCE_RANGE
     * @type Number
     * @static
     * @default 150
     */
    BOUNCE_RANGE: 150,

    /**
     * The interval used when animating the flick
     *
     * @property FRAME_STEP
     * @type Number
     * @static
     * @default 16
     */
    FRAME_STEP: 16,

    /**
     * The default easing used when animating the flick
     *
     * @property EASING
     * @type String
     * @static
     * @default 'cubic-bezier(0, 0.1, 0, 1.0)'
     */
    EASING: 'cubic-bezier(0, 0.1, 0, 1.0)',

    /**
     * The default easing to use when animating the bounce snap back.
     *
     * @property SNAP_EASING
     * @type String
     * @static
     * @default 'ease-out'
     */
    SNAP_EASING: 'ease-out',

    /**
     * The default duration to use when animating the bounce snap back.
     *
     * @property SNAP_DURATION
     * @type Number
     * @static
     * @default 400
     */
    SNAP_DURATION: 400,

    /**
     * Object map of style property names used to set transition properties.
     * Defaults to the vendor prefix established by the Transition module.
     * The configured property names are `_TRANSITION.DURATION` (e.g. "WebkitTransitionDuration") and
     * `_TRANSITION.PROPERTY (e.g. "WebkitTransitionProperty").
     *
     * @property _TRANSITION
     * @private
     */
    _TRANSITION: {
        DURATION: Y.Transition._VENDOR_PREFIX + 'TransitionDuration',
        PROPERTY: Y.Transition._VENDOR_PREFIX + 'TransitionProperty'
    },

    /**
     * Enable/Disable scrolling content via mousewheel
     * @property mousewheel
     * @type boolean
     * @static
     * @default true
     */
    MOUSEWHEEL: {
        value: true
    }
    // End static properties

});

}, '@VERSION@', {"requires": ["widget", "event-gestures", "event-mousewheel", "transition"], "skinnable": true});
