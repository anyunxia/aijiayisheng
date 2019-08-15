<template>
    <div class="list">
        <!-- 商品头部菜单 -->
         <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6">
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增商品</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDeletes" v-permission="['delete']">批量删除</el-button>
            </el-col>
            <el-col :span="4">
                <el-input v-model.trim="searchName" size="small" placeholder="搜索标题" clearable class="other-input">
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
                <el-table-column align="center" label="标题" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.facilityName ? scope.row.facilityName : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="商品说明" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.facilityExplain ? scope.row.facilityExplain : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="价格" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.facilityCommodityMoney != 'null'" v-text="scope.row.facilityCommodityMoney"></span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                    <el-table-column align="center" label="快递费" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.facilityConveyMoney != 'null'" v-text="scope.row.facilityConveyMoney"></span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="库存" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.facilityKc ? scope.row.facilityKc : "--"}}</template>
                </el-table-column>
                <el-table-column align="center" label="发布人" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.facilityFbr ? scope.row.facilityFbr : "--"}}</template>
                </el-table-column>
                    <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.facilityCreatedate">{{scope.row.facilityCreatedate|dateFormat}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                    <el-table-column align="center" label="操作" width="380">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-share" v-permission="['query']" @click="handleSelect(scope.$index, scope.row.facilityId)">查看</el-button>
                        <el-button type="success" size="mini" icon="el-icon-edit" v-permission="['update']" @click="handleUpdate(scope.$index, scope.row.facilityId)">编辑</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-star-off" @click="handleSend(scope.row)" v-if="scope.row.facilityIsputaway==1">上架</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-star-off" @click="handleSend(scope.row)" v-else-if="scope.row.facilityIsputaway==2">下架</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" v-permission="['delete']" @click="handleDelete(scope.$index, scope.row.facilityId)">删除</el-button>
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
import Create from "./Create";
import Update from "./Update";
import Select from "./Select";
import permission from "@/directive/permission/index.js";
import { parseTime } from "@/static/js/common/common.js";
export default {
    directives: {
        permission
    },
    components: {
        Create,
        Update,
        Select,
    },
    data() {
        return{
            
            index:false,
            searchName: null,
            idList:"",
            dataKey: [],
            tableData: [],
            facilityIsputaway:2,
            loading: false,
            page: {
                page: 1,
                limit: 10,
                total: 0,//总条数
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
                criteria: this.searchName,
                page: this.page.page,
                row: this.page.limit,
                timeStamp: Date.parse(new Date()) //年月日
            };
            var config = {
                type: 5,
                name: "facility/querylist",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response){
                   console.log(response.data.data)
                    this.tableData = response.data.data;
                    this.page.total = response.data.total;
                    this.loading = false;
                }
            });
        },
        handleSelectionChange(data) {
            this.idList = data
        },
        handleCreate() {
            this.dialog.create = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                this.$refs.createDialog.loadComponent();
            },100);
        },
        handleDeletes() {
            for(var i=0; i < this.idList.length; i++){
               for(let key in this.idList[i]){
                     this.idList[i]['timeStamp'] =  Date.parse(new Date())
                    key == 'newsId' ?this.idList[i][key] : delete this.idList[i][key]
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
                        name: "facility/delete",
                        data: this.idList,
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
                var data =[{
                    facilityId: id,
                    timeStamp: Date.parse(new Date())
                }];
                var config = {
                    type: 5,
                    name: "facility/delete",
                    data: data,
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
        },
          //上下架
         handleSend(row) {
            this.$confirm('确定操作此选项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(row.facilityIsputaway == 1){
                row.facilityIsputaway = 2 
                }else if(row.facilityIsputaway == 2){
                row.facilityIsputaway = 1 
                }
               var data = {
                    facilityId: row.facilityId,
                    facilityIsputaway: row.facilityIsputaway,
                    timeStamp : new Date().getTime()
                };
                var config = {
                    type: 5,
                    name: "facility/upanddown",
                    data: data,
                    model: "Policydoc",
                    controller: "get_list",
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
                this.$message.info("已取消操作");
            });
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
            this.dialog.create = false;
            this.dialog.update = false;
            this.dialog.select = false;
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
    @import url("../../../../static/css/menu/list.css");
</style>
