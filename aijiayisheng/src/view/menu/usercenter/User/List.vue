<template>
    <div class="list">
            <!-- 头部菜单 -->
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6">
                    <span>用户状态</span>
                    <el-select v-model="dwellerAccountState" size="small" placeholder="请选择" class="el-select-input" @change="handlestatus">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-input v-model.trim="dwellerPhone" size="small" placeholder="搜索账号" clearable class="other-input">
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
                    <el-table-column align="center" label="用户id" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dwellerPhone" v-text="scope.row.dwellerPhone"></span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="姓名" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dwellerName" v-text="scope.row.dwellerName"></span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dwellerCreatdate">{{scope.row.dwellerCreatdate|dateFormat}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="最后登录时间" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dwellerLastTime">{{scope.row.dwellerLastTime|dateFormat}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dwellerAccountState==1">正常</span>
                            <span v-else-if="scope.row.dwellerAccountState==2">冻结</span>
                            <span v-else-if="scope.row.dwellerAccountState==3">删除</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="320">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.dwellerId)" v-permission="['query']">查看</el-button>
                            <el-button type="success" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row.dwellerId)" v-permission="['update']">编辑</el-button>
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
                <Update ref="updateDialog" v-if="dialog.update" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Update>
             </el-dialog>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import Update from "./Update";
import Select from "./Select";
import permission from "@/directive/permission/index.js";
import { parseTime } from "@/static/js/common/common.js";
export default {
    directives: {
        permission
    },
    components: {
        Update,
        Select,
    },

    data() {
        return{
            dwellerAccountState: "",
            dwellerPhone: "",
            dataKey: [],
            tableData: [],
            loading: false,
            statusOptions: [
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
            page: {
                page: 1,
                limit: 10,
                total: 0,//每页的总条数
            },
            dialog: {
                fullscreen: false,
                visible: false,
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
        //页面加载获取列表数据，搜索账号和角色分类执行的函数，不传值时按照原规则获取列表
        getListData() {
            var data = {
                page: this.page.page,
                row: this.page.limit,
                dwellerAccountState: this.dwellerAccountState,
                dwellerPhone: this.dwellerPhone,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "dweller/querylist",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data.data){
                    this.loading = true;
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
        handleSelectionChange(data) {
            this.dataKey = "";
            data.map((item, key)=>{
                if((key + 1) == data.length){
                    this.dataKey += item.dwellerId;
                }else{
                    this.dataKey += item.dwellerId + ",";
                }
            });
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
        handleCurrentChange(page) {
            this.page.page = page;
            this.handleSearch();
        },
        handleSizeChange(limit) {
            this.page.limit = limit;
            this.handleSearch();
        },
        //刷新
        handleRefresh() {
            this.dwellerPhone = "";
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
            this.dialog.select = false;
        },
        handlestatus(val){
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
