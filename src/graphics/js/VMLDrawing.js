Y.log('using VML');
var Y_LANG = Y.Lang,
    IS_NUM = Y_LANG.isNumber,
    IS_ARRAY = Y_LANG.isArray,
    IS_STRING = Y_LANG.isString,
    Y_DOM = Y.DOM,
    Y_SELECTOR = Y.Selector,
    DOCUMENT = Y.config.doc,
    AttributeLite = Y.AttributeLite,
	VMLShape,
	VMLCircle,
	VMLPath,
	VMLRect,
	VMLEllipse,
	VMLGraphic,
    VMLPieSlice;

function VMLDrawing() {}

/**
 * <a href="http://www.w3.org/TR/NOTE-VML">VML</a> implementation of the <a href="Drawing.html">`Drawing`</a> class. 
 * `VMLDrawing` is not intended to be used directly. Instead, use the <a href="Drawing.html">`Drawing`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> and <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> 
 * capabilities, the <a href="Drawing.html">`Drawing`</a> class will point to the `VMLDrawing` class.
 *
 * @module graphics
 * @class VMLDrawing
 * @constructor
 */
VMLDrawing.prototype = {
    /**
     * Current x position of the drqwing.
     *
     * @property _currentX
     * @type Number
     * @private
     */
    _currentX: 0,

    /**
     * Current y position of the drqwing.
     *
     * @property _currentY
     * @type Number
     * @private
     */
    _currentY: 0,

    /**
     * Returns a path array to be compiled into a path command at end.
     *
     * @method _getCurrentPath
     * @param {String} command The drawing command to be added to the path.
     * @private
     */
    _getCurrentPathArray: function(command)
    {
        var currentArray;
        if(this._pathType !== command)
        {
            this._pathType = command;
            currentArray = [command];
            if(!this._pathArray)
            {
                this._pathArray = [];
            }
            this._pathArray.push(currentArray);
        }
        else
        {
            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            if(!currentArray)
            {
                currentArray = [];
                this._pathArray.push(currentArray);
            }
        }
        return currentArray;
    },

    /**
     * Draws a bezier curve.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        var hiX,
            loX,
            hiY,
            loY,
            currentArray = this._getCurrentPathArray("c");
        currentArray.push(cp1x);
        currentArray.push(cp1y); 
        currentArray.push(cp2x); 
        currentArray.push(cp2y); 
        currentArray.push(x); 
        currentArray.push(y);
        this._currentX = x;
        this._currentY = y;
        hiX = Math.max(x, Math.max(cp1x, cp2x));
        hiY = Math.max(y, Math.max(cp1y, cp2y));
        loX = Math.min(x, Math.min(cp1x, cp2x));
        loY = Math.min(y, Math.min(cp1y, cp2y));
        this._trackSize(hiX, hiY);
        this._trackSize(loX, loY);
    },

    /**
     * Draws a quadratic bezier curve.
     *
     * @method quadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    quadraticCurveTo: function(cpx, cpy, x, y) {
        var currentX = this._currentX,
            currentY = this._currentY,
            cp1x = currentX + 0.67*(cpx - currentX),
            cp1y = currentY + 0.67*(cpy - currentY),
            cp2x = cp1x + (x - currentX) * 0.34,
            cp2y = cp1y + (y - currentY) * 0.34;
        this.curveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    },

    /**
     * Draws a rectangle.
     *
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
    drawRect: function(x, y, w, h) {
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this._currentX = x;
        this._currentY = y;
        return this;
    },

    /**
     * Draws a rectangle with rounded corners.
     * 
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @param {Number} ew width of the ellipse used to draw the rounded corners
     * @param {Number} eh height of the ellipse used to draw the rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
        return this;
    },

    /**
     * Draws a circle. Used internally by `CanvasCircle` class.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     * @protected
     */
	drawCircle: function(x, y, radius) {
        var startAngle = 0,
            endAngle = 360,
            circum = radius * 2,
            currentArray;

        endAngle *= 65535;
        this._drawingComplete = false;
        this._trackSize(x + circum, y + circum);
        this.moveTo((x + circum), (y + radius));
        currentArray = this._getCurrentPathArray("ae");
        currentArray.push(x + radius);
        currentArray.push(y + radius); 
        currentArray.push(radius); 
        currentArray.push(radius); 
        currentArray.push(startAngle); 
        currentArray.push(endAngle);
        return this;
    },
    
    /**
     * Draws an ellipse.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @protected
     */
	drawEllipse: function(x, y, w, h) {
        var startAngle = 0,
            endAngle = 360,
            radius = w * 0.5,
            yRadius = h * 0.5,
            currentArray;
        endAngle *= 65535;
        this._drawingComplete = false;
        this._trackSize(x + w, y + h);
        this.moveTo((x + w), (y + yRadius));
        currentArray = this._getCurrentPathArray("ae");
        currentArray.push(x + radius);
        currentArray.push(y + yRadius);
        currentArray.push(radius);
        currentArray.push(yRadius);
        currentArray.push(startAngle);
        currentArray.push(endAngle);
        return this;
    },
    
    /**
     * Draws a diamond.     
     * 
     * @method drawDiamond
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} width width
     * @param {Number} height height
     * @protected
     */
    drawDiamond: function(x, y, width, height)
    {
        var midWidth = width * 0.5,
            midHeight = height * 0.5;
        this.moveTo(x + midWidth, y);
        this.lineTo(x + width, y + midHeight);
        this.lineTo(x + midWidth, y + height);
        this.lineTo(x, y + midHeight);
        this.lineTo(x + midWidth, y);
        return this;
    },

    /**
     * Draws a wedge.
     *
     * @method drawWedge
     * @param {Number} x x-coordinate of the wedge's center point
     * @param {Number} y y-coordinate of the wedge's center point
     * @param {Number} startAngle starting angle in degrees
     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.
     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param {Number} yRadius [optional] y radius for wedge.
     * @private
     */
    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        var diameter = radius * 2,
            currentArray = this._getCurrentPathArray("ae");
        yRadius = yRadius || radius;
        radius = Math.round(radius);
        yRadius = Math.round(yRadius);
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        startAngle *= -65535;
        arc *= 65536;
        moveTo(x, y);
        currentArray.concat([x, y, radius, yRadius, startAngle, arc]);
        this._trackSize(diameter, diameter); 
        this._currentX = x;
        this._currentY = y;
        return this;
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function(point1, point2, etc) {
        var args = arguments,
            i,
            len,
            currentArray = this._getCurrentPathArray("l");
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        len = args.length;
        for (i = 0; i < len; ++i) {
            currentArray.push(args[i][0]);
            currentArray.push(args[i][1]);
            this._trackSize.apply(this, args[i]);
            this._currentX = args[i][0];
            this._currentY = args[i][1];
        }
        return this;
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function(x, y) {
        var currentArray = this._getCurrentPathArray("m");
        currentArray[1] = x
        currentArray[2] = y;
        this._trackSize(x, y);
        this._currentX = x;
        this._currentY = y;
    },

    /**
     * Draws the graphic.
     *
     * @method _draw
     * @private
     */
    _closePath: function()
    {
        var fill = this.get("fill"),
            stroke = this.get("stroke"),
            node = this.node,
            w = this.get("width"),
            h = this.get("height"),
            path = "",
            pathEnd = "",
            currentPath,
            command,
            args,
            multiplier = 21600,
            i,
            len,
            multiplier,
            pathArray = this._pathArray;
        while(pathArray.length > 0)
        {
            currentPath = pathArray.shift();
            if(IS_ARRAY(currentPath))
            {
                command = currentPath.shift();
                args = currentPath;
                len = command == "ae" ? 4 : args.length;
                for(i = 0; i < len; ++i)
                {
                    args[i] = Math.round(args[i] * multiplier);
                }
                path += " " + command + " " + args.toString();
            }
            else if(IS_STRING(currentPath))
            {
                path += currentPath;
            }
        }
        this._fillChangeHandler();
        this._strokeChangeHandler();
        if(path)
        {
            if(fill && fill.color)
            {
                pathEnd += ' x';
            }
            if(stroke)
            {
                pathEnd += ' e';
            }
        }
        if(path)
        {
            node.path = path + pathEnd;
        }
        if(!isNaN(w) && !isNaN(h))
        {
            node.coordOrigin = this._left + ", " + this._top;
            node.coordSize = (w * multiplier) + ", " + (h * multiplier);
            node.style.position = "absolute";
            node.style.width =  w + "px";
            node.style.height =  h + "px";
        }
        this._path = path;
        this._updateTransform();
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._closePath();
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        this._pathArray.push(' x e ');
        this._pathType = 'pathEnd';
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
		this._right = 0;
        this._bottom = 0;
        this._width = 0;
        this._height = 0;
        this._left = 0;
        this._top = 0;
        this._path = "";
        this._pathArray = [];
    },

    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._right) {
            this._right = w;
        }
        if(w < this._left)
        {
            this._left = w;    
        }
        if (h < this._top)
        {
            this._top = h;
        }
        if (h > this._bottom) 
        {
            this._bottom = h;
        }
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
    },

    _left: 0,

    _right: 0,

    _top: 0,

    _bottom: 0,

    _width: 0,

    _height: 0
};
Y.VMLDrawing = VMLDrawing;
