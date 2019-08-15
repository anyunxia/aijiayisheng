<template>
    <div class="list">
        <!-- 操作区域 -->
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12">
                <span>位置分类</span>
                <el-select v-model="advertisingLocation" size="small" placeholder="请选择" class="el-select-input" @change="handlePublishtype">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> 
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增广告</el-button>
            </el-col>
            <el-col :span="4"> 
                <el-input v-model.trim="criteria" size="small" placeholder="搜索" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <!-- 列表区域 -->
        <div class="list-table">
            <el-table border highlight-current-row size="small" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column align="center" label="序号" type="index">
                    <template slot-scope="scope">{{ scope.$index + (page.page - 1) * page.limit + 1 }}</template>
                </el-table-column>
                <el-table-column align="center" label="标题" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.advertisingTitle ? scope.row.advertisingTitle : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="描述" show-overflow-tooltip>
                     <template slot-scope="scope">
                            <span v-if="scope.row.advertisingDescribe" v-html="scope.row.advertisingDescribe"></span>
                            <span v-else>--</span>
                           <!-- <span>{{descr}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column align="center" label="位置" show-overflow-tooltip>
                     <template slot-scope="scope">{{scope.row.advertisingLocation ? scope.row.advertisingLocation : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="当前状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.advertisingState"
                            active-color="#13ce66"
                            off-color="#ff4949"
                            :disabled="scope.row.disabled"
                            :active-value="2"
                            :inactive-value="1"
                            @change="changeSwitch (scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="380">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.advertisingId)" v-permission="['query']">查看</el-button>
                        <el-button type="success" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row.advertisingId)" v-permission="['update']">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row.advertisingId)" v-permission="['delete']">删除</el-button>
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
            <Update ref="updateDialog" v-if="dialog.update" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Update>
            <Select ref="selectDialog" v-if="dialog.select" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Select>
        </el-dialog>
    </div>

    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import Select from "./Select";
import Create from "./Create";
import Update from "./Update";
import permission from "@/directive/permission/index.js";
export default {
    directives: {
        permission
    },
    components: {
        Select,
        Create,
        Update
    },
    data() {
        return{
            button: {
                width: 0
            },
            advertisingLocation: "",
            criteria: "",
            descr: "",
            dataKey: [],
            tableData: [],
            loading: false,
            advertisingState:2,
            page: {
                page: 1,
                limit: 10,
                total: 0,
            },
           dialog: {
                fullscreen: false,
                visible: false,
                create: false,
                select: false,
                update: false,
            },
            options: [{
                value: '',
                label: '全部'
                }, {
                value: '用户端首页',
                label: '用户端首页'
                }, {
                value: '用户端健康页',
                label: '用户端健康页'
                }, {
                value: '医生端首页',
                label: '医生端首页'
                }
            ],
        }
    },
    methods: {
         renderView() {
            this.getListData();
        },
        //初始化获取数据
        getListData() {
            this.loading = true;
            var data = {
                page: this.page.page,
                row: this.page.limit,
                advertisingLocation: this.advertisingLocation,
                criteria: this.criteria,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "advertising/querylist",
                data: data,
                model: "Policyana",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                    this.tableData = response.data.data;
                    this.page.total = response.data.total;
                    this.loading = false;
                }
            });
        },
        //列表数据发生改变重新排列k值
        handleSelectionChange(data) {
            this.dataKey = "";
            data.map((item, key)=>{
                if((key + 1) == data.length){
                    this.dataKey += item.advertisingId;
                }else{
                    this.dataKey += item.advertisingId + ",";
                }
            });
        },
        //点击搜索按钮把k值和列表数据清空,重新获取数据
        handleSearch() {
            this.dataKey = [];
            this.tableData = [];
            this.getListData();
        },
        //查看按钮
        handleSelect(key, id) {
            this.dialog.select = true;
            this.dialog.create = false;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.selectDialog.loadComponent(id);
            },100);
        },
        //分页
        handleCurrentChange(page) {
            this.page.page = page;
            this.handleSearch();
        },
        handleSizeChange(limit) {
            this.page.limit = limit;
            this.handleSearch();
        },
        //关闭弹框的方法
        closeDialog() {
            this.dialog.fullscreen = false;
            this.dialog.visible = false;
            this.dialog.select = false;
            this.dialog.create = false;
            this.dialog.update = false;
        },
        //新增推送
         handleCreate() {
            this.dialog.create = true;
            this.dialog.select = false;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.createDialog.loadComponent();
            },100);
        },
         handleUpdate(key, id) {
            this.dialog.update = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.updateDialog.loadComponent(id);
            },100);
        },
         //单个删除
        handleDelete(key, id) {
            this.$confirm('此操作将会删除选中项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = [{
                    advertisingId: id,
                    timeStamp: Date.parse(new Date())
                }];
                var config = {
                    type: 5,
                    name: "advertising/delete",
                    data: data,
                    model: "Policydoc",
                    controller: "del",
                };
                web(config).then((response) => {
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
        },
        //状态的改变
         changeSwitch(row){
             this.loading = true;
             row.advertisingState == true ? row.advertisingState = 1 : row.advertisingState =2
            var data = {
                advertisingId: row.advertisingId,
                advertisingState: row.advertisingState,
                timeStamp : new Date().getTime()
            };
            var config = {
                type: 5,
                name: "advertising/update",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data.status==200){
                    this.advertisingState=1
                    this.$message.success(response.data.msg);
                } else{
                    this.$message.error(response.data.msg);
                }
                    this.loading = false
                    
            });
            
        },
        //刷新列表
        handleRefresh() {
            this.criteria = "";
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.limit = 10;
            this.page.total = 0;
            this.getListData();
        },
        // 处理选中状态
        handlePublishtype(val){
            this.handleRefresh()
        },
        submitDialog() {
            this.closeDialog();
            this.handleRefresh();
        }
    },
    mounted() {
        this.renderView();
    }
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/list.css");
    
    .list-operation{
       /* float:left;
       padding-right:5%; */
       display: flex;
       justify-content: space-between;
    }
    .list-operation /deep/ .el-input__inner{
        height:35px;
        line-height:35px;
       
    }
    .category1 /deep/ .el-input__inner{
         width: 230px;
    }
    .category2 /deep/ .el-input{
         width: 180px;
    }
    .category3 /deep/ .el-input__inner{
         width: 180px;
    }
    .category4 /deep/ .el-input__inner{
         width: 180px;
    }
    .list-operation /deep/ .el-input__icon {
    line-height: 31px;
    }
    .list-operation /deep/ .el-button {
        height:34px;
        line-height:32px;
        padding: 0px 20px;
    }
    
    @media screen and (max-width: 1530px) {
        .category1 /deep/ .el-input__inner{
            width: 180px;
        }
        .category2 /deep/ .el-input{
            width: 140px;
        }
    }
    @media screen and (max-width: 1400px) {
            .category3 /deep/ .el-input__inner{
            width: 140px;
        }
        .category4 /deep/ .el-input__inner{
            width: 140px;
        }
    }
    
    .el-table /deep/ .is-center .el-tooltip{
        min-width:170px !important;
        display:-webkit-box !important;
        overflow:hidden !important;
        text-overflow:ellipsis !important;
         white-space: normal !important;
        -webkit-line-clamp:1 !important;
        -webkit-box-orient:vertical !important;
        text-align: center !important;
        margin:0 auto !important;
        line-height: 14px !important;
        
    }
     .el-table /deep/ .el-table_2_column_9 .el-tooltip p{
        
          min-width:170px !important;
          display:-webkit-box !important;
           white-space: normal !important;
        overflow:hidden !important;
        text-overflow:ellipsis !important;
        -webkit-line-clamp:1 !important;
        -webkit-box-orient:vertical !important;
        text-align: center !important;
        margin:0 auto !important;
        
     }
</style>
