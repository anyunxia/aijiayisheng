<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增推送</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="发布人">
                    <span v-if="form.pushIssuer" v-text="form.pushIssuer"></span>
                </el-form-item>
                <el-form-item label="标题" prop="pushName">
                    <el-input v-model.trim="form.pushName"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="pushContent">
                    <div id="wangeditor"></div>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="primary" size="small" plain @click="handleClose">取消</el-button>
            <el-button type="warning" size="small" plain @click="handleDraft">存草稿</el-button>
            <el-button type="success" size="small" plain @click="handleSubmit">发布</el-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import web from "@/static/js/common/web.js";
import wangeditor from "@/static/js/common/wangeditor.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            editor: "",
            modifier: "",
            form: {
                pushIssuer: "",
                pushName: "",
                pushContent: "",
                pushRoleName: "",
                pushState:""               
            },
            rules: {
                pushName: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                pushContent: [
                    { required: true, message: "内容不能为空", trigger: "blur" }
                ],
            },
        }
    },
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.form.pushIssuer = item.loginName
        this.form.pushRoleName = item.loginRoleName
    },
    methods: {
        loadComponent() {
            this.getRenderData();
            this.getWangEditor();
        },
        getRenderData(){
            this.form.pushName = "";
            this.form.pushContent = "";
        },
        getWangEditor(){
            this.editor = wangeditor("wangeditor");
            this.editor.create();
        },
        handleSubmit() {
            this.form.pushState = "2"
            if(this.editor.txt.text()){
                this.form.pushContent = this.editor.txt.html();
            }else{
                this.form.pushContent = "";
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
                        name: "push/save",
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
         handleDraft(){
            this.form.pushState = "1"
             if(this.editor.txt.text()){
                this.form.pushContent = this.editor.txt.html();
            }else{
                this.form.pushContent = "";
            }
            this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    var loading = this.$loading({
                        lock: true,
                        text: "存稿中...",
                        spinner: "el-icon-loading",
                        background: "rgba(255, 255, 255, 0.7)",
                        target: document.querySelector(".form-content"),
                    });
                    var config = {
                        type: 5,
                        name: "push/save",
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
    @import url("../../../../../static/css/menu/dialog.css");
</style>
