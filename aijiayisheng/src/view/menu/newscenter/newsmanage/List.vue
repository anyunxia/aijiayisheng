<template>
    <div class="list">
            <!-- 新闻头部菜单 -->
            <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12">
                    <el-select v-model="filterStatus" size="small" placeholder="请选择" class="el-select-input" @change="changeSearchSelect">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增新闻</el-button>
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
                    <el-table-column align="center" label="标题" width='200' show-overflow-tooltip>
                        <template slot-scope="scope">{{scope.row.newsTitle ? scope.row.newsTitle : "--"}}</template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="内容" show-overflow-tooltip class="ontent">
                        <template slot-scope="scope">
                            <span v-if="scope.row.newsContent" v-html="scope.row.newsContent" id="content"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column align="center" label="发布人" show-overflow-tooltip>
                       <template slot-scope="scope">{{scope.row.newsWriter ? scope.row.newsWriter : "--"}}</template>
                    </el-table-column>
                     <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.creationDatetime">{{scope.row.creationDatetime|dateFormat}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="center" label="置顶" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.nesTop"
                                on-color="#13ce66"
                                on-text="置顶"
                                :on-value="true"
                                off-color="#ff4949"
                                off-text="默认"
                                :off-value="false"
                                :disabled="topArr.length >= 5 && scope.row.nesTop != 1 ? true : false"
                                :active-value="1"
                                :inactive-value="2"
                                @change="changeSwitch(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                   
                    <el-table-column align="center" label="操作" width="320">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-share" v-permission="['query']" @click="handleSelect(scope.$index, scope.row.newsId)">查看</el-button>
                            <el-button type="success" size="mini" icon="el-icon-edit" v-permission="['update']" @click="handleUpdate(scope.$index, scope.row.newsId)">编辑</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" v-permission="['delete']" @click="handleDelete(scope.$index, scope.row.newsId)">删除</el-button>
                            
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
            filterStatus: null,
            nesTop:2,
            searchName: null,
            idList:"",
            topArr: [],
            dataKey: [],
            tableData: [
                // {
                // newsTitle: "1",
                // newsWriter: "王王",
                // creationDatetime: "1563328254",
                // nesTop:1
                // },{
                // newsTitle: "1",
                // newsWriter: "王王",
                // creationDatetime: "1563328254",
                // nesTop:1
                // },{
                // newsTitle: "1",
                // newsWriter: "王王",
                // creationDatetime: "1563328254",
                // nesTop:1
                // },{
                // newsTitle: "1",
                // newsWriter: "王王",
                // creationDatetime: "1563328254",
                // nesTop:1
                // },{
                // newsTitle: "1",
                // newsWriter: "王王",
                // creationDatetime: "1563328254",
                // nesTop:1
                // },{
                // newsTitle: "1",
                // newsWriter: "王王",
                // creationDatetime: "1563328254",
                // nesTop:2
                // },{
                // newsTitle: "1",
                // newsWriter: "王王",
                // creationDatetime: "1563328254",
                // nesTop:2
                // },{
                // newsTitle: "1",
                // newsWriter: "王王",
                // creationDatetime: "1563328254",
                // nesTop:2
                // }
                ],
            loading: false,
            statusOptions: [
                {
                value: null,
                label: '全部'
                },
                {
                value: '1',
                label: '广场信息'
                },
                {
                value: '2',
                label: '医疗新闻'
                },
                {
                value: '3',
                label: '健康保养'
                }
            ],
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
                newsTitle: this.searchName,
                page: this.page.page,
                row: this.page.limit,
                newsType: this.filterStatus,
                timeStamp: Date.parse(new Date()) //年月日
            };
            var config = {
                type: 5,
                name: "news/list",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                console.log(response.data.data)
                if(response){
                    this.tableData = response.data.data;
                    var itemArr = [];
                    this.tableData.forEach(function(e){
                        if(e.nesTop == 1){
                            itemArr.push(e.nesTop)
                        }
                    })
                    this.topArr = itemArr
                    console.log(this.topArr.length)
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
                //父组件触发子组件中的方法
                this.$refs.createDialog.loadComponent();
            },100);
        },
        //批量删除
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
                        name: "news/delete",
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
        handleSearch() {
            this.dataKey = [];
            this.tableData = [];
            this.getListData();
        },
        handleSelect(key, id) {
            this.dialog.select = true;
            this.dialog.visible = true;
            setTimeout(()=>{
                //父组件触发子组件中的方法并传值
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
                    newsId: id,
                    timeStamp: Date.parse(new Date())
                }];
                var config = {
                    type: 5,
                    name: "news/delete",
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
        changeSwitch(row){
            this.loading = true;
            row.nesTop == true ? row.nesTop = 1 : row.nesTop =2
            var data = {
                newsId: row.newsId,
                nesTop: row.nesTop,
                timeStamp : new Date().getTime()
            };
            var config = {
                type: 5,
                name: "news/update",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            console.log('传参：' , config)
            web(config).then((response) => {
               console.log('返回' , response.data)
                if(response.data.status==200){
                    this.nesTop=1
                    this.$message.success(response.data.msg);
                     this.getListData()
                } else{
                    this.$message.error(response.data.msg);
                    
                }
                    this.loading = false
            });
            
        },
        submitDialog() {
            this.closeDialog();
            this.handleRefresh();
        },
        // 搜索下拉
        changeSearchSelect(val){
             this.getListData()
        },
        getId() {
            var i = 0;
            return function () {
                return i++;
            };    
        }
    },
    mounted() {
        this.renderView();
    }
}
</script>

<style scoped>
    @import url("../../../../static/css/menu/list.css");
   
  
     .el-table /deep/ .is-center .el-tooltip{
        min-width:180px !important;
        overflow:hidden !important;
       
        text-overflow:ellipsis !important;
        -webkit-line-clamp:1 !important;
        -webkit-box-orient:vertical !important;
        text-align: center !important;
        margin:0 auto !important;
         line-height: 14px !important;
          font-size: 12px !important;
        
    }
     .el-table /deep/ .el-table_3_column_20 .el-tooltip{
        
        min-width:180px !important;
        overflow:hidden !important;
        
        text-overflow:ellipsis !important;
        -webkit-line-clamp:1 !important;
        -webkit-box-orient:vertical !important;
        text-align: center !important;
        margin:0 auto !important;
        font-size: 12px !important;
        line-height: 14px !important;
       
     }
     

</style>
