<template>
    <div class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增账号</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="账户账号:" prop="loginAccount">
                    <el-input v-model.trim="form.loginAccount" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="账户密码:" prop="loginPassword">
                    <el-input type="password" v-model.trim="form.loginPassword" placeholder="请输入账户密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="policy_againpassword">
                    <el-input type="password" v-model.trim="form.policy_againpassword" placeholder="请再次输入账户密码"></el-input>
                </el-form-item>
                <el-form-item label="角色名称:" prop="loginName">
                    <el-input v-model.trim="form.loginName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色分类" prop="roleId">
                    <el-select v-model="form.roleId" placeholder="请选择">
                        <el-option
                        v-for="item in roleData"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注信息" prop="loginNote" class="textareaInput">
                    <el-input type="textarea" placeholder="请输入专长介绍" style="height:110px;" v-model.trim="form.loginNote" maxlength="100" resize="none" show-word-limit></el-input>
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
import md5 from 'js-md5';
export default {
    data() {
        var validatorAccount = (rule, value, callback) => {
            var regular = /^[a-zA-Z0-9]{4,18}$/;//4-18位字母和数字的混合
            if(regular.test(value)){
                callback();
            }else{
                callback(new Error("请输入正确的账户账号!"));
            }
        };
        var validatorPass1 = (rule, value, callback) => {
            // var regular = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;//至少有一个数字字母的正则表达式：
            var regular = /^[a-zA-Z0-9]{6,18}$/;
            if(regular.test(value)){
                callback();
            }else{
                callback(new Error("请输入正确的账户密码!"));
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {  
            callback();
            } else if (value !== this.form.loginPassword) { 
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        var validateRolename = (rule, value, callback) => {
            var regular = /^[\u4e00-\u9fa5]{1,8}$/;
            if(regular.test(value)){
                callback();
            }else{
                callback(new Error("请输入正确的角色名称!"));
            }
        };
        return{
            icon: "el-icon-rank",
            editor: "",
            roleData: [],
            form: {
                loginAccount: "",
                loginPassword: "",
                policy_againpassword: "",
                roleId: "",
                loginName: "",
                loginNote: "",
            },
            rules: {
                loginAccount: [
                    { required: true, message: "账户账号不能为空", trigger: "blur" },
                    { validator: validatorAccount, trigger: "blur" },
                ],
                loginPassword: [
                    { required: true, message: "账户密码不能为空", trigger: "blur" },
                    { validator: validatorPass1, trigger: "blur" },
                ],
                policy_againpassword: [
                    { required: true, message: "确认密码不能为空", trigger: "blur" },
                    { validator: validatePass2, trigger: "blur" },
                ],
                loginName: [
                    { required: true, message: "角色名称不能为空", trigger: "blur" },
                    { validator: validateRolename, trigger: "blur" },
                ],
                roleId: [
                    { required: true, message: "请选择角色分类", trigger: "change" }
                ],
                loginNote: [
                    { required: true, message: "请填写备注信息", trigger: "blur" }
                ],
            },
        }
    },
    // mounted(){
    //     var item = JSON.parse(localStorage.getItem("userMessage"))
    //     this.form.roleId = item.roleId
    // },
    methods: {
        loadComponent() {
            this.getRenderData();
        },
        getRenderData(){
            this.form.loginAccount = "";
            this.form.loginPassword = "";
            this.form.policy_againpassword = "";
            this.form.loginName = "";
            this.form.loginNote = "";
        },
        //获取下拉框
        getroleSelect() {      
            var config = {
                type: 5,
                name: "role/querylist",
                data: {},
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                    this.roleData = response.data.data;
                }
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
                    var config = {
                        type: 5,
                        name: "sys/save",
                        data: {
                            loginAccount: this.form.loginAccount, 
                            loginPassword: md5(this.form.loginPassword),
                            loginName: this.form.loginName,
                            loginRoleId: this.form.roleId,
                            loginNote: this.form.loginNote,
                            timeStamp : new Date().getTime()
                        },
                        model: "Policydoc",
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
    },
    mounted() {
        this.getroleSelect();
    }
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/dialog.css");
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
