### 场景描述

我们项目存在这么一个页面，很长，其中有两种类型的数据：

- 需要一次性初始化即可
- 需要轮训获取最新状态

但，不管是哪种类型，都需要判断它们是否正处于显示区域中。

### 项目依赖
- jquery
- lodash

### 运行方式

将代码下载并放在web目录下，直接浏览器访问即可。

### 使用方式

该模块被封装成一个jquery插件：$.fwScrollWatch：

```html
<script src="//cdn.bootcss.com/lodash.js/4.6.1/lodash.js"></script>
<script src="//cdn.bootcss.com/jquery/2.2.1/jquery.js"></script>
<script src="scrollWatch.js" charset="utf-8"></script>
<script type="text/javascript">

	var scrollWatch = new $.fwScrollWatch();
	var block = {
		name: "blockBox",
		dom: document.getElementById("blockBox"),
		type: 1,
		defer: function(){		//defer参数是一个promise对象
			var defer = $.Deferred();
			defer.then(function(obj){
				console.log("block fetch run");
				//数据异步获取
				//....
			});
			return defer;
		}()
	};
	scrollWatch.addElement(block);

	var list = {
		name: "listBox",
		dom: document.getElementById("listBox"),
		type: 0,
		defer: function newDefer(){		//defer参数是一个promise对象
			var defer = $.Deferred();
			defer.then(function(obj){
				console.log("list fetch run");
				//数据异步获取
				setTimeout(function(){
					obj.element.defer = newDefer();	//重新创建延迟器，这里一定要记得重新定义一个defer
					obj.isSame(false);	//如果不调用这个方法，则不会再次绑定setTimeout
				}, 1);
			});
			return defer;
		}()
	};
	scrollWatch.addElement(list);
</script>
```

初始化组件时，可以传入的参数描述：

- MaxWait: 最大时间间隔秒数，默认值为600秒
- NormalWait: 等待时间间隔秒数，默认值为5秒
- multiple: 上次获取数据不变的情况下与下次请求的时间倍数关系，默认为2倍

该插件，还提供下列方法：

- addElement(element)：添加需要监控页面dom组件，参数`element`对象需要包括：
	- dom：被监控元素的dom对象
	- type：1表示一次性，0表示轮训的
	- defer：延时器，该组件会在监控元素出现在屏幕显示区域时通知该延时器，并传入对象，结构如下：
		- element：该组件本身
		- isSame：func，回调函数，若传参true，表示会延迟下次请求的时间间隔（这部分比较绕，推荐直接看代码）

##### 注意

不能在html的body元素上添加`display:none`样式，这样会导致本插件在初始化时误认为所有监听的区域都处于显示状态！
