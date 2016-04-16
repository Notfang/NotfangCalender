var solarTerm = new Array("小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至");
var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758);
//公历节日
var sFtvName = new Array("元旦","情人节","妇女节","植树节","消费者权益日","愚人节","劳动节","青年节","护士节","儿童节","建党节","建军节","教师节","孔子诞辰","国庆节","老人节","联合国日","平安夜","圣诞节");
var sFtv = new Array("1-1","2-14","3-8","3-12","3-15","4-1","5-1","5-4","5-12","6-1","7-1","8-1","9-10","9-28","10-01","10-06","10-24","12-24","12-25");
//农历节日
var lFtv = new Array('正月正月','正月十五','五月初五','七月初七','七月十五','八月十五','九月初九','十二月初八','十二月廿四');
var lFtvName = new Array("春节","元宵节","端午节","七夕情人节","中元节","中秋节","重阳节","腊八节","小年");
var lunarStr = new Array('正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月');

var festival = document.getElementsByClassName("festival");
function setSolarFtv(){//写入阳历节日和其他
	var solarM = document.getElementById("selectM").value;
	var solarFont = document.getElementsByClassName("solar");
	for(var i=0;i<solarFont.length;i++){//f记录festival的序号
		for(var f=0;f<sFtv.length;f++){
			if(sFtv[f] == solarM +"-"+ solarFont[i].innerText){
				if(festival[i].innerText.indexOf(sFtvName[f])){//节日不同才能添加
						festival[i].innerText =festival[i].innerText + sFtvName[f];
				}				
			}
		}
		
	}
	
}
function setLunarFtv(){//写入阴历节日
	var lunarFont = document.getElementsByClassName("lunar");
	var lunarM,lunarMLoc,lunarMInStr;
	for(var i=0; i<lunarFont.length; i++){
		for(var j=0; j<lunarStr.length;j++){
			if(lunarFont[i].innerText == lunarStr[j]){
				lunarM = lunarStr[j];//记录本月出现的农历月份
				lunarMLoc = i;//出现的位置
				lunarMInStr = j;
				j = lunarStr.length;//跳出循环
			}
		}
	}
	for(var i=0;i<lunarFont.length;i++){
		for(var j=0;j<lFtv.length;j++){
			if(i<lunarMLoc){//月份出现之前的位置
				if(lunarStr[lunarMInStr-1]+lunarFont[i].innerText == lFtv[j]){
					festival[i].innerText =festival[i].innerText + lFtvName[j];
				}
				
			}else{//月份出现之后
				if(lunarStr[lunarMInStr]+lunarFont[i].innerText == lFtv[j]){
					festival[i].innerText =festival[i].innerText+ " " + lFtvName[j];
				}
			}
			
		}
	}
	//写入除夕
	if(lunarM == "正月"){
		festival[lunarMLoc-1].innerText =festival[lunarMLoc-1].innerText + "除夕";
	}
}


//节气+母亲节+父亲节
function setTerms(){
	var y = document.getElementById("selectY").value;
	var m = document.getElementById("selectM").value-1;
	var term1 = sTerm(y,m*2);
	var term2=sTerm(y,m*2+1);
	//第一个参数为节日日期，格式（m-n），第二个为节日名称
	addSolarFtv((m+1)+"-"+term1,solarTerm[m*2]);
	addSolarFtv((m+1)+"-"+term2,solarTerm[m*2+1]);
	
	//母亲节-五月的第二个星期日	
	if(m+1 == 5){
		//
		var temp=0;
		for(var i=0;i<6;i++){
			if(document.getElementById("solar"+i*7).innerText != ""){
				temp++;
			}
			if(temp == 2){
				festival[i*7].innerText = festival[i*7].innerText+" " +"母亲节";
				break;
			}
		}
	}
	//父亲节是6月第三个周日
	if(m+1 == 6){
		var temp=0;
		for(var i=0;i<6;i++){
			if(document.getElementById("solar"+i*7).innerText != ""){
				temp++;
			}
			if(temp == 3){
				festival[i*7].innerText = festival[i*7].innerText+" " +"父亲节";
				break;
			}
		}
	}
	setSolarFtv();
}
//添加阳历节日，节气以这种方式加入，同时可作为API扩展
function addSolarFtv(time,name){
	sFtv.push(time);
	sFtvName.push(name);
}
//返回某年的第n个节气为几日(从0小寒起算)
function sTerm(y,n) {
   var offDate = new Date((31556925974.7*(y-1900)+sTermInfo[n]*60000)+Date.UTC(1900,0,6,2,5));
   return(offDate.getUTCDate())
}
function cleanFtv(){//清空festival中的内容
	for(var i=0;i<festival.length;i++){		
			festival[i].innerText ="";
		}
		
}
//添加生日或日程
function addThings(){
	var y = document.getElementById("selectY").value;
	var m = document.getElementById("selectM").value-1;
	if(clickID == undefined){
		alert("请先选择日期！");
	}else{
		var addStr = document.getElementById("addStr").value;
		//获取点击的日期的值
		var day = document.getElementById(clickID).innerText.split("\n");
		if(addStr == ""){
			alert("请填写内容！")
		}
		else{
			addSolarFtv((m+1)+"-"+day[0],addStr);
			setSolarFtv();
		}
		
	}
	
	
}
