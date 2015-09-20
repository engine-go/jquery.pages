# jquery.pages
-----
#简介
一个简单的jQuery分页插件。主要有两种分页方法：  
- 通过Ajax获取数据分页
- 本地数据进行分页显示

#使用方法

引入**jQuery**和**jquery.pages**插件，如图：
```html
<script src="http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
<script src="./js/jquery.pages.js"></script>
```
### 初始化参数
----

初始化分页插件：
```javascript
$(function(){
  	//init page plugin
  	$("div.page").pages({
  	  	url: '',                
  		type: 'static',       
  		dataCount: 0,   
  		pageLimit: 20,   
  		labelCount: 10,				  
		lang: {					        
			total: '共 ',
			records_desc: '条数据 本页 ',
			item: ' 条，',
			page: ' 页'
		},
  		callback: function(/*arguements*/){} 
  	});
});
```
#####参数说明：
|参数                   | 说明                                                                                      |
|-----------------------|-------------------------------------------------------------------------------------------|
|url                    | Ajax分页时查询的页面URL【如果不填则获取当前页面的URL地址】                                |
|type                   | 本地分页固定参数【本地分页必须】                                                          |
|dataCount              | 总的数据数量 【必须】                                                                     |
|pageLimit              | 每页显示多少条 【默认：20】                                                               |
|labelCount             | 最多显示的页码个数 如: 1,2,3,4,5 默认显示10个页码标签                                     |
|lang                   | 分页数据提示 以上代码中的为默认值，可自行修改                                             |
|callback               | 分页标签点击回调函数。本地分页接收一个参数为当前的页码；Ajax分页接收两个参数请求的返回数据和pages对象本身|

###对本地数据进行分页显示
> 必须参数 **type**,**dataCount**,**callback** 返回当前的页面

如接收分页内容的元素为： 
```html
<div class="page"></div>
```
```javascript
var dataCount = 100,
    pageLimit = 20;
$("div.page").pages({
	type: 'static',
	dataCount: dataCount,
	pageLimit: pageLimit,
	callback: function(pageno){
		showdata(pageno)
	}
});
```
