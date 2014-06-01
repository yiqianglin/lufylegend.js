/*
* LButton.js
**/
function LButton(upState,overState,downState){
	var s = this;
	base(s,LSprite,[]);
	s.type = "LButton";
	s.buttonMode = true;
	s.addChild(upState);
	if(overState == null){
		overState = upState;
	}else{
		s.addChild(overState);
	}
	if(downState == null){
		downState = overState;
	}else{
		s.addChild(downState);
	}
	s.upState = s.bitmap_up = upState;
	s.overState = s.bitmap_over = overState;
	s.downState = downState;
	
	s.overState.visible = false;
	s.downState.visible = false;
	s.upState.visible = true;
	s.staticMode = false;
	
	s.addEventListener(LMouseEvent.MOUSE_OVER,s.ll_modeOver);
	s.addEventListener(LMouseEvent.MOUSE_OUT,s.ll_modeOut);
	s.addEventListener(LMouseEvent.MOUSE_DOWN,s.ll_modeDown);
}
LButton.prototype.ll_modeDown = function (e){
	var s = e.clickTarget,w,h,tw,th,x,y,tx,ty,onComplete;
	if(!s.buttonMode || s.tween){
		return;
	}
	s.upState.visible = false;
	s.overState.visible = false;
	s.downState.visible = true;
	
	s._tweenOver = s.ll_modeOver;
	onComplete = function(obj){
		var s = obj.parent;
		delete s.tween;
		s._tweenOver({clickTarget:s});
		delete s._tweenOver;
	};
	if(s.staticMode){
		s.tween = LTweenLite.to(s.downState,0.3,{})
		.to(s.downState,0.1,{onComplete:onComplete});
	}else{
		w = s.downState.getWidth();
		h = s.downState.getHeight();
		tw = w*1.1;
		th = h*1.1;
		x = s.downState.x;
		y = s.downState.y;
		tx = x+(w - tw)*0.5;
		ty = y+(h - th)*0.5;
		s.tween = LTweenLite.to(s.downState,0.3,{x:tx,y:ty,scaleX:1.1,scaleY:1.1,ease:Quart.easeOut})
		.to(s.downState,0.1,{x:x,y:y,scaleX:1,scaleY:1,ease:Quart.easeOut,onComplete:onComplete});
	}
};
LButton.prototype.ll_modeOver = function (e){
	var s = e.clickTarget;
	if(!s.buttonMode){
		return;
	}
	if(s.tween){
		s._tweenOver = s.ll_modeOver;
		return;
	}
	s.upState.visible = false;
	s.downState.visible = false;
	s.overState.visible = true;
};
LButton.prototype.ll_modeOut = function (e){
	var s = e.clickTarget;
	if(!s.buttonMode){
		return;
	}
	if(s.tween){
		s._tweenOver = s.ll_modeOut;
		return;
	}
	s.overState.visible = false;
	s.downState.visible = false;
	s.upState.visible = true;
};
LButton.prototype.clone = function (){
	var s = this,upState = s.upState.clone(),overState = s.overState.clone(),downState = s.downState.clone(),
	a = new LButton(upState,overState,downState);
	return a;
};