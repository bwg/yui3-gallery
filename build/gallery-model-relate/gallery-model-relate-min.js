YUI.add("gallery-model-relate",function(g){var h={type:"toMany",_initRelated:function(){var i=this;i.related=new i.listType({model:i.relatedModel});i._handles.push(i.related.on("remove",i._onRelatedRemove,i));i._refreshRelationship();},_destroyRelated:function(){this.related.destroy();},_setRelated:function(k){var j=this.related,i=j.isEmpty()?"add":"reset";j[i](k);},_setRelatedAttr:function(j,k,i){this.related.each(function(l){l.set(j,k,i);});},_afterStoreAdd:function(k){var i=this,j=k.model;if(i._checkRelationship(j)){i.related.add(j,k);i.fire("add",k);}},_afterStoreRemove:function(k){var i=this,j=k.model;if(i.related.indexOf(j)!==-1){i.related.remove(j,k);i.fire("remove",k);}},_afterRelatedKeyChange:function(i){i.model=i.target;if(i.src==="create"){return;}else{if(this.related.indexOf(i.model)!==-1){i.unregister=true;this._afterStoreRemove(i);}else{this._afterStoreAdd(i);}}},_onRelatedRemove:function(i){if(i.unregister||i["delete"]){}else{i.preventDefault();}}};var b={type:"toOne",_initRelated:function(){this._refreshRelationship();},_setRelated:function(k){var j=this,i;k=g.Array(k);i=k[0]||null;if(j.related){this.fire("remove",{model:j.related});}j.related=i;if(j.related){this.fire("add",{model:j.related});}},_setRelatedAttr:function(j,k,i){this.related&&this.related.set(j,k,i);},_afterStoreAdd:function(k){var i=this,j=k.model;if(!i.related&&i._checkRelationship(j)){i._setRelated(j);}},_afterStoreRemove:function(k){var j=this,i=k.model;if(i===j.related){j._refreshRelationship();}},_afterRelatedKeyChange:function(i){i.model=i.target;if(i.src==="create"){return;}else{if(this.related===i.model){i.unregister=true;this._afterStoreRemove(i);}else{this._afterStoreAdd(i);}}}};var c=g.ModelStore;function e(j){var i=this;if(!c){g.error("Cannot create relationship. ModelStore not found.");}g.stamp(this);i.name=j.name;i.model=j.model;i.key=j.key||j.model.idAttribute||"id";i.relatedModel=c._getModelCtor(j.relatedModel);i.relatedKey=j.relatedKey||i.key;if(j.type==="toMany"){i.listType=j.listType||g.ModelList;g.mix(i,h,true);}else{if(j.type==="toOne"){g.mix(i,b,true);}else{g.error("Cannot create relationship. "+j.type+" is not a valid relationship type.");}}i.init();}e.toOne="toOne";e.toMany="toMany";e.prototype={type:null,related:null,init:function(j){var i=this;i._handles=[];i._storeList=c.getList(i.relatedModel);i._initRelated();i._initEvents();},destroy:function(){this._detachEvents();this._storeList=null;this._destroyRelated();this._related=null;},toString:function(){var i=this;return i.model.toString()+" "+i.type+" relationship "+i.name+"["+g.stamp(this,true)+"]";},_checkRelationship:function(i){return i.get(this.relatedKey)==this.model.get(this.key);},_destroyRelated:function(){},_detachEvents:function(){g.each(this._handles,function(i){i.detach();});this._handles=[];},_findRelated:function(j){var i=this;return g.Array.filter(i._storeList._items,i._checkRelationship,i);},_initEvents:function(){var j=this,k=j._handles,i={bubbles:true,emitFacade:true,prefix:"modelRelationship",preventable:false};this.publish("add",i);this.publish("remove",i);k.push(j.model.on(j.key+"Change",j._onKeyChange,j));k.push(j.model.after(j.key+"Change",j._afterKeyChange,j));k.push(j._storeList.after("*:"+j.relatedKey+"Change",j._afterRelatedKeyChange,j));k.push(j._storeList.on("error",function(l){}));k.push(j._storeList.after("add",j._afterStoreAdd,j));k.push(j._storeList.after("remove",j._afterStoreRemove,j));},_initRelated:function(){},_refreshRelationship:function(i){this._setRelated(this._findRelated());},_setRelated:function(i){},_setRelatedAttr:function(j,k,i){},_afterKeyChange:function(i){if(i.src==="create"){this._setRelatedAttr(i.attrName,i.newVal,{src:"create",silent:true});}else{this._refreshRelationship();}},_afterStoreAdd:function(i){},_afterStoreRemove:function(i){},_afterRelatedKeyChange:function(i){},_onKeyChange:function(j){var i=j.target;if(j.attrName===i.idAttribute&&i.isNew()){j.src="create";}}};g.ModelRelationship=g.augment(e,g.EventTarget);var f="relationships",a="_rel_";function d(){}d.ATTRS={id:{valueFn:function(){return this.get("clientId");}},outputRelationships:{value:false}};d.prototype={_registered:false,initializer:function(j){var i=this,k=i._aggregateRelationships();j=j||{};i._modelRelateHandles=[g.Do.before(i._doBeforeDestroy,i,"destroy",i),g.Do.after(i._doAfterGetAttrs,i,"getAttrs",i)];g.each(k,function(l){g.each(l,i._addRelationshipAttr,i);});i.after("initializedChange",function(l){if(j.register!==false){i.register();}});},destructor:function(){var i=this._modelRelateHandles;g.each(i,function(j){j.detach();});this._modelRelateHandles=null;this._destroyRelationships();},addRelationship:function(j,i){this._addRelationshipAttr(i,j);return this;},getRelated:function(j){var i=this.getRelationship(j);return i&&i.related;},getRelationship:function(i){return this.get(this._relName(i));},isNew:function(){return this.get("clientId")===this.get("id");},isRegistered:function(){return this._registered;},register:function(){if(!c){}else{if(this.isRegistered()){}else{this._registered=(c.registerModel(this)===this);}}return this;},removeRelationship:function(l){var k=this,i=k.getRelationship(l),j=k._relName(l);if(i){i.destroy();}k.removeAttr(j);k._state.remove(j,f);return k;},toString:function(){return this.name+"["+this.get("id")+":"+g.stamp(this,true)+"]";},unregister:function(){if(!c){}else{if(!this.isRegistered()){}else{this._registered=(c.unregisterModel(this)===this);}}this._destroyRelationships();return this;},_addRelationshipAttr:function(l,k){var j=this,i=j._relName(k),m={};m.readOnly=true;m.lazyAdd=true;m.setter=function(n){return new g.ModelRelationship(n);};m.value=g.merge(l,{name:k,model:this});j.addAttr(i,m,true);if(j._state.get(i,"added")){j._state.add(i,f,k);}},_aggregateRelationships:function(){var j=this.constructor,i=[];while(j){if(j.RELATIONSHIPS){i[i.length]=j.RELATIONSHIPS;}j=j.superclass?j.superclass.constructor:null;}return i;},_doAfterGetAttrs:function(){var i=this._state,j=g.Do.currentRetVal;
if(!this.get("outputRelationships")){g.each(j,function(m,k,l){if(i.get(k,f)){delete l[k];}});}delete j.outputRelationships;return new g.Do.AlterReturn("removed relationship meta from getAttrs return",j);},_doBeforeDestroy:function(i,k){var j;if(typeof i==="function"){k=i;i={};}if(i&&(i.unregister||i["delete"])){this.deleted=true;j=g.bind(function(l){if(l){this.deleted=false;}else{this._destroyRelationships();}k&&k.apply(null,arguments);},this);return new g.Do.AlterArgs(this.toString()+" deleted, modifying callback to destroy model relationships",[i,j]);}},_destroyRelationships:function(){var i=this._state.data;g.each(i,function(k,l){var j=k[f];if(j){this.removeRelationship(j);}},this);},_relName:function(i){return a+i;}};g.ModelRelate=d;},"@VERSION@",{requires:["base","event-custom","array-extras","model-list","gallery-model-store"]});