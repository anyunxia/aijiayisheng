<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增医院</p>
            <el-form ref="ruleForm" label-width="120px" v-loading="loading" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="医院名称" prop="orgName">
                    <el-input v-model.trim="form.orgName" placeholder="请输入医院完整名称" class="elseInput"></el-input>
                </el-form-item>
                <el-form-item label="所在位置" class="outersele">
                     <el-form-item prop="orgProvinceCode" style="width:200px !important;display:inline-block;">
                        <el-select v-model="form.orgProvinceCode" clearable @change="handleChange" placeholder="省份">
                            <el-option 
                                v-for="item in province_options" 
                                :label="item.province" 
                                :value="item.code" 
                                :key="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="orgCityCode" style="width:180px !important;display:inline-block;">
                        <el-select v-model="form.orgCityCode" clearable @change="handleChangeCity" placeholder="城市">
                            <el-option 
                                v-for="item in city_options" 
                                :label="item.city" 
                                :value="item.code" 
                                :key="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                   
                    <el-form-item prop="orgAreaCodeDistrict" style="width:180px !important;display:inline-block;">
                        <el-select v-model="form.orgAreaCodeDistrict" clearable @change="handleChangeDistrict" placeholder="区县" class="margintop">
                            <el-option 
                                v-for="item in district_options" 
                                :label="item.district" 
                                :value="item.code" 
                                :key="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:180px !important;display:inline-block;">
                        <el-select v-model="form.orgStreetCode" clearable placeholder="乡镇/街道"  @change="handleChangeTown" class="margintop">
                            <el-option 
                                v-for="item in town_options" 
                                :label="item.town" 
                                :value="item.code" 
                                :key="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="详细地址" prop="orgAddress">
                    <el-input v-model.trim="form.orgAddress" placeholder="请输入具体地址" class="elseInput"></el-input>
                </el-form-item>
                <el-form-item label="医院级别" prop="orgLevelName">
                    <el-select v-model="form.orgLevelName" placeholder="请选择">
                        <el-option
                            v-for="item in roleData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="医院编码" prop="orgCode">
                    <el-input v-model.trim="form.orgCode" placeholder="请输入医院编码"></el-input>
                </el-form-item>
                <el-form-item label="医院图片" prop="orgUrl">
                    <div class="upload" @click="handleUpload">
                        <input ref="file" type="file" style="display:none;" @change="uploadFile($event)">
                        <img v-if="form.orgUrl" :src="form.orgUrl">
                        <span v-else v-text="uploadStatus"></span>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="新增科室" class="outersele">
                    <ul>
                        <li class="left">一级科室
                            <ul>
                                <el-input placeholder="请输入内容" v-model="oneModel" class="input-with-select">
                                    <el-button slot="append" @click="handleAddOne">新增</el-button>
                                </el-input>  
                                <div class="left-contain">
                                    <li v-for="(item, index) in sourceList" :key="index">
                                        <el-tag v-if="active == index" closable @click="handleOneElem(item, index)" @close="handlebtnoneClose(index)" :class="{active : active == index}">{{item.name}}</el-tag>
                                        <el-tag v-else @click="handleOneElem(item, index)" @close="handlebtnoneClose(index)" :class="{active : active == index}">{{item.name}}</el-tag>
                                    </li>
                                </div> 

                                <p class="btnp" ref="btnp">请新增科室</p>
                            </ul>
                        </li>
                        <li class="right">二级科室
                            <ul>
                                <el-input placeholder="请输入内容" v-model="twoModel" class="input-with-select">
                                    <el-button slot="append" @click="handleAddTwo">新增</el-button>
                                </el-input>  
                                <div class="left-contain" style="border-left:none;"> 
                                    <template  v-if="sourceList[index]">
                                         <li v-for="(val, ind) in sourceList[index].list" :key="ind">
                                            <el-tag closable @close="handlebtntwoClose(val)">{{val.name}}</el-tag>
                                        </li> 
                                    </template>
                                </div> 
                            </ul>
                        </li>
                    </ul>

                </el-form-item>   -->
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="success" size="small" @click="handleSubmit">保存并下一步</el-button>
            <el-button type="primary" size="small" @click="handleClose">取消</el-button>
        </div>
         <!-- 嵌套的内层弹框 -->
        <el-dialog width="50%" top="5vh" :visible.sync="innerVisible" append-to-body>
            <Updatesel ref="nestDialog" :dialog="dialog" :departmentsHospitalId="departmentsHospitalId" :departmentsHospitalName="departmentsHospitalName" :departmentsHospitalCode="departmentsHospitalCode" @closeDialog="closeDialog"></Updatesel>  
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import Updatesel from "./Updatesel.vue"
import web from "@/static/js/common/web.js";
import upload from "@/static/js/common/upload.js";
import {url} from "@/static/js/common/commonUrl.js";
export default {
     props: {
        dialog:{
            type: Object,
            default: {}

        },
    },
    components:{
            Updatesel
        },
    data() {
        
        return{
            innerVisible: false,
            loading: false,
            icon: "el-icon-rank",
            uploadStatus: "未上传",
            departmentsHospitalId:"",
            departmentsHospitalCode:"",
            departmentsHospitalName: "",
            timeStamp:"",
            roleData: [
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
            city_options:[], 
            district_options: [],
            town_options: [],
            province_options: [],
            form: {
                orgName: "",
                orgLevelName: "",
                orgAddress: "",
                orgProvinceCode: "",
                orgCityCode: "",
                orgAreaCodeDistrict: "",
                orgStreetCode: "",
                orgUrl: "",
                orgCode: "",
                orgProvince:"",
                orgCity: "",
                orgArea: "",
                orgStreet: "",
                orgId: "",
                timeStamp: Date.parse(new Date())
                
            },
            rules: {
                orgName: [
                    { required: true, message: "价格不能为空", trigger: "blur" },
                ],
                orgAddress: [
                    { required: true, message: "请输入详细地址", trigger: "blur" },
                ],
                orgLevelName: [
                    { required: true, message: "请选择医院级别", trigger: "change" }
                ],
                orgProvinceCode: [
                    { required: true, message: "请选择省", trigger: "change" }
                ],
                orgCityCode: [
                    { required: true, message: "请选择市", trigger: "change" }
                ],
                orgAreaCodeDistrict: [
                    { required: true, message: "请选择县", trigger: "change" }
                ],
                orgStreetCode: [
                    { required: true, message: "请选择街道", trigger: "change" }
                ],
                orgCode: [
                    { required: true, message: "请输入医院编码", trigger: "change" }
                ],
                orgUrl: [
                    { required: true, message: "请上传图片", trigger: "change" }
                ],
               
            },
        }
    },
    computed: {
        cuIndex: function () {
        // `this` 指向 vm 实例
            return this.index
        }
    },
    methods: {
         loadComponent(id) {
            this.form.orgId = id;
            this.getRenderData();
            this.getListData();
            this.getseListData();
        },
        getRenderData(){
            this.form.orgName = "";
            this.form.orgLevelName = "";
            this.form.orgAddress = "";
            this.form.orgProvinceCode = "";
            this.form.orgCityCode = "";
            this.form.orgAreaCodeDistrict = "";
            this.form.orgStreet = "";
            this.form.orgUrl = "",
            this.form.orgCode = "",
            this.form.orgProvince = "";
            this.form.orgCity = "";
            this.form.orgArea = "";
            this.form.orgStreetCode = "";
            this.timeStamp = Date.parse(new Date())
        },
        handleUpload() {
            this.$refs.file.click();
        },
        uploadFile(event) {
            var that = this;
            that.form.orgUrl = "";
            that.uploadStatus = "上传中";
            function callBack(data){
                that.uploadStatus = "未上传";
                if(data.data) {
                    that.form.orgUrl = url + data.data;
                }else{
                    that.uploadStatus = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        //省份
        getseListData() {
            this.loading = true;    
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
                this.loading = false;    
            });
        },
        //点击省获取市
        handleChange(val) {
            let obj = {};
            obj = this.province_options.find((item)=>{
                return item.code === val;
            });
            this.form.orgProvince = obj.province
            for (var i = 0; i < this.province_options.length; i++ ) {
                if (this.form.orgProvinceCode == this.province_options[i].code) {
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
            });
        },
         //点击市获取县
        handleChangeCity(val) {
            let obj = {};
            obj = this.city_options.find((item)=>{
                return item.code === val;
            });
            this.form.orgCity = obj.city
            for (var i = 0; i < this.city_options.length; i++ ) {
                if (this.form.orgCityCode == this.city_options[i].code) {
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
            });
        },
        //点击区县获取街道
        handleChangeDistrict(val) {
            let obj = {};
            obj = this.district_options.find((item)=>{
                return item.code === val;
            });
            this.form.orgArea = obj.district
            for (var i = 0; i < this.district_options.length; i++ ) {
                if (this.form.orgAreaCodeDistrict == this.district_options[i].code) {
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
            });
        },
          //获取街道名称
        handleChangeTown(val){
            let obj = {};
            obj = this.town_options.find((item)=>{
                return item.code === val;
            });
            this.form.orgStreet = obj.town
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
                this.departmentsHospitalId = response.data.data.orgId;
                this.departmentsHospitalCode = response.data.data.orgCode;
                // this.form.orgName = response.data.data.orgName;
                // this.form.orgLevelName = response.data.data.orgLevelName;
                // this.form.orgAddress = response.data.data.orgAddress;
                // this.form.orgUrl =  response.data.data.orgUrl;
                // this.form.orgProvinceCode = response.data.data.orgProvinceCode;

                // this.form.orgCityCode = response.data.data.orgCityCode;
                // this.form.orgAreaCodeDistrict = response.data.data.orgAreaCodeDistrict;
                // this.form.orgStreetCode = response.data.data.orgStreetCode;
                // this.form.orgCode = response.data.data.orgCode;

                // this.form.orgStreet = response.data.data.orgStreet;
                // this.form.orgProvince = response.data.data.orgProvince;
                // this.form.orgCity = response.data.data.orgCity;
                // this.form.orgArea = response.data.data.orgArea;
                this.form =  response.data.data
                 // 初始化对应的市
                var config = {
                    type: 5,
                    name: "areas/queryareas",
                    data:{
                        code: this.form.orgProvinceCode,
                        timeStamp: Date.parse(new Date()),
                    },
                    model: "Policydoc",
                    controller: "detail",
                };
                web(config).then((response) => {
                    this.city_options = response.data.data
                    config.data.code = this.form.orgCityCode
                    config.data.timeStamp = Date.parse(new Date())
                    web(config).then((response) => {
                        this.district_options = response.data.data
                        config.data.code = this.form.orgAreaCodeDistrict
                        config.data.timeStamp = Date.parse(new Date())
                        web(config).then((response) => {
                            this.town_options = response.data.data
                        })
                    })
                });
                this.loading = false;
            });
        },
        //点击提交
         handleSubmit() {
             this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    this.$confirm('确定保存不可更改, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { 
                 const loading = this.$loading({
                        lock: true,
                        text: "提交中...",
                        spinner: "el-icon-loading",
                        background: "rgba(255, 255, 255, 0.7)",
                        target: document.querySelector(".form-content"),
                    });
                    var config = {
                        type: 5,
                        name: "hospital/update",
                        // data: {
                        //     orgId:this.form.orgId,
                        //     orgName: this.form.orgName,
                        //     orgLevelName: this.form.orgLevelName,
                        //     orgAddress: this.form.orgAddress,
                        //     orgUrl: this.form.orgUrl,
                        //     orgCode: this.form.orgCode,
                        //     orgProvinceCode: this.form.orgProvince,
                        //     orgCityCode: this.form.orgCity,
                        //     orgAreaCodeDistrict: this.form.orgArea,
                        //     orgStreetCode: this.form.orgStreet,
                           
                        //     orgProvince:this.form.orgProvinceCode,
                        //     orgCity: this.form.orgCityCode,
                        //     orgArea: this.form.orgAreaCodeDistrict,
                        //     orgStreet: this.form.orgStreetCode,
                            
                        //     // orgProvinceCode: this.form.orgProvinceCode,
                        //     // orgCityCode: this.form.orgCityCode,
                        //     // orgAreaCodeDistrict: this.form.orgAreaCodeDistrict,
                        //     // orgStreetCode: this.form.orgStreetCode,
                           
                        //     // orgProvince:this.form.orgProvince,
                        //     // orgCity: this.form.orgCity,
                        //     // orgArea: this.form.orgArea,
                        //     // orgStreet: this.form.orgStreet,
                        //     timeStamp: Date.parse(new Date())
                        // },
                        data: this.form,
                        model: "News",
                        controller: "add",
                    };
                     web(config).then((response) => {
                        if(response.data.status == 200){
                            //  this.$message.success(response.data.msg);
                            //  this.$emit("submitDialog"); 
                            // this.$emit("closeDialog");
                            this.innerVisible=true
                           
                        }else{
                            this.$message.error(response.data.msg);
                        }
                            loading.close();
                    });
            }).catch(() => {
                this.$message.info("已取消操作");
            });
                   
                   
                }
            });
        },
        handleClose() {
            this.$emit("closeDialog");
        },
       
        changeDialog() {
            this.icon = this.icon == "el-icon-rank" ? "el-icon-menu" : "el-icon-rank";
            this.$emit("changeDialog");
        },
         closeDialog() {
            this.innerVisible = false;
        }
    }
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/dialog.css");
    .other_titleInput /deep/ .el-form-item__error{
        position:static !important;
    }
    .number_title{
        line-height:18px;
    }
    .outersele:before {
        content: '*';
        color: #F56C6C;
        float:left;
       margin-top:12px;
       margin-right:3px;
    }
    .outersele /deep/ .el-form-item__label{
        width:110px !important;
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
        width:225px;
        border-right:1px solid #E4E7ED;
        border-top:1px solid #E4E7ED;
        border-left:1px solid #E4E7ED;
        text-align: center;
        position: relative;
    }
    .el-form-item__content ul .right{
        width:225px;
        border-right:1px solid #E4E7ED;
        border-top:1px solid #E4E7ED;
        text-align: center;
    }
    .left-contain{
        width:100%;
        height:250px;
        border:1px solid #ccc;
        border-top:none;
        overflow-y: auto;
    }
    .left-contain li{
        width:100%;
    }
    .left-contain li span{
        display: block;
        width:100%;
    }
    .el-form-item__content ul li{
        list-style: none;
        float: left;
        text-align: left;
       
    }
    .el-form-item__content ul li .el-tag{
       display: flex;
       width:100%;
       justify-content: space-between;
    }
    /* .left-contain /deep/ .el-tag .el-icon-close{
        text-align: right !important;
    } */
    .left-contain /deep/ .el-tag .el-icon-close{
        /* right:0 !important; */
        left:-3px;
        top:8px;
    }
    .el-tag {
        background-color: #fff !important;
        color:#333;
    }
    .active {
        background: #ccc !important;
    }
    .el-form-item__content ul .left .btnp{
        position: absolute;
        top:310px;
        color: #F56C6C;
        font-size: 12px;
        display: none;
    }
     @media screen and (max-width: 1700px) {
        .form-content .margintop{
            margin-top:20px;
        }
    }
</style>
