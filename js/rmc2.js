var RMC={
		_SH:0,//視窗寬度
		_SW:0,//視窗高度
		_NOWID:'',//現在使用的ID
		_PAGE_STORE:[],//頁的紀錄
		_CORDOVA_STATUS:false,//cordova status
		_PAGE_EVENT:{'hidebefore':{},'hide':{},'showbefore':{},'show':{}},//事件 
		create:function(){
			RMC._SW=$(window).width();
			RMC._SH=$(window).height();
			var HP=false;//header position
			var FP=false;//footer position
			
			var i=0;
			$('.page').each(function(){
				var CH=RMC._SH;
				var chf=false;
				++i;
				//$(this).addClass("display-none");
				$(this).attr('class','page display-none');
				$(this).css({'width':RMC._SW+'px','height':RMC._SH+'px','overflow':'hidden'});
				if(i==1) {
					RMC._NOWID=this.id;
					RMC._PAGE_STORE.push(this.id);
				}
				var content=$(this).find('.content');
				var header=$(this).find('.header');
				var footer=$(this).find('.footer');
				HP=header.attr('data-position');
				if(HP){
					//$(this).find('.header').css('position','fixed');
					//header.css('position','fixed');
					//header.addClass("fixed");
					//header.attr("class","header fixed");
					HP=header.outerHeight(true);
					CH -=HP;
					//content.css('margin-top',HP+'px');
					chf=true;
				}
				FP=footer.attr('data-position');
				if(FP){
					FP=footer.outerHeight(true);
					CH -=FP;
					//content.css('margin-bottom',FP+'px');
					FP=RMC._SH-FP;
					chf=true;
					//footer.css({'position':'fixed','left':'0px','top':FP+'px'});
					//footer.addClass('fixed');
					//footer.addClass("to-bottom");
					//footer.attr("class","footer fixed to-bottom");
				}
				if(chf){
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}
				/*if(content){
					if(chf){
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}*/
				//RMC._PAGENUM++;
			});
			//$('#'+RMC._NOWID).removeClass("display-none");
			//$('#'+RMC._NOWID).addClass("display-show");
			$('#'+RMC._NOWID).attr('class','page display-show');
			
			RMC.runCordova();
		},
		changePage:function(id){RMC.changepage(id);},
		changepage:function(id){
			window.location.hash=id;
			this._PAGE_STORE.push(id);
			var tmp='#'+RMC._NOWID;
			//$('#'+RMC._NOWID).attr('class','page display-none');
			$(tmp).attr('class','page fadeOut');
			RMC._NOWID=id;
			$('#'+id).attr('class','page slideInRight');
			setTimeout(function(){
				//alert(id);
				//alert($('#'+id).outerWidth(true));
				//alert($('body').outerWidth(true));
				$('#'+id).attr('class','page display-now'); 
				//$(tmp).attr('class','page display-none');
			},1200);
		},
		backPage:function(){RMC.backpage();},
		backpage:function(){
			var tmp='#'+RMC._NOWID;
			$(tmp).attr('class','page display-show');
			//$('#'+RMC._NOWID).attr('class','page display-none');
			this._PAGE_STORE.pop();
			RMC._NOWID=this._PAGE_STORE[this._PAGE_STORE.length-1];
			$('#'+RMC._NOWID).attr('class','page slideInLeft');
			window.location.hash=RMC._NOWID;
			setTimeout(function(){
			//	$('#'+RMC._NOWID).attr('class','page display-now');
				$(tmp).attr('class','page hidden');
			},1200);
			//var tmp=this._PAGE_STORE.pop();
			//alert(tmp);
		}
};
//cordova 參數
$(document).ready(function(){
	RMC.create();
});