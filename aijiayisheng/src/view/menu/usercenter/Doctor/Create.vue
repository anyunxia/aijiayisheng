<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增账号</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="账号(手机号)" prop="doctorSjh">
                    <el-input v-model.trim="form.doctorSjh" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="doctorXm">
                    <el-input v-model.trim="form.doctorXm" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="职称" prop="doctorYsjb">
                    <el-input v-model.trim="form.doctorYsjb" placeholder="请输入职称"></el-input>
                </el-form-item>
                <el-form-item label="医院" prop="doctorOrgId">
                    <el-select v-model.trim="form.doctorOrgId" placeholder="请选择医院" @change="currentSel">
                        <el-option
                        v-for="item in doctorOrgNameData"
                        :key="item.orgId"
                        :label="item.orgName"
                        :value="item.orgId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="科室" prop="doctorOrgYjid">
                    <el-select v-model.trim="form.doctorOrgYjid" placeholder="请选择科室" clearable @change="getyjSel">
                        <el-option
                        v-for="item in doctorOrgYjofficeData"
                        :key="item.departmentsId"
                        :label="item.departmentsName"
                        :value="item.departmentsId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级科室" prop="doctorOfficeid">
                    <el-select v-model.trim="form.doctorOfficeid" placeholder="请选择二级科室" @change="getejSel">
                        <el-option
                        v-for="item in doctorOfficeData"
                        :key="item.departmentsId"
                        :label="item.departmentsName"
                        :value="item.departmentsId"
                        ></el-option>   
                    </el-select>
                </el-form-item>
                 <el-form-item label="性别" prop="doctorXb">
                    <el-radio v-model="form.doctorXb" label="1">男</el-radio>
                    <el-radio v-model="form.doctorXb" label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="身份证号" prop="doctorSfz">
                    <el-input v-model.trim="form.doctorSfz" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item label="医生头像">
                    <div class="upload" @click="handleUpload6" style="float:left;">
                        <input ref="file6" type="file" style="display:none;" @change="uploadFiletx($event)">
                        <img v-if="form.doctorTx" :src="form.doctorTx">
                        <span v-else v-text="uploadStatustx"></span>
                    </div>
                </el-form-item>
                <el-form-item label="身份证照片">
                    <div class="upload" @click="handleUpload1" style="float:left;">
                        <input ref="file1" type="file" style="display:none;" @change="uploadFilezm($event)">
                        <img v-if="form.yszsSfzzm" :src="form.yszsSfzzm">
                        <span v-else v-text="uploadStatusz"></span>
                    </div>
                     <div class="upload" @click="handleUpload2" style="float:left;margin-left:10px;">
                        <input ref="file2" type="file" style="display:none;" @change="uploadFilefm($event)">
                        <img v-if="form.yszsSfzfm" :src="form.yszsSfzfm">
                        <span v-else v-text="uploadStatusf"></span>
                    </div>
                </el-form-item>
                <el-form-item label="手持身份证照片">
                    <div class="upload" @click="handleUpload3" style="display:inline-block;">
                        <input ref="file3" type="file" style="display:none;" @change="uploadFilesc($event)">
                        <img v-if="form.yszsScsfzzp" :src="form.yszsScsfzzp">
                        <span v-else v-text="uploadStatussc"></span>
                    </div>
                </el-form-item>
                 <el-form-item label="医师资格证">
                    <div class="upload" @click="handleUpload4" style="display:inline-block;">
                        <input ref="file4" type="file" style="display:none;" @change="uploadFileys($event)">
                        <img v-if="form.yszsYszgz" :src="form.yszsYszgz">
                        <span v-else v-text="uploadStatusys"></span>
                    </div>
                </el-form-item>
                <el-form-item label="职业证书">
                    <div class="upload" @click="handleUpload5" style="display:inline-block;">
                        <input ref="file5" type="file" style="display:none;" @change="uploadFilezy($event)">
                        <img v-if="form.yszsZyzs" :src="form.yszsZyzs">
                        <span v-else v-text="uploadStatuszs"></span>
                    </div>
                </el-form-item>
                <el-form-item label="专长介绍" class="textareaInput">
                     <el-input type="textarea" placeholder="请输入专长介绍" style="height:110px;" v-model.trim="form.doctorYsjs" maxlength="120" resize="none" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="个人简介" class="textareaInput">
                    <el-input type="textarea" placeholder="请输入个人简介" style="height:110px;" v-model.trim="form.doctorZcjs" maxlength="300" resize="none" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            
             <el-button type="primary" size="small" plain @click="handleClose">取消</el-button>
             <el-button type="success" size="small" plain @click="handleSubmit">确定</el-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import upload from "@/static/js/common/upload.js";
import web from "@/static/js/common/web.js";
import {url} from "@/static/js/common/commonUrl.js";
export default {
    data() {
          var validatorPhone = (rule, value, callback) => {
            var regular = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
            if(regular.test(value)){
                callback();
            }else{
                callback(new Error("请输入正确的手机号!"));
            }
        };
       //需要校验但不是必填
         var validatorCode = (rule, value, callback) => {
             var regular = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
           if(value){
               if(regular.test(value)){
                   callback();
               }else{
                    callback(new Error("请输入正确的身份证号!"));
               }

           }else{
               return callback()
           }
        };
        return{
            icon: "el-icon-rank",
            editor: "",
            departId:"",
            departName: "",
            departCode: "",
            
            qddoctorOrgYjoffice: "",
            qddoctorOrgYjcode: "",

            qddoctorOffice: "",
            qddoctorOfficecode: "",

            uploadStatusz: "上传身份证正面照",
            uploadStatusf: "上传身份证背面照",
            uploadStatussc: "上传手持身份证照片",
            uploadStatusys: "上传医师资格证照片",
            uploadStatuszs: "上传职业证书照片",
            uploadStatustx: "上传头像",
            doctorOrgNameData: [],
            doctorOrgYjofficeData: [],
            doctorOfficeData: [],
            form: {
                doctorSjh: "",
                doctorXm	: "",
                doctorSfz: "", 
                doctorXb: "",
                doctorYsjb: "",
                doctorOrgName: "",
                doctorOrgYjoffice: "",
                
                yszsSfzzm: "",
                yszsSfzfm: "",
                yszsScsfzzp: "",
                yszsYszgz: "",
                yszsZyzs: "",
                doctorYsjs: "",
                doctorZcjs: "",
                doctorTx: "",

                doctorOrgId: "",
                doctorOrgName: "",
                doctorOrgCode: "",

                doctorOrgYjid: "",
                doctorOrgYjoffice: "",
                doctorOrgYjcode: "",

                doctorOfficeid: "",
                doctorOffice: "",
                doctorOfficecode: ""

            },
            rules: {
                doctorSjh: [
                    { required: true, message: "请输入手机号", trigger: "change" },
                    { validator: validatorPhone, trigger: "blur" },
                ],
                doctorXm	: [
                    { required: true, message: "请输入姓名", trigger: "change" }
                ],
                doctorYsjb: [
                    { required: true, message: "请输入职称", trigger: "change" }
                ],
                doctorOrgId: [
                    { required: true, message: "请选择医院", trigger: "change" }
                ],
                doctorOrgYjid: [
                    { required: true, message: "请选择科室", trigger: "change" }
                ],
                doctorOfficeid: [
                    { required: true, message: "请选择二级科室", trigger: "change" }
                ],
                doctorXb: [
                    { required: true, message: "请选择性别", trigger: "change" }
                ],
                doctorSfz:[
                     { required: false, message: "请输入正确的身份证号", trigger: "change" },
                     { validator: validatorCode, trigger: "blur" },
                ],

            }
        }
    },
    methods: {
        loadComponent() {
            this.getRenderData();
            this.getyySelect();
        },
        getRenderData(){
            this.form.doctorYsjs = "",
            this.form.doctorSjh = ""
            this.form.doctorXm	 = "",
            this.form.doctorSfz = "",
            this.form.doctorXb = "",
            this.form.doctorYsjb = "",
            
            this.form.yszsSfzzm = "",
            this.form.yszsSfzfm = "",
            this.form.yszsScsfzzp = "",
            this.form.yszsYszgz = "",
            this.form.yszsZyzs = "",
            this.form.doctorZcjs = "",

            this.form.doctorOrgId = "",
            this.form.doctorOrgName = "",
            this.form.doctorOrgCode = "",

            this.form.doctorOrgYjid = "",
            this.form.doctorOrgYjoffice = "",
            this.form.doctorOrgYjcode = "",

            this.form.doctorOfficeid = "",
            this.form.doctorOffice = "",
            this.form.doctorOfficecode = "",
            this.form.doctorTx = ""
            
        },
         //获取医院下拉框
        getyySelect() { 
            var data = {
                page:"1",
                row:"10000",
                timeStamp: Date.parse(new Date())
            };     
            var config = {
                type: 5,
                name: "hospital/querylist",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                    this.doctorOrgNameData = response.data.data;
                }
            });
        },
        //医院下拉选中值
        currentSel(selVal) {
            if(selVal != ""){
                var choosenItem = this.doctorOrgNameData.filter(item => item.orgId === selVal)[0];
                this.departlId = choosenItem.orgId,
                this.departName= choosenItem.orgName,
                this.departCode= choosenItem.orgCode
                //获取一级科室下拉框
                this.getksSelect()
            }
        },
          //获取一级科室下拉框
        getksSelect() { 
            var data = {
                departmentsHospitalId:this.departlId,
                departmentsName:this.departName,
                departmentsFid:0,
                departmentsHospitalCode:this.departCode,
	            timeStamp : new Date().getTime()
            };     
            var config = {
                type: 5,
                name: "depart/query",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                   this.doctorOrgYjofficeData = response.data.data;
                }
            });
        },
        //点击一级获取二级科室
        getyjSel(){
            this.form.doctorOfficeid = ""
            for (var i = 0; i < this.doctorOrgYjofficeData.length; i++ ) {
                if (this.form.doctorOrgYjid == this.doctorOrgYjofficeData[i].departmentsId) {
                    var fidid = this.doctorOrgYjofficeData[i].departmentsId
                    var hospitalId = this.doctorOrgYjofficeData[i].departmentsHospitalId
                    this.qddoctorOrgYjoffice = this.doctorOrgYjofficeData[i].departmentsName
                    this.qddoctorOrgYjcode = this.doctorOrgYjofficeData[i].departmentsCode                    
                }
            }
             var config = {
                type: 5,
                name: "depart/query",
                data:{
                    departmentsFid: fidid,
                    departmentsHospitalId : hospitalId,
                    timeStamp: Date.parse(new Date()),
                },
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                 if(response.data){
                     this.doctorOfficeData = response.data.data
                 }    
            });
        },
         //点击二级科室
        getejSel(){
            for(var i = 0; i < this.doctorOfficeData.length; i++){
                if (this.form.doctorOfficeid == this.doctorOfficeData[i].departmentsId) {
                    this.qddoctorOffice = this.doctorOfficeData[i].departmentsName           
                }
            }
        },
        handleUpload1() {
            this.$refs.file1.click();
        },
        handleUpload2() {
            this.$refs.file2.click();
        },
        handleUpload3() {
            this.$refs.file3.click();
        },
        handleUpload4() {
            this.$refs.file4.click();
        },
        handleUpload5() {
            this.$refs.file5.click();
        },
        handleUpload6() {
            this.$refs.file6.click();
        },
        uploadFiletx(event) {
            var that = this;
            that.form.doctorTx = "";
            that.uploadStatustx = "上传中";
            function callBack(data){
                that.uploadStatustx = "未上传";
                if(data.data) {
                    that.form.doctorTx = url + data.data;
                }else{
                    that.uploadStatustx = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        uploadFilezm(event) {
            var that = this;
            that.form.yszsSfzzm = "";
            that.uploadStatusz = "上传中";
            function callBack(data){
                that.uploadStatusz = "未上传";
                if(data.data) {
                    that.form.yszsSfzzm = url + data.data;
                }else{
                    that.uploadStatusz = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        uploadFilefm(event) {
            var that = this;
            that.form.yszsSfzfm = "";
            that.uploadStatusf = "上传中";
            function callBack(data){
                that.uploadStatusf = "未上传";
                if(data.data) {
                    that.form.yszsSfzfm = url + data.data;
                }else{
                    that.uploadStatusf = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        uploadFilesc(event) {
            var that = this;
            that.form.yszsScsfzzp = "";
            that.uploadStatussc = "上传中";
            function callBack(data){
                that.uploadStatussc = "未上传";
                if(data.data) {
                    that.form.yszsScsfzzp = url + data.data;
                }else{
                   that.uploadStatussc = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        uploadFileys(event) {
            var that = this;
            that.form.yszsYszgz = "";
            that.uploadStatusys = "上传中";
            function callBack(data){
                that.uploadStatusys = "未上传";
                if(data.data) {
                    that.form.yszsYszgz = url + data.data;
                }else{
                    that.uploadStatusys = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        uploadFilezy(event) {
            var that = this;
            that.form.yszsZyzs = "";
            that.uploadStatuszs = "上传中";
            function callBack(data){
                that.uploadStatuszs = "未上传";
                if(data.data) {
                    that.form.yszsZyzs = url + data.data;
                }else{
                    that.uploadStatuszs = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        handleSubmit() {
            this.form.doctorOrgName = this.departName,
            this.form.doctorOrgCode = this.departCode,
            this.form.doctorOrgYjoffice = this.qddoctorOrgYjoffice,
            this.form.doctorOrgYjcode = this.qddoctorOrgYjcode,
            this.form.doctorOffice = this.qddoctorOffice,
            this.form.doctorOfficecode = this.qddoctorOfficecode
            this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    var loading = this.$loading({
                        lock: true,
                        text: "提交中...",
                        spinner: "el-icon-loading",
                        background: "rgba(255, 255, 255, 0.7)",
                        target: document.querySelector(".form-content"),
                    });
                    var config = {
                        type: 5,
                        name: "doctor/save",
                        data: this.form,
                        model: "Policyana",
                        controller: "add",
                    };
                    web(config).then((response) => {
                        if(response.data.status == 200){
                            this.$message.success(response.data.msg);
                            this.$emit("submitDialog");
                        }else{
                            this.$message.error(response.data.msg);
                        }
                        loading.close();
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
    }
}
</script>

<style scoped>
    @import url("../../../../static/css/menu/dialog.css");
    .number_title{
        line-height:18px;
    }
     .textareaInput /deep/ textarea{
        min-height: 80px !important;
        margin-top:10px;
    }
     .textareaInput /deep/ .el-textarea .el-input__count {
        bottom: 31px;
    }
    .textareaInput{
       margin-bottom: 0;
    }
    .textareaInput /deep/ .el-form-item__content {
        line-height: 20px;
    }
</style>
