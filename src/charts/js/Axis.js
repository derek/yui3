/**
 * The Axis class. Generates axes for a chart.
 *
 * @class Axis
 * @extends Widget
 * @constructor
 */
Y.Axis = function(cfg)
{
    Y.Axis.superclass.constructor.apply(this, arguments);
};

Y.Axis.NAME = "axis";

Y.extend(Y.Axis, Y.Widget, {
    /**
     * @private
     */
    _dataChangeHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },
    
    /**
     * @private
     */
    renderUI: function()
    {
        var pos = this.get("position");
        this._layout = new this._layoutClasses[pos]();
        if(this._layout)
        {
            this._setCanvas();
        }
    },

    /**
     * @private
     */
    syncUI: function()
    {
        var defaultMargins = this._layout._getDefaultMargins(),
            styles = this.get("styles"),
            label = styles.label.margin,
            title =styles.title.margin,
            i;
        //need to defaultMargins method to the layout classes.
        for(i in defaultMargins)
        {
            if(defaultMargins.hasOwnProperty(i))
            {
                label[i] = label[i] === undefined ? defaultMargins[i] : label[i];
                title[i] = title[i] === undefined ? defaultMargins[i] : title[i];
            }
        }
        this._drawAxis();
    },

    /**
     * @private
     */
    _setCanvas: function()
    {
        var cb = this.get("contentBox"),
            bb = this.get("boundingBox"),
            p = this.get("position"),
            pn = this._parentNode,
            w = this.get("width"),
            h = this.get("height");
        bb.setStyle("position", "absolute");
        w = w ? w + "px" : pn.getStyle("width");
        h = h ? h + "px" : pn.getStyle("height");
        if(p === "top" || p === "bottom")
        {
            cb.setStyle("width", w);
        }
        else
        {
            cb.setStyle("height", h);
        }
        cb.setStyle("position", "relative");
        cb.setStyle("left", "0px");
        cb.setStyle("top", "0px");
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(cb);
    },
	
    /**
     * @protected
     *
     * Gets the default value for the <code>styles</code> attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     */
    _getDefaultStyles: function()
    {
        var axisstyles = {
            majorTicks: {
                display:"inside",
                length:4,
                color:"#dad8c9",
                weight:1,
                alpha:1
            },
            minorTicks: {
                display:"none",
                length:2,
                color:"#dad8c9",
                weight:1
            },
            line: {
                weight:1,
                color:"#dad8c9",
                alpha:1
            },
            majorUnit: {
                determinant:"count",
                count:11,
                distance:75
            },
            top: "0px",
            left: "0px",
            width: "100px",
            height: "100px",
            label: {
                color:"#808080",
                alpha: 1,
                fontSize:"85%",
                rotation: 0,
                margin: {
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    left: undefined
                }
            },
            title: {
                color:"#808080",
                alpha: 1,
                fontSize:"85%",
                rotation: undefined,
                margin: {
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    left: undefined
                }
            },
            hideOverlappingLabelTicks: false
        };
        return Y.merge(Y.Renderer.prototype._getDefaultStyles(), axisstyles); 
    },

    /**
     * @private
     */
    _handleSizeChange: function(e)
    {
        var attrName = e.attrName,
            pos = this.get("position"),
            vert = pos == "left" || pos == "right",
            cb = this.get("contentBox"),
            hor = pos == "bottom" || pos == "top";
        cb.setStyle("width", this.get("width"));
        cb.setStyle("height", this.get("height"));
        if((hor && attrName == "width") || (vert && attrName == "height"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private 
     */
    getLayout: function(pos)
    {
        return new this._layoutClasses[pos]();
    },
   
    /**
     * @private
     */
    _layoutClasses: 
    {
        top : Y.TopAxisLayout,
        bottom: Y.BottomAxisLayout,
        left: Y.LeftAxisLayout,
        right : Y.RightAxisLayout
    },

    /**
     * @private
     */
    drawLine: function(startPoint, endPoint, line)
    {
        var graphic = this.get("graphic");
        graphic.lineStyle(line.weight, line.color, line.alpha);
        graphic.moveTo(startPoint.x, startPoint.y);
        graphic.lineTo(endPoint.x, endPoint.y);
        graphic.end();
    },

    _getTextRotationProps: function(styles)
    {
        if(styles.rotation === undefined)
        {
            switch(this.get("position"))
            {
                case "left" :
                    styles.rotation = -90;
                break; 
                case "right" : 
                    styles.rotation = 90;
                break;
                default :
                    styles.rotation = 0;
                break;
            }
        }
        var rot =  Math.min(90, Math.max(-90, styles.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11 = cosRadians,
            m12 = rot > 0 ? -sinRadians : sinRadians,
            m21 = -m12,
            m22 = m11;
        return {
            rot: rot,
            absRot: absRot,
            radCon: radCon,
            sinRadians: sinRadians,
            cosRadians: cosRadians,
            m11: m11,
            m12: m12,
            m21: m21,
            m22: m22,
            textAlpha: styles.alpha
        };

    },

    /**
     * @private
     */
    _drawAxis: function ()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        if(this._layout)
        {
            var styles = this.get("styles"),
                labelStyles = styles.label,
                majorTickStyles = styles.majorTicks,
                drawTicks = majorTickStyles.display != "none",
                tickPoint,
                majorUnit = styles.majorUnit,
                len,
                majorUnitDistance,
                i = 0,
                layout = this._layout,
                layoutLength,
                position,
                lineStart,
                label,
                labelFunction = this.get("labelFunction"),
                labelFunctionScope = this.get("labelFunctionScope"),
                labelFormat = this.get("labelFormat"),
                graphic = this.get("graphic");
            this._labelRotationProps = this._getTextRotationProps(labelStyles);
            graphic.clear();
            layout.setTickOffsets.apply(this);
            layoutLength = this.getLength();
            lineStart = layout.getLineStart.apply(this);
            len = this.getTotalMajorUnits(majorUnit);
            majorUnitDistance = this.getMajorUnitDistance(len, layoutLength, majorUnit);
            this.set("edgeOffset", this.getEdgeOffset(len, layoutLength) * 0.5);
            tickPoint = this.getFirstPoint(lineStart);
            this.drawLine(lineStart, this.getLineEnd(tickPoint), styles.line);
            if(drawTicks) 
            {
               layout.drawTick.apply(this, [tickPoint, majorTickStyles]);
            }
            if(len < 1)
            {
                this._clearLabelCache();
                return;
            }
            this._createLabelCache();
            this._tickPoints = [];
            this.set("maxLabelSize", 0); 
            this._titleSize = 0;
            for(; i < len; ++i)
            {
                if(drawTicks) 
                {
                    layout.drawTick.apply(this, [tickPoint, majorTickStyles]);
                }
                position = this.getPosition(tickPoint);
                label = this.getLabel(tickPoint, labelStyles);
                label.innerHTML = labelFunction.apply(labelFunctionScope, [this.getLabelByIndex(i, len), labelFormat]);
                tickPoint = this.getNextPoint(tickPoint, majorUnitDistance);
            }
            this._clearLabelCache();
            this._updateTitle();
            layout.setSizeAndPosition.apply(this);
            if(this.get("overlapGraph"))
            {
               layout.offsetNodeForTick.apply(this, [this.get("contentBox")]);
            }
            layout.setCalculatedSize.apply(this);
            for(i = 0; i < len; ++i)
            {
                layout.positionLabel.apply(this, [this.get("labels")[i], this._tickPoints[i]]);
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._drawAxis();
        }
        else
        {
            this.fire("axisRendered");
        }
    },

    /**
     * @private
     */
    _updateTitle: function()
    {
        var i,
            styles,
            customStyles,
            title = this.get("title"),
            titleTextField = this._titleTextField,
            parentNode;
        if(title !== null && title !== undefined)
        {
            customStyles = {
                    rotation: "rotation",
                    margin: "margin",
                    alpha: "alpha"
            };
            styles = this.get("styles").title;
            if(!titleTextField)
            {
                titleTextField = Y.config.doc.createElement('span');
                titleTextField.setAttribute("class", "axisTitle");
                this.get("contentBox").appendChild(titleTextField);
            }
            titleTextField.setAttribute("style", "display:block;white-space:nowrap;position:absolute;");
            for(i in styles)
            {
                if(styles.hasOwnProperty(i) && !customStyles.hasOwnProperty(i))
                {
                    titleTextField.style[i] = styles[i];
                }
            }
            titleTextField.innerHTML = title;
            this._titleTextField = titleTextField;
            this._layout.positionTitle.apply(this, [titleTextField]);
        }
        else if(titleTextField)
        {
            parentNode = titleTextField.parentNode;
            if(parentNode)
            {
                parentNode.removeChild(titleTextField);
            }
            this._titleTextField = null;
        }
    },

    /**
     * @private
     */
    _labels: null,

    /**
     * @private 
     */
    _labelCache: null,

    /**
     * @private
     */
    getLabel: function(pt, styles)
    {
        var i,
            label,
            customStyles = {
                rotation: "rotation",
                margin: "margin",
                alpha: "alpha"
            },
            cache = this._labelCache;
        if(cache.length > 0)
        {
            label = cache.shift();
        }
        else
        {
            label = document.createElement("span");
            label.style.display = "block";
            label.style.whiteSpace = "nowrap";
            Y.one(label).addClass("axisLabel");
            this.get("contentBox").appendChild(label);
        }
        label.style.position = "absolute";
        this._labels.push(label);
        this._tickPoints.push({x:pt.x, y:pt.y});
        this._layout.updateMaxLabelSize.apply(this, [label]);
        for(i in styles)
        {
            if(styles.hasOwnProperty(i) && !customStyles.hasOwnProperty(i))
            {
                label.style[i] = styles[i];
            }
        }
        return label;
    },   

    /**
     * @private
     */
    _createLabelCache: function()
    {
        if(this._labels)
        {
            if(this._labelCache)
            {
                this._labelCache = this._labels.concat(this._labelCache);
            }
            else
            {
                this._labelCache = this._labels.concat();
            }
        }
        else
        {
            this._clearLabelCache();
        }
        this._labels = [];
    },
    
    /**
     * @private
     */
    _clearLabelCache: function()
    {
        if(this._labelCache)
        {
            var len = this._labelCache.length,
                i = 0,
                label,
                labelCache = this._labelCache;
            for(; i < len; ++i)
            {
                label = labelCache[i];
                label.parentNode.removeChild(label);
            }
        }
        this._labelCache = [];
    },

    /**
     * @private
     */
    _calculateSizeByTickLength: true,

    /**
     * @private 
     */
    getLineEnd: function(pt)
    {
        var w = this.get("width"),
            h = this.get("height"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w, y:pt.y};
        }
        else
        {
            return {x:pt.x, y:h};
        }
    },

    /**
     * @private
     */
    getLength: function()
    {
        var l,
            style = this.get("styles"),
            padding = style.padding,
            w = this.get("width"),
            h = this.get("height"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            l = w - (padding.left + padding.right);
        }
        else
        {
            l = h - (padding.top + padding.bottom);
        }
        return l;
    },

    /**
     * @private
     */
    getFirstPoint:function(pt)
    {
        var style = this.get("styles"),
            pos = this.get("position"),
            padding = style.padding,
            np = {x:pt.x, y:pt.y};
        if(pos === "top" || pos === "bottom")
        {
            np.x += padding.left + this.get("edgeOffset");
        }
        else
        {
            np.y += this.get("height") - (padding.top + this.get("edgeOffset"));
        }
        return np;
    },

    /**
     * @private
     */
    getNextPoint: function(point, majorUnitDistance)
    {
        var pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            point.x = point.x + majorUnitDistance;		
        }
        else
        {
            point.y = point.y - majorUnitDistance;
        }
        return point;
    },

    /**
     * @private 
     */
    getLastPoint: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            w = this.get("width"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w - padding.right, y:padding.top};
        }
        else
        {
            return {x:padding.left, y:padding.top};
        }
    },

    /**
     * @private 
     */
    getPosition: function(point)
    {
        var p,
            h = this.get("height"),
            style = this.get("styles"),
            padding = style.padding,
            pos = this.get("position"),
            dataType = this.get("dataType");
        if(pos === "left" || pos === "right") 
        {
            //Numeric data on a vertical axis is displayed from bottom to top.
            //Categorical and Timeline data is displayed from top to bottom.
            if(dataType === "numeric")
            {
                p = (h - (padding.top + padding.bottom)) - (point.y - padding.top);
            }
            else
            {
                p = point.y - padding.top;
            }
        }
        else
        {
            p = point.x - padding.left;
        }
        return p;
    },

    /**
     * @private
     */
    _rotate: function(label, props)
    {
        var rot = props.rot,
            absRot,
            radCon,
            sinRadians,
            cosRadians,
            m11,
            m12,
            m21,
            m22,
            filterString,
            textAlpha;
        if(Y.config.doc.createElementNS)
        {
            label.style.MozTransformOrigin =  "0 0";
            label.style.MozTransform = "rotate(" + rot + "deg)";
            label.style.webkitTransformOrigin = "0 0";
            label.style.webkitTransform = "rotate(" + rot + "deg)";
            label.style.msTransformOrigin =  "0 0";
            label.style.msTransform = "rotate(" + rot + "deg)";
            label.style.OTransformOrigin =  "0 0";
            label.style.OTransform = "rotate(" + rot + "deg)";
        }
        else
        {
            textAlpha = props.textAlpha;
            absRot = props.absRot;
            radCon = props.radCon;
            sinRadians = props.sinRadians;
            cosRadians = props.cosRadians;
            m11 = props.m11;
            m12 = props.m12;
            m21 = props.m21;
            m22 = props.m22;
            if(Y.Lang.isNumber(textAlpha) && textAlpha < 1 && textAlpha > -1 && !isNaN(textAlpha))
            {
                filterString = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(textAlpha * 100) + ")";
            }
            if(rot !== 0)
            {
                if(filterString)
                {
                    filterString += " ";
                }
                else
                {
                    filterString = ""; 
                }
                filterString += 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            }
            if(filterString)
            {
                label.style.filter = filterString;
            }
        }
    }
});

Y.Axis.ATTRS = Y.merge(Y.Renderer.ATTRS, {
        /**
         * @protected
         *
         * Difference betweend the first/last tick and edge of axis.
         *
         * @attribute edgeOffset
         * @type Number
         */
        edgeOffset: 
        {
            value: 0
        },

        /**
         * The graphic in which the axis line and ticks will be rendered.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {},
        
        /**
         * Contains the contents of the axis. 
         *
         * @attribute node
         * @type HTMLElement
         */
        node: {},

        /**
         * Direction of the axis.
         *
         * @attribute position
         * @type String
         */
        position: {
            setOnce: true,

            setter: function(val)
            {
                return val;
            }
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the top of the axis.
         *
         * @attribute topTickOffset
         * @type Number
         */
        topTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the bottom of the axis.
         *
         * @attribute bottomTickOffset
         * @type Number
         */
        bottomTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the left of the axis.
         *
         * @attribute leftTickOffset
         * @type Number
         */
        leftTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the right side of the axis.
         *
         * @attribute rightTickOffset
         * @type Number
         */
        rightTickOffset: {
            value: 0
        },
        
        /**
         * Collection of labels used to render the axis.
         *
         * @attribute labels
         * @type Array
         */
        labels: {
            readOnly: true,
            getter: function()
            {
                return this._labels;
            }
        },

        /**
         * Collection of points used for placement of labels and ticks along the axis.
         *
         * @attribute tickPoints
         * @type Array
         */
        tickPoints: {
            readOnly: true,

            getter: function()
            {
                if(this.get("position") == "none")
                {
                    return this.get("styles").majorUnit.count;
                }
                return this._tickPoints;
            }
        },

        /**
         * Indicates whether the axis overlaps the graph. If an axis is the inner most axis on a given
         * position and the tick position is inside or cross, the axis will need to overlap the graph.
         *
         * @attribute overlapGraph
         * @type Boolean
         */
        overlapGraph: {
            value:true,

            validator: function(val)
            {
                return Y.Lang.isBoolean(val);
            }
        },

        /**
         * Object which should have by the labelFunction
         *
         * @attribute labelFunctionScope
         * @type Object
         */
        labelFunctionScope: {},
        
        /**
         * Length in pixels of largest text bounding box. Used to calculate the height of the axis.
         *
         * @attribute maxLabelSize
         * @type Number
         * @protected
         */
        maxLabelSize: {
            value: 0
        },
    
        /**
         *  Title for the axis. When specified, the title will display. The position of the title is determined by the axis position. 
         *  <dl>
         *      <dt>top</dt><dd>Appears above the axis and it labels. The default rotation is 0.</dd>
         *      <dt>right</dt><dd>Appears to the right of the axis and its labels. The default rotation is 90.</dd>
         *      <dt>bottom</dt><dd>Appears below the axis and its labels. The default rotation is 0.</dd>
         *      <dt>left</dt><dd>Appears to the left of the axis and its labels. The default rotation is -90.</dd>
         *  </dl>
         */
        title: {}

        /**
         * Style properties used for drawing an axis. This attribute is inherited from <code>Renderer</code>. Below are the default values:
         *  <dl>
         *      <dt>majorTicks</dt><dd>Properties used for drawing ticks.
         *          <dl>
         *              <dt>display</dt><dd>Position of the tick. Possible values are <code>inside</code>, <code>outside</code>, <code>cross</code> and <code>none</code>. The
         *              default value is <code>inside</code>.</dd>
         *              <dt>length</dt><dd>The length (in pixels) of the tick. The default value is 4.</dd>
         *              <dt>color</dt><dd>The color of the tick. The default value is <code>#dad8c9</code></dd>
         *              <dt>weight</dt><dd>Number indicating the width of the tick. The default value is 1.</dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the tick. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>line</dt><dd>Properties used for drawing the axis line. 
         *          <dl>
         *              <dt>weight</dt><dd>Number indicating the width of the axis line. The default value is 1.</dd>
         *              <dt>color</dt><dd>The color of the axis line. The default value is <code>#dad8c9</code>.</dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the tick. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>majorUnit</dt><dd>Properties used to calculate the <code>majorUnit</code> for the axis. 
         *          <dl>
         *              <dt>determinant</dt><dd>The algorithm used for calculating distance between ticks. The possible options are <code>count</code> and <code>distance</code>. If
         *              the <code>determinant</code> is <code>count</code>, the axis ticks will spaced so that a specified number of ticks appear on the axis. If the <code>determinant</code>
         *              is <code>distance</code>, the axis ticks will spaced out according to the specified distance. The default value is <code>count</code>.</dd>
         *              <dt>count</dt><dd>Number of ticks to appear on the axis when the <code>determinant</code> is <code>count</code>. The default value is 11.</dd>
         *              <dt>distance</dt><dd>The distance (in pixels) between ticks when the <code>determinant</code> is <code>distance</code>. The default value is 75.</dd>
         *          </dl>
         *      </dd>
         *      <dt>label</dt><dd>Properties and styles applied to the axis labels.
         *          <dl>
         *              <dt>color</dt><dd>The color of the labels. The default value is <code>#808080</code>.</dd>
         *              <dt>alpha</dt><dd>Number between 0 and 1 indicating the opacity of the labels. The default value is 1.</dd>
         *              <dt>fontSize</dt><dd>The font-size of the labels. The default value is 85%</dd>
         *              <dt>rotation</dt><dd>The rotation, in degrees (between -90 and 90) of the labels. The default value is 0.</dd>
         *              <dt>margin</dt><dd>The distance between the label and the axis/tick. Depending on the position of the <code>Axis</code>, only one of the properties used.
         *                  <dl>
         *                      <dt>top</dt><dd>Pixel value used for an axis with a <code>position</code> of <code>bottom</code>. The default value is 4.</dd>
         *                      <dt>right</dt><dd>Pixel value used for an axis with a <code>position</code> of <code>left</code>. The default value is 4.</dd>
         *                      <dt>bottom</dt><dd>Pixel value used for an axis with a <code>position</code> of <code>top</code>. The default value is 4.</dd>
         *                      <dt>left</dt><dd>Pixel value used for an axis with a <code>position</code> of <code>right</code>. The default value is 4.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    });
Y.mix(Y.Axis, Y.Renderer, false, null, 1);
