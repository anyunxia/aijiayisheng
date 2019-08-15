// 获取当前时间
const getNowDate = (type) => {
    var weekItem = ["日","一","二","三","四","五","六"];
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var week = date.getDay();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    var nowDate;
    switch(type){
        case "date":
            nowDate = year + "-" + month + "-" + day;
            break;
        case "dateTime":
            nowDate = year + "年" + month + "月" + day + "日" + " " + "星期" + weekItem[week] + " " + hours +":" + minutes + ":" + seconds;
            break;
        default:
            nowDate = year + "年" + month + "月" + day + "日" + " " + "星期" + weekItem[week] + " " + hours +":" + minutes + ":" + seconds;
        break;
    }
    return nowDate;
};

export default getNowDate;