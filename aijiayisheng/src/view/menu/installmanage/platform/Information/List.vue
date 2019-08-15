<template>
    <div class="list">
        <!-- 操作区域 -->
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="7">
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增分类</el-button>
            </el-col>
        </el-row>
        <!-- 列表区域 -->
        <div class="list-table">
            <el-table border highlight-current-row size="small" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection"></el-table-column>
                 <el-table-column align="center" label="序号" type="index">
                        <template slot-scope="scope">{{ scope.$index + (page.page - 1) * page.limit + 1 }}</template>
                    </el-table-column>
                <el-table-column align="center" label="标题" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.protocolName ? scope.row.protocolName : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="应用" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.protocolPort==1">用户端</span>
                        <span v-else>医生端</span>
                    </template>
                </el-table-column>
               
                <el-table-column align="center" label="内容" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-html="scope.row.protocolContent ? scope.row.protocolContent : '--'"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="修改人" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.historyUpdateName ? scope.row.historyUpdateName : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="修改时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.updateDatetime">{{scope.row.updateDatetime|dateFormat}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.protocolId)" v-permission="['query']">查看</el-button>
                        <el-button type="success" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row.protocolId)" v-permission="['update']">编辑</el-button>
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
import power from "@/static/js/common/power.js";
import Select from "./Select";
import Create from "./Create";
import Update from "./Update";
import moment from 'moment';
import permission from "@/directive/permission/index.js";
import {getNowFormatDate, parseTime } from "@/static/js/common/common.js";
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
            publishtype: "",
            dataKey: [],
            tableData: [],
            loading: false,
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
                update: false
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
        //初始化获取数据
        getListData() {
            this.loading = true;
            var data = {
                page: this.page.page,
                row: this.page.limit,
                timeStamp: Date.parse(new Date())
                // timeStamp: getNowFormatDate()
            };
            var config = {
                type: 5,
                name: "protocol/querylist",
                data: data,
                model: "Policyana",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data.status == 200){
                    console.log(response.data)
                    this.tableData = response.data.data;
                    this.page.total = response.data.total;
                  
                    this.loading = false;
                }
            });
        },
        
        //列表数据发生改变重新排列k值
        handleSelectionChange(data) {
            this.dataKey = "";
            console.log(data)
            data.map((item, key)=>{
                if((key + 1) == data.length){
                    this.dataKey += item.protocolId;
                }else{
                    this.dataKey += item.protocolId + ",";
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
            this.dialog.update = false;
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
            this.dialog.update = false;
            this.dialog.create = false;
        },
        //新增推送
         handleCreate() {
            this.dialog.create = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.createDialog.loadComponent();
            },100);
        },

        //刷新列表
        handleRefresh() {
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.limit = 10;
            this.page.total = 0;
            this.getListData();
        },
        submitDialog() {
            this.closeDialog();
            this.handleSearch();
           
        },
        //编辑
        handleUpdate(key, id) {
            this.dialog.update = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.updateDialog.loadComponent(id);
            },100);
        },
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
        min-width:180px !important;
        display:-webkit-box !important;
        overflow:hidden !important;
        white-space: normal !important;
        text-overflow:ellipsis !important;
        -webkit-line-clamp:1 !important;
        -webkit-box-orient:vertical !important;
        text-align: center !important;
        margin:0 auto !important;
         line-height: 14px !important;
        
    }
     .el-table /deep/ .el-table_5_column_33 .el-tooltip{
        
          min-width:180px !important;
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
