<template>
    <div  class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>编辑信息</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :rules="rules" :model="form">
                <el-form-item label="用户id">
                    <span v-if="form.doctorId" v-text="form.doctorId"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="创建时间">
                    <span v-if="form.doctorCreatedate">{{form.doctorCreatedate|dateFormat}}</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="最后登录时间">
                    <span v-if="form.doctorZhdlsj">{{form.doctorZhdlsj|dateFormat}}</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="当前状态">
                    <span v-if="form.doctorZhzt==1">正常</span>
                    <span v-else-if="form.doctorZhzt==2">冻结</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="手机号">
                    <span v-if="form.doctorSjh" v-html="form.doctorSjh"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="qq绑定">
                    <span v-if="form.doctorQq" v-text="form.doctorQq"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="微信绑定">
                    <span v-if="form.doctorWx" v-text="form.doctorWx"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="姓名">
                    <span v-if="form.doctorXm" v-text="form.doctorXm"></span>
                    <span v-else>--</span>
                </el-form-item>

                <el-form-item label="身份证">
                    <span v-if="form.doctorSfz" v-html="form.doctorSfz"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="年龄">
                    <span v-if="form.doctorAge" v-html="form.doctorAge"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="性别">
                    <span v-if="form.doctorXb==1">男</span>
                    <span v-else-if="form.doctorXb==2">女</span>
                    <span v-else-if="form.doctorXb==3">其他</span>
                    <span v-else>--</span>
                </el-form-item>
                 <el-form-item label="所在医院">
                    <span v-if="form.doctorOrgName" v-text="form.doctorOrgName"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="一级科室">
                    <span v-if="form.doctorOrgYjoffice" v-text="form.doctorOrgYjoffice"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="二级科室">
                    <span v-if="form.doctorOffice" v-html="form.doctorOffice"></span>
                    <span v-else>--</span>
                 </el-form-item>
                <p>认证信息</p>
                <el-form-item label="身份证照片">
                    <img v-if="form.yszsSfzzm" :src="form.yszsSfzzm" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                    <img v-if="form.yszsSfzfm" :src="form.yszsSfzfm" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="手持身份证照片">
                    <img v-if="form.yszsScsfzzp  " :src="form.yszsScsfzzp" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="医师资格证">
                    <img v-if="form.yszsYszgz" :src="form.yszsYszgz" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="职业证书">
                    <img v-if="form.yszsZyzs" :src="form.yszsZyzs" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                </el-form-item>

                <el-form-item label="冻结" prop="accountState">
                    <el-radio v-model="form.accountState" label="1">正常</el-radio>
                    <el-radio v-model="form.accountState" label="2">冻结</el-radio>
                </el-form-item>
               <el-form-item label="备注信息" class="textareaInput">
                    <el-input
                    type="textarea"
                    placeholder="请输入备注信息"
                    style="height:110px;"
                    v-model.trim="form.recordRemark"
                    maxlength="100"
                    show-word-limit
                    >
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="success" size="small" plain @click="handleSubmit">提交</el-button>
            <el-button type="primary" size="small" plain @click="handleClose">关闭</el-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import web from "@/static/js/common/web.js";
import {getNowFormatDate, parseTime } from "@/static/js/common/common.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            uploadStatus: "未上传",
            editor: "",
            loading: false,
            form: {
                doctorId: "",
                doctorCreatedate: "",
                doctorZhdlsj: "",
                doctorZhzt: "",
                doctorQq: "",
                doctorWx: "",
                doctorXm: "",
                doctorSfz: "",
                doctorAge: "",
                doctorXb: "",
                recordRemark: "",
                recordRole:"",
                yszsSfzzm: "",
                yszsSfzfm: "",
                yszsScsfzzp: "",
                yszsYszgz: "",
                yszsZyzs: "",
                doctorSjh: "",
                accountState: "",
                doctorOrgName: "",
                doctorOrgYjoffice: "",
                doctorOffice: ""
            },
            rules:{
                 accountState: [
                    { required: true, message: "请选择冻结状态", trigger: "blur" }
                ]
            },
            tableData: []
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
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.form.recordRole = item.loginRoleName
    },
    methods: {
        loadComponent(id) {
            this.form.doctorId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.doctorZhzt = "";
            this.form.doctorQq = "";
            this.form.doctorWx = "";
            this.form.doctorXm = "";
            this.form.doctorSfz = "";
            this.form.doctorAge = "";
            this.form.doctorXb = "";

            this.form.recordRemark = "";
            this.form.doctorCreatedate = "";
            this.form.doctorZhdlsj = "";
            this.form.yszsSfzzm = "";
            this.form.yszsSfzfm = "";
            this.form.yszsScsfzzp = "";
            this.form.yszsYszgz = "";
            this.form.yszsZyzs = "";
            this.form.doctorSjh = "";
            this.form.doctorOrgName= "";
            this.form.doctorOrgYjoffice= "";
            this.form.doctorOffice= ""
        },
        
        getListData() {
            this.loading = true;
            var data = {
                doctorId: this.form.doctorId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "doctor/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form = response.data.data
                this.tableData = response.data.data.doctorRecord;
                this.loading = false;
            });
        },
        handleUpload() {
            this.$refs.file.click();
        },
        handleSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    var loading = this.$loading({
                        lock: true,
                        text: "提交中...",
                        spinner: "el-icon-loading",
                        background: "rgba(255, 255, 255, 0.7)",
                        target: document.querySelector(".form-content"),
                    });
                    var data = {
                        doctorId: this.form.doctorId,
                        accountState: this.form.accountState,
                        recordRemark: this.form.recordRemark,
                        timeStamp: Date.parse(new Date())
                    };
                    var config = {
                        type:5,
                        name: "doctor/update",
                        data: data,
                        model: "Policydoc",
                        controller: "edit",
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
   .form-content /deep/ .el-form-item{
        margin-bottom:0 !important;
    }
    .textareaInput /deep/ textarea{
        min-height: 80px !important;
        margin-top:10px;
    }
    .textareaInput /deep/ .el-textarea .el-input__count {
        bottom: 31px;
    }
    .textareaInput /deep/ .el-form-item__content {
        line-height: 20px;
    }
</style>
