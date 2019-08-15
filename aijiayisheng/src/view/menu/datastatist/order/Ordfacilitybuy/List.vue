<template>
    <div class="list">
            <!-- 头部菜单 -->
            
            <div class="list-operation list-opera">
                <el-collapse v-model="activeNames">
                    <!-- 订单数据 -->
                    <el-collapse-item name="1">
                        <template slot="title">
                            <div class="category category1">
                                <span>订单数据</span>
                                <el-select v-model="ddsjstatus" size="small" placeholder="请选择" class="el-select-input" @change="handleddsjBtn">
                                    <el-option label="昨日" value="1"></el-option>
                                    <el-option label="7日" value="2"></el-option>
                                    <el-option label="30日" value="3"></el-option>
                                    <el-option label="自定义" value="4"></el-option>
                                </el-select>
                            </div>
                            <div v-if="ddsjBtn" class="category category2">
                                <div @click="stopbubbling1($event)" class="outer">  
                                    <el-date-picker
                                        v-model="ddsjdate"
                                        size="small"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div> 
                                 <el-button type="primary" size="small" @click="handleddsjData($event)">确认</el-button>  
                            </div>
                        </template>
                        <div class="hxzbdata" v-for="(item,index) in ddsjList">
                            <ul>
                                <li v-for="list in item.orderData">
                                    <span>{{list.title}}</span>
                                    <span class="number">{{list.number}}</span>
                                </li>
                            </ul>
                            <p v-for="listnum in item.registnum">
                                <span>{{listnum.title}}</span>
                                <span class="bottomnum">{{listnum.number}}</span>
                            </p>
                        </div>
                        </el-collapse-item>
                        <!-- 订单来源 -->
                        <el-collapse-item name="2">
                            <template slot="title">
                                <div class="category category1">
                                    <span>订单来源</span>
                                    <el-select v-model="ddlystatus" size="small" placeholder="请选择" class="el-select-input" @change="handleddlyBtn">
                                        <el-option label="昨日" value="1"></el-option>
                                        <el-option label="7日" value="2"></el-option>
                                        <el-option label="30日" value="3"></el-option>
                                        <el-option label="自定义" value="4"></el-option>
                                    </el-select>
                                </div>
                                <div  v-if="ddlyBtn" class="category category2">
                                    <div @click="stopbubbling2($event)" class="outer">  
                                        <el-date-picker
                                            v-model="ddlydate"
                                            size="small"
                                            type="daterange"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :default-time="['00:00:00', '23:59:59']">
                                        </el-date-picker>
                                    </div>
                                     <el-button type="primary" size="small" @click="handleddlyData($event)">确认</el-button> 
                                </div>
                            </template>
                            <div class="hxzbdata ddlydata" v-for="(item,index) in ddlyList">
                            <ul>
                                <li v-for="list in item.orderSource">
                                    <span>{{list.title}}</span>
                                    <span class="number">{{list.number}}</span>
                                </li>
                            </ul>
                            <p v-for="listnum in item.registnum">
                                <span>{{listnum.title}}</span>
                                <span class="bottomnum">{{listnum.number}}</span>
                            </p>
                        </div>
                        </el-collapse-item>
                        <!-- 订单指标 -->
                        <el-collapse-item name="3">
                            <template slot="title">
                                <div class="category category1">
                                    <span>订单指标</span>
                                    <el-select v-model="ddzbstatus" size="small" placeholder="请选择" class="el-select-input"  @change="handleddzbBtn">
                                        <el-option label="昨日" value="1"></el-option>
                                        <el-option label="7日" value="2"></el-option>
                                        <el-option label="30日" value="3"></el-option>
                                        <el-option label="自定义" value="4"></el-option>
                                    </el-select>
                                </div>
                                <div v-if="ddzbBtn" class="category category2">
                                    <div @click="stopbubbling3($event)" class="outer">  
                                        <el-date-picker
                                            v-model="ddzbdate"
                                            size="small"
                                            type="daterange"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :default-time="['00:00:00', '23:59:59']">
                                        </el-date-picker>
                                    </div> 
                                     <el-button type="primary" size="small" @click="handleddzbData($event)">确认</el-button> 
                                </div>
                            </template>
                            <div id="myecharts" style="width:800px;height:400px;"></div>
                            <div class="btBox">
                                <div class="btList">
                                    <h3>{{zbsjList.title}}</h3>
                                   
                                        <p v-for="items in zbsjList.list">
                                            <span>{{items.title}}</span><span>{{items.number}}</span>
                                        </p>
                                   
                                </div>
                            </div>
                        </el-collapse-item>
                 </el-collapse>
            </div>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import power from "@/static/js/common/power.js";
import moment from 'moment';
const echarts = require('echarts');
import 'echarts/map/js/china.js';
import {getDay, Appendzero} from "@/static/js/common/common.js";
export default {
    data() {
        return{
            ddsjBtn:false,
            ddlyBtn:false,
            ddzbBtn:false,
            activeNames: ['1','2','3','4'],

            ddsjstatus: "1",
            ddsjStartdate:"",
            ddsjEnddate:"",
            ddsjdate: "",

            ddlystatus: "1",
            ddlyStartdate:"",
            ddlyEnddate:"",
            ddlydate: "",

            ddzbstatus: "1",
            ddzbStartdate:"",
            ddzbEnddate:"",
            ddzbdate: "",

            todayTime:"",
            yesterdayTime: "",
            ddsjList:[{
                "registnum":[
                    {
                        "title" : "订单数" ,
                        "number" : 756935
                    }
                ],
                "orderData":[
                    {
                    "title" : "老客订单数" ,
                    "number" : "2,700"
                    }, 
                    {
                    "title" : "老客订单占比" ,
                    "number" : "56%"
                    },
                    {
                    "title" : "新客订单数" ,
                    "number" : "659"
                    },
                    {
                    "title" : "新客订单占比" ,
                    "number" : '34%'
                    },
                    {
                    "title" : "订单总金额" ,
                    "number" : "00:7:45"
                    }
                ]
            }],
            ddlyList:[{
                "registnum":[
                    {
                        "title" : "IOS用户数",
                        "number" : 13435
                    },
                    {
                        "title" : "Android用户数",
                        "number" : 10723
                    }
                ],
                "orderSource":[
                    {
                    "title" : "Android订单" ,
                    "number" : "1,248"
                    }, 
                    {
                    "title" : "Android订单占比" ,
                    "number" : "11.02%"
                    },
                    {
                    "title" : "IOS订单" ,
                    "number" : "1,400"
                    },
                    {
                    "title" : "IOS订单占比" ,
                    "number" : "45.78%"
                    }
                           
                ]
            }],
            zbsjList:{
                "title":"指标数据",
                "list":[{
                    "title" : "订单总数:" ,
                    "number" : 4000
                    }, 
                    {
                    "title" : "已付款:" ,
                    "number" : 3600
                    },
                    {
                    "title" : "待付款:" ,
                    "number" : 1310
                    },
                    {
                    "title" : "已取消:" ,
                    "number" : 90
                    }]
            }
           
        }
    },
    methods: {
         //阻止冒泡
        stopbubbling1(e){
            e.stopPropagation();
        },
        stopbubbling2(e){
            e.stopPropagation();
        },
        stopbubbling3(e){
            e.stopPropagation();
        },
    //   获取订单数据公共方法  
        getddsjListData(status, startdate, enddate) {
            var data = {
                status: status,
                startdate:  startdate,
                enddate: enddate
            };
            var config = {
                type: 2,
                name: "policydoc_list",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                    // console.log(response.data)
                    // this.tableData = response.data.data;
                    // this.page.total = response.data.total;
                }
            });
        },

//------------订单数据 
        // getddsjListData() {
        //     var data = {
        //         status: this.ddsjstatus,
        //         startdate:  this.ddsjStartdate,
        //         enddate: this.ddsjEnddate
        //     };
        //     var config = {
        //         type: 2,
        //         name: "policydoc_list",
        //         data: data,
        //         model: "Policydoc",
        //         controller: "get_list",
        //     };
        //     web(config).then((response) => {
        //         if(response.data){
        //             // console.log(response.data)
        //             // this.tableData = response.data.data;
        //             // this.page.total = response.data.total;
        //         }
        //     });
        // },
        handleddsjBtn(val){
            if(val==1){//昨日
                this.ddsjBtn = false
                this.ddsjStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
                this.ddsjEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
                console.log(this.ddsjStartdate)
                console.log(this.ddsjEnddate)
            }else if(val==2){//7天
               // var timestamp = Date.parse(time);时间转时间戳
                this.ddsjBtn = false
                this.ddsjStartdate = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss")
                this.ddsjEnddate = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss")
                // console.log( Date.parse(start) )//时间戳 
                // console.log( Date.parse(end) )//时间戳
                console.log( this.ddsjStartdate  ) //标准时间
                console.log( this.ddsjEnddate  ) //标准时间
            }else if(val==3){//本月
                this.ddsjBtn = false
                this.ddsjStartdate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")
                this.ddsjEnddate = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss")
            }else if(val==4){
                this.ddsjBtn = true
            }
             this.getddsjListData(this.ddsjstatus, this.ddsjStartdate, this.ddsjEnddate)
        },
         //订单数据指标自定义选中时间
        handleddsjData(e){
            e.stopPropagation();
            var arr = this.ddsjdate
            var dateStart = new Date(arr[0])
            var dateEnd = new Date(arr[1])
             this.ddsjStartdate=Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) + ' ' + Appendzero(dateStart.getHours()) + ':' + Appendzero(dateStart.getMinutes()) + ':' + Appendzero(dateStart.getSeconds());  
            // console.log(this.ddsjStartdate)
             this.ddsjEnddate=Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate()) + ' ' + Appendzero(dateEnd.getHours()) + ':' + Appendzero(dateEnd.getMinutes()) + ':' + Appendzero(dateEnd.getSeconds());  
        //    console.log(this.ddsjEnddate)  
            this.getddsjListData(this.ddsjstatus, this.ddsjStartdate, this.ddsjEnddate)          
        },
       
    
//------------订单来源 
        handleddlyBtn(val){
            if(val==1){//昨日
                this.ddlyBtn = false
                this.ddlyStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
                this.ddlyEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
                console.log(this.ddsjStartdate)
                console.log(this.ddsjEnddate)
            }else if(val==2){//7天
               // var timestamp = Date.parse(time);时间转时间戳
                this.ddlyBtn = false
                this.ddlyStartdate = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss")
                this.ddlyEnddate = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss")
                // console.log( Date.parse(start) )//时间戳
                // console.log( Date.parse(end) )//时间戳
                console.log( this.ddsjStartdate  ) //标准时间
                console.log( this.ddsjEnddate  ) //标准时间
            }else if(val==3){//本月
                this.ddlyBtn = false
                this.ddlyStartdate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")
                this.ddlyEnddate = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss")
            }else if(val==4){
                this.ddlyBtn = true
            }
             this.getddsjListData(this.ddlystatus, this.ddlyStartdate, this.ddlyEnddate)
        },
         //订单数据指标自定义选中时间
        handleddlyData(e){
            e.stopPropagation();
            var arr = this.ddlydate
            var dateStart = new Date(arr[0])
            var dateEnd = new Date(arr[1])
             this.ddlyStartdate=Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) + ' ' + Appendzero(dateStart.getHours()) + ':' + Appendzero(dateStart.getMinutes()) + ':' + Appendzero(dateStart.getSeconds());  
            // console.log(this.ddsjStartdate)
             this.ddlyEnddate=Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate()) + ' ' + Appendzero(dateEnd.getHours()) + ':' + Appendzero(dateEnd.getMinutes()) + ':' + Appendzero(dateEnd.getSeconds());  
        //    console.log(this.ddsjEnddate)  
            this.getddsjListData(this.ddlystatus, this.ddlyStartdate, this.ddlyEnddate)      
        },
 //------------订单指标 
        handleddzbBtn(val){
            if(val==1){//昨日
                this.ddzbBtn = false
                this.ddzbStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
                this.ddzbEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
            }else if(val==2){//7天
               // var timestamp = Date.parse(time);时间转时间戳       
                this.ddzbBtn = false
                this.ddzbStartdate = Date.parse(moment().startOf('week').format("YYYY-MM-DD HH:mm:ss"))
                this.ddzbEnddate = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss")
                console.log( this.ddzbStartdate )//时间戳
                // console.log( Date.parse(end) )//时间戳
                // var ddzbStartdate = Date.parse(new Date(this.ddzbStartdate));
                // console.log( ddzbStartdate ) //标准时间
                console.log( this.ddzbEnddate  ) //标准时间
            }else if(val==3){//本月
                this.ddzbBtn = false
                this.ddzbStartdate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")
                this.ddzbEnddate = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss")
            }else if(val==4){
                this.ddzbBtn = true
            }
             this.getddsjListData(this.ddzbstatus, this.ddzbStartdate, this.ddzbEnddate)
        },
         //订单数据指标自定义选中时间
        handleddzbData(e){
            e.stopPropagation();
            var arr = this.ddzbdate
            var dateStart = new Date(arr[0])
            var dateEnd = new Date(arr[1])
             this.ddzbStartdate = Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) + ' ' + Appendzero(dateStart.getHours()) + ':' + Appendzero(dateStart.getMinutes()) + ':' + Appendzero(dateStart.getSeconds());  
            // console.log(this.ddsjStartdate)
             this.ddzbEnddate = Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate()) + ' ' + Appendzero(dateEnd.getHours()) + ':' + Appendzero(dateEnd.getMinutes()) + ':' + Appendzero(dateEnd.getSeconds());  
        //    console.log(this.ddsjEnddate)  
            this.getddsjListData(this.ddzbstatus, this.ddzbStartdate, this.ddzbEnddate)   
        }      
    },
    //echarts
    mounted() {
            //订单数据昨日初始开始时间和结束时间
            this.ddsjStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
            this.ddsjEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
            this.getddsjListData(this.ddsjstatus, this.ddsjStartdate, this.ddsjEnddate) 
            //订单来源昨日初始开始时间和结束时间
            this.ddlyStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
            this.ddlyEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
            this.getddsjListData(this.ddlystatus, this.ddlyStartdate, this.ddlyEnddate)
            //订单指标昨日初始开始时间和结束时间
            this.ddzbStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
            this.ddzbEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
            this.getddsjListData(this.ddzbstatus, this.ddzbStartdate, this.ddzbEnddate) 

            this.todayTime = getDay(0)
            this.yesterdayTime = getDay(-1)
                //基于准备好的dom, 初始化echarts实例
            let myChartbt = echarts.init(document.getElementById('myecharts'));
            myChartbt.setOption({
                title: {
                    text: '订单指标',
                    left: 50, //配置title的位置
                    padding: [20,20,50,10], //title的padding值
                    textStyle: {
                        "color": "#8ECBFF"
                    },
		        },
                legend: {
                    left: '30px',
                    top: 'bottom',
                    display: 'block',
                    orient: 'vertical',
                    data: ['已付款', '待付款', '已取消'],
                    textStyle: { //图例文字的样式
                        color: '#8ECBFF',
                        fontSize: 13
                    }
                },
                series: [{
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '57%'],
                    label: { //饼图图形上的文本标签
                        normal: {
                            show: true,
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 13 //文字的字体大小
                            },
                            formatter: '{b}:{c}: ({d}%)',
                        }
                    },
                    data: [{
                        value: 10,
                        name: '已付款',
                        itemStyle: {
                            normal: {
                                color: '#F4AA61'
                            }
                        }
                    }, {
                        value: 32,
                        name: '待付款',
                        itemStyle: {
                            normal: {
                                color: '#4EC7B8'
                            }
                        }
                    }, {
                        value: 10,
                        name: '已取消',
                        itemStyle: {
                            normal: {
                                color: '#90C9F6'
                            }
                        }
                    }]
                }]


            })
        }
    
}

</script>

<style scoped>
    @import url("../../../../../static/css/menu/list.css");
    .list{
        margin: 0px;
        padding: 1%;
        position: relative;
    }
    .hxzbdata ul li{
        width: 19.5%;      
    }
    .hxzbdata ul{
        height:200px;
        }
    .hxzbdata p{
        padding-top:0;
        display: inline-block;
    }
    .ddlydata ul li{
            width: 24.5%;
    }
    #myecharts{
        float:left;
    }
    .letterBox{
        float:right;
        margin:20px 30px 20px 0;
    }
    /* .category4{
       margin-left:70px;
    }
    .category button[data-v-37428210] {
   margin-top:13px;
} */
</style>
