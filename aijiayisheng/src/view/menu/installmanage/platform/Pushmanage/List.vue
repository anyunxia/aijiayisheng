<template>
    <div class="list">
        <!-- 操作区域 -->
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12">
                <span>状态</span>
                <el-select v-model="pushState" size="small" placeholder="请选择" class="el-select-input" @change="handlePublishtype">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已发布" value="2"></el-option>
                    <el-option label="未发布" value="1"></el-option>
                </el-select> 
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增推送</el-button>
            </el-col>
            <el-col :span="4">
                <el-input v-model.trim="searchName" size="small" placeholder="搜索标题、发布人" clearable>
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
                    <template slot-scope="scope">{{scope.row.pushName ? scope.row.pushName : "--"}}</template>
                </el-table-column>
                <!-- <el-table-column align="center" label="内容" show-overflow-tooltip>
                     <template slot-scope="scope">
                        <span v-if="scope.row.pushContent" v-html="scope.row.pushContent"></span>
                        <span v-else>--</span>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" label="发布人" show-overflow-tooltip>
                     <template slot-scope="scope">{{scope.row.pushIssuer ? scope.row.pushIssuer : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="角色分类" show-overflow-tooltip>
                     <template slot-scope="scope">{{scope.row.pushRoleName ? scope.row.pushRoleName : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="发布时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.pushDateTime">{{scope.row.pushDateTime|dateFormat}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.pushState==1">未发布</span>
                        <span v-else>已发布</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-share" v-permission="['query']" @click="handleSelect(scope.$index, scope.row.pushId)">查看</el-button>
                        <el-button v-if="button.send" type="info" size="mini" icon="el-icon-share" v-permission="['issue']" @click="handleSend(scope.$index, scope.row.pushId)" v-show="scope.row.pushState==1">发布</el-button>
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
        </el-dialog>
    </div>

    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import power from "@/static/js/common/power.js";
import Select from "./Select";
import Create from "./Create";
import permission from "@/directive/permission/index.js";
import {getNowFormatDate, parseTime } from "@/static/js/common/common.js";
export default {
    directives: {
        permission
    },
    components: {
        Select,
        Create
    },
    data() {
        return{
            button: {
                width: 0,
                send: true
            },
            pushState: "",
            searchName: "",
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
                queryCondition:this.searchName,
                pushState: this.pushState,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "push/querylist",
                data: data,
                model: "Policyana",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data.status == 200){
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
                    this.dataKey += item.pushId;
                }else{
                    this.dataKey += item.pushId + ",";
                }
            });
        },
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
        },
        //新增推送
         handleCreate() {
            this.dialog.create = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.createDialog.loadComponent();
            },100);
        },
        //发布
         handleSend(key, id) {
            var data = {
                pushState: "2",
                timeStamp: Date.parse(new Date()),
                pushId:id,
            };
            var config = {
                type: 5,
                name: "push/issue",
                data: data,
                model: "News",
                controller: "status",
            };
            web(config).then((response) => {
                if(response.data.status == 200){
                    console.log(response.data)
                    this.$message.success(response.data.msg);
                    this.handleRefresh();
                }else{
                    this.$message.error(response.data.msg);
                }
            });
        },
        //刷新列表
        handleRefresh() {
            this.searchName = "";
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.limit = 10;
            this.page.total = 0;
            this.getListData();
        },
        // 处理选中状态
        handlePublishtype(val){
            this.getListData()
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
</style>
