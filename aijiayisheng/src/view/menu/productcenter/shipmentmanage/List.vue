<template>
    <div class="list">
        <!-- 商品头部菜单 -->
         <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="7">
               <el-date-picker
                    v-model="hxzbdate"
                    size="mini"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                 <el-button type="primary" size="mini" @click="handlehxzbDate($event)">确认</el-button> 
            </el-col>
            <el-col :span="6">
                <span>商品</span>
                <el-select v-model="commodityck" size="mini" placeholder="请选择" class="el-select-input" @change="handlePublishtype">
                    <el-option
                    v-for="item in commodity"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> 
            </el-col>
            <el-col :span="6">
                 <span>发货状态</span>
                <el-select v-model="shipmentsck" size="mini" placeholder="请选择" class="el-select-input" @change="handlePublishtype">
                    <el-option
                    v-for="item in shipments"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> 
           </el-col>
            <el-col :span="5">
                <el-input v-model.trim="searchName" size="mini" placeholder="搜索标题" clearable class="other-input">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </el-col>
        </el-row>   

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
                        <!-- 调取接口 facilityIsputaway改成scope.row.facilityIsputaway -->
                        <el-button type="warning" size="mini" icon="el-icon-star-off" @click="handleSend(scope.$index, scope.row.facilityId)" v-if="facilityIsputaway==1">发货</el-button>
                        <el-button type="info" disabled size="mini" icon="el-icon-star-off" v-else-if="facilityIsputaway==2">已发货</el-button>
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
            <Update ref="updateDialog" v-if="dialog.update" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Update>
            <Select ref="selectDialog" v-if="dialog.select" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Select>
        </el-dialog>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import Update from "./Update";
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
        Update,
        Select,
    },
    data() {
        return{
            index:false,
            searchName: null,
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
                update: false,
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
                label: '血压仪'
                }, {
                value: '2',
                label: '血糖仪'
                }, {
                value: '3',
                label: '血氧仪'
                }, {
                value: '4',
                label: '体温计'
                }, {
                value: '5',
                label: '心电仪'
                }
            ],
            shipments: [{
                value: '',
                label: '全部'
                }, {
                value: '1',
                label: '已发货'
                }, {
                value: '2',
                label: '未发货'
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
        handlehxzbDate(e){
            e.stopPropagation();
            var arr = this.hxzbdate
            var dateStart = new Date(arr[0])
            var dateEnd = new Date(arr[1])
            this.hxzbStartdate = Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) 
            //console.log(this.hxzbStartdate)
            this.hxzbEnddate = Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate())
            //console.log(this.hxzbEnddate)  
            this.getListData()          
        },
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
            //     searchName: this.searchName,
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
        //上下架
        handleSend(row) {
            this.dialog.update = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.updateDialog.loadComponent(id);
            },100);
        },
        handleSearch() {
            this.dataKey = [];
            this.tableData = [];
            this.getListData();
        },
        handleSelect(key, id) {
            this.dialog.select = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.selectDialog.loadComponent(id);
            },100);
        },
        handleUpdate(key, id) {
            this.dialog.update = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.updateDialog.loadComponent(id);
            },100);
        },
        handleRefresh() {
            this.searchName = null;
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.limit = 10;
            this.page.total = 0;
            this.getListData();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this.handleSearch();
        },
        handleSizeChange(limit) {
            this.page.limit = limit;
            this.handleSearch();
        },
        submitDialog() {
            this.closeDialog();
            this.handleSearch()
        },
        closeDialog() {
            this.dialog.fullscreen = false;
            this.dialog.visible = false;
            this.dialog.update = false;
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
     created(){
        this.hxzbStartdate = getDay(0)
        this.hxzbEnddate = getDay(0)
        this.hxzbdate = [this.hxzbStartdate, this.hxzbEnddate]
    },
    mounted() {
        this.renderView();
    }
}
</script>

<style scoped>
    @import url("../../../../static/css/menu/list.css");
    .list .el-date-editor{
        width:250px !important;
    }
</style>
