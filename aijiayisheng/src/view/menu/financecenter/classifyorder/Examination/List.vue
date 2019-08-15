<template>
    <div class="list">
        <!-- 头部菜单 -->
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="7">
                    <el-date-picker
                        v-model="flddalldate"
                        size="small"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker> 
                <el-button type="primary" size="small"  @click="handleflddDate($event)">确认</el-button>  
            </el-col>
            <el-col :span="6">
                <span>状态</span>
                <el-select v-model="status" size="small" placeholder="请选择" class="el-select-input" @change="changeSearchSelect">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-input v-model.trim="searchName" size="small" placeholder="请输入订单编号" clearable class="other-input">
                    <el-button slot="append" size="small" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </el-col>
        </el-row> 
            <!-- 列表区域 -->
            <div class="list-table">
                <el-table border highlight-current-row size="small" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column align="center" label="订单编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.classify_ordercode" v-text="scope.row.classify_ordercode"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="消费账号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.classify_account" v-text="scope.row.classify_account"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.classify_commodity" v-text="scope.row.classify_commodity"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="金额" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.classify_money" v-text="scope.row.classify_money"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="实付金额" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.classify_realitymoney" v-text="scope.row.classify_realitymoney"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.classify_ordertype" v-text="scope.row.classify_ordertype"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.classify_state" v-text="scope.row.classify_state"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="center" label="操作" width="320">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.policy_id)">查看</el-button>
                            
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
import power from "@/static/js/common/power.js";
import {Appendzero} from "@/static/js/common/common.js";
import moment from 'moment';
import Select from "./Select";
export default {
    components: {
        Select
    },
    data() {
        return{
            flddalldate: "",
            hxzbStartdate:"",
            hxzbEnddate:"",
            status: "",
            searchName: "",
            dataKey: [],
            options: [{
                value: '',
                label: '全部'
                }, {
                value: '已付款',
                label: '已付款'
                }, {
                value: '待付款',
                label: '待付款'
                }, {
                value: '已取消',
                label: '已取消'
                }, {
                value: '已退款',
                label: '已退款'
                }
            ],
            tableData: [{
                classify_ordercode: "201905201675453498",
                classify_account: "201932424142565463",
                classify_commodity: "第二附属医院;普通号",
                classify_money: "20.00",
                classify_realitymoney: "20.00",
                classify_ordertype: "挂号",
                classify_state: "已支付"


            }],
            loading: false,
            page: {
                page: 1,
                limit: 10,
                total: 0,
            },
            dialog: {
                fullscreen: false,
                visible: false,
                select: false,
            },

        }
    },
    created() {
        const start = new Date();
        const end = new Date();
        this.flddalldate = [start, end];
    },
    methods: {
        stopbubbling1(e){
            e.stopPropagation();
        },
         // 搜索下拉
        changeSearchSelect(val){
            this.getListData()
        },
         //获取选中时间
        handleflddDate(e){
            e.stopPropagation();
            var arr = this.flddalldate
            var dateStart = new Date(arr[0])
            var dateEnd = new Date(arr[1])
            this.hxzbStartdate = Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) + ' ' + Appendzero(dateStart.getHours()) + ':' + Appendzero(dateStart.getMinutes()) + ':' + Appendzero(dateStart.getSeconds());  
            // console.log(this.hxzbStartdate)
            this.hxzbEnddate = Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate()) + ' ' + Appendzero(dateEnd.getHours()) + ':' + Appendzero(dateEnd.getMinutes()) + ':' + Appendzero(dateEnd.getSeconds());  
            // console.log(this.hxzbEnddate)  
            this.getListData()          
        },
        renderView() {
            this.getListData();
        },
        created() {
            var dateStart = new Date(new Date(new Date().toLocaleDateString()).getTime());
            var dateEnd = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
            this.hxzbStartdate = Appendzero(dateStart.getFullYear()) + '-' + (Appendzero(dateStart.getMonth() + 1)) + '-' + Appendzero(dateStart.getDate()) + ' ' + Appendzero(dateStart.getHours()) + ':' + Appendzero(dateStart.getMinutes()) + ':' + Appendzero(dateStart.getSeconds());  
            // console.log(this.hxzbStartdate)
            this.hxzbEnddate = Appendzero(dateEnd.getFullYear()) + '-' + (Appendzero(dateEnd.getMonth() + 1)) + '-' + Appendzero(dateEnd.getDate()) + ' ' + Appendzero(dateEnd.getHours()) + ':' + Appendzero(dateEnd.getMinutes()) + ':' + Appendzero(dateEnd.getSeconds());  
            // console.log(this.hxzbEnddate)  
            this.flddalldate = [this.hxzbStartdate, this.hxzbEnddate ];             
        },
        getListData() {
            // this.loading = true;
            var data = {
                page: this.page.page,
                limit: this.page.limit,
                status: this.status,
                startdate:  this.hxzbStartdate,
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
                    // this.tableData = response.data.data;
                    this.page.total = response.data.total;
                    // this.loading = false;
                }
            });
        },
        handleSelectionChange(data) {
            this.dataKey = "";
            data.map((item, key)=>{
                if((key + 1) == data.length){
                    this.dataKey += item.policy_id;
                }else{
                    this.dataKey += item.policy_id + ",";
                }
            });
        },
        handleSearch() {
            this.loading = true;
            this.dataKey = [];
            this.tableData = [];
            var data = {
                searchName: this.searchName,
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
                    // this.tableData = response.data.data;
                    this.page.total = response.data.total;
                    this.loading = false;
                }
            });
        },
        handleSelect(key, id) {
            this.dialog.select = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.selectDialog.loadComponent(id);
            },100);
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this.getListData();
        },
        handleSizeChange(limit) {
            this.page.limit = limit;
            this.getListData();
        },
        submitDialog() {
            this.closeDialog();
            this.handleRefresh();
        },
        closeDialog() {
            this.dialog.fullscreen = false;
            this.dialog.visible = false;
            this.dialog.select = false;
        },
    },
    mounted() {
        this.renderView();
    }
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/list.css");
    .list .el-date-editor{
        width:250px !important;
    }
</style>
