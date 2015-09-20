/**
 * 基于ajax的分页插件 需要jQuery（使用jQuery的ajax）
 * @author nealli
 */
(function($){
	$.fn.extend({
		pages: function(options){
			var _page = this,
				tpl = '',						//分页的模板
				LANG,
				_url = window.location.href, 	//获取当前页面的url
				_pageSize = 0,   				//页面总数
				defaults = {					//默认参数
					url: "",
					curPage: 1,					//当前显示的页面
					pageLimit: 20,				//每页显示多少条
					dataCount: 0,				//总的数据条数 【必须】
					labelCount: 10,				//要显示的页面个数 如: 1,2,3,4,5 默认显示5个页码标签
					lang: {					//分页数据提示
						total: '共 ',
						records_desc: '条数据 本页 ',
						item: ' 条，',
						page: ' 页'
					},
					callback: function(){}		//Ajax执行成功的回调函数 会回传两个参数 res(ajax请求返回的数据) page(当前的page的jQuery对象)
				};
			
			//赋值
			defaults = $.extend(defaults, options);
			
			_page.curPage = defaults.curPage;
			_page.dataCount = defaults.dataCount;
			_page.pageLimit = defaults.pageLimit;
			_page.nowCount = _page.pageLimit;
			LANG = defaults.lang;
			_page.url = _url;
			
			//pageSize
			_pageSize = getPageSize();
			
			//计算pageSize
			function getPageSize(){
				return Math.ceil(_page.dataCount/_page.pageLimit);
			}
			
			//检查页码
			_page.checkPage = function(pno){
				if(pno && pno < 1){
					pno = 1;
				}else if(pno && pno > _page.pageLimit){
					pnp = _page.pageLimit;
				}
				
				return pno || 1;
			}

			//提示信息
			function pageTips(){
				if(_page.dataCount<_page.pageLimit){
					_page.nowCount = _page.dataCount;
				}else if(_pageSize == _page.curPage){
					_page.nowCount = _page.dataCount%_page.pageLimit;
				}else if(_page.dataCount>_page.pageLimit){
					_page.nowCount = _page.pageLimit;
				}
				
				tpl += '<span class="page-tip">'+LANG.total+'<b> '+ _page.dataCount +' </b>'+LANG.records_desc+'<b>' + _page.nowCount + '</b>'+LANG.item+LANG.total+'<b>'+ _pageSize +'</b>'+ LANG.page +'</span>';
			}
			
			//使用用户自定义的url
			if(defaults.url){
				_page.url = defaults.url;
			}
			
			//首页
			function firstPage(){
				if(_page.curPage == 1){
					tpl += '<a href="javascript:void(0);" style="cursor:not-allowed" class="page-firsted">&lt;&lt;</a>';
				}else{
					tpl += '<a href="javascript:void(0);" class="page-first">&lt;&lt;</a>';
					
					//注册监听
					addListener('page-first', 1);
				}
			}
			
			//上一页
			function prevPage(){
				if(_page.curPage > 1){
					tpl += '<a href="javascript:void(0);" class="page-prev">&lt;</a>';
					
					//注册监听
					addListener('page-prev', _page.curPage-1);
				}else{
					tpl += '<a href="javascript:void(0);" style="cursor:not-allowed" class="page-preved">&lt;</a>';
				}
			}
			
			//显示的页码
			function pageList(){
				var cp = _page.curPage;
				var lc = defaults.labelCount;
				
				var middle = Math.floor(lc/2);
				
				tpl += '<b>';
				
				//当前页前面
				for(var i=middle; i>=1; i--){
					var p = cp-i;
					if(p>=1){
						tpl += '<a href="javascript:void(0);" class="page-list'+ p +'">'+ p +'</a>';
						
						//注册监听
						addListener('page-list'+p, p);
					}
				}

				//当前页
				if(cp >= 1){
					tpl +='<span class="page-active">'+ cp +'</span>';
				}
				
				//当前页后面
				for(var i=1; i<middle; i++){
					var p = cp + i;
					if(p <= _pageSize){
						tpl += '<a href="javascript:void(0);" class="page-list'+ p +'">'+ p +'</a>';
						
						//注册监听
						addListener('page-list'+p, p);
					}
				}
				
				tpl +='</b>';
			}
			
			//下一页
			function nextPage(){
				if(_page.curPage < _pageSize){
					tpl += '<a href="javascript:void(0);" class="page-next">&gt;</a>';
					
					//注册监听
					addListener('page-next', _page.curPage+1);
				}else{
					tpl += '<a href="javascript:void(0);" style="cursor:not-allowed" class="page-nexted">&gt;</a>';
				}
			}
			
			//尾页
			function lastPage(){
				if(_page.dataCount>0 && _page.curPage != _pageSize){
					tpl += '<a href="javascript:void(0);" class="page-last">&gt;&gt;</a></div><div style="clear:both"></div>';
					
					//注册监听
					addListener('page-last',_pageSize);
				}else{
					tpl += '<a href="javascript:void(0);" class="page-lasted" style="cursor:not-allowed">&gt;&gt;</a></div><div style="clear:both"></div>'
				}
			}
			
			//注册监听
			function addListener(type, page){
				_page.off('click', "a."+type);
				_page.on('click', "a."+type, function(e){
					//请求数据
					getData(page, type);
				});
			}
			
			//分页GET请求
			function getData(page, type){
				
				if(defaults.type == 'static'){
					//执行回调函数
					defaults.callback(page, _page);
					//改变当前页
					_page.curPage = page;
					//刷新分页
					createPages();
					
					return false;
				}
				
				$.get(doUrl(_page.url)+"&page="+page+"&pageLimit="+defaults.pageLimit, function(res){
					if(defaults.callback && typeof defaults.callback == 'function'){
						//执行回调函数
						defaults.callback(res, _page);
						
						//改变当前页
						_page.curPage = page;
						//刷新分页
						createPages();
					}
				});
			}
			
			//处理 url
			function doUrl(url){
				
				if(url.indexOf("?") == -1){
					url += "?";
				}
				
				var char = url.charAt(url.length-1);
				
				if(char == "&" || char == '?'){
					url +="_t="+Math.random();
				}else{
					url +="&_t="+Math.random();
				}
				return url;
			}
			
			//生成分页
			function createPages(){
				//重新计算pageSize
				_pageSize = getPageSize();
				//生成提示
				pageTips();
				//生成第一页
				firstPage();
				//生成前一页
				prevPage();
				//生成中间页码
				pageList();
				//生成第下一页
				nextPage();
				//生成最后一页
				lastPage();
				
				tpl = '<div>'+ tpl + '</div>';
				
				_page.empty().html(tpl);
				
				tpl = '';
				
			}
			
			//生成分页
			createPages();
			
			//刷新分页
			_page.refresh = function(){
				_page.curPage = 1;
				createPages();
			}
			
			return _page;
		}
	});
})(jQuery);

//日期格式化
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
