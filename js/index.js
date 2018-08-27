
var page = new Page();
var util = new UTIL();



var lotteryPageInfo={
		indexBg:null,//"./image/bg1-1.png",//默认背景图 为null则不显示
		indexVideo:"./image/bgvideo.mp4?ver=3",//默认背景video 为null则不显示
		openingTitle:"./image/title.png",//首屏的中间标题图
		lotteryLevel:[
			{
				name:"一等奖",//奖项名称
				round:1,//第几轮（不需要改)
				step1:{
					title:"./image/level1-1.png",
					icon:"./image/level7-icon.png" ,//标题下方附带的图片ICON 不用则Null
					ani:'zoomIn'},//开场标题图及CSS动画名称
				step2:{
					bg:null,//"./image/bg1-2.png",//背景图，无则null
					title:"./image/level1-1.png",ani:'bounceInLoop'//抽奖中的标题图及CSS动画名称
				},
				users:[//这里为此奖项的每轮抽奖的人数，有多少个就增加多少个{name:""}
					{name:""},{name:""},{name:""},{name:""},{name:""},
				],
			},
			{
				name:"二等奖",
				round:1,
				step1:{title:"./image/level2-1.png",ani:'zoomInDown'},
				step2:{
					bg:null,
					title:"./image/level2-1.png",ani:'bounceInLoop'
				},
				users:[
					{name:""},{name:""},{name:""},{name:""},{name:""},
					{name:""},{name:""},{name:""},{name:""},{name:""},
				],
			},
			{
				name:"三等奖",
				round:1,
				step1:{title:"./image/level3-1.png",ani:'bounceIn'},
				step2:{
					bg:null,
					title:"./image/level3-1.png",ani:'bounceInLoop'
				},
				users:[
					{name:""},{name:""},{name:""},{name:""},{name:""},
					{name:""},{name:""},{name:""},{name:""},{name:""},
					{name:""},{name:""},{name:""},{name:""},{name:""},
					{name:""},{name:""},{name:""},{name:""},{name:""},
				],
			},
			{
				name:"特别奖",
				round:1,
				step1:{title:"./image/level6-1.png",ani:'rubberBand'},
				step2:{
					bg:null,
					title:"./image/level6-1.png",ani:'bounceInLoop'
				},
				users:[
					{name:""}
				],
			},
		],
	};


function reRandUsers(){

	for( var i = 0 ; i < users.length ; i++ ){
		var goIdx = util.CRand(0,users.length-1);
		var temp = users[i];
		users[i] = users[goIdx];
		users[goIdx] = temp;
	}
}





function Page(){
	this.app= null;
}

Page.prototype.loaded= function(){

	this.initLotteryUsers();

	document.body.onblur=function(e){
		util.showDom('noactive');
	};
	document.body.onfocus=function(e){
		util.hideDom('noactive');
	};


	document.onkeyup= function(e){
		var key = e.key.toLowerCase();
		// console.log(key);
		
		if( key === 'enter'){
			page.app.goLottery();
		}else{
			try{
				var num = +key;
				if(isNaN(num) === false ){
					if(num > lotteryPageInfo.lotteryLevel.length ){return;}
					page.changeLottery(num);
				}
			}catch(ex){
				console.log(ex.message);
			}
		}

	};




	this.app = new Vue({
	  el: '#app',
	  data: {
	  	openingTitle:lotteryPageInfo.openingTitle,
	  	indexVideo:lotteryPageInfo.indexVideo,
	    lineHeight:"col-5",
	    state:'opening',//index:首页,run:抽奖中,result:抽奖完毕
	    stateStep:"",//showTitle:显示标题

	    indexBg:lotteryPageInfo.indexBg,
	    curLottery:lotteryPageInfo.lotteryLevel[0],
	    
			toStop:-1,
			stopStep:[33,66,120,140,180,200,400,700,800],
			stopTime:0,
	  },
	  methods:{
		  	clear:function(){

		  		this.stopStep=[];
		  		var tt=33;
		  		for( var i = 0 ; i < 15; i++ ){
		  			this.stopStep.push(tt);
		  			tt+=(12);
		  			tt=tt>200?200:tt;
		  		}
		  		// console.log(this.stopStep);

		  		this.toStop=-1;
		  		if( this.randTimer ){
						clearInterval(this.randTimer);
	        	this.randTimer = null;
	        }
		  	},


	  		getRandUser: function(){
					var user= users[ util.CRand(0,users.length-1) ];
					return user;
				},
				
				setShowUser:function(idx,user){
					this.curLottery.users[idx].name = user.name;
					this.curLottery.users[idx].pid = user.pid;
					this.curLottery.users[idx].dep = user.dep;
				},
				stopLottery:function(){

					if( this.randTimer ){
						clearInterval(this.randTimer);
	        	this.randTimer = null;
	        }

	        //获取获奖用户
  			  var winners = page.runLottery(this.curLottery.name, this.curLottery.round++);

        	for( var i = 0 ; i < winners.length; i++ ){
        		this.setShowUser( i, winners[i] );
        	} 		 	
        	this.state='result';
				},
				runRandTimer:function(){
					var self=this;
					if( users.length <= 0 ){
	  	  			alert('没有用户可以抽奖啦');
	  	  			return;
	  	  		}

	  	  		//开启定时器，进行滚动
	          self.randTimer = setInterval(function(){
	          	for( var i = 0 ; i < self.curLottery.users.length ;i++ ){
	          		self.setShowUser( i, self.getRandUser() );
	          	}
	          },33);

	          self.state = 'run';

				},
	  	  goLottery: function() {
	  	  	var self = this;
	  	  	if( self.state === 'index' ){
	  	  		this.runRandTimer();
	        }else if( self.state === 'run' ){
	        	self.stopLottery();
	        }else if( self.state === 'result' ){
	        	this.runRandTimer();
	        }

        },
	  },
	});

	util.showDom('body');

};

/**
 * 进行一次抽奖
 */
Page.prototype.runLottery= function(type, roundNo){

	//获取本轮抽奖的用户数量
	var winnerCount = this.app.curLottery.users.length;
	//取出中奖用户
	var winners= this.getNewWinners(winnerCount);
	if(!winners){
		alert('没有用户中奖了');
		return null;
	}

	//将得奖用户列表保存下来
	var winnerSave = util.getLocalStorage('result');
	if( !winnerSave[type] ){ winnerSave[type]=[];}
	winnerSave[type].push(winners);
	util.setLocalStorage('result', winnerSave );

	return winners;

};

/**
 * 获取规定人数的中奖者名单
 * @param  {[type]} needWinners 需要获得几个中奖者
 * @return {[type]}             [description]
 */
Page.prototype.getNewWinners= function(needWinners){
	var winners = [];
	if( !users || users.length <= 0 ){
		return null;
	}
	var winnerSave = util.getLocalStorage('winner');
	if( !winnerSave.users ){winnerSave.users=[];}

	//由于users在初始化的时候已经随机过，所以只需要从栈顶拿出需要中奖的用户数量就可以了
	for( var i = 0 ; i < needWinners ; i++ ){
		if( !users[0]  ){
			break;
		}
		winners.push(users[0]);
		winnerSave.users.push(users[0]);
		users.splice(0,1);
	}

	util.setLocalStorage('winner', winnerSave);


	//再随机一次排列
	reRandUsers();

	return winners;
};



/**
 * 初始化抽奖玩家列表（去除过去中奖的用户，然后进行随机排列）
 * @return {[type]} [description]
 */
Page.prototype.initLotteryUsers= function(){

	var i = 0;
	var j = 0;

	//将已中奖者删除
	var winner = util.getLocalStorage('winner');
	if( winner && winner.users ){
		for(  i = 0 ; i < winner.users.length ; i++ ){
			for(  j = 0 ; j < users.length ; j++ ){
				if( winner.users[i].pid === users[j].pid ){
					users.splice(j,1);
					break;
				}
			}
		}
	}


	//对现在的用户进行一次随机排列
	reRandUsers();

};


Page.prototype.changeLottery= function(id){

	if(id===0){
		this.app.state = 'opening';
		return;
	}
	this.app.curLottery = lotteryPageInfo.lotteryLevel[id-1];

	//标准是5个一列，特殊情况为4个一列
	var colCount=5;
	switch(id){
		case 4:
		case 5:{colCount=4;}break;
	}


	var dom = util.getDom('box-font-height');
	var  h = dom.offsetHeight;
	// console.log("自动计算高度:" + h);
	util.getDom('box-users').style.height=h*colCount+30+"px";

	// var padding=0;
	// if( this.app.curLottery.users.length/colCount === 2 ){
	// 	// padding=30;
	// }
	// util.getDom('box-users').style.paddingLeft=padding+"%";
	// util.getDom('box-users').style.paddingRight=padding+"%";

	this.app.state = 'index';
	this.app.stateStep='showTitle';
	this.app.clear();
};


window.onload = function(){
	if(location.search.toLowerCase().indexOf('auto') >= 0 ){
		util.getDom('class-style').className='screenAuto';
	}	
	page.loaded();
};



