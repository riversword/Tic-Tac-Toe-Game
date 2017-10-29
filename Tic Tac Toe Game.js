/*
  code by riversword
  Copyright ©2017 riversword. All rights reserved.
*/
$(document).ready(function(){
	
	var InfoTrs=$('.vsInfo tr'),a=[],b=[],p1Ws=0,cWs=0,p2Ws=0;
	var lastWinner='player1',f,fOwner,s,sOwner,curTurn,curPointer,gameMode='player1 VS computer',isWin,cMap=[];
	var per=[],com=[],roomLeft=[0,1,2,3,4,5,6,7,8],cent=[4],jiao=[0,2,6,8],winWay=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],victoryBox=[];
	
	for(var i=0;i<3;i++){
		a[i]=$(InfoTrs[i].getElementsByTagName('td')[1]);
		b[i]=$(InfoTrs[i].getElementsByTagName('td')[0]);
	}

	readyStart();

	$('.gameMap table td').click(function(){
		if(gameMode=='player1 VS computer'){
			if($(this).html()==''){
				$(this).html(a[0].html());
				per.push(parseInt(this.id));
				delFAll(parseInt(this.id));
				hasWin();

				if(!isWin){//人未赢
					if(isFulled()){
						$('.tipInfo p').html("It's a tie.");
						$('.tipInfo button:eq(0)').addClass('disappear');
						$('.tipInfo button:eq(1)').removeClass('disappear');
						$('.cover').removeClass('disappear');
					}else{//人未赢，且棋盘未满才执行电脑下棋
						comBrain();
						hasWin();
						if(!isWin){//电脑是否赢
							if(isFulled()){
							$('.tipInfo p').html("It's a tie.");
							$('.tipInfo button:eq(0)').addClass('disappear');
							$('.tipInfo button:eq(1)').removeClass('disappear');
							$('.cover').removeClass('disappear');
							}
						}
					}
				}
				
			}
		}else{
			//player1 VS player2模式
			if($(this).html()==''){
				$(this).html(curPointer);
				hasWin();
				if(!isWin){
					if(isFulled()){
						$('.tipInfo p').html("It's a tie.");
						$('.tipInfo button:eq(0)').addClass('disappear');
						$('.tipInfo button:eq(1)').removeClass('disappear');
						$('.cover').removeClass('disappear');
					}
				}
				nextTurn();//curTurn切换
			}
		}
		
	});

	//每次切换游戏模式，或改变棋子样式都需要重新开始游戏（胜负记录也要清空）
	a[0].click(function(){
		if($(this).html()=="o"){
			a[0].html("x");
			a[1].html('o');
			a[2].html('o');
		}else{
			a[0].html("o");
			a[1].html('x');
			a[2].html('x');
		}
		clearRecord();
		readyStart();
	});
	a[1].click(function(){
		if($(this).html()=="o"){
			a[0].html("o");
			a[1].html('x');
			a[2].html('x');
		}else{
			a[0].html("x");
			a[1].html('o');
			a[2].html('o');
		}
		clearRecord();
		readyStart();
	});
	a[2].click(
		function(){
		if($(this).html()=="o"){
			a[0].html("o");
			a[1].html('x');
			a[2].html('x');
		}else{
			a[0].html("x");
			a[1].html('o');
			a[2].html('o');
		}
		clearRecord();
		readyStart();
	});

	//鼠标悬停在computer/player2时，显示提示可切换模式
	b[1].mouseover(function(){
		$('.vsInfo div.changeMode').removeClass("disappear");
		$(this).mouseout(function(){ //这里的this指向b[1]
			$('.vsInfo div.changeMode').addClass("disappear");
			$('.vsInfo div.changeMode').mouseover(function(){
				$(this).removeClass("disappear"); //这里的this指向$('.vsInfo div.changeMode')
				$(this).mouseout(function(){
					$(this).addClass("disappear");
				});
			});
		});
	});

	b[2].mouseover(function(){
		$('.vsInfo div.changeMode').removeClass("disappear");
		$(this).mouseout(function(){
		$('.vsInfo div.changeMode').addClass("disappear");
		$('.vsInfo div.changeMode').mouseover(function(){
			$(this).removeClass("disappear");
			$(this).mouseout(function(){
				$(this).addClass("disappear");
			});
		});
	});
	});
	//点击切换模式
	b[1].click(function(){
		$('.vsInfo tr:eq(2)').removeClass("disappear");//元素被设置为display:none;后，元素仍存在，获取元素时仍须将其算在内。
		$('.vsInfo tr:eq(1)').addClass("disappear");
		$('.changeMode p').html('click to "person VS computer"');
		clearRecord();
		readyStart();
	});
	b[2].click(function(){
		$('.vsInfo tr:eq(1)').removeClass("disappear");
		$('.vsInfo tr:eq(2)').addClass("disappear");
		$('.changeMode p').html('click to "person VS person"');
		clearRecord();
		readyStart();
	});
	
	//点击play again 重新开始
	$('.tipInfo button').click(function(){
		//隐藏cover层
		readyStart();
	});

	function readyStart(){
		
		$('.tipInfo button:eq(0)').removeClass('disappear');
		$('.tipInfo button:eq(1)').addClass('disappear');
		$('.tipInfo p').html('The winner is <span></span>');//清空上一次的胜利者信息
		$('.cover').addClass('disappear');

		//清空游戏地图格子
		for(var i=0;i<9;i++){
			$('.gameMap table td').html('');
			cMap[i]='';
		}
		per=[],com=[],roomLeft=[0,1,2,3,4,5,6,7,8],cent=[4],jiao=[0,2,6,8],winWay=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
		if($('.vsInfo tr:eq(2)').hasClass('disappear')){
			//true,即当前为player1 VS computer
			gameMode='player1 VS computer';
			if(lastWinner=='player1'){
				
				fOwner='player1',f=a[0].html();
				sOwner='computer',s=a[1].html();
			}else{
				fOwner='computer',f=a[1].html();
				sOwner='player1',s=a[0].html();
				comBrain();
			}
		}else{
			//false,即当前为player1 VS player2
			gameMode='player1 VS player2';
			if(lastWinner=='player1'){
				
				fOwner='player1',f=a[0].html();
				sOwner='player2',s=a[2].html();
			}else{
				fOwner='player2',f=a[2].html();
				sOwner='player1',s=a[0].html();
			}
			curTurn=fOwner,curPointer=f;
		}

	}

	//判断是否有胜利者产生
	function hasWin(){
		isWin=false;
		if($('.gameMap table td').eq(0).html()==$('.gameMap table td').eq(1).html() && $('.gameMap table td').eq(1).html()==$('.gameMap table td').eq(2).html() && $('.gameMap table td').eq(1).html()!=''){
			//console.log('第一行');
			if($('.gameMap table td').eq(0).html()==f){
				lastWinner=fOwner;
			}else{
				lastWinner=sOwner;
			}
			isWin=true;
			showWinner();
		}
		if($('.gameMap table td').eq(3).html()==$('.gameMap table td').eq(4).html() && $('.gameMap table td').eq(4).html()==$('.gameMap table td').eq(5).html() && $('.gameMap table td').eq(4).html()!=''){
			//console.log('第二行');
			if($('.gameMap table td').eq(3).html()==f){
				lastWinner=fOwner;
			}else{
				lastWinner=sOwner;
			}
			isWin=true;
			showWinner();
		}
		if($('.gameMap table td').eq(6).html()==$('.gameMap table td').eq(7).html() && $('.gameMap table td').eq(7).html()==$('.gameMap table td').eq(8).html() && $('.gameMap table td').eq(7).html()!=''){
			//console.log('第三行');
			if($('.gameMap table td').eq(6).html()==f){
				lastWinner=fOwner;
			}else{
				lastWinner=sOwner;
			}
			isWin=true;
			showWinner();
		}
		if($('.gameMap table td').eq(0).html()==$('.gameMap table td').eq(3).html() && $('.gameMap table td').eq(3).html()==$('.gameMap table td').eq(6).html() && $('.gameMap table td').eq(3).html()!=''){
			//console.log('第一列');
			if($('.gameMap table td').eq(0).html()==f){
				lastWinner=fOwner;
			}else{
				lastWinner=sOwner;
			}
			isWin=true;
			showWinner();
		}
		if($('.gameMap table td').eq(1).html()==$('.gameMap table td').eq(4).html() && $('.gameMap table td').eq(4).html()==$('.gameMap table td').eq(7).html() && $('.gameMap table td').eq(4).html()!=''){
			//console.log('第二列');
			if($('.gameMap table td').eq(1).html()==f){
				lastWinner=fOwner;
			}else{
				lastWinner=sOwner;
			}
			isWin=true;
			showWinner();
		}
		if($('.gameMap table td').eq(2).html()==$('.gameMap table td').eq(5).html() && $('.gameMap table td').eq(5).html()==$('.gameMap table td').eq(8).html() && $('.gameMap table td').eq(5).html()!=''){
			//console.log('第三列');
			if($('.gameMap table td').eq(2).html()==f){
				lastWinner=fOwner;
			}else{
				lastWinner=sOwner;
			}
			isWin=true;
			showWinner();
		}
		if($('.gameMap table td').eq(0).html()==$('.gameMap table td').eq(4).html() && $('.gameMap table td').eq(4).html()==$('.gameMap table td').eq(8).html() && $('.gameMap table td').eq(4).html()!=''){
			//console.log('左上角斜');
			if($('.gameMap table td').eq(0).html()==f){
				lastWinner=fOwner;
			}else{
				lastWinner=sOwner;
			}
			isWin=true;
			showWinner();
		}
		if($('.gameMap table td').eq(2).html()==$('.gameMap table td').eq(4).html() && $('.gameMap table td').eq(4).html()==$('.gameMap table td').eq(6).html() && $('.gameMap table td').eq(4).html()!=''){
			//console.log('右上角斜');
			if($('.gameMap table td').eq(2).html()==f){
				lastWinner=fOwner;
			}else{
				lastWinner=sOwner;
			}
			isWin=true;
			showWinner();
		}
	}

	function showWinner(){
		switch(lastWinner){
				case 'player1':p1Ws++;
					$('.vsInfo table td').eq(2).html(p1Ws+' win');
					$('.tipInfo p span').html(lastWinner);
					$('.cover').removeClass('disappear');//弹出play again的窗口；
					break;
				case 'computer':cWs++;
					$('.vsInfo table td').eq(5).html(cWs+' win');
					$('.tipInfo p span').html(lastWinner);
					$('.cover').removeClass('disappear');
					break;
				case 'player2':p2Ws++;
					$('.vsInfo table td').eq(8).html(p2Ws+' win');
					$('.tipInfo p span').html(lastWinner);
					$('.cover').removeClass('disappear');
					break;
			}
	}

	//清空游戏记录
	function clearRecord(){
		lastWinner='player1';
		p1Ws=0,cws=0,p2Ws=0;
		$('.vsInfo table td').eq(2).html(p1Ws+' win');
		$('.vsInfo table td').eq(5).html(cWs+' win');
		$('.vsInfo table td').eq(8).html(p2Ws+' win');
	}

	function nextTurn(){
		//首先判断游戏模式
		if(gameMode=='player1 VS computer'){
			//判断当前的curTurn是
			if(curTurn=='player1'){
				curTurn='computer',curPointer=a[1].html();
			}else{
				curTurn='player1',curPointer=a[0].html();
			}
		}else{
			if(curTurn=='player1'){
				curTurn='player2',curPointer=a[2].html();
			}else{
				curTurn='player1',curPointer=a[0].html();
			}
		}
	}

	function isFulled(){
		var result=true;
		for(var i=0;i<9;i++){
			if($('.gameMap table td').eq(i).html()==''){
				result=false;
				break;
			}
		}
		return result;
	}

	//电脑的下棋策略
	function comBrain(){
		var step4j;
		//这是电脑的第三步棋及以后几步，中间位置必然已被占
		if(com.length>1){
			//电脑先下或是人先下都是如此处理
				if(willWin(com,per)){
					//console.log('我赢了！');
					var num2=Math.floor(Math.random()*victoryBox.length);
					$('.gameMap table td').eq(victoryBox[num2]).html(a[1].html());
					com.push(victoryBox[num2]);
					delFAll(victoryBox[num2]);
				}else if(willWin(per,com)){
					//console.log('人要赢，电脑第三步及以后');
					var num2=Math.floor(Math.random()*victoryBox.length);
					$('.gameMap table td').eq(victoryBox[num2]).html(a[1].html());
					com.push(victoryBox[num2]);
					delFAll(victoryBox[num2]);
				}else if(jiao.length>0){//还有角，则下角
					//console.log('电脑第三步及以后，随机下角上');
					var num2=Math.floor(Math.random()*jiao.length);
					$('.gameMap table td').eq(jiao[num2]).html(a[1].html());
					com.push(jiao[num2]);
					delFAll(jiao[num2]);
				}else{//随便空位，下一个子
					//console.log('电脑第三步及以后，随机下个地方');
					var num2=Math.floor(Math.random()*roomLeft.length);
					$('.gameMap table td').eq(roomLeft[num2]).html(a[1].html());
					com.push(roomLeft[num2]);
					delFAll(roomLeft[num2]);
				}
		}
		//这是电脑的第二步棋
		if(com.length==1){
			if(per.length==1){//电脑先下，c1角,p1
				if(per[0]==4){//若p1下在中间，c1角,p1中
					//则电脑下到四角,c1角,p1中,c2角
					step4j=jiao[Math.floor(jiao.length*Math.random())];
					$('.gameMap table td').eq(step4j).html(a[1].html());//电脑将第2子下到三角中的一个
					com.push(step4j);
					delFAll(step4j);
					//还剩2角
				}else{//c1角,p1(角/边)
					//电脑下到中间，c1角,p1(角/边),c2中
					$('.gameMap table td').eq(4).html(a[1].html());//电脑下中间
					com.push(4);
					delFAll(4);//从数组中删除中间位置
				}
			}else{//人先下,p1(中/角/边),c1(中/角),p2(中/角/边)，  p1(中),c1(角)或p1(角),c1(中)或p1(边),c1(角)
				//判断p是否下一步可赢(即横、竖、斜上有2子，且无我子)
				if(willWin(per,com)){//为何判断失败，第8中方案
					//为何判断失败，第8中方案
					//console.log('人会赢,电脑第二步');
					
					var num1=Math.floor(Math.random()*victoryBox.length);
					$('.gameMap table td').eq(victoryBox[num1]).html(a[1].html());
					com.push(victoryBox[num1]);
					delFAll(victoryBox[num1]);
				}else if(cent.length==1){//中间位置空着就下中间
					//console.log('电脑第二步，下中间');
					$('.gameMap table td').eq(4).html(a[1].html());
					com.push(4);
					delFAll(4);
				}else{//下在角上
					//console.log('电脑第二步，随机下角上');
					var num1=Math.floor(Math.random()*jiao.length);
					$('.gameMap table td').eq(jiao[num1]).html(a[1].html());
					com.push(jiao[num1]);
					delFAll(jiao[num1]);
				}
			}
		}
		//这是电脑的第一步棋
		if(com.length==0){
			if(per.length==0){//是电脑先下，c1角
				step4j=jiao[Math.floor(jiao.length*Math.random())];
				$('.gameMap table td').eq(step4j).html(a[1].html());//电脑将棋下到四角中的一个
				com.push(step4j);
				delFAll(step4j);
			}else{//人先下，p1(中/角/边),c1(中/角)； p1(中),c1(角)或p1(角),c1(中)或p1(边),c1(角)
				//判断p1将棋落在何处
				switch(per[0]){
					case 0:
					case 2:
					case 6:
					case 8:$('.gameMap table td').eq(4).html(a[1].html());//电脑将棋下到中间
						com.push(4);
						delFAll(4);//delOne(roomLeft,4);//从数组中删除4
						break;
					default:step4j=jiao[Math.floor(jiao.length*Math.random())];
						$('.gameMap table td').eq(step4j).html(a[1].html());//电脑将棋下到四角中的一个
						com.push(step4j);
						delFAll(step4j);
				}
			}
		}
		
	}

	function delOne(arr,y){//删除数组arr中的y元素
		var ind=arr.indexOf(y);
		if(ind!=-1){
			arr.splice(ind,1);
		}
	}
	function delFAll(y){
		delOne(roomLeft,y);
		delOne(cent,y);
		delOne(jiao,y);
	}
	
	//判断当前是否可以下一棋胜利
	function willWin(arr,arg){
		//数组arr中的元素,每两个形成一个组合。arr是player1下的位置,arg是computer下的位置
		victoryBox=[];//每次调用该函数要将victoryBox初始化
		var arr2=[[]],box=[];
		for(var i=0;i<arr.length-1;i++){
			for(var j=i+1;j<arr.length;j++){
				box=[];
				box.push(arr[i]);
				box.push(arr[j]);
				arr2.push(box);
			}
		}
		
		//获得了组合arr2,再做判断是否具有胜利条件？可不可以在获得组合的过程中，判断是否具有胜利条件呢？(筛选组合)
		var canVictory=false;
		for(var i=1;i<arr2.length;i++){//arr的第一个元素是空数组
			//console.log('arr2['+i+']='+arr2[i]);
			if(inTheWay(arr2[i])!=-1){
				var has=true;
				for(var j=0;j<arg.length;j++){
					if(winWay[inTheWay(arr2[i])].indexOf(arg[j]) !=-1){//元素arg[j]在该方法中(已经阻挡了对手)
						//console.log('arg['+j+']='+arg[j]);//这一句为何不起作用
						has=false;//在该方法中没有胜利位置
						break;
					}
				}
				//console.log('has='+has);
				if(has){
					var victory=winWay[inTheWay(arr2[i])];
					delOne(victory,arr2[i][0]);
					delOne(victory,arr2[i][1]);
					//console.log('victory='+victory);
					victoryBox.push(victory[0]);//victory[0]即胜利位置
					canVictory=true;
				}
			}else{
				//console.log('arr2['+i+']='+arr2[i]+'不在方法中');
			}
			
		}
		//判断组合arr2是否在8种方法中，同时arg中没有元素在该方法中，返回该种方法及胜利位置，若有多个(2个)则返回多个
		return canVictory;//返回能否胜利
	}
	
	function inTheWay(arr){
		var way=-1;
		for(var i=0;i<winWay.length;i++){
			if(winWay[i].indexOf(arr[0])!=-1 && winWay[i].indexOf(arr[1])!=-1){
				way=i;
				break;
			}
		}
		return way;
	}

});