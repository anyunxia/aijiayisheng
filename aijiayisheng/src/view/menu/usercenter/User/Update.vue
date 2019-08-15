<template>
    <div  class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>编辑信息</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :rules="rules" :model="form">
                <el-form-item label="用户id">
                    <span v-if="form.dwellerId" v-text="form.dwellerId"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="创建时间">
                    <span v-if="form.dwellerCreatdate">{{form.dwellerCreatdate|dateFormat}}</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="最后登录时间">
                    <span v-if="form.dwellerLastTime">{{form.dwellerLastTime|dateFormat}}</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="当前状态">
                    <!-- <span v-if="form.dwellerAccountState" v-text="form.dwellerAccountState"></span> -->
                    <span v-if="form.dwellerAccountState==1">正常</span>
                    <span v-else-if="form.dwellerAccountState==2">冻结</span>
                    <span v-else-if="form.dwellerAccountState==3">删除</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="qq绑定">
                    <span v-if="form.dwellerQq" v-text="form.dwellerQq"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="微信绑定">
                    <span v-if="form.dwellerWechat" v-text="form.dwellerWechat"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="姓名">
                    <span v-if="form.dwellerName" v-text="form.dwellerName"></span>
                    <span v-else>未填写</span>
                </el-form-item>

                <el-form-item label="身份证">
                    <span v-if="form.dwellerIdcard" v-html="form.dwellerIdcard"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="年龄">
                    <span v-if="form.policy_age" v-html="form.policy_age"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="性别">
                    <!-- <span v-if="form.dwellerSex" v-html="form.dwellerSex"></span> -->
                    <span v-if="form.dwellerSex==1">男</span>
                    <span v-else-if="form.dwellerSex==2">女</span>
                    <span v-else-if="form.dwellerSex==3">其它</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="是否已婚">
                    <!-- <span v-if="form.dwellerMarriage" v-text="form.dwellerMarriage"></span> -->
                    <span v-if="form.dwellerMarriage==1">未婚</span>
                    <span v-else-if="form.dwellerMarriage==2">已婚</span>
                    <span v-else-if="form.dwellerMarriage==3">丧偶</span>
                    <span v-else-if="form.dwellerMarriage==4">离婚</span>
                    <span v-else-if="form.dwellerMarriage==4">未说明的离婚状况</span>
                    <span v-else>未填写</span>
                </el-form-item>
               
               
                <el-form-item label="冻结" prop="recordContent">
                    <el-radio v-model="form.recordContent" label="1">正常</el-radio>
                    <el-radio v-model="form.recordContent" label="2">冻结</el-radio>
                </el-form-item>
                <el-form-item label="备注信息" class="textareaInput">
                    <el-input
                    type="textarea"
                    placeholder="请输入备注信息"
                    style="height:110px;"
                    v-model.trim="form.recordNotes"
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
            editor: "",
            loading: false,
            form: {
                dwellerId: "",
                dwellerCreatdate: "",
                dwellerLastTime: "",
                dwellerAccountState: "",
                dwellerQq: "",
                dwellerWechat: "",
                dwellerName: "",
                dwellerIdcard: "", 
                dwellerSex: "", 
                ddwellerAccountState: "",
                recordContent: "1",
                recordNotes: "",
                recordRole:""
            },
            rules: {
                recordContent: [
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
            this.form.dwellerId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.dwellerAccountState = "",
            this.form.dwellerQq = "",
            this.form.dwellerWechat = "",
            this.form.dwellerName = "",
            this.form.dwellerIdcard = "", 
            this.form.dwellerSex = "", 
            this.form.dwellerMarriage = "",
            this.form.recordNotes = "",
            this.form.dwellerCreatdate = "",
            this.form.dwellerLastTime = ""
        },
        
        getListData() {
            this.loading = true;
            var data = {
                dwellerId: this.form.dwellerId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "dweller/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form.dwellerId = response.data.data.dwellerId;
                this.form.dwellerAccountState = response.data.data.dwellerAccountState;
                this.form.dwellerQq = response.data.data.dwellerQq;
                this.form.dwellerWechat = response.data.data.dwellerWechat;
                this.form.dwellerName = response.data.data.dwellerName;
                this.form.dwellerIdcard = response.data.data.dwellerIdcard;
                this.form.dwellerSex = response.data.data.dwellerSex;
                this.form.dwellerMarriage = response.data.data.dwellerMarriage;
                this.form.dwellerCreatdate = response.data.data.dwellerCreatdate;
                this.form.dwellerLastTime = response.data.data.dwellerLastTime;
                this.loading = false;
            });
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
                        recordDwellerId: this.form.dwellerId,
                        recordContent: this.form.recordContent,
                        recordNotes: this.form.recordNotes,
                        recordRole: this.form.recordRole,
                        timeStamp: Date.parse(new Date())
                    };
                    var config = {
                        type:5,
                        name: "dweller/update",
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
