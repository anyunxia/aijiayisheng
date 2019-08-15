<template>
    <div class="list">
            <!-- 头部菜单 -->
            <div class="list-operation list-opera">
                <el-collapse v-model="activeNames">
                    <!-- 核心指标 -->
                    <el-collapse-item name="1">
                        <template slot="title">
                            <div class="category category1">
                                <span>核心指标</span>
                                <el-select v-model="hxzbstatus" size="small" placeholder="请选择" class="el-select-input" @change="handlehxzbBtn">
                                    <el-option label="昨日" value="昨日"></el-option>
                                    <el-option label="7日" value="7日"></el-option>
                                    <el-option label="30日" value="30日"></el-option>
                                    <el-option label="自定义" value="自定义" ></el-option>
                                </el-select>
                            </div>
                            <div v-if="hxzbBtn" class="category category2">
                                <div @click="stopbubbling1($event)" class="outer">  
                                    <el-date-picker
                                        v-model="hxzbdate"
                                        size="small"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div>  
                                <el-button type="primary" size="small" @click="handlehxzbDate($event)">确认</el-button> 
                            </div>
                        </template>
                        <div class="hxzbdata" v-for="(item,index) in hxzbList">
                            <ul>
                                <li v-for="list in item.topList">
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
                    <!-- 用户趋势 -->
                    <el-collapse-item name="2" class="collapse-item2">
                        <template slot="title">
                            <div class="category category1">
                                <span>用户趋势</span>
                                <el-select v-model="yhqsstatus" size="small" placeholder="请选择" class="el-select-input" @change="handleyhqsBtn">
                                    <el-option label="昨日" value="昨日"></el-option>
                                    <el-option label="7日" value="7日"></el-option>
                                    <el-option label="30日" value="30日"></el-option>
                                    <el-option label="自定义" value="自定义"></el-option>
                                </el-select>
                            </div>
                            <div v-if="yhqsBtn" class="category category2">
                                <div @click="stopbubbling2($event)" class="outer">  
                                    <el-date-picker
                                        v-model="yhqsdate"
                                        type="daterange"
                                        size="small"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div>
                                <el-button type="primary" size="small" @click="handleyhqsDate($event)">确认</el-button> 
                            </div>
                            
                        </template>
                        <div class="hxzbdata hxzbdata-p" v-for="(item,index) in hxzbList">
                            <p class="title">每日启动用户中新用户的数量</p>
                            <ul>
                                <li v-for="list in item.centerList">
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
                    <!-- 日注册用户 -->
                    <el-collapse-item name="3" class="hxzbdata-p">
                        <template slot="title">
                            <div class="category category1">
                                <span>日注册用户</span>
                            </div>
                        </template>
                        <p class="title">当前与昨日的新用户数对比</p>
                        <div class="mark">
                            <p class="p1"><span class="s1"></span><span class="paraphrase1">{{todayTime}}</span></p>
                            <p class="p2"><span class="s1 s2"></span><span class="paraphrase2">{{yesterdayTime}}</span></p>
                        </div>
                        <div id="echartContainer" style="height:500px;"></div>
                    </el-collapse-item>
                    <!-- 用户分布图 -->
                    <el-collapse-item name="4" class="collapse-item-map">
                        <template slot="title">
                            <div class="category category1">
                                <span>用户分布图</span>
                            </div>
                        </template>
                        <div id="main"></div>
                        <div class="letterBox">
                            <div class="mapList">
                                <p>
                                    <span>地域分布</span>
                                    <span>启动次数</span>
                                    <span>启动次数占比</span>  
                                </p>
                                <ul>
                                    <li v-for="item in dataList">
                                        <span>{{item.name}}</span>
                                        <span>{{item.value}}</span>
                                        <span>{{item.proportion}}</span>
                                    </li>
                                </ul>
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
import {getDay, Appendzero, getNowFormatDate} from "@/static/js/common/common.js";
export default {
    data() {
        return{
            hxzbBtn:false,
            yhqsBtn:false,
            activeNames: ['1','2','3','4'],
            hxzbstatus: "昨日",
            hxzbStartdate:"",
            hxzbEnddate:"",
            hxzbdate: "",
            yhqsstatus: "昨日",
            yhqsStartdate:"",
            yhqsEnddate:"",
            yhqsdate: "",
            todayTime:"",
            yesterdayTime: "",
            hxzbList:[{
                "registnum":[
                    {
                        "title" : "累计注册量" ,
                        "number" : 756935
                    }
                ],
                "topList":[
                            {
                            "title" : "新用户注册" ,
                            "number" : 120
                            }, 
                            {
                            "title" : "启动注册" ,
                            "number" : "1,000"
                            },
                            {
                            "title" : "启动次数" ,
                            "number" : "9,999"
                            },
                            {
                            "title" : "每次使用时长" ,
                            "number" : "00:07:36"
                            },
                            {
                            "title" : "每人使用时长" ,
                            "number" : "00:12:16"
                            },
                            {
                            "title" : "人均启动次数" ,
                            "number" : 900
                            }
                ],
                "centerList":[
                            {
                            "title" : "新用户注册" ,
                            "number" : 160
                            }, 
                            {
                            "title" : "启动注册" ,
                            "number" : "1,200"
                            },
                            {
                            "title" : "启动次数" ,
                            "number" : "9,000"
                            },
                            {
                            "title" : "每次使用时长" ,
                            "number" : "00:10:36"
                            },
                            {
                            "title" : "每人使用时长" ,
                            "number" : "00:16:15"
                            },
                            {
                            "title" : "人均启动次数" ,
                            "number" : 1000
                            }
                ]
                
            }],
            dataList: [
            
            {"name": '北京', "value": 23,"proportion":"54.3%"},
            {"name": '天津', "value": 24,"proportion":"54.3%"},
            {"name": '上海', "value": 25,"proportion":"54.3%"},
            {"name": '重庆', "value": 28,"proportion":"54.3%"},
            {"name": '河北', "value": 280,"proportion":"54.3%"},
            {"name": '河南', "value": 258,"proportion":"54.3%"},
            {"name": '云南', "value": 567,"proportion":"54.3%"},
            {"name": '辽宁', "value": 46,"proportion":"54.3%"},
            {"name": '黑龙江', "value": 89,"proportion":"54.3%"},
            {"name": '湖南', "value": 467,"proportion":"54.3%"},
            {"name": '安徽', "value": 36,"proportion":"54.3%"},
            {"name": '山东', "value": 364,"proportion":"54.3%"},
            {"name": '新疆', "value": 53,"proportion":"54.3%"},
            {"name": '江苏', "value": 25,"proportion":"54.3%"},
            {"name": '浙江', "value": 786,"proportion":"54.3%"},
            {"name": '江西', "value": 35,"proportion":"54.3%"},
            {"name": '湖北', "value": 352,"proportion":"54.3%"},
            {"name": '广西', "value": 245,"proportion":"54.3%"},
            {"name": '甘肃', "value": 111,"proportion":"54.3%"},
            {"name": '山西', "value": 111,"proportion":"54.3%"},
            {"name": '内蒙古', "value": 333,"proportion":"54.3%"},
            {"name": '陕西', "value": 444,"proportion":"54.3%"},
            {"name": '吉林', "value": 555,"proportion":"54.3%"},
            {"name": '福建', "value": 666,"proportion":"54.3%"},
            {"name": '贵州', "value": 885,"proportion":"54.3%"},
            {"name": '广东', "value": 557,"proportion":"54.3%"},
            {"name": '青海', "value": 877,"proportion":"54.3%"},
            {"name": '西藏', "value": 887,"proportion":"54.3%"},
            {"name": '四川', "value": 877,"proportion":"54.3%"},
            {"name": '宁夏', "value": 887,"proportion":"54.3%"},
            {"name": '海南', "value": 466,"proportion":"54.3%"},
            {"name": '台湾', "value": 785,"proportion":"54.3%"},
            {"name": '香港', "value": 46,"proportion":"54.3%"},
            {"name":"南海诸岛","value":0,"proportion":"54.3%"},
            ]
            
           
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
//--------------------------------获取核心指标选中时间函数
        gethxzbListData() {
            var data = {
                status: this.hxzbstatus,
                startdate: this.hxzbStartdate,
                enddate: this.hxzbEnddate
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
        //核心指标选中项发生改变
        handlehxzbBtn(val){
            if(val == "昨日"){//昨日
                this.hxzbBtn = false
                this.hxzbStartdate =  moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
                this.hxzbEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
                // console.log(this.hxzbStartdate)
                // console.log(this.hxzbEnddate)
            }else if(val == "7日"){//7天
               // var timestamp = Date.parse(time);时间转时间戳
                this.hxzbBtn = false
                this.hxzbStartdate = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss")
                this.hxzbEnddate = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss")
                // console.log( Date.parse(start) )//时间戳
                // console.log( Date.parse(end) )//时间戳
            }else if(val == "30日"){//本月
                this.hxzbBtn = false
                this.hxzbStartdate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")
                this.hxzbEnddate = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss")
            }else if(val == "自定义"){
                this.hxzbBtn = true
            }
            this.gethxzbListData()
        },
         //获取核心指标自定义选中时间
        handlehxzbDate(e){
            e.stopPropagation();
            var arr = this.hxzbdate
            var dateStart = new Date(arr[0])
            var dateEnd = new Date(arr[1])
             this.hxzbStartdate = Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) + ' ' + Appendzero(dateStart.getHours()) + ':' + Appendzero(dateStart.getMinutes()) + ':' + Appendzero(dateStart.getSeconds());  
            // console.log(this.hxzbStartdate)
             this.hxzbEnddate = Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate()) + ' ' + Appendzero(dateEnd.getHours()) + ':' + Appendzero(dateEnd.getMinutes()) + ':' + Appendzero(dateEnd.getSeconds());  
        //    console.log(this.hxzbEnddate)  
            this.gethxzbListData()          
        },

//--------------------------------获取用户趋势选中时间函数       
        getyhqsListData() {
            var data = {
                status: this.yhqsstatus,
                // 转化成时间戳
                // startdate:  Date.parse(this.yhqsStartdate),
                // enddate: Date.parse(this.yhqsEnddate)
                startdate:  this.yhqsStartdate,
                enddate: this.yhqsEnddate
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
        //用户趋势选中项发生改变
        handleyhqsBtn(val){
             if(val == "昨日"){//昨日
                this.yhqsBtn = false
                this.yhqsStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
                this.yhqsEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
            
            }else if(val == "7日"){//7天
               // var timestamp = Date.parse(time);时间转时间戳
                this.yhqsBtn = false
                this.yhqsStartdate  = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss")
                this.yhqsEnddate = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss")
                //console.log( Date.parse(this.yhqsStartdate) )//时间戳
            }else if(val == "30日"){//本月
                this.yhqsBtn = false
                this.yhqsStartdate  = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")
                this.yhqsEnddate = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss")
            }else if(val == "自定义"){
                this.yhqsBtn = true
            }
            this.getyhqsListData()
        },
      
        //获取用户趋势自定义选中时间
        handleyhqsDate(e){
            e.stopPropagation();
            var arr = this.yhqsdate
            var dateStart = new Date(arr[0])
            var dateEnd = new Date(arr[1])
            this.yhqsStartdate = Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) + ' ' + Appendzero(dateStart.getHours()) + ':' + Appendzero(dateStart.getMinutes()) + ':' + Appendzero(dateStart.getSeconds());  
        //  console.log(date_start)
            this.yhqsEnddate = Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate()) + ' ' + Appendzero(dateEnd.getHours()) + ':' + Appendzero(dateEnd.getMinutes()) + ':' + Appendzero(dateEnd.getSeconds());  
        // console.log(date_end)   
            this.getyhqsListData()         
        },
       
    },
    //echarts
    mounted() {
        //核心指标昨日初始开始时间和结束时间
        this.hxzbStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
        this.hxzbEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
        //调用核心指标获取时间段函数
        this.gethxzbListData() 
        //用户趋势昨日初始开始时间和结束时间
        this.yhqsStartdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
        this.yhqsEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
        //调用获取时间段函数
        this.getyhqsListData() 
        //日注册用户今日时间
        this.todayTime = getDay(0)
        //日注册用户昨日时间
        this.yesterdayTime = getDay(-1)
        //基于准备好的dom, 初始化echarts实例
        let myChart = echarts.init(document.getElementById('echartContainer'));
        window.onresize = function () {
            myChart.resize();
        }
        let myChartDt = echarts.init(document.getElementById('main'));
        myChart.setOption({
            tooltip: {
                trigger: 'axis' //通过哪种方式触发tip
            },
            legend: {
                data:['销量']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ["00:00-00:59","03:00-03:59","06:00-06:59","09:00-09:59","12:00-12:59","15:00-15:59","18:00-18:59","21:00-21:59"]
            },
            yAxis : {
                type: 'value'
            },
            series: [{
                name: '2018/03/28',
                type: 'line',
                data: [65, 76, 89, 80, 90, 89, 77,150]
            },
            {
                name: '2018/03/27',
                type: 'line',
                data: [60, 69, 85, 70, 80,67,78,90]
            }]
        })
        myChartDt.setOption({
            tooltip: {
                formatter:function(params,ticket, callback){
                    return params.seriesName+'<br />'+params.name+'：'+params.value
                }
            },
            visualMap: {
                min: 0,
                max: 1500,
                left: 'left',
                top: 'bottom',
                text: ['高','低'],
                inRange: {
                    color: ['#e0ffff', '#006edd']
                },
                show:true
            },
            geo: {
                map: 'china',
                roam: false,
                zoom:1.23,
                label: {
                    normal: {
                        show: true,
                        fontSize:'10',
                        color: 'rgba(0,0,0,0.7)'
                    }
                },
                itemStyle: {
                    normal:{
                        borderColor: 'rgba(0, 0, 0, 0.2)'
                    },
                    emphasis:{
                        areaColor: '#F3B329',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            series : [
                {
                    name: '信息量',
                    type: 'map',
                    geoIndex: 0,
                    data:this.dataList
                }
            ]
        });
    }
    
}

</script>

<style scoped>
    @import url("../../../../../static/css/menu/list.css");
    .hxzbdata-p .title{
        padding-top:0;
        padding-left:31px;
    }
    
    .el-collapse-item__content .letterBox{
        float:right;
        margin-right:20px;
        margin-bottom:50px;
    }
</style>
