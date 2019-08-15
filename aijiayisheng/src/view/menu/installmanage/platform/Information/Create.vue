<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增分类</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="修改人">
                    <span v-if="amend_user" v-text="amend_user"></span>
                </el-form-item>
                <el-form-item label="应用" prop="protocolPort">
                    <el-select v-model.trim="form.protocolPort">
                        <el-option label="用户端" value="1"></el-option>
                        <el-option label="医生端" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="protocolName">
                    <el-input v-model.trim="form.protocolName" placeholder="请输入标题"></el-input>
                </el-form-item>
                <!-- <el-form-item label="内容" prop="policy_content" class="other_input">
                    <textarea maxlength="300" @input="descInput" v-model.trim="form.policy_content" placeholder="请输入内容" class="other_textarea"/>
                    <span class="number_title"><i>{{remnant}}</i>/300字</span>
                </el-form-item> -->
                <el-form-item label="内容" prop="protocolContent">
                    <div id="wangeditor"></div>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="success" size="small" plain @click="handleSubmit">确定</el-button>
            <el-button type="primary" size="small" plain @click="handleClose">取消</el-button>
             
        </div>
    </div>
</template>

<script>
import axios from "axios";
import web from "@/static/js/common/web.js";
import wangeditor from "@/static/js/common/wangeditor.js";
import moment from 'moment';
import { parseTime } from "@/static/js/common/common.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            editor: "",
            amend_user: "",
            form: {
                
                protocolName: "",
                protocolPort: "",
                protocolContent: "",
                timeStamp: Date.parse(new Date())
            },
            rules: {
                protocolName: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                protocolPort: [
                    { required: true, message: "请选择应用", trigger: "blur" }
                ],
                protocolContent: [
                    { required: true, message: "内容不能为空", trigger: "blur" }
                ],
            },
        }
    },
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.amend_user = item.loginName
    },
    methods: {
        loadComponent() {
            this.getRenderData();
            this.getWangEditor();
        },
        getRenderData(){
            this.form.protocolName = "";
            this.form.protocolContent = "";
        },
        getWangEditor(){
            this.editor = wangeditor("wangeditor");
            this.editor.create();
        },
        handleSubmit() {
            if(this.editor.txt.text()){
                this.form.protocolContent = this.editor.txt.html();
            }else{
                this.form.protocolContent = "";
            } 
            this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    var loading = this.$loading({
                        lock: true,
                        text: "发布中...",
                        spinner: "el-icon-loading",
                        background: "rgba(255, 255, 255, 0.7)",
                        target: document.querySelector(".form-content"),
                    });
                    var config = {
                        type: 5,
                        name: "protocol/save",
                        data: this.form,
                        model: "Policyana",
                        controller: "add",
                    };
                    web(config).then((response) => {
                        console.log(response.data)
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
        }
    }
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/dialog.css");
    
   
</style>
