;(function($){

	var body = document.body;
	var win = getViewport();

	var elements = [];
	var config = {};

	function getViewport() {
		var e = window,
				a = 'inner';
		if (!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || body;
		}
		return {
				width: e[a + 'Width'],
				height: e[a + 'Height']
		};
	}

	function isActive(dom){

		if(dom === null){
			console.log("dom is null");
			return false;
		}

		var pos = dom.getBoundingClientRect();
		if (pos.top > win.height) {
		} else if (pos.bottom < 0) {
		} else if (pos.left > win.width) {
		} else if (pos.right < 0) {
		} else {
			console.log("activeing");
			return true;
		}
		console.log("sleeping");
		return false;
	}

	function getCurPos() {
		console.log("getCurPos");
		_(elements).forEach(function(element){
			if(!element.processing){
				element.processing = true;
				console.log("processing");

				if(element.type === 1){//block类型
					if(element.lock === true &&	isActive(element.dom)){
						console.log("block handle");
						element.lock = false;
						element.defer.resolve();
					}
				}else if(element.type === 0){//评论类型
					if(isActive(element.dom)){
						if(element.timer === null){
							element.timer = setTimeout(function run(){
									console.log("timer run");
									element.defer.resolve({
										element: element,
										isSame: function(isSame){
											if(isSame){
												var num = element.nextTime * config.multiple;
												if(num > config.MaxWait){
													element.nextTime = config.MaxWait;
												}else{
													element.nextTime = num;
												}
											}else{
												element.nextTime = config.NormalWait;
											}

											//用于判断回调时该元素是否还在显示区域
											if(isActive(element.dom)){
												 element.timer = setTimeout(run, element.nextTime * 1000);
											}
										}
								});
								console.log((element.nextTime) + "秒");
							}, element.nextTime * 1000);
						}
					}else{
						if(element.timer !== null){
							console.log("clear timer");
							clearTimeout(element.timer);
							element.timer = null;
						}
					}
				}

				element.processing = false;
			}
		});
	}

	/*
	 *自定义scroll插件
	 *
	*/
	$.fwScrollWatch = function(options){
			config =  $.extend({}, {
				MaxWait: 600,	//最大等待时间间隔秒数
				NormalWait: 5,	//等待时间间隔秒数
				multiple: 2,	//上次获取数据不变的情况下与下次请求的时间倍数关系
			}, options);

			window.addEventListener('scroll', getCurPos, false);
			window.addEventListener('resize', function() {
				win = getViewport();
			　getCurPos();
			}, false);
	};

	$.fwScrollWatch.prototype.addElement = function(element){
			//console.log("addElement");
			//element must have: name, dom, type, defer
			if(element.type === 1){
				element.lock = true;
				//element.dom = document.getElementById(name);
			}else if(element.type === 0){
				element.nextTime = 1;
			}
			elements.push(element);
			getCurPos();	//立即计算一次，用于匹配那些首屏显示的元素
	};

	// $.fwScrollWatch.prototype.removeElement = function(element){
	// 		console.log("removeElement");
	// };

})(jQuery);
