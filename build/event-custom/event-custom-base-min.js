<<<<<<< HEAD
<<<<<<< HEAD
YUI.add("event-custom-base",function(c){c.Env.evt={handles:{},plugins:{}};var p=0,d=1,n={objs:{},before:function(C,E,F,G){var D=C,B;if(G){B=[C,G].concat(c.Array(arguments,4,true));D=c.rbind.apply(c,B);}return this._inject(p,D,E,F);},after:function(C,E,F,G){var D=C,B;if(G){B=[C,G].concat(c.Array(arguments,4,true));D=c.rbind.apply(c,B);}return this._inject(d,D,E,F);},_inject:function(B,D,E,G){var H=c.stamp(E),F,C;if(!this.objs[H]){this.objs[H]={};}F=this.objs[H];if(!F[G]){F[G]=new c.Do.Method(E,G);E[G]=function(){return F[G].exec.apply(F[G],arguments);};}C=H+c.stamp(D)+G;F[G].register(C,D,B);return new c.EventHandle(F[G],C);},detach:function(B){if(B.detach){B.detach();}},_unload:function(C,B){}};c.Do=n;n.Method=function(B,C){this.obj=B;this.methodName=C;this.method=B[C];this.before={};this.after={};};n.Method.prototype.register=function(C,D,B){if(B){this.after[C]=D;}else{this.before[C]=D;}};n.Method.prototype._delete=function(B){delete this.before[B];delete this.after[B];};n.Method.prototype.exec=function(){var D=c.Array(arguments,0,true),E,C,H,F=this.before,B=this.after,G=false;for(E in F){if(F.hasOwnProperty(E)){C=F[E].apply(this.obj,D);if(C){switch(C.constructor){case n.Halt:return C.retVal;case n.AlterArgs:D=C.newArgs;break;case n.Prevent:G=true;break;default:}}}}if(!G){C=this.method.apply(this.obj,D);}n.originalRetVal=C;n.currentRetVal=C;for(E in B){if(B.hasOwnProperty(E)){H=B[E].apply(this.obj,D);if(H&&H.constructor==n.Halt){return H.retVal;}else{if(H&&H.constructor==n.AlterReturn){C=H.newRetVal;n.currentRetVal=C;}}}}return C;};n.AlterArgs=function(C,B){this.msg=C;this.newArgs=B;};n.AlterReturn=function(C,B){this.msg=C;this.newRetVal=B;};n.Halt=function(C,B){this.msg=C;this.retVal=B;};n.Prevent=function(B){this.msg=B;};n.Error=n.Halt;var x="after",b=["broadcast","monitored","bubbles","context","contextFn","currentTarget","defaultFn","defaultTargetOnly","details","emitFacade","fireOnce","async","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],k=9,e="yui:log",w=c.Array,f=c.Lang,s;function g(B,C){this.evt=B;this.sub=C;}g.prototype={batch:function(B,C){B.call(C||this,this);if(f.isArray(this.evt)){c.Array.each(this.evt,function(D){D.batch.call(C||D,B);});}},detach:function(){var B=this.evt,D=0,C;if(B){if(f.isArray(B)){for(C=0;C<B.length;C++){D+=B[C].detach();}}else{B._delete(this.sub);D=1;}}return D;},monitor:function(B){return this.evt.monitor.apply(this.evt,arguments);}};c.EventHandle=g;function q(C,D){var B=this;D=D||{};B.id=c.stamp(B);B.type=C;B.context=c;B.logSystem=(C==e);B.silent=B.logSystem;B.subscribers={};B.afters={};B.preventable=true;B.bubbles=true;B.signature=k;B.subCount=0;B.afterCount=0;B.applyConfig(D,true);}s={hasSubs:function(B){var E=this.subCount,C=this.afterCount,D=this.sibling;if(D){E+=D.subCount;C+=D.afterCount;}if(B){return(B=="after")?C:E;}return(E+C);},monitor:function(E){var B=this,D=B.id+"|"+B.type+"_"+E,C=w(arguments,0,true);B.monitored=true;C[0]=D;return B.host.on.apply(B.host,C);},getSubs:function(){var D=c.merge(this.subscribers),B=c.merge(this.afters),C=this.sibling;if(C){c.mix(D,C.subscribers);c.mix(B,C.afters);}return[D,B];},applyConfig:function(C,B){if(C){c.mix(this,C,B,b);}},_on:function(G,E,D,B){var C=this,F=new c.Subscriber(G,E,D,B);if(C.fireOnce&&C.fired){if(C.async){setTimeout(c.bind(C._notify,C,F,C.firedWith),0);}else{C._notify(F,C.firedWith);}}if(B==x){C.afters[F.id]=F;C.afterCount++;}else{C.subscribers[F.id]=F;C.subCount++;}return new c.EventHandle(C,F);},on:function(D,C){var B=(arguments.length>2)?w(arguments,2,true):null;if(this.host){this.host._monitor("attach",this.type,{args:arguments});}return this._on(D,C,B,true);},after:function(D,C){var B=(arguments.length>2)?w(arguments,2,true):null;return this._on(D,C,B,x);},detach:function(F,D){if(F&&F.detach){return F.detach();}var C,E,G=0,B=c.merge(this.subscribers,this.afters);for(C in B){if(B.hasOwnProperty(C)){E=B[C];if(E&&(!F||F===E.fn)){this._delete(E);G++;}}}return G;},_notify:function(F,E,B){var C=this,D;D=F.notify(E,C);if(false===D||C.stopped>1){return false;}return true;},fire:function(){var B=this,D=(B.emitFacade)?"fireComplex":"fireSimple",C=w(arguments,0,true);if(B.fireOnce){B.fired=true;B.firedWith=C;B.fire=B._fireImmediate;}return B[D](C);},_fireImmediate:function(){return true;},fireSimple:function(C){var B=this,D;B.stopped=0;B.prevented=0;if(B.hasSubs()){D=B.getSubs();B._procSubs(D[0],C);B._procSubs(D[1],C);}B.broadcast&&!B.stopped&&B._broadcast(C);return B.stopped?false:true;},fireComplex:function(B){B[0]=B[0]||{};return this.fireSimple(B);},_procSubs:function(E,C,B){var F,D;for(D in E){if(E.hasOwnProperty(D)){F=E[D];if(F&&F.fn){if(false===this._notify(F,C,B)){this.stopped=2;}if(this.stopped==2){return false;}}}}return true;},_broadcast:function(C){var B=C.slice();B.unshift(this.type);if(this.host!==c){c.fire.apply(c,B);}if(this.broadcast==2){c.Global.fire.apply(c.Global,B);}},detachAll:function(){return this.detach();},_delete:function(C){var B=this;if(C){if(B.subscribers[C.id]){delete B.subscribers[C.id];B.subCount--;}if(B.afters[C.id]){delete B.afters[C.id];B.afterCount--;}}if(B.host){B.host._monitor("detach",B.type,{ce:B,sub:C});}if(C){C.deleted=true;}}};s.unsubscribe=s.detach;s.unsubscribeAll=s.detachAll;q.prototype=s;c.CustomEvent=q;function z(E,D,C){var B=this;B.fn=E;B.context=D;B.id=c.stamp(B);B.args=C;}z.prototype={_notify:function(G,D,E){if(this.deleted&&!this.postponed){delete this.postponed;return null;}var B=this.args,F=this.fn,C;switch(E.signature){case 0:C=F.call(G,E.type,D,G);break;case 1:C=F.call(G,D[0]||null,G);break;default:if(B||D){D=D||[];B=(B)?D.concat(B):D;C=F.apply(G,B);}else{C=F.call(G);}}if(this.once){E._delete(this);}return C;},notify:function(C,E){var F=this.context,B=true;if(!F){F=(E.contextFn)?E.contextFn():E.context;}if(c.config.throwFail){B=this._notify(F,C,E);}else{try{B=this._notify(F,C,E);}catch(D){c.error(this+" failed: "+D.message,D);}}return B;},contains:function(C,B){if(B){return((this.fn==C)&&this.context==B);
}else{return(this.fn==C);}}};c.Subscriber=z;var i=c.Lang,A=":",y="|",h="~AFTER~",j=c.Array,o=i.isString,m=i.isArray,l=i.isObject,a=i.isFunction,v=c.cached(function(B){return B.replace(/(.*)(:)(.*)/,"*$2$3");}),r=c.cached(function(B,C){if(!C||!o(B)||B.indexOf(A)>-1){return B;}return C+A+B;}),t=c.cached(function(D,F){var C=D,E,G,B;if(!o(C)){return C;}B=C.indexOf(h);if(B>-1){G=true;C=C.substr(h.length);}B=C.indexOf(y);if(B>-1){E=C.substr(0,(B));C=C.substr(B+1);if(C=="*"){C=null;}}return[E,(F)?r(C,F):C,G,C];}),u=function(B){var C=(l(B))?B:{};this._yuievt=this._yuievt||{id:c.guid(),events:{},targets:{},config:C,chain:("chain" in C)?C.chain:c.config.chain,bubbling:false,defaults:{context:C.context||this,host:this,emitFacade:C.emitFacade,fireOnce:C.fireOnce,queuable:C.queuable,monitored:C.monitored,broadcast:C.broadcast,defaultTargetOnly:C.defaultTargetOnly,bubbles:("bubbles" in C)?C.bubbles:true}};};u.prototype={once:function(){var B=this.on.apply(this,arguments);B.batch(function(C){if(C.sub){C.sub.once=true;}});return B;},onceAfter:function(){var B=this.after.apply(this,arguments);B.batch(function(C){if(C.sub){C.sub.once=true;}});return B;},parseType:function(B,C){return t(B,C||this._yuievt.config.prefix);},on:function(F,K,D){var N=t(F,this._yuievt.config.prefix),H=c.Env.evt.handles,S=c.Node,P,Q,C,T,M,L,R,E,B,I,O,J,G;this._monitor("attach",N[1],{args:arguments,category:N[0],after:N[2]});if(l(F)){if(a(F)){return c.Do.before.apply(c.Do,arguments);}P=K;Q=D;C=j(arguments,0,true);T=[];G=m(F);E=(F._after&&(delete F._after))?h:"";c.each(F,function(V,U){if(l(V)){P=V.fn||((a(V))?V:P);Q=V.context||Q;}C[0]=E+((G)?V:U);C[1]=P;C[2]=Q;T.push(this.on.apply(this,C));},this);return(this._yuievt.chain)?this:new c.EventHandle(T);}L=N[0];E=N[2];I=N[3];if(S&&c.instanceOf(this,S)&&(I in S.DOM_EVENTS)){C=j(arguments,0,true);C.splice(2,0,S.getDOMNode(this));return c.on.apply(c,C);}F=N[1];if(c.instanceOf(this,YUI)){B=c.Env.evt.plugins[F];C=j(arguments,0,true);C[0]=I;if(S){O=C[2];if(c.instanceOf(O,c.NodeList)){O=c.NodeList.getDOMNodes(O);}else{if(c.instanceOf(O,S)){O=S.getDOMNode(O);}}J=(I in S.DOM_EVENTS);if(J){C[2]=O;}}if(B){R=B.on.apply(c,C);}else{if((!F)||J){R=c.Event._attach(C);}}}if(!R){M=this._yuievt.events[F]||this.publish(F);R=M._on(K,D,(arguments.length>3)?j(arguments,3,true):null,(E)?"after":true);}if(L){H[L]=H[L]||{};H[L][F]=H[L][F]||[];H[L][F].push(R);}return(this._yuievt.chain)?this:R;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(K,M,B){var Q=this._yuievt.events,F,H=c.Node,O=H&&(c.instanceOf(this,H));if(!K&&(this!==c)){for(F in Q){if(Q.hasOwnProperty(F)){Q[F].detach(M,B);}}if(O){c.Event.purgeElement(H.getDOMNode(this));}return this;}var E=t(K,this._yuievt.config.prefix),J=m(E)?E[0]:null,R=(E)?E[3]:null,G,N=c.Env.evt.handles,P,L,I,D,C=function(W,U,V){var T=W[U],X,S;if(T){for(S=T.length-1;S>=0;--S){X=T[S].evt;if(X.host===V||X.el===V){T[S].detach();}}}};if(J){L=N[J];K=E[1];P=(O)?c.Node.getDOMNode(this):this;if(L){if(K){C(L,K,P);}else{for(F in L){if(L.hasOwnProperty(F)){C(L,F,P);}}}return this;}}else{if(l(K)&&K.detach){K.detach();return this;}else{if(O&&((!R)||(R in H.DOM_EVENTS))){I=j(arguments,0,true);I[2]=H.getDOMNode(this);c.detach.apply(c,I);return this;}}}G=c.Env.evt.plugins[R];if(c.instanceOf(this,YUI)){I=j(arguments,0,true);if(G&&G.detach){G.detach.apply(c,I);return this;}else{if(!K||(!G&&H&&(K in H.DOM_EVENTS))){I[0]=K;c.Event.detach.apply(c.Event,I);return this;}}}D=Q[E[1]];if(D){D.detach(M,B);}return this;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(B){return this.detach(B);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(E,F){var H=this._yuievt,G=H.config.prefix,D=H.events,C=H.defaults,B;E=(G)?r(E,G):E;if(!D[E]){if(l(E)){B={};c.each(E,function(J,I){B[I]=this.publish(I,J||F);},this);return B;}F&&(C=c.merge(C,F));D[E]=new c.CustomEvent(E,C);}else{if(F){D[E].applyConfig(F,true);}}return D[E];},_monitor:function(E,B,F){var C,D=this.getEvent(B);if((this._yuievt.config.monitored&&(!D||D.monitored))||(D&&D.monitored)){C=B+"_"+E;F.monitored=E;this.fire.call(this,C,F);}},fire:function(E){var I=o(E),D=(I)?E:(E&&E.type),H,C,G=this._yuievt.config.prefix,F,B=(I)?j(arguments,1,true):arguments;D=(G)?r(D,G):D;this._monitor("fire",D,{args:B});H=this.getEvent(D,true);F=this.getSibling(D,H);if(F&&!H){H=this.publish(D);}if(!H){if(this._yuievt.hasTargets){return this.bubble({type:D},B,this);}C=true;}else{H.sibling=F;C=H.fire.apply(H,B);}return(this._yuievt.chain)?this:C;},getSibling:function(B,D){var C;if(B.indexOf(A)>-1){B=v(B);C=this.getEvent(B,true);if(C){C.applyConfig(D);C.bubbles=false;C.broadcast=0;}}return C;},getEvent:function(C,B){var D;if(!B){D=this._yuievt.config.prefix;C=(D)?r(C,D):C;}return this._yuievt.events[C]||null;},after:function(D,C){var B=j(arguments,0,true);switch(i.type(D)){case"function":return c.Do.after.apply(c.Do,arguments);case"array":case"object":B[0]._after=true;break;default:B[0]=h+D;}return this.on.apply(this,B);},before:function(){return this.on.apply(this,arguments);}};c.EventTarget=u;c.mix(c,u.prototype);u.call(c,{bubbles:false});YUI.Env.globalEvents=YUI.Env.globalEvents||new u();c.Global=YUI.Env.globalEvents;},"@VERSION@",{requires:["oop"]});
=======
YUI.add("event-custom-base",function(b){b.Env.evt={handles:{},plugins:{}};var l=0,c=1,k={objs:{},before:function(y,A,B,C){var z=y,x;if(C){x=[y,C].concat(b.Array(arguments,4,true));z=b.rbind.apply(b,x);}return this._inject(l,z,A,B);},after:function(y,A,B,C){var z=y,x;if(C){x=[y,C].concat(b.Array(arguments,4,true));z=b.rbind.apply(b,x);}return this._inject(c,z,A,B);},_inject:function(x,z,A,C){var D=b.stamp(A),B,y;if(!this.objs[D]){this.objs[D]={};}B=this.objs[D];if(!B[C]){B[C]=new b.Do.Method(A,C);A[C]=function(){return B[C].exec.apply(B[C],arguments);};}y=D+b.stamp(z)+C;B[C].register(y,z,x);return new b.EventHandle(B[C],y);},detach:function(x){if(x.detach){x.detach();}},_unload:function(y,x){}};b.Do=k;k.Method=function(x,y){this.obj=x;this.methodName=y;this.method=x[y];this.before={};this.after={};};k.Method.prototype.register=function(y,z,x){if(x){this.after[y]=z;}else{this.before[y]=z;}};k.Method.prototype._delete=function(x){delete this.before[x];delete this.after[x];};k.Method.prototype.exec=function(){var z=b.Array(arguments,0,true),A,y,D,B=this.before,x=this.after,C=false;for(A in B){if(B.hasOwnProperty(A)){y=B[A].apply(this.obj,z);if(y){switch(y.constructor){case k.Halt:return y.retVal;case k.AlterArgs:z=y.newArgs;break;case k.Prevent:C=true;break;default:}}}}if(!C){y=this.method.apply(this.obj,z);}k.originalRetVal=y;k.currentRetVal=y;for(A in x){if(x.hasOwnProperty(A)){D=x[A].apply(this.obj,z);if(D&&D.constructor==k.Halt){return D.retVal;}else{if(D&&D.constructor==k.AlterReturn){y=D.newRetVal;k.currentRetVal=y;}}}}return y;};k.AlterArgs=function(y,x){this.msg=y;this.newArgs=x;};k.AlterReturn=function(y,x){this.msg=y;this.newRetVal=x;};k.Halt=function(y,x){this.msg=y;this.retVal=x;};k.Prevent=function(x){this.msg=x;};k.Error=k.Halt;var t="after",a=["broadcast","monitored","bubbles","context","contextFn","currentTarget","defaultFn","defaultTargetOnly","details","emitFacade","fireOnce","async","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],j=9,d="yui:log",s=b.Array,e=b.Lang,o;function f(x,y){this.evt=x;this.sub=y;}f.prototype={batch:function(x,y){x.call(y||this,this);if(e.isArray(this.evt)){b.Array.each(this.evt,function(z){z.batch.call(y||z,x);});}},detach:function(){var x=this.evt,z=0,y;if(x){if(e.isArray(x)){for(y=0;y<x.length;y++){z+=x[y].detach();}}else{x._delete(this.sub);z=1;}}return z;},monitor:function(x){return this.evt.monitor.apply(this.evt,arguments);}};b.EventHandle=f;function m(y,z){var x=this;z=z||{};x.id=b.stamp(x);x.type=y;x.context=b;x.logSystem=(y==d);x.silent=x.logSystem;x.subscribers={};x.afters={};x.preventable=true;x.bubbles=true;x.signature=j;x.subCount=0;x.afterCount=0;x.applyConfig(z,true);}o={hasSubs:function(x){var A=this.subCount,y=this.afterCount,z=this.sibling;if(z){A+=z.subCount;y+=z.afterCount;}if(x){return(x=="after")?y:A;}return(A+y);},monitor:function(A){var x=this,z=x.id+"|"+x.type+"_"+A,y=s(arguments,0,true);x.monitored=true;y[0]=z;return x.host.on.apply(x.host,y);},getSubs:function(){var z=b.merge(this.subscribers),x=b.merge(this.afters),y=this.sibling;if(y){b.mix(z,y.subscribers);b.mix(x,y.afters);}return[z,x];},applyConfig:function(y,x){if(y){b.mix(this,y,x,a);}},_on:function(C,A,z,x){var y=this,B=new b.Subscriber(C,A,z,x);if(y.fireOnce&&y.fired){if(y.async){setTimeout(b.bind(y._notify,y,B,y.firedWith),0);}else{y._notify(B,y.firedWith);}}if(x==t){y.afters[B.id]=B;y.afterCount++;}else{y.subscribers[B.id]=B;y.subCount++;}return new b.EventHandle(y,B);},on:function(z,y){var x=(arguments.length>2)?s(arguments,2,true):null;if(this.host){this.host._monitor("attach",this.type,{args:arguments});}return this._on(z,y,x,true);},after:function(z,y){var x=(arguments.length>2)?s(arguments,2,true):null;return this._on(z,y,x,t);},detach:function(B,z){if(B&&B.detach){return B.detach();}var y,A,C=0,x=b.merge(this.subscribers,this.afters);for(y in x){if(x.hasOwnProperty(y)){A=x[y];if(A&&(!B||B===A.fn)){this._delete(A);C++;}}}return C;},_notify:function(B,A,x){var y=this,z;z=B.notify(A,y);if(false===z||y.stopped>1){return false;}return true;},fire:function(){var x=this,z=(x.emitFacade)?"fireComplex":"fireSimple",y=s(arguments,0,true);if(x.fireOnce){x.fired=true;x.firedWith=y;x.fire=x._fireImmediate;}return x[z](y);},_fireImmediate:function(){return true;},fireSimple:function(y){var x=this,z;x.stopped=0;x.prevented=0;if(x.hasSubs()){z=x.getSubs();x._procSubs(z[0],y);x._procSubs(z[1],y);}x.broadcast&&!x.stopped&&x._broadcast(y);return x.stopped?false:true;},fireComplex:function(x){x[0]=x[0]||{};return this.fireSimple(x);},_procSubs:function(A,y,x){var B,z;for(z in A){if(A.hasOwnProperty(z)){B=A[z];if(B&&B.fn){if(false===this._notify(B,y,x)){this.stopped=2;}if(this.stopped==2){return false;}}}}return true;},_broadcast:function(y){var x=y.slice();x.unshift(this.type);if(this.host!==b){b.fire.apply(b,x);}if(this.broadcast==2){b.Global.fire.apply(b.Global,x);}},detachAll:function(){return this.detach();},_delete:function(y){var x=this;if(y){if(x.subscribers[y.id]){delete x.subscribers[y.id];x.subCount--;}if(x.afters[y.id]){delete x.afters[y.id];x.afterCount--;}}if(x.host){x.host._monitor("detach",x.type,{ce:x,sub:y});}if(y){y.deleted=true;}}};o.unsubscribe=o.detach;o.unsubscribeAll=o.detachAll;m.prototype=o;b.CustomEvent=m;function v(A,z,y){var x=this;x.fn=A;x.context=z;x.id=b.stamp(x);x.args=y;}v.prototype={_notify:function(C,z,A){if(this.deleted&&!this.postponed){delete this.postponed;return null;}var x=this.args,B=this.fn,y;switch(A.signature){case 0:y=B.call(C,A.type,z,C);break;case 1:y=B.call(C,z[0]||null,C);break;default:if(x||z){z=z||[];x=(x)?z.concat(x):z;y=B.apply(C,x);}else{y=B.call(C);}}if(this.once){A._delete(this);}return y;},notify:function(y,A){var B=this.context,x=true;if(!B){B=(A.contextFn)?A.contextFn():A.context;}if(b.config.throwFail){x=this._notify(B,y,A);}else{try{x=this._notify(B,y,A);}catch(z){b.error(this+" failed: "+z.message,z);}}return x;},contains:function(y,x){if(x){return((this.fn==y)&&this.context==x);
}else{return(this.fn==y);}}};b.Subscriber=v;var h=b.Lang,w=":",u="|",g="~AFTER~",i=b.Array,r=b.cached(function(x){return x.replace(/(.*)(:)(.*)/,"*$2$3");}),n=b.cached(function(x,y){if(!y||!h.isString(x)||x.indexOf(w)>-1){return x;}return y+w+x;}),p=b.cached(function(z,B){var y=z,A,C,x;if(!h.isString(y)){return y;}x=y.indexOf(g);if(x>-1){C=true;y=y.substr(g.length);}x=y.indexOf(u);if(x>-1){A=y.substr(0,(x));y=y.substr(x+1);if(y=="*"){y=null;}}return[A,(B)?n(y,B):y,C,y];}),q=function(x){var y=(h.isObject(x))?x:{};this._yuievt=this._yuievt||{id:b.guid(),events:{},targets:{},config:y,chain:("chain" in y)?y.chain:b.config.chain,bubbling:false,defaults:{context:y.context||this,host:this,emitFacade:y.emitFacade,fireOnce:y.fireOnce,queuable:y.queuable,monitored:y.monitored,broadcast:y.broadcast,defaultTargetOnly:y.defaultTargetOnly,bubbles:("bubbles" in y)?y.bubbles:true}};};q.prototype={once:function(){var x=this.on.apply(this,arguments);x.batch(function(y){if(y.sub){y.sub.once=true;}});return x;},onceAfter:function(){var x=this.after.apply(this,arguments);x.batch(function(y){if(y.sub){y.sub.once=true;}});return x;},parseType:function(x,y){return p(x,y||this._yuievt.config.prefix);},on:function(B,G,z){var J=p(B,this._yuievt.config.prefix),L,M,y,P,I,H,N,D=b.Env.evt.handles,A,x,E,O=b.Node,K,F,C;this._monitor("attach",J[1],{args:arguments,category:J[0],after:J[2]});if(h.isObject(B)){if(h.isFunction(B)){return b.Do.before.apply(b.Do,arguments);}L=G;M=z;y=i(arguments,0,true);P=[];if(h.isArray(B)){C=true;}A=B._after;delete B._after;b.each(B,function(S,R){if(h.isObject(S)){L=S.fn||((h.isFunction(S))?S:L);M=S.context||M;}var Q=(A)?g:"";y[0]=Q+((C)?S:R);y[1]=L;y[2]=M;P.push(this.on.apply(this,y));},this);return(this._yuievt.chain)?this:new b.EventHandle(P);}H=J[0];A=J[2];E=J[3];if(O&&b.instanceOf(this,O)&&(E in O.DOM_EVENTS)){y=i(arguments,0,true);y.splice(2,0,O.getDOMNode(this));return b.on.apply(b,y);}B=J[1];if(b.instanceOf(this,YUI)){x=b.Env.evt.plugins[B];y=i(arguments,0,true);y[0]=E;if(O){K=y[2];if(b.instanceOf(K,b.NodeList)){K=b.NodeList.getDOMNodes(K);}else{if(b.instanceOf(K,O)){K=O.getDOMNode(K);}}F=(E in O.DOM_EVENTS);if(F){y[2]=K;}}if(x){N=x.on.apply(b,y);}else{if((!B)||F){N=b.Event._attach(y);}}}if(!N){I=this._yuievt.events[B]||this.publish(B);N=I._on(G,z,(arguments.length>3)?i(arguments,3,true):null,(A)?"after":true);}if(H){D[H]=D[H]||{};D[H][B]=D[H][B]||[];D[H][B].push(N);}return(this._yuievt.chain)?this:N;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(G,I,x){var M=this._yuievt.events,B,D=b.Node,K=D&&(b.instanceOf(this,D));if(!G&&(this!==b)){for(B in M){if(M.hasOwnProperty(B)){M[B].detach(I,x);}}if(K){b.Event.purgeElement(D.getDOMNode(this));}return this;}var A=p(G,this._yuievt.config.prefix),F=h.isArray(A)?A[0]:null,N=(A)?A[3]:null,C,J=b.Env.evt.handles,L,H,E,z,y=function(S,Q,R){var P=S[Q],T,O;if(P){for(O=P.length-1;O>=0;--O){T=P[O].evt;if(T.host===R||T.el===R){P[O].detach();}}}};if(F){H=J[F];G=A[1];L=(K)?b.Node.getDOMNode(this):this;if(H){if(G){y(H,G,L);}else{for(B in H){if(H.hasOwnProperty(B)){y(H,B,L);}}}return this;}}else{if(h.isObject(G)&&G.detach){G.detach();return this;}else{if(K&&((!N)||(N in D.DOM_EVENTS))){E=i(arguments,0,true);E[2]=D.getDOMNode(this);b.detach.apply(b,E);return this;}}}C=b.Env.evt.plugins[N];if(b.instanceOf(this,YUI)){E=i(arguments,0,true);if(C&&C.detach){C.detach.apply(b,E);return this;}else{if(!G||(!C&&D&&(G in D.DOM_EVENTS))){E[0]=G;b.Event.detach.apply(b.Event,E);return this;}}}z=M[A[1]];if(z){z.detach(I,x);}return this;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(x){return this.detach(x);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(z,A){var y,E,x,D,C=this._yuievt,B=C.config.prefix;z=(B)?n(z,B):z;this._monitor("publish",z,{args:arguments});if(h.isObject(z)){x={};b.each(z,function(G,F){x[F]=this.publish(F,G||A);},this);return x;}y=C.events;E=y[z];if(E){if(A){E.applyConfig(A,true);}}else{D=C.defaults;E=new b.CustomEvent(z,(A)?b.merge(D,A):D);y[z]=E;}return y[z];},_monitor:function(A,x,B){var y,z=this.getEvent(x);if((this._yuievt.config.monitored&&(!z||z.monitored))||(z&&z.monitored)){y=x+"_"+A;B.monitored=A;this.fire.call(this,y,B);}},fire:function(A){var E=h.isString(A),z=(E)?A:(A&&A.type),D,y,C=this._yuievt.config.prefix,B,x=(E)?i(arguments,1,true):arguments;z=(C)?n(z,C):z;this._monitor("fire",z,{args:x});D=this.getEvent(z,true);B=this.getSibling(z,D);if(B&&!D){D=this.publish(z);}if(!D){if(this._yuievt.hasTargets){return this.bubble({type:z},x,this);}y=true;}else{D.sibling=B;y=D.fire.apply(D,x);}return(this._yuievt.chain)?this:y;},getSibling:function(x,z){var y;if(x.indexOf(w)>-1){x=r(x);y=this.getEvent(x,true);if(y){y.applyConfig(z);y.bubbles=false;y.broadcast=0;}}return y;},getEvent:function(y,x){var A,z;if(!x){A=this._yuievt.config.prefix;y=(A)?n(y,A):y;}z=this._yuievt.events;return z[y]||null;},after:function(z,y){var x=i(arguments,0,true);switch(h.type(z)){case"function":return b.Do.after.apply(b.Do,arguments);case"array":case"object":x[0]._after=true;break;default:x[0]=g+z;}return this.on.apply(this,x);},before:function(){return this.on.apply(this,arguments);}};b.EventTarget=q;b.mix(b,q.prototype);q.call(b,{bubbles:false});YUI.Env.globalEvents=YUI.Env.globalEvents||new q();b.Global=YUI.Env.globalEvents;},"@VERSION@",{requires:["oop"]});
>>>>>>> Byte shaving and minor perf improvements
=======
YUI.add("event-custom-base",function(c){c.Env.evt={handles:{},plugins:{}};var p=0,d=1,n={objs:{},before:function(C,E,F,G){var D=C,B;if(G){B=[C,G].concat(c.Array(arguments,4,true));D=c.rbind.apply(c,B);}return this._inject(p,D,E,F);},after:function(C,E,F,G){var D=C,B;if(G){B=[C,G].concat(c.Array(arguments,4,true));D=c.rbind.apply(c,B);}return this._inject(d,D,E,F);},_inject:function(B,D,E,G){var H=c.stamp(E),F,C;if(!this.objs[H]){this.objs[H]={};}F=this.objs[H];if(!F[G]){F[G]=new c.Do.Method(E,G);E[G]=function(){return F[G].exec.apply(F[G],arguments);};}C=H+c.stamp(D)+G;F[G].register(C,D,B);return new c.EventHandle(F[G],C);},detach:function(B){if(B.detach){B.detach();}},_unload:function(C,B){}};c.Do=n;n.Method=function(B,C){this.obj=B;this.methodName=C;this.method=B[C];this.before={};this.after={};};n.Method.prototype.register=function(C,D,B){if(B){this.after[C]=D;}else{this.before[C]=D;}};n.Method.prototype._delete=function(B){delete this.before[B];delete this.after[B];};n.Method.prototype.exec=function(){var D=c.Array(arguments,0,true),E,C,H,F=this.before,B=this.after,G=false;for(E in F){if(F.hasOwnProperty(E)){C=F[E].apply(this.obj,D);if(C){switch(C.constructor){case n.Halt:return C.retVal;case n.AlterArgs:D=C.newArgs;break;case n.Prevent:G=true;break;default:}}}}if(!G){C=this.method.apply(this.obj,D);}n.originalRetVal=C;n.currentRetVal=C;for(E in B){if(B.hasOwnProperty(E)){H=B[E].apply(this.obj,D);if(H&&H.constructor==n.Halt){return H.retVal;}else{if(H&&H.constructor==n.AlterReturn){C=H.newRetVal;n.currentRetVal=C;}}}}return C;};n.AlterArgs=function(C,B){this.msg=C;this.newArgs=B;};n.AlterReturn=function(C,B){this.msg=C;this.newRetVal=B;};n.Halt=function(C,B){this.msg=C;this.retVal=B;};n.Prevent=function(B){this.msg=B;};n.Error=n.Halt;var x="after",b=["broadcast","monitored","bubbles","context","contextFn","currentTarget","defaultFn","defaultTargetOnly","details","emitFacade","fireOnce","async","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],k=9,e="yui:log",w=c.Array,f=c.Lang,s;function g(B,C){this.evt=B;this.sub=C;}g.prototype={batch:function(B,C){B.call(C||this,this);if(f.isArray(this.evt)){c.Array.each(this.evt,function(D){D.batch.call(C||D,B);});}},detach:function(){var B=this.evt,D=0,C;if(B){if(f.isArray(B)){for(C=0;C<B.length;C++){D+=B[C].detach();}}else{B._delete(this.sub);D=1;}}return D;},monitor:function(B){return this.evt.monitor.apply(this.evt,arguments);}};c.EventHandle=g;function q(C,D){var B=this;D=D||{};B.id=c.stamp(B);B.type=C;B.context=c;B.logSystem=(C==e);B.silent=B.logSystem;B.subscribers={};B.afters={};B.preventable=true;B.bubbles=true;B.signature=k;B.subCount=0;B.afterCount=0;B.applyConfig(D,true);}s={hasSubs:function(B){var E=this.subCount,C=this.afterCount,D=this.sibling;if(D){E+=D.subCount;C+=D.afterCount;}if(B){return(B=="after")?C:E;}return(E+C);},monitor:function(E){var B=this,D=B.id+"|"+B.type+"_"+E,C=w(arguments,0,true);B.monitored=true;C[0]=D;return B.host.on.apply(B.host,C);},getSubs:function(){var D=c.merge(this.subscribers),B=c.merge(this.afters),C=this.sibling;if(C){c.mix(D,C.subscribers);c.mix(B,C.afters);}return[D,B];},applyConfig:function(C,B){if(C){c.mix(this,C,B,b);}},_on:function(G,E,D,B){var C=this,F=new c.Subscriber(G,E,D,B);if(C.fireOnce&&C.fired){if(C.async){setTimeout(c.bind(C._notify,C,F,C.firedWith),0);}else{C._notify(F,C.firedWith);}}if(B==x){C.afters[F.id]=F;C.afterCount++;}else{C.subscribers[F.id]=F;C.subCount++;}return new c.EventHandle(C,F);},on:function(D,C){var B=(arguments.length>2)?w(arguments,2,true):null;if(this.host){this.host._monitor("attach",this.type,{args:arguments});}return this._on(D,C,B,true);},after:function(D,C){var B=(arguments.length>2)?w(arguments,2,true):null;return this._on(D,C,B,x);},detach:function(F,D){if(F&&F.detach){return F.detach();}var C,E,G=0,B=c.merge(this.subscribers,this.afters);for(C in B){if(B.hasOwnProperty(C)){E=B[C];if(E&&(!F||F===E.fn)){this._delete(E);G++;}}}return G;},_notify:function(F,E,B){var C=this,D;D=F.notify(E,C);if(false===D||C.stopped>1){return false;}return true;},fire:function(){var B=this,D=(B.emitFacade)?"fireComplex":"fireSimple",C=w(arguments,0,true);if(B.fireOnce){B.fired=true;B.firedWith=C;B.fire=B._fireImmediate;}return B[D](C);},_fireImmediate:function(){return true;},fireSimple:function(C){var B=this,D;B.stopped=0;B.prevented=0;if(B.hasSubs()){D=B.getSubs();B._procSubs(D[0],C);B._procSubs(D[1],C);}B.broadcast&&!B.stopped&&B._broadcast(C);return B.stopped?false:true;},fireComplex:function(B){B[0]=B[0]||{};return this.fireSimple(B);},_procSubs:function(E,C,B){var F,D;for(D in E){if(E.hasOwnProperty(D)){F=E[D];if(F&&F.fn){if(false===this._notify(F,C,B)){this.stopped=2;}if(this.stopped==2){return false;}}}}return true;},_broadcast:function(C){var B=C.slice();B.unshift(this.type);if(this.host!==c){c.fire.apply(c,B);}if(this.broadcast==2){c.Global.fire.apply(c.Global,B);}},detachAll:function(){return this.detach();},_delete:function(C){var B=this;if(C){if(B.subscribers[C.id]){delete B.subscribers[C.id];B.subCount--;}if(B.afters[C.id]){delete B.afters[C.id];B.afterCount--;}}if(B.host){B.host._monitor("detach",B.type,{ce:B,sub:C});}if(C){C.deleted=true;}}};s.unsubscribe=s.detach;s.unsubscribeAll=s.detachAll;q.prototype=s;c.CustomEvent=q;function z(E,D,C){var B=this;B.fn=E;B.context=D;B.id=c.stamp(B);B.args=C;}z.prototype={_notify:function(G,D,E){if(this.deleted&&!this.postponed){delete this.postponed;return null;}var B=this.args,F=this.fn,C;switch(E.signature){case 0:C=F.call(G,E.type,D,G);break;case 1:C=F.call(G,D[0]||null,G);break;default:if(B||D){D=D||[];B=(B)?D.concat(B):D;C=F.apply(G,B);}else{C=F.call(G);}}if(this.once){E._delete(this);}return C;},notify:function(C,E){var F=this.context,B=true;if(!F){F=(E.contextFn)?E.contextFn():E.context;}if(c.config.throwFail){B=this._notify(F,C,E);}else{try{B=this._notify(F,C,E);}catch(D){c.error(this+" failed: "+D.message,D);}}return B;},contains:function(C,B){if(B){return((this.fn==C)&&this.context==B);
}else{return(this.fn==C);}}};c.Subscriber=z;var i=c.Lang,A=":",y="|",h="~AFTER~",j=c.Array,o=i.isString,m=i.isArray,l=i.isObject,a=i.isFunction,v=c.cached(function(B){return B.replace(/(.*)(:)(.*)/,"*$2$3");}),r=c.cached(function(B,C){if(!C||!o(B)||B.indexOf(A)>-1){return B;}return C+A+B;}),t=c.cached(function(D,F){var C=D,E,G,B;if(!o(C)){return C;}B=C.indexOf(h);if(B>-1){G=true;C=C.substr(h.length);}B=C.indexOf(y);if(B>-1){E=C.substr(0,(B));C=C.substr(B+1);if(C=="*"){C=null;}}return[E,(F)?r(C,F):C,G,C];}),u=function(B){var C=(l(B))?B:{};this._yuievt=this._yuievt||{id:c.guid(),events:{},targets:{},config:C,chain:("chain" in C)?C.chain:c.config.chain,bubbling:false,defaults:{context:C.context||this,host:this,emitFacade:C.emitFacade,fireOnce:C.fireOnce,queuable:C.queuable,monitored:C.monitored,broadcast:C.broadcast,defaultTargetOnly:C.defaultTargetOnly,bubbles:("bubbles" in C)?C.bubbles:true}};};u.prototype={once:function(){var B=this.on.apply(this,arguments);B.batch(function(C){if(C.sub){C.sub.once=true;}});return B;},onceAfter:function(){var B=this.after.apply(this,arguments);B.batch(function(C){if(C.sub){C.sub.once=true;}});return B;},parseType:function(B,C){return t(B,C||this._yuievt.config.prefix);},on:function(F,K,D){var N=t(F,this._yuievt.config.prefix),H=c.Env.evt.handles,S=c.Node,P,Q,C,T,M,L,R,E,B,I,O,J,G;this._monitor("attach",N[1],{args:arguments,category:N[0],after:N[2]});if(l(F)){if(a(F)){return c.Do.before.apply(c.Do,arguments);}P=K;Q=D;C=j(arguments,0,true);T=[];G=m(F);E=(F._after&&(delete F._after))?h:"";c.each(F,function(V,U){if(l(V)){P=V.fn||((a(V))?V:P);Q=V.context||Q;}C[0]=E+((G)?V:U);C[1]=P;C[2]=Q;T.push(this.on.apply(this,C));},this);return(this._yuievt.chain)?this:new c.EventHandle(T);}L=N[0];E=N[2];I=N[3];if(S&&c.instanceOf(this,S)&&(I in S.DOM_EVENTS)){C=j(arguments,0,true);C.splice(2,0,S.getDOMNode(this));return c.on.apply(c,C);}F=N[1];if(c.instanceOf(this,YUI)){B=c.Env.evt.plugins[F];C=j(arguments,0,true);C[0]=I;if(S){O=C[2];if(c.instanceOf(O,c.NodeList)){O=c.NodeList.getDOMNodes(O);}else{if(c.instanceOf(O,S)){O=S.getDOMNode(O);}}J=(I in S.DOM_EVENTS);if(J){C[2]=O;}}if(B){R=B.on.apply(c,C);}else{if((!F)||J){R=c.Event._attach(C);}}}if(!R){M=this._yuievt.events[F]||this.publish(F);R=M._on(K,D,(arguments.length>3)?j(arguments,3,true):null,(E)?"after":true);}if(L){H[L]=H[L]||{};H[L][F]=H[L][F]||[];H[L][F].push(R);}return(this._yuievt.chain)?this:R;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(K,M,B){var Q=this._yuievt.events,F,H=c.Node,O=H&&(c.instanceOf(this,H));if(!K&&(this!==c)){for(F in Q){if(Q.hasOwnProperty(F)){Q[F].detach(M,B);}}if(O){c.Event.purgeElement(H.getDOMNode(this));}return this;}var E=t(K,this._yuievt.config.prefix),J=m(E)?E[0]:null,R=(E)?E[3]:null,G,N=c.Env.evt.handles,P,L,I,D,C=function(W,U,V){var T=W[U],X,S;if(T){for(S=T.length-1;S>=0;--S){X=T[S].evt;if(X.host===V||X.el===V){T[S].detach();}}}};if(J){L=N[J];K=E[1];P=(O)?c.Node.getDOMNode(this):this;if(L){if(K){C(L,K,P);}else{for(F in L){if(L.hasOwnProperty(F)){C(L,F,P);}}}return this;}}else{if(l(K)&&K.detach){K.detach();return this;}else{if(O&&((!R)||(R in H.DOM_EVENTS))){I=j(arguments,0,true);I[2]=H.getDOMNode(this);c.detach.apply(c,I);return this;}}}G=c.Env.evt.plugins[R];if(c.instanceOf(this,YUI)){I=j(arguments,0,true);if(G&&G.detach){G.detach.apply(c,I);return this;}else{if(!K||(!G&&H&&(K in H.DOM_EVENTS))){I[0]=K;c.Event.detach.apply(c.Event,I);return this;}}}D=Q[E[1]];if(D){D.detach(M,B);}return this;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(B){return this.detach(B);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(E,F){var H=this._yuievt,G=H.config.prefix,D=H.events,C=H.defaults,B;E=(G)?r(E,G):E;if(!D[E]){if(l(E)){B={};c.each(E,function(J,I){B[I]=this.publish(I,J||F);},this);return B;}F&&(C=c.merge(C,F));D[E]=new c.CustomEvent(E,C);}else{if(F){D[E].applyConfig(F,true);}}return D[E];},_monitor:function(E,B,F){var C,D=this.getEvent(B);if((this._yuievt.config.monitored&&(!D||D.monitored))||(D&&D.monitored)){C=B+"_"+E;F.monitored=E;this.fire.call(this,C,F);}},fire:function(E){var I=o(E),D=(I)?E:(E&&E.type),H,C,G=this._yuievt.config.prefix,F,B=(I)?j(arguments,1,true):arguments;D=(G)?r(D,G):D;this._monitor("fire",D,{args:B});H=this.getEvent(D,true);F=this.getSibling(D,H);if(F&&!H){H=this.publish(D);}if(!H){if(this._yuievt.hasTargets){return this.bubble({type:D},B,this);}C=true;}else{H.sibling=F;C=H.fire.apply(H,B);}return(this._yuievt.chain)?this:C;},getSibling:function(B,D){var C;if(B.indexOf(A)>-1){B=v(B);C=this.getEvent(B,true);if(C){C.applyConfig(D);C.bubbles=false;C.broadcast=0;}}return C;},getEvent:function(C,B){var D;if(!B){D=this._yuievt.config.prefix;C=(D)?r(C,D):C;}return this._yuievt.events[C]||null;},after:function(D,C){var B=j(arguments,0,true);switch(i.type(D)){case"function":return c.Do.after.apply(c.Do,arguments);case"array":case"object":B[0]._after=true;break;default:B[0]=h+D;}return this.on.apply(this,B);},before:function(){return this.on.apply(this,arguments);}};c.EventTarget=u;c.mix(c,u.prototype);u.call(c,{bubbles:false});YUI.Env.globalEvents=YUI.Env.globalEvents||new u();c.Global=YUI.Env.globalEvents;},"@VERSION@",{requires:["oop"]});
>>>>>>> Byte shaving from event-target
