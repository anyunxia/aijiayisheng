<template>
    <div class="list">
            <!-- 新闻头部菜单 -->
            <div class="top-other">
                <div class="left">
                    <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreate" v-permission="['save']">新增医院</el-button>
                </div>
                <div class="right">
                    <span style="font-size:14px;margin-right: 8px;">医院位置</span>
                    <el-select v-model="form.province" size="mini" clearable @change="handleChange" placeholder="省份">
                        <el-option 
                            v-for="item in province_options" 
                            :label="item.province" 
                            :value="item.code" 
                            :key="item.code">
                        </el-option>
                    </el-select> 
                    <el-select v-model="form.city" size="mini" clearable @change="handleChangeCity" placeholder="城市">
                        <el-option 
                            v-for="item in city_options" 
                            :label="item.name" 
                            :value="item.code" 
                            :key="item.code">
                        </el-option>
                    </el-select>
                    <el-select v-model="form.district" size="mini" clearable @change="handleChangeDistrict" placeholder="区县">
                        <el-option 
                            v-for="item in district_options" 
                            :label="item.name" 
                            :value="item.code" 
                            :key="item.code">
                        </el-option>
                    </el-select>
                    <el-select v-model="form.town" size="mini" clearable placeholder="乡镇/街道">
                        <el-option 
                            v-for="item in town_options" 
                            :label="item.name" 
                            :value="item.code" 
                            :key="item.code">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="12">
                    <span>医院级别</span>
                    <el-select v-model="shipmentsck" size="mini" placeholder="请选择" class="el-select-input" @change="handlePublishtype">
                        <el-option
                        v-for="item in shipments"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select> 
                </el-col>
                <el-col :span="4">
                    <el-input v-model.trim="criteria" size="mini" placeholder="请输入医院名称" clearable class="other-input">
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 列表区域 -->
            <div class="list-table">
                <el-table border highlight-current-row size="small" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column align="center" label="序号" type="index">
                        <template slot-scope="scope">{{ scope.$index + (page.page - 1) * page.row + 1 }}</template>
                    </el-table-column>
                    <el-table-column align="center" label="医院名称" width='200' show-overflow-tooltip>
                        <template slot-scope="scope">{{scope.row.orgName ? scope.row.orgName : "--"}}</template>
                    </el-table-column>
                    <el-table-column align="center" label="级别" show-overflow-tooltip>
                       <template slot-scope="scope">{{scope.row.orgLevelName ? scope.row.orgLevelName : "--"}}</template>
                    </el-table-column>
                    <el-table-column align="center" label="地址" show-overflow-tooltip>
                       <template slot-scope="scope">{{scope.row.orgAddress ? scope.row.orgAddress : "--"}}</template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="320">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-share" v-permission="['query']" @click="handleSelect(scope.$index, scope.row.orgId)">查看</el-button>
                            <el-button type="success" size="mini" icon="el-icon-edit" v-permission="['update']" @click="handleUpdate(scope.$index, scope.row.orgId)">编辑</el-button>
                            <!-- <el-button type="danger" size="mini" icon="el-icon-delete" v-permission="['delete']" @click="handleDelete(scope.$index, scope.row.orgId)">删除</el-button> -->
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
                <Create ref="createDialog" v-if="dialog.create" :dialog="dialog" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Create>
                <Update ref="updateDialog" v-if="dialog.update" :dialog="dialog" @submitDialog="submitDialog" @closeDialog="closeDialog" @changeDialog="dialog.fullscreen = !dialog.fullscreen"></Update>
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
            filterStatus: null,
            criteria: null,
            idList:"",
            shipmentsck:"",
            dataKey: [],
            form:{
                province:"",
                city: "",
                district: "",
                town: ""
            },
            city_options:[], 
            district_options: [],
            town_options: [],
            province_options: [],
            tableData: [],
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
            shipments:[
                {
                value: '',
                label: '全部'
                },
                {
                value: '三级甲等',
                label: '三级甲等'
                },
                {
                value: '三级乙等',
                label: '三级乙等'
                },
                {
                value: '三级丙等',
                label: '三级丙等'
                },
                {
                value: '二级甲等',
                label: '二级甲等'
                },
                {
                value: '二级乙等',
                label: '二级乙等'
                },
                {
                value: '二级丙等',
                label: '二级丙等'
                },
                 {
                value: '一级甲等',
                label: '一级甲等'
                },
                {
                value: '一级乙等',
                label: '一级乙等'
                },
                {
                value: '一级丙等',
                label: '一级丙等'
                },
            ],
            page: {
                page: 1,
                row: 10,
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
            this.getseleData();
        },
        getListData() {
            this.loading = true;
            var data = {
                criteria: this.criteria,
                page: this.page.page,
                row: this.page.row,
                orgLevelName: this.shipmentsck,
                orgProvinceCode: this.form.province,
                orgCityCode: this.form.city,
                orgAreaCodeDistrict:this.form.district,
                orgStreetCode: this.form.town,
                timeStamp: Date.parse(new Date()) //年月日
            };
            var config = {
                type: 5,
                name: "hospital/querylist",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data.data != ""){
                    this.tableData = response.data.data;
                    this.page.total = response.data.total;
                    this.loading = false;
                }else{
                    this.tableData = [];
                    this.loading = false;
                }
            });
        },
         //省份
        getseleData() {
            var config = {
                type: 5,
                name: "areas/queryareas",
                data:{
                    timeStamp: Date.parse(new Date()),
                    code:0   
                },
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.province_options = response.data.data
                 this.getListData()
            });
        },
        //获取市    
        handleChange() {
            for (var i = 0; i < this.province_options.length; i++ ) {
                if (this.form.province == this.province_options[i].code) {
                    var codes = this.province_options[i].code
                }
            }
            var config = {
                type: 5,
                name: "areas/queryareas",
                data:{
                    code: codes,
                    timeStamp: Date.parse(new Date()),
                },
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.city_options = response.data.data
                this.getListData()
            });
        },
         //获取县
        handleChangeCity() {
            for (var i = 0; i < this.city_options.length; i++ ) {
                if (this.form.city == this.city_options[i].code) {
                    var codex = this.city_options[i].code
                }
            }
            var config = {
                type: 5,
                name: "areas/queryareas",
                data:{
                    code: codex,
                    timeStamp: Date.parse(new Date()),
                },
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.district_options = response.data.data
                this.getListData()
            });
        },
        
         //获取街道
        handleChangeDistrict() {
            for (var i = 0; i < this.district_options.length; i++ ) {
                if (this.form.district == this.district_options[i].code) {
                    var codej = this.district_options[i].code
                }
            }
            var config = {
                type: 5,
                name: "areas/queryareas",
                data:{
                    code: codej,
                    timeStamp: Date.parse(new Date()),
                },
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.town_options = response.data.data
                this.getListData()
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
        handleRefresh() {
            this.criteria = null;
            this.dataKey = [];
            this.tableData = [];
            this.page.page = 1;
            this.page.row = 10;
            this.page.total = 0;
            this.getListData();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this.handleSearch();
        },
        handleSizeChange(row) {
            this.page.row = row;
            this.handleSearch();
        },
        submitDialog() {
            this.closeDialog();
            this.handleSearch()
           
        },
         handleDelete(key, id) {
            this.$confirm('此操作将会删除选中项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data =[{
                    orgId: id,
                    timeStamp: Date.parse(new Date())
                }];
                var config = {
                    type: 5,
                    name: "hospital/delete",
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
        closeDialog() {
            this.dialog.fullscreen = false;
            this.dialog.visible = false;
            this.dialog.create = false;
            this.dialog.update = false;
            this.dialog.select = false;
        },
       
        // 搜索下拉
        changeSearchSelect(val){
             this.getListData()
        },
        handlePublishtype(val){
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
    .top-other{
        width:100%;
        height:45px;
    }
    .top-other .left{
        float:left;
    }
    .top-other .right{
        float:right;
    }
</style>
