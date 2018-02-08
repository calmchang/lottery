

var page = new Page();
var util = new UTIL();


function Page(){
	this.app= null;
}

Page.prototype.loaded= function(){


	var winnerSave = util.getLocalStorage('result');
	if(!winnerSave)return;

	var oldWinner = util.getLocalStorage('winner');
	var total = 0;
	var results=[];

	var allUsers=[];

	for( var key in winnerSave ){

		var type = winnerSave[key];
		var info={name:key,count:0};
		for( var i = 0 ; i < type.length; i++ ){
			info.count+=type[i].length;
			total+=type[i].length;
		}
		allUsers.push(info);

		results.push({
			name:key,
			rounds:winnerSave[key]
		});
	}

	this.app = new Vue({
	  el: '#app',
	  data: {
	  	results:results,
	  	oldWinnersCount:total,
	  	desInfo:allUsers
	  },
	  methods:{
		  	btnRefresh:function(){
		  		location.reload();
		  	},
				btnReset:function(){

					var r = confirm('确认重置所有数据?');
					if( r === true){
						util.setLocalStorage('result',null);
						util.setLocalStorage('winner',null);
						alert('重置完毕');
					}
				}
	  },
	});

	util.showDom('body');

};



window.onload = function(){
		page.loaded();
};