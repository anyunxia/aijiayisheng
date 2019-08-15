<template>
    <div class="list">
        <!-- 头部菜单 -->
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12">
                <span>角色分类</span>
                <el-select v-model="roleId" size="small" placeholder="请选择" class="el-select-input" @change="changeSearchSelect">
                    <el-option
                        v-for="item in roleData"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                    >
                    </el-option>
                </el-select>
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增账号</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDeletes" v-permission="['delete']">批量删除</el-button>
            </el-col>
            <el-col :span="4">
                <el-input v-model.trim="criteria" size="small" placeholder="搜索账号" clearable class="other-input">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </el-col>
        </el-row> 

        <!-- 列表区域 -->
        <div class="list-table">
            <el-table border highlight-current-row size="small" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection"></el-table-column>
                <el-table-column align="center" label="序号" type="index">
                    <template slot-scope="scope">{{ scope.$index + (page.page - 1) * page.row + 1 }}</template>
                </el-table-column>
                <el-table-column align="center" label="角色名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.loginName" v-text="scope.row.loginName"></span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="角色分类" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.loginRoleName" v-text="scope.row.loginRoleName"></span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="角色账号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.loginAccount" v-text="scope.row.loginAccount"></span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.loginNote" v-text="scope.row.loginNote"></span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.creationDatetime">{{scope.row.creationDatetime|dateFormat}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="320">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-share" v-permission="['query']" @click="handleSelect(scope.$index, scope.row.loginId)">查看</el-button>
                        <el-button type="success" size="mini" icon="el-icon-edit" v-permission="['update']" @click="handleUpdate(scope.$index, scope.row.loginId)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" v-permission="['delete']" @click="handleDelete(scope.$index, scope.row.loginId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页区域 -->
        <div class="list-page">
            <el-pagination
                :total="page.total"
                :page-size="page.row"
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
</template>

<script>
import web from "@/static/js/common/web.js";
import power from "@/static/js/common/power.js";
import Create from "./Create";
import Update from "./Update";
import Select from "./Select";
import permission from "@/directive/permission/index.js";
import {getNowFormatDate, parseTime } from "@/static/js/common/common.js";
export default {
    directives: {
        permission
    },
    components: {
        Create,
        Update,
        Select
    },
    data() {
        return{
            button: {
                width: 100
            },
            criteria: "",
            roleName: "",
            roleId: "",
            idList:"",
            dataKey: [],
            tableData: [],
            roleData: [],
            loading: false,
            page: {
                page: 1,
                row: 10,
                total: 0,
            },
            dialog: {
                fullscreen: false,
                visible: false,
                create: false,
                update: false,
                select: false
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
            this.getroleSelect();         
            this.getListData();
        },
        getroleSelect() {
            var data = {
                roleName:this.roleId,
                page: this.page.page,
                row: this.page.row,
                timeStamp: Date.parse(new Date())
            };       
            var config = {
                type: 5,
                name: "role/querylist",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                    console.log(response.data)
                    this.roleData = response.data.data;
                    this.page.total = response.data.total;
                }
            });
        },
        getListData() {
            var data = {
                loginRoleId:this.roleId,
                criteria: this.criteria,
                page: this.page.page,
                row: this.page.row,
                timeStamp: Date.parse(new Date())
            };       
            var config = {
                type: 5,
                name: "sys/querylist",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                    this.loading = true;
                    console.log(response.data)
                    this.tableData = response.data.data;
                    this.page.total = response.data.total;
                    this.loading = false;
                }
            });
        },
        handleCreate() {
            this.dialog.create = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.createDialog.loadComponent();
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
        handleSelectionChange(data) {
             this.idList = data
        },
        //批量删除
        handleDeletes() {
            for(var i=0; i < this.idList.length; i++){
               for(let key in this.idList[i]){
                     this.idList[i]['timeStamp'] =  Date.parse(new Date())
                    key == 'loginId' ?this.idList[i][key] : delete this.idList[i][key]
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
                        name: "sys/delete",
                        data: this.idList,
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
            }else{
                this.$message.warning("请先选择要删除的选项");
            }
        },
        //单个删除
        handleDelete(key, id) {
            this.$confirm('此操作将会删除选中项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    loginId: id,
                    timeStamp: Date.parse(new Date())
                };
                var config = {
                    type: 5,
                    name: "sys/delete",
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
        
        handleCurrentChange(page) {
            this.page.page = page;
            this.handleSearch();
        },
        handleSizeChange(row) {
            this.page.row = row;
            this.handleSearch();
        },
        //刷新列表
        handleRefresh() {
            this.criteria = "";
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.row = 10;
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
            this.dialog.create = false;
            this.dialog.update = false;
            this.dialog.select = false;
            this.dialog.updatepwd = false;
        },
        changeSearchSelect(val){
            this.getListData()
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
