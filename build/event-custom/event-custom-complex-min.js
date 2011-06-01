YUI.add("event-custom-complex",function(g){var d,f={},c=g.CustomEvent.prototype,e=g.EventTarget.prototype,a=g.Lang.isObject,b=f.hasOwnProperty;g.EventFacade=function(j,i){var h=this;j=j||f;h._event=j;h.details=j.details;h.type=j.type;h._type=j.type;h.target=j.target;h.currentTarget=i;h.relatedTarget=j.relatedTarget;};g.extend(g.EventFacade,Object,{stopPropagation:function(){this._event.stopPropagation();this.stopped=1;},stopImmediatePropagation:function(){this._event.stopImmediatePropagation();this.stopped=2;},preventDefault:function(){this._event.preventDefault();this.prevented=1;},halt:function(h){this._event.halt(h);this.prevented=1;this.stopped=(h)?2:1;}});c.fireComplex=function(r){var s,m,h,o,j,p,k,i,u=this,t=u.host||u,n,l;if(u.stack){if(u.queuable&&u.type!=u.stack.next.type){u.stack.queue.push([u,r]);return true;}}s=u.stack||{id:u.id,next:u,silent:u.silent,stopped:0,prevented:0,bubbling:null,type:u.type,afterQueue:new g.Queue(),defaultTargetOnly:u.defaultTargetOnly,queue:[]};k=u.getSubs();u.stopped=(u.type!==s.type)?0:s.stopped;u.prevented=(u.type!==s.type)?0:s.prevented;u.target=u.target||t;u.currentTarget=t;u.details=r.slice();u._facade=null;m=u._getFacade(r);if(a(r[0])){r[0]=m;}else{r.unshift(m);}if(k[0]){u._procSubs(k[0],r,m);}if(u.bubbles&&t.bubble&&!u.stopped){l=s.bubbling;s.bubbling=u.type;if(s.type!=u.type){s.stopped=0;s.prevented=0;}p=t.bubble(u,r,null,s);u.stopped=Math.max(u.stopped,s.stopped);u.prevented=Math.max(u.prevented,s.prevented);s.bubbling=l;}if(u.stopped&&u.stoppedFn){u.stoppedFn.apply(t,r);}if(u.prevented){if(u.preventedFn){u.preventedFn.apply(t,r);}}else{if(u.defaultFn&&((!u.defaultTargetOnly&&!s.defaultTargetOnly)||t===m.target)){u.defaultFn.apply(t,r);}}u.broadcast&&!u.stopped&&u._broadcast(r);if(k[1]&&!u.prevented&&u.stopped<2){if(s.id===u.id||u.type!=t._yuievt.bubbling){u._procSubs(k[1],r,m);while((n=s.afterQueue.last())){n();}}else{i=k[1];if(s.execDefaultCnt){i=g.merge(i);g.each(i,function(q){q.postponed=true;});}s.afterQueue.add(function(){u._procSubs(i,r,m);});}}u.target=null;if(s.id===u.id){o=s.queue;while(o.length){h=o.pop();j=h[0];s.next=j;j.fire.apply(j,h[1]);}u.stack=null;}p=!(u.stopped);if(u.type!=t._yuievt.bubbling){s.stopped=0;s.prevented=0;u.stopped=0;u.prevented=0;}return p;};c._getFacade=function(){var j=this,h=j._facade||new g.EventFacade(j,j.currentTarget),l=j.details,m,i;if(l&&a(l[0],true)){m=l[0];for(i in m){if(b.call(m,i)&&!(i in d)){h[i]=m[i];}}m.type&&(h.type=m.type);}h.details=j.details;h.target=j.originalTarget||j.target;h.currentTarget=j.currentTarget;h.stopped=h.prevented=0;return(j._facade=h);};c.stopPropagation=function(){this.stopped=1;if(this.stack){this.stack.stopped=1;}};c.stopImmediatePropagation=function(){this.stopped=2;if(this.stack){this.stack.stopped=2;}};c.preventDefault=function(){if(this.preventable){this.prevented=1;if(this.stack){this.stack.prevented=1;}}};c.halt=function(h){if(h){this.stopImmediatePropagation();}else{this.stopPropagation();}this.preventDefault();};e.addTarget=function(h){this._yuievt.targets[g.stamp(h)]=h;this._yuievt.hasTargets=true;};e.getTargets=function(){return g.Object.values(this._yuievt.targets);};e.removeTarget=function(h){delete this._yuievt.targets[g.stamp(h)];};e.bubble=function(v,r,p,u){var n=this._yuievt.targets,q=true,w,s=v&&v.type,j,m,o,k,h=p||(v&&v.target)||this,l;if(!v||(!v.stopped&&n)){for(m in n){if(n.hasOwnProperty(m)){w=n[m];j=w.getEvent(s,true);k=w.getSibling(s,j);if(k&&!j){j=w.publish(s);}l=w._yuievt.bubbling;w._yuievt.bubbling=s;if(!j){if(w._yuievt.hasTargets){w.bubble(v,r,h,u);}}else{j.sibling=k;j.target=h;j.originalTarget=h;j.currentTarget=w;o=j.broadcast;j.broadcast=false;j.emitFacade=true;j.stack=u;q=q&&j.fire.apply(j,r||v.details||[]);j.broadcast=o;j.originalTarget=null;if(j.stopped){break;}}w._yuievt.bubbling=l;}}}return q;};d=new g.EventFacade();},"@VERSION@",{requires:["event-custom-base"]});