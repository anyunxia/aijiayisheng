<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content else-form-content">
            <p>查看医院</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                <el-form-item label="医院名称"><span>{{form.orgName ? form.orgName : "--"}}</span></el-form-item>
                <el-form-item label="所在位置"><span>{{form.orgorgAddress ? form.orgorgAddress : "--"}}</span></el-form-item>
                <el-form-item label="详细地址"><span>{{form.orgAddress ? form.orgAddress : "--"}}</span></el-form-item>
                <el-form-item label="医院级别"><span>{{ getStatusName(form.orgLevelName) }}</span></el-form-item>
                <el-form-item label="医院编码"><span>{{form.orgCode ? form.orgCode : "--"}}</span></el-form-item>
                <el-form-item label="医院图片">
                    <img v-if="form.orgUrl" :src="form.orgUrl">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="添加科室">
                    <ul>
                        <li class="left">一级科室</li>
                        <li class="right">二级科室</li>
                    </ul>
                    <el-cascader-panel 
                        change-on-select
                        filterable
                        :options="options" 
                        :props="defaultParams"
                        v-model="selectedOptions"
                        :clearable="true"
                        @change="getval"
                        style="margin-bottom:40px;"
                        >
                    </el-cascader-panel>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="primary" size="small" plain @click="handleClose">关闭</el-button>
        </div>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            loading: false,
            form: {
                orgId: "",
                orgName: "",
                orgorgAddress: "",
                orgLevelName: "",
                orgAddress: "",
                orgCode: "",
                orgUrl: ""          
            },
            selectedOptions: [],
            options: [],
            defaultParams: {
                label: 'departmentsName',
                value: 'departmentsId',
                children: 'departments'
            }
        }
    },
    methods: {
        loadComponent(id) {
            this.form.orgId = id;
            this.getRenderData();
            this.getListData();
            this.getselListData();
            
        },
        getRenderData(){
            this.form.orgName = "";
            this.form.orgorgAddress = "";
            this.form.orgLevelName = "";
            this.form.orgAddress = "";
            this.form.orgCode = "";               
            this.form.orgUrl = "";   
        },
        getListData() {
            this.loading = true;
            var data = {
                orgId: this.form.orgId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "hospital/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                console.log(response.data)
                var returnData = response.data.data
                var province = returnData.orgProvince;
                var city = returnData.orgCity;
                var district = returnData.orgArea;
                var street= returnData.orgStreet;
                this.form.orgName = returnData.orgName;
                this.form.orgorgAddress = province+city+district+street;
                this.form.orgLevelName = returnData.orgLevelName;
                this.form.orgAddress = returnData.orgAddress;
                this.form.orgCode = returnData.orgCode;
                this.form.orgUrl = returnData.orgUrl;
                this.loading = false;
            });
        },
       
        getselListData() {
            this.loading = true;        
            var edata = {
                departmentsHospitalId:this.form.orgId,
                departmentsFid:0,
	            timeStamp: Date.parse(new Date())
            }
            var config = {
                type: 5,
                name: "depart/query",
                data: edata,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                 this.options=response.data.data;
                 this.loading = false; 
                 this.options.map((item)=>{
                    item.departments.map((sub)=>{
                         if(sub.departments.length <= 0){
                            sub.disabled = true;
                        }
                    })
                 })
                    
            });
        },
        // getTreeData(data){
        //       if(!data || !data.length) return
        //       return data.map(item=>({
        //           departmentsId:item.departmentsId,
        //           departmentsName:item.departmentsName,
        //           departments: this.getTreeData(item.departments)
                  
        //       }))
        // },
        getval(val){
            console.log(val)
        },
        handleClose() {
            this.$emit("closeDialog");
        },
        changeDialog() {
            this.icon = this.icon == "el-icon-rank" ? "el-icon-menu" : "el-icon-rank";
            this.$emit("changeDialog");
        }
    },
    closeDialog() {
        this.innerVisible = false;
    },
    computed: {
        getStatusName: function() {
            return function(status) {
                switch(status){
                    case '三级甲等':return '三级甲等';
                    case '三级乙等':return '三级乙等';
                    case '三级丙等':return '三级丙等';
                    case '二级甲等':return '二级甲等';
                    case '二级乙等':return '二级乙等';
                    case '二级丙等':return '二级丙等';
                    case '一级甲等':return '一级甲等';
                    case '一级乙等':return '一级乙等';
                    case '一级丙等':return '一级丙等';
                    default:return '--';
                }
            };
        }
    }
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/dialog.css");
    .panel{
        width:200px;
        height:200px;
    }
    .el-cascader-node__prefix {
        position: absolute;
        left: -18px !important;
    }
    .el-cascader-panel /deep/ .el-cascader-menu {
        min-width: 213px !important;
    }
    /* .el-cascader-menu {
        min-width: 213px !important;;
    } */
    .else-form-content .el-form-item__content .el-cascader-panel{
        width:426px !important;
        position: absolute;
        top:54px;
        left:0;
    }
    .el-form-item__content ul{
        width: 100%;
        height:30px;
        margin-left:-40px;
        margin-bottom:-5px;
    }
    .el-form-item__content ul li{
        list-style: none;
        float:left;
        text-align: center;  
    }
    .el-form-item__content ul .left{
        width:212px;
        border-right:1px solid #E4E7ED;
        border-top:1px solid #E4E7ED;
        border-left:1px solid #E4E7ED;
    }
    .el-form-item__content ul .right{
        width:212px;
        border-right:1px solid #E4E7ED;
        border-top:1px solid #E4E7ED;
    }
    .else-form-content /deep/ .el-scrollbar__thumb{
        height:0 !important;
    }
    .else-form-content /deep/ .el-cascader-node.is-disabled {
   
        cursor: text !important;
        color:#606266;
    }
    .else-form-content /deep/ .is-disabled .el-icon-arrow-right{
        display: none !important;
    }
</style>
