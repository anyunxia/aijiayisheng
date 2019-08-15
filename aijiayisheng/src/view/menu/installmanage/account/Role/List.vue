<template>
    <div class="list">
        <!-- 操作区域 -->
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="7">
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate">新增分类</el-button>
            </el-col>
            <el-col :span="4">    
                <el-input v-model.trim="searchName" size="small" placeholder="请输入搜索角色名称.." clearable class="other-input">
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
                <el-table-column align="center" label="角色名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.role_name" v-text="scope.row.role_name"></span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注信息">
                    <template slot-scope="scope">
                        <span v-if="scope.row.desc" v-text="scope.row.desc"></span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.create_time" v-text="scope.row.create_time"></span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.role_id)">查看</el-button>
                        <el-button type="success" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row.role_id)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row.role_id)">删除</el-button>
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
</template>

<script>
import web from "@/static/js/common/web.js";
import power from "@/static/js/common/power.js";
import Create from "./Create";
import Update from "./Update";
import Select from "./Select";
export default {
    components: {
        Create,
        Update,
        Select,
    },
    data() {
        return{
            button: {
                width: 0,
            },
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
                update: false,
                select: false,
            }
        }
    },
    methods: {
        renderView() {
            
            this.getListData();
        },
        getListData() {
            // this.loading = true;
            var data = {
                searchName: this.searchName,
                page: this.page.page,
                limit: this.page.limit,
            };
            var config = {
                type: 2,
                name: "role_list",
                data: data,
                model: "Role",
                controller: "get_list",
            };
            web(config).then((response) => {
                console.log(response.data)
                if(response.data){
                    this.tableData = response.data.data;
                    this.page.total = response.data.total;
                    // this.loading = false;
                }
            });
        },
        handleSelectionChange(data) {
            this.dataKey = "";
            data.map((item, key)=>{
                if((key + 1) == data.length){
                    this.dataKey += item.role_id;
                }else{
                    this.dataKey += item.role_id + ",";
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
        handleDelete(key, id) {
            this.$confirm('此操作将会删除选中项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    role_id: id
                };
                var config = {
                    type: 2,
                    name: "role_del",
                    data: data,
                    model: "Role",
                    controller: "del",
                };
                web(config).then((response) => {
                    if(response.data.code == 200){
                        this.$message.success(response.data.msg);
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
        handleSizeChange(limit) {
            this.page.limit = limit;
            this.handleSearch();
        },
        submitDialog() {
            this.closeDialog();
        },
        closeDialog() {
            this.dialog.fullscreen = false;
            this.dialog.visible = false;
            this.dialog.create = false;
            this.dialog.update = false;
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
    .list-operation{
       display: flex;
       justify-content: space-between;
    }
</style>
