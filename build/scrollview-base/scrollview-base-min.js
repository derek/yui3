<<<<<<< HEAD
YUI.add("scrollview-base",function(a,y){var M=a.ClassNameManager.getClassName,b=a.config.doc,i=a.config.win,j=a.UA.ie,N=a.Transition.useNative,g="scrollview",o={vertical:M(g,"vert"),horizontal:M(g,"horiz")},F="scrollEnd",L="flick",l="drag",r="mousewheel",n="ui",z="top",K="right",u="bottom",m="left",O="px",D="axis",E="scrollY",G="scrollX",B="bounce",w="disabled",d="deceleration",q="x",p="y",J="boundingBox",s="contentBox",t="gesturemove",v="start",H="end",c="",h="0s",e="snapDuration",I="snapEasing",f="easing",k="frameDuration",A="bounceRange",x=function(R,Q,P){return Math.min(Math.max(R,Q),P);};function C(){C.superclass.constructor.apply(this,arguments);}a.ScrollView=a.extend(C,a.Widget,{_forceHWTransforms:a.UA.webkit?true:false,_prevent:{start:false,move:true,end:false},lastScrolledAmt:0,initializer:function(Q){var P=this;P._bb=P.get(J);P._cb=P.get(s);P._cAxis=P.get(D);P._cBounce=P.get(B);P._cBounceRange=P.get(A);P._cDeceleration=P.get(d);P._cFrameDuration=P.get(k);},bindUI:function(){var P=this;P._bindFlick(P.get(L));P._bindDrag(P.get(l));P._bindMousewheel(true);P._bindAttrs();if(j){P._fixIESelect(P._bb,P._cb);}if(C.SNAP_DURATION){P.set(e,C.SNAP_DURATION);}if(C.SNAP_EASING){P.set(I,C.SNAP_EASING);}if(C.EASING){P.set(f,C.EASING);}if(C.FRAME_STEP){P.set(k,C.FRAME_STEP);}if(C.BOUNCE_RANGE){P.set(A,C.BOUNCE_RANGE);}},_bindAttrs:function(){var P=this,R=P._afterScrollChange,Q=P._afterDimChange;P.after({"scrollEnd":P._afterScrollEnd,"disabledChange":P._afterDisabledChange,"flickChange":P._afterFlickChange,"dragChange":P._afterDragChange,"axisChange":P._afterAxisChange,"scrollYChange":R,"scrollXChange":R,"heightChange":Q,"widthChange":Q});},_bindDrag:function(Q){var P=this,R=P._bb;R.detach(l+"|*");if(Q){R.on(l+"|"+t+v,a.bind(P._onGestureMoveStart,P));}},_bindFlick:function(Q){var P=this,R=P._bb;R.detach(L+"|*");if(Q){R.on(L+"|"+L,a.bind(P._onFlick,P),Q);P._bindDrag(P.get(l));}},_bindMousewheel:function(P){var Q=this,R=Q._bb;R.detach(r+"|*");if(P){a.one(b).on(r,a.bind(Q._onMousewheel,Q));}},syncUI:function(){var Q=this,U=Q._getScrollDims(),T=U.offsetWidth,P=U.offsetHeight,R=U.scrollWidth,S=U.scrollHeight;if(Q._cAxis===undefined){Q._cAxis={x:(R>T),y:(S>P)};Q._set(D,Q._cAxis);}Q.rtl=(Q._cb.getComputedStyle("direction")==="rtl");Q._cDisabled=Q.get(w);Q._uiDimensionsChange();if(Q._isOutOfBounds()){Q._snapBack();}},_getScrollDims:function(){var Q=this,P=Q._cb,V=Q._bb,R=C._TRANSITION,W=Q.get(G),U=Q.get(E),S,T;if(N){P.setStyle(R.DURATION,h);P.setStyle(R.PROPERTY,c);}origHWTransform=Q._forceHWTransforms;Q._forceHWTransforms=false;Q._moveTo(P,0,0);T={"offsetWidth":V.get("offsetWidth"),"offsetHeight":V.get("offsetHeight"),"scrollWidth":V.get("scrollWidth"),"scrollHeight":V.get("scrollHeight")};Q._moveTo(P,-(W),-(U));Q._forceHWTransforms=origHWTransform;return T;},_uiDimensionsChange:function(){var V=this,S=V._bb,U=V._getScrollDims(),P=U.offsetWidth,W=U.offsetHeight,Q=U.scrollWidth,X=U.scrollHeight,T=V.rtl,R=V._cAxis;if(R&&R.x){S.addClass(o.horizontal);}if(R&&R.y){S.addClass(o.vertical);}V._minScrollX=(T)?Math.min(0,-(Q-P)):0;V._maxScrollX=(T)?0:Math.max(0,Q-P);V._minScrollY=0;V._maxScrollY=Math.max(0,X-W);},scrollTo:function(Y,X,T,V,R){if(this._cDisabled){return;}var Z=this,S=Z._cb,W=C._TRANSITION,aa=a.bind(Z._onTransEnd,Z),P=0,ab=0,U={},Q;T=T||0;V=V||Z.get(f);R=R||S;if(Y!==null){Z.set(G,Y,{src:n});P=-(Y);}if(X!==null){Z.set(E,X,{src:n});ab=-(X);}Q=Z._transform(P,ab);if(N){R.setStyle(W.DURATION,h).setStyle(W.PROPERTY,c);}if(T===0){if(N){R.setStyle("transform",Q);}else{if(Y!==null){R.setStyle(m,P+O);}if(X!==null){R.setStyle(z,ab+O);}}}else{U.easing=V;U.duration=T/1000;if(N){U.transform=Q;}else{U.left=P+O;U.top=ab+O;}R.transition(U,aa);}},_transform:function(P,R){var Q="translate("+P+"px, "+R+"px)";if(this._forceHWTransforms){Q+=" translateZ(0)";}return Q;},_moveTo:function(Q,P,R){if(N){Q.setStyle("transform",this._transform(P,R));}else{Q.setStyle(m,P+O);Q.setStyle(z,R+O);}},_onTransEnd:function(Q){var P=this;P.fire(F);},_onGestureMoveStart:function(U){if(this._cDisabled){return false;}var Q=this,V=Q._bb,R=Q.get(G),P=Q.get(E),T=U.clientX,S=U.clientY;if(Q._prevent.start){U.preventDefault();}if(Q._flickAnim){Q._flickAnim.cancel();Q._flickAnim=false;Q._onTransEnd();}U.stopPropagation();Q.lastScrolledAmt=0;Q._gesture={axis:null,startX:R,startY:P,startClientX:T,startClientY:S,endClientX:null,endClientY:null,deltaX:null,deltaY:null,flick:null,onGestureMove:V.on(l+"|"+t,a.bind(Q._onGestureMove,Q)),onGestureMoveEnd:V.on(l+"|"+t+H,a.bind(Q._onGestureMoveEnd,Q))};},_onGestureMove:function(V){var aa=this,Z=aa._gesture,W=aa._cAxis,Y=W.x,X=W.y,S=Z.startX,R=Z.startY,U=Z.startClientX,T=Z.startClientY,Q=V.clientX,P=V.clientY;if(aa._prevent.move){V.preventDefault();}Z.deltaX=U-Q;Z.deltaY=T-P;if(Z.axis===null){Z.axis=(Math.abs(Z.deltaX)>Math.abs(Z.deltaY))?q:p;}if(Z.axis===q&&Y){aa.set(G,S+Z.deltaX);}else{if(Z.axis===p&&X){aa.set(E,R+Z.deltaY);}}},_onGestureMoveEnd:function(U){var P=this,R=P._gesture,Q=R.flick,T=U.clientX,S=U.clientY;if(P._prevent.end){U.preventDefault();}R.endClientX=T;R.endClientY=S;R.onGestureMove.detach();R.onGestureMoveEnd.detach();if(!Q){if(R.deltaX!==null&&R.deltaY!==null){if(P._isOutOfBounds()){P._snapBack();}else{if(P.pages&&!P.pages.get(D)[R.axis]){P._onTransEnd();}}}}},_onFlick:function(ai){if(this._cDisabled){return;}var ae=this,V=ae._cBounce,X=ae._cBounceRange,ah=ae._cDeceleration,R=ae._cFrameDuration,ag=0.15,W=ae._cAxis,ad=ai.flick,S=ad.axis,ac=ad.velocity,aa=(S===p),aj=(aa?E:G),P=Math.round(Math.log(ag/Math.abs(ac))/Math.log(ah)),T=ac*(1-Math.pow(ah,P+1))/(1-ah),ab=ae.get(aj),ak=ab-T,U=(aa?ae._minScrollY:ae._minScrollX),Q=(aa?ae._maxScrollY:ae._maxScrollX),al=U-X,Z=Q-X,af="ease-out",Y=[];if(ae._gesture){ae._gesture.flick=ad;}if(!W[S]){return false;}if((ak<al)||(ak>Z)){ak=x(ak,al,Z);af="cubic-bezier(0,0,0.4,1)";}if(S===q){Y.push(ak);Y.push(null);}else{Y.push(null);Y.push(ak);}Y.push(P);Y.push(af);ae.scrollTo.apply(ae,Y);},_onMousewheel:function(T){var P=this,S=P.get(E),V=P._bb,Q=10,R=(T.wheelDelta>0),U=S-((R?1:-1)*Q);
U=x(U,P._minScrollY,P._maxScrollY);if(V.contains(T.target)&&P._cAxis[p]){P.lastScrolledAmt=0;P.set(E,U);if(P.scrollbars){P.scrollbars._update();P.scrollbars.flash();}P._onTransEnd();T.preventDefault();}},_isOutOfBounds:function(Z,X){var aa=this,V=aa._cAxis,Y=V.x,W=V.y,S=Z||aa.get(G),R=X||aa.get(E),U=aa._minScrollX,T=aa._minScrollY,Q=aa._maxScrollX,P=aa._maxScrollY;return(Y&&(S<U||S>Q))||(W&&(R<T||R>P));},_snapBack:function(){var Y=this,T=Y.get(G),S=Y.get(E),V=Y._minScrollX,U=Y._minScrollY,R=Y._maxScrollX,Q=Y._maxScrollY,Z=x(S,U,Q),P=x(T,V,R),W=Y.get(e),X=Y.get(I);if(P!==T){Y.set(G,P,{duration:W,easing:X});}else{if(Z!==S){Y.set(E,Z,{duration:W,easing:X});}else{Y._onTransEnd();}}},_afterScrollChange:function(S){if(S.src===C.UI_SRC){return false;}var P=this,R=S.duration,U=S.easing,T=S.newVal,Q=[];P.lastScrolledAmt=P.lastScrolledAmt+(S.newVal-S.prevVal);if(S.attrName===G){Q.push(T);Q.push(P.get(E));}else{Q.push(P.get(G));Q.push(T);}Q.push(R);Q.push(U);P.scrollTo.apply(P,Q);},_afterFlickChange:function(P){this._bindFlick(P.newVal);},_afterDisabledChange:function(P){this._cDisabled=P.newVal;},_afterAxisChange:function(P){this._cAxis=P.newVal;},_afterDragChange:function(P){this._bindDrag(P.newVal);},_afterDimChange:function(){this._uiDimensionsChange();},_afterScrollEnd:function(Q){var P=this;P._flick=false;if(P._isOutOfBounds()){P._snapBack();}},_axisSetter:function(Q,P){if(a.Lang.isString(Q)){return{x:Q.match(/x/i)?true:false,y:Q.match(/y/i)?true:false};}},_setScroll:function(Q,P){if(this._cDisabled){Q=a.Attribute.INVALID_VALUE;}return Q;},_setScrollX:function(P){return this._setScroll(P,q);},_setScrollY:function(P){return this._setScroll(P,p);}},{NAME:"scrollview",ATTRS:{axis:{setter:"_axisSetter",writeOnce:"initOnly"},scrollX:{value:0,setter:"_setScrollX"},scrollY:{value:0,setter:"_setScrollY"},deceleration:{value:0.998},bounce:{value:0.1},flick:{value:{minDistance:10,minVelocity:0.3}},drag:{value:true},snapDuration:{value:400},snapEasing:{value:"ease-out"},easing:{value:"cubic-bezier(0, 0.1, 0, 1.0)"},frameDuration:{value:15},bounceRange:{value:15}},CLASS_NAMES:o,UI_SRC:n,_TRANSITION:{DURATION:a.Transition._VENDOR_PREFIX+"TransitionDuration",PROPERTY:a.Transition._VENDOR_PREFIX+"TransitionProperty"},BOUNCE_RANGE:false,FRAME_STEP:false,EASING:false,SNAP_EASING:false,SNAP_DURATION:false});},"@VERSION@",{"requires":["widget","event-gestures","event-mousewheel","transition"],"skinnable":true});
=======
YUI.add("scrollview-base",function(e,t){function q(){q.superclass.constructor.apply(this,arguments)}var n=e.ClassNameManager.getClassName,r=e.config.doc,i=e.config.win,s=e.UA.ie,o=e.Transition.useNative,u="scrollview",a={vertical:n(u,"vert"),horizontal:n(u,"horiz")},f="scrollEnd",l="flick",c="drag",h="mousewheel",p="ui",d="top",v="right",m="bottom",g="left",y="px",b="axis",w="scrollY",E="scrollX",S="bounce",x="disabled",T="deceleration",N="x",C="y",k="boundingBox",L="contentBox",A="gesturemove",O="start",M="end",_="",D="0s",P="snapDuration",H="snapEasing",B="easing",j="frameDuration",F="bounceRange",I=function(e,t,n){return Math.min(Math.max(e,t),n)};e.ScrollView=e.extend(q,e.Widget,{_forceHWTransforms:e.UA.webkit?!0:!1,_prevent:{start:!1,move:!0,end:!1},lastScrolledAmt:0,initializer:function(e){var t=this;t._bb=t.get(k),t._cb=t.get(L),t._cAxis=t.get(b),t._cBounce=t.get(S),t._cBounceRange=t.get(F),t._cDeceleration=t.get(T),t._cFrameDuration=t.get(j)},bindUI:function(){var e=this;e._bindFlick(e.get(l)),e._bindDrag(e.get(c)),e._bindMousewheel(!0),e._bindAttrs(),s&&e._fixIESelect(e._bb,e._cb),q.SNAP_DURATION&&e.set(P,q.SNAP_DURATION),q.SNAP_EASING&&e.set(H,q.SNAP_EASING),q.EASING&&e.set(B,q.EASING),q.FRAME_STEP&&e.set(j,q.FRAME_STEP),q.BOUNCE_RANGE&&e.set(F,q.BOUNCE_RANGE)},_bindAttrs:function(){var e=this,t=e._afterScrollChange,n=e._afterDimChange;e.after({scrollEnd:e._afterScrollEnd,disabledChange:e._afterDisabledChange,flickChange:e._afterFlickChange,dragChange:e._afterDragChange,axisChange:e._afterAxisChange,scrollYChange:t,scrollXChange:t,heightChange:n,widthChange:n})},_bindDrag:function(t){var n=this,r=n._bb;r.detach(c+"|*"),t&&r.on(c+"|"+A+O,e.bind(n._onGestureMoveStart,n))},_bindFlick:function(t){var n=this,r=n._bb;r.detach(l+"|*"),t&&(r.on(l+"|"+l,e.bind(n._flick,n),t),n._bindDrag(n.get(c)))},_bindMousewheel:function(t){var n=this,i=n._bb;i.detach(h+"|*"),t&&e.one(r).on(h,e.bind(n._mousewheel,n))},syncUI:function(){var e=this,t=e._getScrollDims(),n=t.offsetWidth,r=t.offsetHeight,i=t.scrollWidth,s=t.scrollHeight;e._cAxis===undefined&&(e._cAxis={x:i>n,y:s>r},e._set(b,e._cAxis)),e.rtl=e._cb.getComputedStyle("direction")==="rtl",e._cDisabled=e.get(x),e._uiDimensionsChange(),e._isOutOfBounds()&&e._snapBack()},_getScrollDims:function(){var e=this,t=e._cb,n=e._bb,r=q._TRANSITION,i=e.get(E),s=e.get(w),u,a;return o&&(t.setStyle(r.DURATION,D),t.setStyle(r.PROPERTY,_)),u=e._forceHWTransforms,e._forceHWTransforms=!1,e._moveTo(t,0,0),a={offsetWidth:n.get("offsetWidth"),offsetHeight:n.get("offsetHeight"),scrollWidth:n.get("scrollWidth"),scrollHeight:n.get("scrollHeight")},e._moveTo(t,-i,-s),e._forceHWTransforms=u,a},_uiDimensionsChange:function(){var e=this,t=e._bb,n=e._getScrollDims(),r=n.offsetWidth,i=n.offsetHeight,s=n.scrollWidth,o=n.scrollHeight,u=e.rtl,f=e._cAxis;f&&f.x&&t.addClass(a.horizontal),f&&f.y&&t.addClass(a.vertical),e._minScrollX=u?Math.min(0,-(s-r)):0,e._maxScrollX=u?0:Math.max(0,s-r),e._minScrollY=0,e._maxScrollY=Math.max(0,o-i)},scrollTo:function(t,n,r,i,s){if(this._cDisabled)return;var u=this,a=u._cb,f=q._TRANSITION,l=e.bind(u._onTransEnd,u),c=0,h=0,v={},m;r=r||0,i=i||u.get(B),s=s||a,t!==null&&(u.set(E,t,{src:p}),c=-t),n!==null&&(u.set(w,n,{src:p}),h=-n),m=u._transform(c,h),o&&s.setStyle(f.DURATION,D).setStyle(f.PROPERTY,_),r===0?o?s.setStyle("transform",m):(t!==null&&s.setStyle(g,c+y),n!==null&&s.setStyle(d,h+y)):(v.easing=i,v.duration=r/1e3,o?v.transform=m:(v.left=c+y,v.top=h+y),s.transition(v,l))},_transform:function(e,t){var n="translate("+e+"px, "+t+"px)";return this._forceHWTransforms&&(n+=" translateZ(0)"),n},_moveTo:function(e,t,n){o?e.setStyle("transform",this._transform(t,n)):(e.setStyle(g,t+y),e.setStyle(d,n+y))},_onTransEnd:function(e){var t=this;t.fire(f)},_onGestureMoveStart:function(t){if(this._cDisabled)return!1;var n=this,r=n._bb,i=n.get(E),s=n.get(w),o=t.clientX,u=t.clientY;n._prevent.start&&t.preventDefault(),n._flickAnim&&(n._flickAnim.cancel(),delete n._flickAnim,n._onTransEnd()),t.stopPropagation(),n.lastScrolledAmt=0,n._gesture={axis:null,startX:i,startY:s,startClientX:o,startClientY:u,endClientX:null,endClientY:null,deltaX:null,deltaY:null,flick:null,onGestureMove:r.on(c+"|"+A,e.bind(n._onGestureMove,n)),onGestureMoveEnd:r.on(c+"|"+A+M,e.bind(n._onGestureMoveEnd,n))}},_onGestureMove:function(e){var t=this,n=t._gesture,r=t._cAxis,i=r.x,s=r.y,o=n.startX,u=n.startY,a=n.startClientX,f=n.startClientY,l=e.clientX,c=e.clientY;t._prevent.move&&e.preventDefault(),n.deltaX=a-l,n.deltaY=f-c,n.axis===null&&(n.axis=Math.abs(n.deltaX)>Math.abs(n.deltaY)?N:C),n.axis===N&&i?t.set(E,o+n.deltaX):n.axis===C&&s&&t.set(w,u+n.deltaY)},_onGestureMoveEnd:function(e){var t=this,n=t._gesture,r=n.flick,i=e.clientX,s=e.clientY;t._prevent.end&&e.preventDefault(),n.endClientX=i,n.endClientY=s,n.onGestureMove.detach(),n.onGestureMoveEnd.detach(),r||n.deltaX!==null&&n.deltaY!==null&&(t._isOutOfBounds()?t._snapBack():t.pages&&!t.pages.get(b)[n.axis]&&t._onTransEnd())},_flick:function(e){if(this._cDisabled)return!1;var t=this,n=t._cAxis,r=e.flick,i=r.axis,s=r.velocity,o=i===N?E:w,u=t.get(o);t._gesture&&(t._gesture.flick=r),n[i]&&t._flickFrame(s,i,u)},_flickFrame:function(t,n,r){var i=this,s=n===N?E:w,o=i._cBounce,u=i._cBounceRange,a=i._cDeceleration,f=i._cFrameDuration,l=t*a,c=r-f*l,h=n===N?i._minScrollX:i._minScrollY,p=n===N?i._maxScrollX:i._maxScrollY,d=c<h,v=c<p,m=c>h,g=c>p,y=c<h-u,b=c<p+u,S=d&&c>h-u,x=g&&c<p+u,T=c>h-u,C=c>p+u,k;if(S||x)l*=o;k=Math.abs(l).toFixed(4)<.015,k||y||C?(i._flickAnim&&(i._flickAnim.cancel(),delete i._flickAnim),m&&v?i._onTransEnd():i._snapBack()):(i._flickAnim=e.later(f,i,"_flickFrame",[l,n,c]),i.set(s,c))},_mousewheel:function(e){var t=this,n=t.get(w),r=t._bb,i=10,s=e.wheelDelta>0,o=n-(s?1:-1)*i;o=I(o,t._minScrollY,t._maxScrollY),r.contains(e.target)&&t._cAxis[C]&&(t.lastScrolledAmt=0,t.set(w,o),t.scrollbars&&(t.scrollbars._update(),t.scrollbars.flash()),t._onTransEnd(),e.preventDefault())},_isOutOfBounds:function(e,t){var n=this,r=n._cAxis,i=r.x,s=r.y,o=e||n.get(E),u=t||n.get(w),a=n._minScrollX,f=n._minScrollY,l=n._maxScrollX,c=n._maxScrollY;return i&&(o<a||o>l)||s&&(u<f||u>c)},_snapBack:function(){var e=this,t=e.get(E),n=e.get(w),r=e._minScrollX,i=e._minScrollY,s=e._maxScrollX,o=e._maxScrollY,u=I(n,i,o),a=I(t,r,s),f=e.get(P),l=e.get(H);a!==t?e.set(E,a,{duration:f,easing:l}):u!==n?e.set(w,u,{duration:f,easing:l}):e._onTransEnd()},_afterScrollChange:function(e){if(e.src===q.UI_SRC)return!1;var t=this,n=e.duration,r=e.easing,i=e.newVal,s=[];t.lastScrolledAmt=t.lastScrolledAmt+(e.newVal-e.prevVal),e.attrName===E?(s.push(i),s.push(t.get(w))):(s.push(t.get(E)),s.push(i)),s.push(n),s.push(r),t.scrollTo.apply(t,s)},_afterFlickChange:function(e){this._bindFlick(e.newVal)},_afterDisabledChange:function(e){this._cDisabled=e.newVal},_afterAxisChange:function(e){this._cAxis=e.newVal},_afterDragChange:function(e){this._bindDrag(e.newVal)},_afterDimChange:function(){this._uiDimensionsChange()},_afterScrollEnd:function(e){var t=this;t._flickAnim&&(t._flickAnim.cancel(),delete t._flickAnim),t._isOutOfBounds()&&t._snapBack()},_axisSetter:function(t,n){if(e.Lang.isString(t))return{x:t.match(/x/i)?!0:!1,y:t.match(/y/i)?!0:!1}},_setScroll:function(t,n){return this._cDisabled&&(t=e.Attribute.INVALID_VALUE),t},_setScrollX:function(e){return this._setScroll(e,N)},_setScrollY:function(e){return this._setScroll(e,C)}},{NAME:"scrollview",ATTRS:{axis:{setter:"_axisSetter",writeOnce:"initOnly"},scrollX:{value:0,setter:"_setScrollX"},scrollY:{value:0,setter:"_setScrollY"},deceleration:{value:.93},bounce:{value:.1},flick:{value:{minDistance:10,minVelocity:.3}},drag:{value:!0},snapDuration:{value:400},snapEasing:{value:"ease-out"},easing:{value:"cubic-bezier(0, 0.1, 0, 1.0)"},frameDuration:{value:15},bounceRange:{value:150}},CLASS_NAMES:a,UI_SRC:p,_TRANSITION:{DURATION:e.Transition._VENDOR_PREFIX+"TransitionDuration",PROPERTY:e.Transition._VENDOR_PREFIX+"TransitionProperty"},BOUNCE_RANGE:!1,FRAME_STEP:!1,EASING:!1,SNAP_EASING:!1,SNAP_DURATION:!1})},"@VERSION@",{requires:["widget","event-gestures","event-mousewheel","transition"],skinnable:!0});
>>>>>>> 3cn_int_scrollview
