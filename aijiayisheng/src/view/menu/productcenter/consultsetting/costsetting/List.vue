<template>
    <div class="list">
            <!-- 新闻头部菜单 -->
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6">
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增参数</el-button>
            </el-col>
        </el-row> 
            <!-- 列表区域 -->
            <div class="list-table">
                <el-table border highlight-current-row size="small" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column align="center" label="序号" type="index">
                        <template slot-scope="scope">{{ scope.$index + (page.page - 1) * page.limit + 1 }}</template>
                    </el-table-column>
                    <el-table-column align="center" label="参数名称" width='200' show-overflow-tooltip>
                        <template slot-scope="scope">{{scope.row.newsTitle ? scope.row.newsTitle : "--"}}</template>
                    </el-table-column>
                    <el-table-column align="center" label="设置比例" show-overflow-tooltip>
                       <template slot-scope="scope">{{scope.row.newsWriter ? scope.row.newsWriter : "--"}}</template>
                    </el-table-column>
                    <el-table-column align="center" label="说明" show-overflow-tooltip>
                       <template slot-scope="scope">{{scope.row.address ? scope.row.address : "--"}}</template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="320">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-share" v-permission="['query']" @click="handleSelect(scope.$index, scope.row.newsId)">查看</el-button>
                            <el-button type="success" size="mini" icon="el-icon-edit" v-permission="['update']" @click="handleUpdate(scope.$index, scope.row.newsId)">编辑</el-button>
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
            idList:"",
            dataKey: [],
            tableData: [{
                newsTitle: "1",
                newsWriter: "王王",
                address: "北京市朝阳区xx街道"
               
                },{
                newsTitle: "1",
                newsWriter: "王王",
                 address: "北京市朝阳区xx街道"
               
                },{
                newsTitle: "1",
                newsWriter: "王王",
                 address: "北京市朝阳区xx街道"
               
                },{
                newsTitle: "1",
                newsWriter: "王王",
                address: "北京市朝阳区xx街道"
               
                },{
                newsTitle: "1",
                newsWriter: "王王",
                address: "北京市朝阳区xx街道"               
                },{
                newsTitle: "1",
                newsWriter: "王王",
                address: "北京市朝阳区xx街道"                
                },{
                newsTitle: "1",
                newsWriter: "王王",
                address: "北京市朝阳区xx街道"               
                },{
                newsTitle: "1",
                newsWriter: "王王",
                address: "北京市朝阳区xx街道"
                }],
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
    methods: {
        renderView() {
            this.getListData();
        },
        getListData() {
            // this.loading = true;
            // var data = {
            //     page: this.page.page,
            //     row: this.page.limit,
            //     timeStamp: Date.parse(new Date()) //年月日
            // };
            // var config = {
            //     type: 5,
            //     name: "news/list",
            //     data: data,
            //     model: "Policydoc",
            //     controller: "get_list",
            // };
            // web(config).then((response) => {
            //     console.log(response)
            //     if(response){
            //         this.tableData = response.data.data;
            //         this.page.total = response.data.total;
            //         console.log(this.tableData)
            //         this.loading = false;
                    
            //     }
            // });
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
        handleRefresh() {
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.limit = 10;
            this.page.total = 0;
            this.getListData();
        },
        handleCurrentChange(page) {
            this.page.page = page;
           
        },
        handleSizeChange(limit) {
            this.page.limit = limit;
           
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
    @import url("../../../../../static/css/menu/list.css");
</style>
