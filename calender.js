var lunarInfo=new Array(
0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0)
 
var solarMonthDays=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
var Animals=new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪");
var weekStr = new Array('日','一','二','三','四','五','六');
var lunarStr1 = new Array('初','十','廿','卅');
var lunarStr2 = new Array('正','二','三','四','五','六','七','八','九','十','十一','十二');

//获得一个月的天数
function solarOneMonthDays(y,m){
	if(m==1){//对于二月份的天数判断是否是闰年
		var isLeapYear = y%4==0 && (y%100 != 0) || (y%400 == 0);
		return isLeapYear ? 29:28;
	}else{
		return(solarMonthDays[m]);
	}
}
//返回y年闰月的月号，不闰月返回0
function leapMonth(y){
	return(lunarInfo[y-1900]&0xf);
}
//返回y年闰月的天数
function leapDays(y){
	if(leapMonth(y)){//leapMonth返回y年闰月的月号
		return((lunarInfo[y-1900] & 0x10000)? 30: 29);
	}else{
		return (0);
	}
}
//获得农历y年的天数
function lunarYearDays(y){
	var i, sum = 348;
	for(i=0x8000; i>0x8; i>>=1){
		sum+=(lunarInfo[y-1900]&i)?1:0;
	}
	return(sum+leapDays(y));
}
//获得阴历一个月的天数
function lunarMonthDays(y,m){
	return((lunarInfo[y-1900]&(0x10000>>m))?30:29);
}
//确定阳历月第一天的阴历日期
function getLunarDay(solarDayObj){
	var i;
	var tempDays;
	var baseDate = new Date(1900,0,31);
	var offSetDay = (solarDayObj-baseDate)/86400000;//86400000是一天的毫秒数
	for(var i=1900;i<2050&&offSetDay>0;i++){//
		if(offSetDay-lunarYearDays(i)>0){
			offSetDay -= lunarYearDays(i);
			
		}else{
			break;
		}				
	}	
	this.year = i;//农历年份
	leap = leapMonth(this.year);//取得哪个月是闰月
	this.isLeap = false;//表示是否已经进行了闰月操作
	for(i=0;i<12 && offSetDay>0;i++){//以月为单位靠近当天的农历日期
		if(leap>0 && i==leap && this.isLeap == false){//i+1月需要闰月
			this.isLeap = true;
			tempDays = leapDays(this.year);//获得闰月的天数
			i--;//月数退回一个
		}else{
			tempDays = lunarMonthDays(this.year,i+1);//获取农历i+1月的天数
		}
		
		if(this.isLeap == true && i == leap){
			this.isLeap = false;//
		}
		offSetDay -= tempDays;		
	}
	if(offSetDay==0 && leap>0 && i== leap){//offSetDay=0
		if(this.isLeap){
			this.isLeap = false;
		}else{
			this.isLeap = true;
			i--;
		}
	}
	if(offSetDay<0){
		offSetDay += tempDays;
		i--;
	}
	this.month = i+1;//当前阴历月
	this.day = offSetDay+1;//阴历日
}
//获得一个月的日历-类
function getCalender(sY,sM){
	solarDayObj = new Date(sY,sM,1);//sY年sM月的第一天
	this.length = solarOneMonthDays(sY,sM);//获得一个月的天数
	this.firstDayWeek = solarDayObj.getDay();//公历当月1日星期几
	//存储阴历信息的变量
	var lunarY,lunarM,lunarD,lunarIsLeap,lunarMonthLastDay;
	lunarD=1;lunarMonthLastDay=0;
	for(var i=0;i<this.length;i++){//为这个月的每一天确定阴历日期
		if(lunarD>lunarMonthLastDay){
			solarDayObj = new Date(sY,sM,i+1);
			lunarDayObj = new getLunarDay(solarDayObj);//获得农历信息
			lunarY = lunarDayObj.year;
			lunarM = lunarDayObj.month;
			if(lunarM > 12) lunarM = 1;
			lunarD = lunarDayObj.day;
			lunarIsLeap = lunarDayObj.isLeap;
			if(lunarIsLeap)
				lunarMonthLastDay = leapDays(lunarY);
			else
				lunarMonthLastDay = lunarMonthDays(lunarY,lunarM);			
		}
		week = weekStr[(i+this.firstDayWeek)%7];
		this[i] = new calenderDay(sY,sM+1,i+1,week,lunarY,lunarM,lunarD,lunarIsLeap);
		lunarD++;
	}
}
function calenderDay(sY,sM,sD,week,lY,lM,lD,isL){
	this.isToday = false;
    //公历
    this.sYear = sY;
    this.sMonth = sM;
    this.sDay = sD;
    this.week = week;
    //农历
    this.lYear = lY;
    this.lMonth = lM;
    this.lDay = lD;
    this.isLeap = isL;
}
//将日期信息显示到表格中
function drawCanlender(sY,sM){
	//绘制生肖
	SX.innerHTML="【"+Animals[(sY-4)%12]+"】";
	calender = new getCalender(sY,sM);//返回当前月的日历
	var i;//记录6*7的表格的位置
	var cellDay,solarDay,lunarDay;
	var sD;//记录本月日期1~end,不存在的日期的单元格显示为负数
	for(i=0;i<42;i++){
		//cellDay=document.getElementById(i);
		solarDay=document.getElementById("solar"+i);
		lunarDay=document.getElementById("lunar"+i);
		sD =i-calender.firstDayWeek;//i-本月第一天的星期
		if(sD>-1&&sD<calender.length){//sD在本月日期内则绘制			
			solarDay.innerHTML = sD+1;			
			if(calender[sD].lDay == 1){//如果是农历月的第一天，显示月信息
				lunarDay.innerHTML =  '<b>'+(calender[sD].isLeap?'闰':'') + lunarStr2[calender[sD].lMonth-1] + '月'+'</b>';
			}else{//不是第一天显示农历日信息
				var s = function(){
					var str;
					switch(calender[sD].lDay){
						case 10:
						str = "初十";break;
						case 20:
						str = "二十";break;
						case 30:
						str = "三十";break;
						default:
						str = lunarStr1[Math.floor(calender[sD].lDay/10)] + lunarStr2[calender[sD].lDay%10-1];
					}
					return str;
				}();
				lunarDay.innerHTML = s;
			}			
		}else{//非本月日期的单元格
			solarDay.innerHTML="";
			lunarDay.innerHTML="";
		}
	}
}

//当前日期信息
var Today = new Date();
var todayY = Today.getFullYear();
var todayM = Today.getMonth();
var todayD = Today.getDate();
//今天的位置
var firstDay = new Date(todayY,todayM,1);
var row = (todayD-(7-firstDay.getDay())-Today.getDay()-1)/7 + 1;
var col = Today.getDay();
//select变换年份月份后的变化
function changeCalender(){
	var selectY = document.getElementById("selectY").value;
	var selectM = document.getElementById("selectM").value;
	drawCanlender(selectY,selectM-1);
	//写入节日
	cleanFtv();
	setSolarFtv();
	setLunarFtv();
	setTerms();
	//绘制今天的背景色
	setToday(selectY,selectM-1);
	//消除单元格的背景色
	if(clickID != undefined)
		document.getElementById(clickID).style.backgroundColor = "";	
}
//绘制当天的背景属性
function setToday(sY,sM){
	//为今天添加属性
	/*Today = new Date(2016,3,30);
	todayD = Today.getDate();*/
	if(sY == todayY && sM == todayM){		
		var tDiv = document.getElementById("cell"+row+col);
		tDiv.style.backgroundColor = "bisque";
	}else{		
		var tDiv = document.getElementById("cell"+row+col);
		tDiv.style.backgroundColor = "";
		
	}
}
var clickID;
//点击单元格变色
function clickShow(id){
	
	if(clickID != undefined){
		document.getElementById(clickID).style.backgroundColor = "";	
	}
	clickID = id;
	document.getElementById(clickID).style.backgroundColor = "rgba(238, 95, 91, 0.44)";
}
//打开页时,在下拉列表中显示当前年月,并调用自定义函数drawCld(),显示公历和农历的相关信息
function initial() {
	var table = document.getElementById("myTable");
	var selectY = document.getElementById("selectY");
	var selectM = document.getElementById("selectM");
	//将select中的日期设置为系统时间
	selectY.selectedIndex=todayY-1900;;
	selectM.selectedIndex=todayM;
	//将当前的日期传入绘制日历
    drawCanlender(todayY,todayM);
	//写入节日
	setSolarFtv();
	setLunarFtv();
	setTerms();
	setToday(selectY.value,selectM.value-1);
	
}
window.onload = function(){	
	initial();
}
