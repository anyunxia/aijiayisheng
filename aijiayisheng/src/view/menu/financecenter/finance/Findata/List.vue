<template>
    <div class="list">
        <!-- 商品头部菜单 -->
            <div class="list-operation list-opera">
               <div class="category">
                <span style="font-size:14px;margin-right: 8px;">所属单位</span>
                <el-select v-model="commodityck" size="mini" placeholder="请选择" class="el-select-input" @change="handlePublishtype">
                    <el-option
                    v-for="item in commodity"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> 
                </div>
             
                 <!-- <span>时间</span>
                <el-select v-model="shipmentsck" size="mini" placeholder="请选择" class="el-select-input" @change="handlePublishtype">
                    <el-option
                    v-for="item in shipments"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>  -->
                <div class="category">
                    <span style="font-size:14px;margin-right: 8px;">时间</span>
                    <el-select v-model="hxzbstatus" size="small" placeholder="请选择" class="el-select-input" @change="handleselectBtn">
                        <el-option
                        v-for="item in shipments"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
               
                 <div v-if="yearBtn" class="category category2">
                        <el-date-picker
                            v-model="yeardate"
                            size="small"
                            type="year"
                            placeholder="选择年">
                         </el-date-picker>
                    <el-button type="primary" size="small" @click="handleyearDate">确认</el-button> 
                </div>
                <div v-if="monthBtn" class="category category3">
                        <el-date-picker
                            v-model="monthdate"
                            size="small"
                            type="month"
                            placeholder="选择月"
                            >
                             
                        </el-date-picker>
                    <el-button type="primary" size="small" @click="handlemonthDate">确认</el-button> 
                </div>
               
                <div v-if="customBtn">
                        <el-date-picker
                            v-model="customdate"
                            size="small"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            >
                        </el-date-picker>
                    <el-button type="primary" size="small" @click="handlecustomDate">确认</el-button> 
                </div>  
        </div>   

        <!-- 列表区域 -->
        <div class="list-table">
            <el-table border highlight-current-row size="small" v-loading="loading" :data="tableData">
                <el-table-column align="center" label="序号" type="index">
                    <template slot-scope="scope">{{ scope.$index + (page.page - 1) * page.limit + 1 }}</template>
                </el-table-column>
                <el-table-column align="center" label="订单编号" show-overflow-tooltip>
                     <template slot-scope="scope">{{scope.row.facilityName ? scope.row.facilityName : "--"}}</template>                    
                </el-table-column>
                <el-table-column align="center" label="消费账号" show-overflow-tooltip>
                     <template slot-scope="scope">{{scope.row.facilityCommodityMoney ? scope.row.facilityCommodityMoney : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="商品" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.facilityConveyMoney ? scope.row.facilityConveyMoney : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="支付时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.facilityCreatedate">{{scope.row.facilityCreatedate|dateFormat}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单金额" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.facilityKc ? scope.row.facilityKc : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="实付金额" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.facilityKc ? scope.row.facilityKc : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="380">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-share" v-permission="['query']" @click="handleSelect(scope.$index, scope.row.facilityId)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页区域 -->
        <div class="list-page">
            <el-pagination
                :total="page.total"
                :page-size="page.limit"
                :current-page="page.page"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
        <!-- 弹窗区域 -->
        <el-dialog center top="5vh" :visible="dialog.visible" :fullscreen="dialog.fullscreen" :close-on-click-modal="false" @close="closeDialog">
            <Select ref="selectDialog" v-if="dialog.select" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Select>
        </el-dialog>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import Select from "./Select";
import permission from "@/directive/permission/index.js";
import { parseTime } from "@/static/js/common/common.js";
import moment from 'moment';
import {getDay, Appendzero, getNowFormatDate} from "@/static/js/common/common.js";
export default {
    directives: {
        permission
    },
    components: {
        Select
    },
    data() {
        return{
            hxzbstatus: "",
            yearBtn:false,
            monthBtn:false,
            customBtn:false,
            yeardate: "",
            monthdate: "",
            customdate: "",
            index:false,
            facilityIsputaway:1,
            idList:"",
            dataKey: [],
            tableData: [{
                facilityName:"1",
                facilityCreatedate:1563171440,
                
            },{
                facilityName:"2",
                facilityCreatedate:1563171440,
                
            },],
            loading: false,
            page: {
                page: 1,
                limit: 10,
                total: 0,//总条数
            },
            dialog: {
                fullscreen: false,
                visible: false,
                select: false,
            },
            hxzbdate: "",
            hxzbStartdate:"",
            hxzbEnddate:"",
            commodityck:"",
            shipmentsck:"",
            commodity: [{
                value: '',
                label: '全部'
                }, {
                value: '1',
                label: 'A医院'
                }, {
                value: '2',
                label: 'B医院'
                }
            ],
            shipments: [{
                value: '1',
                label: '年'
                }, {
                value: '2',
                label: '月'
                }, {
                value: '3',
                label: '自定义'
                }
            ]
        }
    },
    filters:{
        dateFormat(val){
            if (!val) {
                return false;
            } 
            return parseTime(val);
        }
    },
    methods: {
         //阻止冒泡
        stopbubbling1(e){
            e.stopPropagation();
        },
         //获取自定义选中时间
        // handlehxzbDate(e){
        //     e.stopPropagation();
        //     var arr = this.hxzbdate
        //     var dateStart = new Date(arr[0])
        //     var dateEnd = new Date(arr[1])
        //     this.hxzbStartdate = Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) 
        //     //console.log(this.hxzbStartdate)
        //     this.hxzbEnddate = Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate())
        //     //console.log(this.hxzbEnddate)  
        //     this.getListData()          
        // },
        renderView() {
            this.getListData();
        },
        getListData() {
            // this.loading = true;
            // var data = {
            //     startdate: this.hxzbStartdate,
            //     enddate: this.hxzbEnddate,
            //     commodityck:this.commodityck,
            //     shipmentsck:this.shipmentsck,
            //     page: this.page.page,
            //     row: this.page.limit,
            //     timeStamp: Date.parse(new Date()) //年月日
            // };
            // var config = {
            //     type: 5,
            //     name: "facility/querylist",
            //     data: data,
            //     model: "Policydoc",
            //     controller: "get_list",
            // };
            // web(config).then((response) => {
            //     if(response){
            //         console.log(response.data)
            //         this.tableData = response.data.data;
                     
            //         this.page.total = response.data.total;
            //         console.log(this.tableData)
            //         this.loading = false;
            //     }
            // });
        },
        handleyearDate(){
            
           this.yeardate = moment().startOf('year').format("YYYY")
           console.log(this.yeardate)
        },
        handlemonthDate(){
            this.monthdate = moment().startOf('month').format("YYYY-MM")
            console.log(this.monthdate )
        },
        handlecustomDate(){
            // this.customdate = moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD");
            // console.log(this.customdate )
            var arr = this.customdate
            var dateStart = new Date(arr[0])
            var dateEnd = new Date(arr[1])
            this.hxzbStartdate = Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) 
            this.hxzbEnddate = Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate())
            console.log(this.hxzbStartdate)
            console.log(this.hxzbEnddate)  
        //     this.getListData()       
        },
         //核心指标选中项发生改变
        handleselectBtn(val){
            if(val == "1"){//年
                this.yearBtn = true,
                this.monthBtn = false,
                this.customBtn = false
                this.yeardate = moment().startOf('year').format("YYYY")
                // this.hxzbStartdate =  moment().day(moment().day() - 1).startOf('day').format("YYYY-MM-DD HH:mm:ss");
                // this.hxzbEnddate = moment().day(moment().day() - 1).endOf('day').format("YYYY-MM-DD HH:mm:ss");
                // console.log(this.hxzbStartdate)
                // console.log(this.hxzbEnddate)
            }else if(val == "2"){//月
               // var timestamp = Date.parse(time);时间转时间戳
                this.yearBtn = false,
                this.monthBtn = true,
                this.customBtn = false,
                this.hxzbStartdate = moment().startOf('week').format("YYYY-MM-DD HH:mm:ss")
                this.hxzbEnddate = moment().endOf('week').format("YYYY-MM-DD HH:mm:ss")
                // console.log( Date.parse(start) )//时间戳
                // console.log( Date.parse(end) )//时间戳
            }else if(val == "3"){//自定义
                this.yearBtn = false,
                this.monthBtn = false,
                this.customBtn = true,
                this.hxzbStartdate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")
                this.hxzbEnddate = moment().endOf('month').format("YYYY-MM-DD HH:mm:ss")
            }else if(val == "自定义"){
                this.hxzbBtn = true
            }
            this.getListData()
        },
        handleSelect(key, id) {
            this.dialog.select = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.selectDialog.loadComponent(id);
            },100);
        },
        handleRefresh() {
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.limit = 10;
            this.page.total = 0;
            this.getListData();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this.handleRefresh()
        },
        handleSizeChange(limit) {
            this.page.limit = limit;
            this.handleRefresh()
        },
        submitDialog() {
            this.closeDialog();
            this.handleRefresh()
        },
        closeDialog() {
            this.dialog.fullscreen = false;
            this.dialog.visible = false;
            this.dialog.select = false;
        },
         // 处理选中状态
        handlePublishtype(){
            this.handleRefresh()
        },
        submitDialog() {
            this.closeDialog();
            this.handleRefresh();
        }
    },
    //  created(){
    //     this.hxzbStartdate = getDay(0)
    //     this.hxzbEnddate = getDay(0)
    //     this.hxzbdate = [this.hxzbStartdate, this.hxzbEnddate]
    // },
    mounted() {
        this.renderView();
    }
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/list.css");
    /* .list .el-date-editor{
        width:250px !important;
    } */
</style>
