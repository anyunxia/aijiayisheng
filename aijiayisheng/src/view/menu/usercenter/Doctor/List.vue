<template>
    <div class="list">
            <!-- 头部菜单 -->
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增账号</el-button>
                 <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDeletes" v-permission="['delete']">批量删除</el-button>
                <el-col :span="6">
                    <span>医生状态</span>
                    <el-select v-model="accountState" size="small" placeholder="请选择" class="el-select-input" @change="handlestatus">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <span>审核结果</span>
                    <el-select v-model="auditStatus" size="small" placeholder="请选择" class="el-select-input" @change="handlestatus">
                        <el-option
                            v-for="item in resultOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-input v-model.trim="searchCriteria" size="small" placeholder="搜索账号" clearable class="other-input">
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                    </el-input>
                </el-col>
            </el-row>      
            <!-- 列表区域 -->
            <div class="list-table">
                <el-table border highlight-current-row size="small" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="selection"></el-table-column>
                    <el-table-column align="center" label="序号" type="index">
                        <template slot-scope="scope">{{ scope.$index + (page.page - 1) * page.limit + 1 }}</template>
                    </el-table-column>
                    <el-table-column align="center" label="用户id" show-overflow-tooltip width="170">
                        <template slot-scope="scope">
                            <span v-if="scope.row.doctorSjh" v-text="scope.row.doctorSjh"></span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="姓名" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.doctorXm" v-text="scope.row.doctorXm"></span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="创建时间" show-overflow-tooltip width="170">
                        <template slot-scope="scope">
                            <span v-if="scope.row.doctorCreatedate">{{scope.row.doctorCreatedate|dateFormat}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="最后登录时间" show-overflow-tooltip width="170">
                        <template slot-scope="scope">
                            <span v-if="scope.row.doctorZhdlsj">{{scope.row.doctorZhdlsj|dateFormat}}</span>
                            <span v-else>--</span>    
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.doctorZhzt==1">正常</span>
                            <span v-else-if="scope.row.doctorZhzt==2">冻结</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="center" label="审核" show-overflow-tooltip>   
                        <template slot-scope="scope"> 
                            <span v-if="scope.row.doctorShzt==1">待审核</span>
                            <span v-else-if="scope.row.doctorShzt==2">未通过</span>
                            <span v-else-if="scope.row.doctorShzt==3">已通过</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="360">
                        <template slot-scope="scope">     
                            <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.doctorId)" v-permission="['query']">查看</el-button>
                            <el-button type="success" size="mini" icon="el-icon-edit" @click="handleUpdatesel(scope.$index, scope.row.doctorId)" v-permission="['update']">编辑</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row.doctorId)">冻结</el-button>
                            <el-button type="warning" size="mini" icon="el-icon-share" @click="handleSend(scope.$index, scope.row.doctorId)">审核</el-button>
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
                <Create ref="createDialog" v-if="dialog.create" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Create>
                <Select ref="selectDialog" v-if="dialog.select" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Select>
                <Updatesel ref="updateDialog" v-if="dialog.updatesel" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Updatesel>
                <Update ref="updateDialog" v-if="dialog.update" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Update>
                <Send ref="sendDialog" v-if="dialog.Send" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Send>
             </el-dialog>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import Update from "./Update";
import Updatesel from "./Updatesel";
import Create from "./Create";
import Select from "./Select";
import Send from "./Send";
import permission from "@/directive/permission/index.js";
import { parseTime } from "@/static/js/common/common.js";
export default {
    directives: {
        permission
    },
    components: {
        Update,
        Select,
        Updatesel,
        Create,
        Send
    },
    data() {
        return{
            innerVisible: false,
            accountState: "",
            searchCriteria: "",
            auditStatus: "",
            idList:"",
            dataKey: [],
            tableData: [],
            loading: false,
            options: [
                {
                value: '',
                label: '全部'
                },
                {
                value: '1',
                label: '正常'
                },
                {
                value: '2',
                label: '冻结'
                }
            ],
            resultOptions: [
                {
                value: '',
                label: '全部'
                },
                {
                value: '1',
                label: '待审核'
                },
                {
                value: '2',
                label: '未通过'
                },
                {
                value: '3',
                label: '已通过'
                }

            ],
            page: {
                page: 1,       
                limit: 10,
                total: 0,//每页的总条数
            },
            dialog: {
                fullscreen: false,
                visible: false,
                update: false,
                create: false,
                select: false,
                updatesel: false,
                Send: false
            }
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
        renderView() {     
            this.getListData();
        },
        getListData() {
            this.loading = true;
            var data = {
                accountState: this.accountState,
                auditStatus: this.auditStatus,
                searchCriteria: this.searchCriteria,
                page: this.page.page,
                row: this.page.limit,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "doctor/querylist",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                    this.tableData = response.data.data;
                    this.page.total = response.data.total;
                    this.loading = false;
                }else{
                    this.tableData = [];
                    this.page.total = 0;
                    this.loading = false;
                }
            });
        },
        //当选择项发生变化时会触发该事件
        // handleSelectionChange(data) {
        //     this.dataKey = "";
        //     data.map((item, key)=>{
        //         if((key + 1) == data.length){
        //             this.dataKey += item.doctorId;
        //         }else{
        //             this.dataKey += item.doctorId + ",";
        //         }
        //     });
        // },
        handleSearch() {
            this.dataKey = [];
            this.tableData = [];
            this.accountState = null;
            this.getListData();
        },
        handleSelect(key, id) {
            this.dialog.select = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.selectDialog.loadComponent(id);
            },100);
        },
        handleUpdatesel(key, id) {
            this.dialog.updatesel = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.updateDialog.loadComponent(id);
            },100);
        },
        handleUpdate(key, id) {
            this.dialog.update = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.updateDialog.loadComponent(id);
            },100);
        },
         handleCreate() {
            this.dialog.create = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                //父组件触发子组件中的方法
                this.$refs.createDialog.loadComponent();
            },100);
        },
        handleSend(key, id) {
            this.dialog.Send = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.sendDialog.loadComponent(id);
            },100);
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this.handleSearch();
        },
        handleSizeChange(limit) {
            this.page.limit = limit;
            this.handleSearch();
        },
        handleSelectionChange(data) {
            this.idList = data
        },
         //批量删除
        handleDeletes() {
            for(var i=0; i < this.idList.length; i++){
               for(let key in this.idList[i]){
                    this.idList[i]['timeStamp'] =  Date.parse(new Date())
                    key == 'doctorId' ?this.idList[i][key] : delete this.idList[i][key]
                }
            }
            if(this.idList.length > 0){
                this.$confirm('此操作将会删除选中项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   var config = {
                        type: 5,
                        name: "doctor/delete",
                        data:  this.idList,
                        model: "Policydoc",
                        controller: "del",
                    };
                    web(config).then((response) => {
                         console.log(response.data)
                        if(response.data.status == 200){
                           this.$message.success(response.data.msg);
                           this.handleRefresh();
                        }else{
                            this.$message.error(response.data.msg);
                        }
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");        
                });
            }else{
                this.$message.warning("请先选择要删除的选项");
            }
        },
        //刷新
        handleRefresh() {
            this.searchCriteria = "";
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.limit = 10;
            this.page.total = 0;
            this.getListData();
        },
        submitDialog() {
            this.closeDialog();
            this.handleRefresh();
        },
        closeDialog() {
            this.dialog.fullscreen = false;
            this.dialog.visible = false;
            this.dialog.update = false;
            this.dialog.create = false;
            this.dialog.select = false; 
            this.dialog.updatesel = false; 
            this.dialog.Send = false; 
        },
        handlestatus(){
            this.handleRefresh()
        }
    },
    mounted() {
        this.renderView();
    }
}
</script>

<style scoped>
    @import url("../../../../static/css/menu/list.css");
</style>
