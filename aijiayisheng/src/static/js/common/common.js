
//获取日期 num：-2前天，-1昨天，0今天，+1明天，+2后天
export function getDay(num){   
    var today = new Date();       
    var nowTime = today.getTime();        
    var ms = 24*3600*1000*num;        
    today.setTime(parseInt(nowTime + ms));        
    var oYear = today.getFullYear();        
    var oMoth = (today.getMonth() + 1).toString(); 
    var oDay = today.getDate().toString();           
    if (oMoth.length <= 1) oMoth = '0' + oMoth;               
    if (oDay.length <= 1) oDay = '0' + oDay;     
    return oYear + "-" + oMoth + "-" + oDay; 
    
}
//获取当前时间的年月日时分秒
export function getNowFormatDate(){
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + h + seperator2 + minute
            + seperator2 + second;
    return currentdate;
}
//时间戳转换成时间
export function formatDateTime(timeStamp){
    var date = new Date();
    date.setTime(timeStamp * 1000); //时间戳为微秒*1,毫秒*1000
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
//日期小于10补0
export function Appendzero(obj){
    if(obj<10) return "0" +""+ obj;
    else return obj;
}

/**
 *Created by wangxiaoxiang on 18/10/27.
 * @param  as parseTime(1167752316309,'{y}-{m}-{d} {h}:{i}:{s}') 
 * @returns "2007-01-02 23:38:36"
 */

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}


