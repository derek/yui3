YUI.add("scrollview-base",function(a,y){var M=a.ClassNameManager.getClassName,b=a.config.doc,i=a.config.win,j=a.UA.ie,N=a.Transition.useNative,g="scrollview",o={vertical:M(g,"vert"),horizontal:M(g,"horiz")},F="scrollEnd",L="flick",l="drag",r="mousewheel",n="ui",z="top",K="right",u="bottom",m="left",O="px",D="axis",E="scrollY",G="scrollX",B="bounce",w="disabled",d="deceleration",q="x",p="y",J="boundingBox",s="contentBox",t="gesturemove",v="start",H="end",c="",h="0s",e="snapDuration",I="snapEasing",f="easing",k="frameDuration",A="bounceRange",x=function(R,Q,P){return Math.min(Math.max(R,Q),P);};function C(){C.superclass.constructor.apply(this,arguments);}a.ScrollView=a.extend(C,a.Widget,{_forceHWTransforms:a.UA.webkit?true:false,_prevent:{start:false,move:true,end:false},lastScrolledAmt:0,initializer:function(Q){var P=this;P._bb=P.get(J);P._cb=P.get(s);P._cAxis=P.get(D);P._cBounce=P.get(B);P._cBounceRange=P.get(A);P._cDeceleration=P.get(d);P._cFrameDuration=P.get(k);},bindUI:function(){var P=this;P._bindFlick(P.get(L));P._bindDrag(P.get(l));P._bindMousewheel(true);P._bindAttrs();if(j){P._fixIESelect(P._bb,P._cb);}if(C.SNAP_DURATION){P.set(e,C.SNAP_DURATION);}if(C.SNAP_EASING){P.set(I,C.SNAP_EASING);}if(C.EASING){P.set(f,C.EASING);}if(C.FRAME_STEP){P.set(k,C.FRAME_STEP);}if(C.BOUNCE_RANGE){P.set(A,C.BOUNCE_RANGE);}},_bindAttrs:function(){var P=this,R=P._afterScrollChange,Q=P._afterDimChange;P.after({"scrollEnd":P._afterScrollEnd,"disabledChange":P._afterDisabledChange,"flickChange":P._afterFlickChange,"dragChange":P._afterDragChange,"axisChange":P._afterAxisChange,"scrollYChange":R,"scrollXChange":R,"heightChange":Q,"widthChange":Q});},_bindDrag:function(Q){var P=this,R=P._bb;R.detach(l+"|*");if(Q){R.on(l+"|"+t+v,a.bind(P._onGestureMoveStart,P));}},_bindFlick:function(Q){var P=this,R=P._bb;R.detach(L+"|*");if(Q){R.on(L+"|"+L,a.bind(P._flick,P),Q);P._bindDrag(P.get(l));}},_bindMousewheel:function(P){var Q=this,R=Q._bb;R.detach(r+"|*");if(P){a.one(b).on(r,a.bind(Q._mousewheel,Q));}},syncUI:function(){var Q=this,U=Q._getScrollDims(),T=U.offsetWidth,P=U.offsetHeight,R=U.scrollWidth,S=U.scrollHeight;if(Q._cAxis===undefined){Q._cAxis={x:(R>T),y:(S>P)};Q._set(D,Q._cAxis);}Q.rtl=(Q._cb.getComputedStyle("direction")==="rtl");Q._cDisabled=Q.get(w);Q._uiDimensionsChange();if(Q._isOutOfBounds()){Q._snapBack();}},_getScrollDims:function(){var Q=this,P=Q._cb,T=Q._bb,R=C._TRANSITION,S;if(N){P.setStyle(R.DURATION,h);P.setStyle(R.PROPERTY,c);}S={"offsetWidth":T.get("offsetWidth"),"offsetHeight":T.get("offsetHeight"),"scrollWidth":T.get("scrollWidth"),"scrollHeight":T.get("scrollHeight")};return S;},_uiDimensionsChange:function(){var V=this,S=V._bb,U=V._getScrollDims(),P=U.offsetWidth,W=U.offsetHeight,Q=U.scrollWidth,X=U.scrollHeight,T=V.rtl,R=V._cAxis;if(R&&R.x){S.addClass(o.horizontal);}if(R&&R.y){S.addClass(o.vertical);}V._minScrollX=(T)?Math.min(0,-(Q-P)):0;V._maxScrollX=(T)?0:Math.max(0,Q-P);V._minScrollY=0;V._maxScrollY=Math.max(0,X-W);},scrollTo:function(Y,X,T,V,R){if(this._cDisabled){return;}var Z=this,S=Z._cb,W=C._TRANSITION,aa=a.bind(Z._onTransEnd,Z),P=0,ab=0,U={},Q;T=T||0;V=V||Z.get(f);R=R||S;if(Y!==null){Z.set(G,Y,{src:n});P=-(Y);}if(X!==null){Z.set(E,X,{src:n});ab=-(X);}Q=Z._transform(P,ab);if(N){R.setStyle(W.DURATION,h).setStyle(W.PROPERTY,c);}if(T===0){if(N){R.setStyle("transform",Q);}else{if(Y!==null){R.setStyle(m,P+O);}if(X!==null){R.setStyle(z,ab+O);}}}else{U.easing=V;U.duration=T/1000;if(N){U.transform=Q;}else{U.left=P+O;U.top=ab+O;}R.transition(U,aa);}},_transform:function(P,R){var Q="translate("+P+"px, "+R+"px)";if(this._forceHWTransforms){Q+=" translateZ(0)";}return Q;},_onTransEnd:function(Q){var P=this;P.fire(F);},_onGestureMoveStart:function(U){if(this._cDisabled){return false;}var Q=this,V=Q._bb,R=Q.get(G),P=Q.get(E),T=U.clientX,S=U.clientY;if(Q._prevent.start){U.preventDefault();}if(Q._flickAnim){Q._flickAnim.cancel();delete Q._flickAnim;Q._onTransEnd();}U.stopPropagation();Q.lastScrolledAmt=0;Q._gesture={axis:null,startX:R,startY:P,startClientX:T,startClientY:S,endClientX:null,endClientY:null,deltaX:null,deltaY:null,flick:null,onGestureMove:V.on(l+"|"+t,a.bind(Q._onGestureMove,Q)),onGestureMoveEnd:V.on(l+"|"+t+H,a.bind(Q._onGestureMoveEnd,Q))};},_onGestureMove:function(V){var aa=this,Z=aa._gesture,W=aa._cAxis,Y=W.x,X=W.y,S=Z.startX,R=Z.startY,U=Z.startClientX,T=Z.startClientY,Q=V.clientX,P=V.clientY;if(aa._prevent.move){V.preventDefault();}Z.deltaX=U-Q;Z.deltaY=T-P;if(Z.axis===null){Z.axis=(Math.abs(Z.deltaX)>Math.abs(Z.deltaY))?q:p;}if(Z.axis===q&&Y){aa.set(G,S+Z.deltaX);}else{if(Z.axis===p&&X){aa.set(E,R+Z.deltaY);}}},_onGestureMoveEnd:function(U){var P=this,R=P._gesture,Q=R.flick,T=U.clientX,S=U.clientY;if(P._prevent.end){U.preventDefault();}R.endClientX=T;R.endClientY=S;R.onGestureMove.detach();R.onGestureMoveEnd.detach();if(!Q){if(R.deltaX!==null&&R.deltaY!==null){if(P._isOutOfBounds()){P._snapBack();}else{if(P.pages&&!P.pages.get(D)[R.axis]){P._onTransEnd();}}}}},_flick:function(S){if(this._cDisabled){return false;}var X=this,W=X._gesture,T=X._cAxis,U=S.flick,P=U.axis,R=U.velocity,V=P===q?G:E,Q=X.get(V);W.flick=U;if(T[P]){X._flickFrame(R,P,Q);}},_flickFrame:function(X,S,Y){var ae=this,al=S===q?G:E,U=ae._cBounce,V=ae._cBounceRange,ai=ae._cDeceleration,Q=ae._cFrameDuration,P=X*ai,T=Y-(Q*P),ag=S===q?ae._minScrollX:ae._minScrollY,ah=S===q?ae._maxScrollX:ae._maxScrollY,W=(T<ag),Z=(T<ah),ac=(T>ag),af=(T>ah),ad=(T<(ag-V)),ak=(T<(ah+V)),ab=(W&&(T>(ag-V))),aj=(af&&(T<(ah+V))),R=(T>(ag-V)),aa=(T>(ah+V)),am;if(ab||aj){P*=U;}am=(Math.abs(P).toFixed(4)<0.015);if(am||ad||aa){if(ae._flickAnim){ae._flickAnim.cancel();delete ae._flickAnim;}if(ac&&Z){ae._onTransEnd();}else{ae._snapBack();}}else{ae._flickAnim=a.later(Q,ae,"_flickFrame",[P,S,T]);ae.set(al,T);}},_mousewheel:function(T){var P=this,S=P.get(E),V=P._bb,Q=10,R=(T.wheelDelta>0),U=S-((R?1:-1)*Q);U=x(U,P._minScrollY,P._maxScrollY);if(V.contains(T.target)&&P._cAxis[p]){P.lastScrolledAmt=0;P.set(E,U);if(P.scrollbars){P.scrollbars._update();
P.scrollbars.flash();}P._onTransEnd();T.preventDefault();}},_isOutOfBounds:function(Z,X){var aa=this,V=aa._cAxis,Y=V.x,W=V.y,S=Z||aa.get(G),R=X||aa.get(E),U=aa._minScrollX,T=aa._minScrollY,Q=aa._maxScrollX,P=aa._maxScrollY;return(Y&&(S<U||S>Q))||(W&&(R<T||R>P));},_snapBack:function(){var Y=this,T=Y.get(G),S=Y.get(E),V=Y._minScrollX,U=Y._minScrollY,R=Y._maxScrollX,Q=Y._maxScrollY,Z=x(S,U,Q),P=x(T,V,R),W=Y.get(e),X=Y.get(I);if(P!==T){Y.set(G,P,{duration:W,easing:X});}else{if(Z!==S){Y.set(E,Z,{duration:W,easing:X});}else{Y._onTransEnd();}}},_afterScrollChange:function(S){if(S.src===C.UI_SRC){return false;}var P=this,R=S.duration,U=S.easing,T=S.newVal,Q=[];P.lastScrolledAmt=P.lastScrolledAmt+(S.newVal-S.prevVal);if(S.attrName===G){Q.push(T);Q.push(P.get(E));}else{Q.push(P.get(G));Q.push(T);}Q.push(R);Q.push(U);P.scrollTo.apply(P,Q);},_afterFlickChange:function(P){this._bindFlick(P.newVal);},_afterDisabledChange:function(P){this._cDisabled=P.newVal;},_afterAxisChange:function(P){this._cAxis=P.newVal;},_afterDragChange:function(P){this._bindDrag(P.newVal);},_afterDimChange:function(){this._uiDimensionsChange();},_afterScrollEnd:function(Q){var P=this;if(P._flickAnim){P._flickAnim.cancel();delete P._flickAnim;}if(P._isOutOfBounds()){P._snapBack();}},_axisSetter:function(Q,P){if(a.Lang.isString(Q)){return{x:Q.match(/x/i)?true:false,y:Q.match(/y/i)?true:false};}},_setScroll:function(Q,P){if(this._cDisabled){Q=a.Attribute.INVALID_VALUE;}return Q;},_setScrollX:function(P){return this._setScroll(P,q);},_setScrollY:function(P){return this._setScroll(P,p);}},{NAME:"scrollview",ATTRS:{axis:{setter:"_axisSetter",writeOnce:"initOnly"},scrollX:{value:0,setter:"_setScrollX"},scrollY:{value:0,setter:"_setScrollY"},deceleration:{value:0.93},bounce:{value:0.1},flick:{value:{minDistance:10,minVelocity:0.3}},drag:{value:true},snapDuration:{value:400},snapEasing:{value:"ease-out"},easing:{value:"cubic-bezier(0, 0.1, 0, 1.0)"},frameDuration:{value:15},bounceRange:{value:150}},CLASS_NAMES:o,UI_SRC:n,_TRANSITION:{DURATION:a.Transition._VENDOR_PREFIX+"TransitionDuration",PROPERTY:a.Transition._VENDOR_PREFIX+"TransitionProperty"},BOUNCE_RANGE:false,FRAME_STEP:false,EASING:false,SNAP_EASING:false,SNAP_DURATION:false});},"@VERSION@",{"requires":["widget","event-gestures","event-mousewheel","transition"],"skinnable":true});