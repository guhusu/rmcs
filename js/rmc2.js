/**
 * 2.0版
 * 修正header 移動顯示問題
 * 加入移動事件
 * 加入頁的紀錄
 * */
var RMC={
		_SW:0,//視窗寬度
		_SH:0,//視窗高度
		_PAGENUM:0,//頁的數量
		_NOWID:'',//現在使用的ID
		_BACKID:'',//上一次使用的ID
		_PAGEHISTORY:[],//記錄頁
		_TOTAL_PAGE:[],//記錄所以點過的PAGE
		_CORDOVA_STATUS:false,//cordova status
		_PAGE_EVENT:{'hidebefore':{},'hide':{},'showbefore':{},'show':{}},//事件 
		//初始化
		create:function(c){
			RMC._SW=$(window).width();
			RMC._SH=$(window).height();//alert(RMC._SW+' -- '+RMC._SH);
			var HP=false;//header position
			var FP=false;//footer position
			var CH=RMC._SH;
			var i=0;
			$('.page').each(function(){
				var chf=false;
				++i;
				$(this).addClass("display-none");
				$(this).css({'width':RMC._SW+'px','height':RMC._SH+'px'});
				if(i==1) RMC._NOWID=this.id;
				var content=$(this).find('.content');
				var header=$(this).find('.header');
				var footer=$(this).find('.footer');
				HP=header.attr('data-position');
				if(HP){
					//$(this).find('.header').css('position','fixed');
					header.css('position','fixed');
					HP=header.outerHeight(true);
					CH -=HP;
					content.css('margin-top',HP+'px');
					chf=true;
				}
				FP=footer.attr('data-position');
				if(FP){
					FP=footer.outerHeight(true);
					CH -=FP;
					content.css('margin-bottom',FP+'px');
					FP=RMC._SH-FP;
					footer.css({'position':'fixed','left':'0px','top':FP+'px'});
				}
				if(content){
					if(chf){
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}
				RMC._PAGENUM++;
			});//alert(RMC._NOWID);
			$('#'+RMC._NOWID).removeClass("display-none");
			$('#'+RMC._NOWID).addClass("display-show");
			//$('#'+RMC._NOWID).css({'display':'','left':'0px'});
			//$('#vv').css('display','');
			//設定事件
			$('[tap]').each(function(){
				$(this).swipe( {
		            tap:function(event, target) {
		            	eval($(this).attr('tap'));
		            },
		            threshold:50
		          });
			});
			
			RMC.runCordova();//if(c!=undefined) RMC.runCordova();
		},
		pageCreate:function(){
			
		},
		//換頁
		changePage:function(id,type){RMC.changepage(id,type);},
		changepage:function(id,type){
			if(document.getElementById(id)){
				if(type==undefined){//alert(RMC._NOWID);
					RMC._TOTAL_PAGE.push(id);//紀錄頁id
					RMC._BACKID=RMC._NOWID;
					if(RMC._PAGE_EVENT['hidebefore'][RMC._BACKID]!=undefined){
						eval(RMC._PAGE_EVENT['hidebefore'][RMC._BACKID]+"();");
					}
					if(RMC._PAGE_EVENT['showbefore'][id]!=undefined){
						eval(RMC._PAGE_EVENT['showbefore'][id]+"();");
					}
					$('#'+id).removeClass('display-none').addClass('animated slideInRight');
					//$('#'+RMC._NOWID).removeClass("display-show").addClass('animated slideOutLeft');
					$('#'+RMC._NOWID).removeClass("display-show");
					/*
					if($('#'+id+' .header').attr('data-position')=="true") $('#'+id+' .header').css('position','absolute'); 
					if($('#'+RMC._NOWID+' .header').attr('data-position')=="true") $('#'+RMC._NOWID+' .header').css('position','absolute');
					$('#'+id).css({left:RMC._SW+'px','z-index':3,'display':''}).animate({left:'0px'},800,function(){
						if($('#'+this.id+' .header').attr('data-position')=="true") $('#'+this.id+' .header').css('position','fixed');
						//alert(RMC._PAGE_EVENT['show'][id]);
						if(RMC._PAGE_EVENT['show'][id]!=undefined){
							//alert(RMC._PAGE_EVENT['show'][id]);
							eval(RMC._PAGE_EVENT['show'][id]+"();");
						}
						
					});
					var ll='-'+RMC._SW+'px'; 
					$('#'+RMC._NOWID).css({'z-index':2}).animate({left:ll},800,function(){
						$(this).css('display','none');
						if(RMC._PAGE_EVENT['hide'][RMC._BACKID]!=undefined){
							eval(RMC._PAGE_EVENT['hide'][RMC._BACKID]+"();");
						}
					});
					*/
				}else{//alert(id);
					//返回
					RMC._TOTAL_PAGE.push(id);//紀錄頁id
					if(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]!=undefined){
						eval(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]+"();");
					}
					if(RMC._PAGE_EVENT['showbefore'][id]!=undefined){
						eval(RMC._PAGE_EVENT['showbefore'][id]+"();");
					}
					$('#'+id).css({left:'-'+RMC._SW+'px','z-index':3,'display':''}).animate({left:'0px'},800,function(){
						if($('#'+this.id+' .header').attr('data-position')=="true") $('#'+this.id+' .header').css('position','fixed');
						if(RMC._PAGE_EVENT['show'][id]!=undefined){
							eval(RMC._PAGE_EVENT['show'][id]+"();");
						}
					});
					$('#'+RMC._NOWID).css({'z-index':2}).animate({left:RMC._SW+'px'},800,function(){
						$(this).css('display','none');
						if(RMC._PAGE_EVENT['hide'][RMC._NOWID]!=undefined){
							eval(RMC._PAGE_EVENT['hide'][RMC._NOWID]+"();");
						}
					});
				}
				RMC._NOWID=id;
			}
		},
		//上一頁
		backPage:function(){RMC.backpage();},
		backpage:function(){
			if(RMC._BACKID!=''){
				//RMC._TOTAL_PAGE.push(id);//移除最後一頁
				if(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]!=undefined){
					eval(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]+"();");
				}
				if(RMC._PAGE_EVENT['showbefore'][RMC._BACKID]!=undefined){
					eval(RMC._PAGE_EVENT['showbefore'][id]+"();");
				}
				if($('#'+RMC._BACKID+' .header').attr('data-position')=="true") $('#'+RMC._BACKID+' .header').css('position','absolute'); 
				if($('#'+RMC._NOWID+' .header').attr('data-position')=="true") $('#'+RMC._NOWID+' .header').css('position','absolute');
				
				var ll='-'+RMC._SW+'px';
				$('#'+RMC._BACKID).css({left:ll,'z-index':3,'display':''}).animate({left:'0px'},800,function(){
					if($('#'+this.id+' .header').attr('data-position')=="true") $('#'+this.id+' .header').css('position','fixed');
					if(RMC._PAGE_EVENT['show'][RMC._BACKID]!=undefined){
						eval(RMC._PAGE_EVENT['show'][RMC._BACKID]+"();");
					}
				});
				$('#'+RMC._NOWID).css({'z-index':2}).animate({left:RMC._SW+'px'},800,function(){
					$(this).css('display','none');
					if(RMC._PAGE_EVENT['hide'][RMC._NOWID]!=undefined){
						eval(RMC._PAGE_EVENT['hide'][RMC._NOWID]+"();");
					}
				});
				var id=RMC._BACKID;
				RMC._BACKID=RMC._NOWID;
				RMC._NOWID=id;
			}
		},
		//載入page
		loadpage:function(url,id){
			
		},
		load_file:function(name){
			$.get("notification.html", function(data) {
				//alert("Data Loaded: " + data); // 執行會跳出 Data Loaded: hello word 的視窗
				//$('body').append(data);
				//alert();
				//showAlert();
				
				if(!document.getElementById('loadpage')){
					$('body').append('<span id="loadpage" style="display:none;"></span>');
				}
				$('#loadpage').append(data);
				$('#loadpage .page').each(function(){
					var id=$(this).attr('id');
					if(id==undefined) $(this).remove();
					else{
						var html=$(this).html();
						$(this).remove();
						$('body').append('<div class="page" id="'+id+'" style="display:none;">'+html+'</div>');
					}
					
				});
				alert('load finish!!');
				alert($('body').html());
			});
			//var html = document.open('notification.html');
			//alert(html.innerHTML);
			//return false;
			//document.getElementById('hi").innerHTML = html;
		},
		//swipe event
		swipe:function(name,type,fn){
			if(type=='left'){alert('left');
				$('#'+name).on('swipeleft',function(e){
					alert('left');
				});
				//$('#'+name).swipe();
				/*if(document.getElementById(name)){
					$('#'+name).css({left:'-'+RMC._SW+'px','z-index':2,'display':''}).animate({left:'0px'},500);
					$('#'+RMC._NOWID).animate({left:RMC._SW+'px','z-index':1},500,function(){
						$(this).css('display','none');
					});
					RMC._BACKID=RMC._NOWID;
					RMC._NOWID=name;
				}*/
			}else{
				$('#'+name).on('swiperight',function(e){
					alert('right');
				});
			}
		},
		//執行cordova
		runCordova:function(){
			document.addEventListener("deviceready", RMC.deviceReady, false);
		},
		//cordova執行完成
		deviceReady:function(){
			this._CORDOVA_STATUS=true;
		},
		//加入事件
		add_evnet:function(type,id,fun){
			this._PAGE_EVENT[type][id]=fun;
		},
		on:function(id,type,fun){
			switch(type)
			{
				case 'tap':
				case 'click':
					$('#'+id).swipe({
						tap:fun,threshold:50	
					});
					break;
				default:break;
			}

		},
		tap:function(id,fun){
			$('#'+id).swipe({
				tap:fun,
				threshold:50
			});
		},
		click:function(id,fun){
			$('#'+id).swipe({
				tap:fun,
				threshold:50
			});
		}
};
//cordova 參數
$(document).ready(function(){
	RMC.create();
	//document.addEventListener("deviceready",deviceReady,false);
	//
});
