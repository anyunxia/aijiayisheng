<template>
    <div  class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>编辑账号</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form" :rules="rules" status-icon>
                <el-form-item label="发布人">
                    <span v-if="modifier" v-text="modifier"></span>
                </el-form-item>
                <el-form-item label="标题" prop="advertisingTitle">
                     <el-input type="text" placeholder="请输入标题" v-model.trim="form.advertisingTitle" maxlength="20" resize="none" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="位置" prop="advertisingLocation">
                    <el-select v-model.trim="form.advertisingLocation">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                         </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="advertisingDescribe">
                    <div id="wangeditor"></div>
                </el-form-item>
                <el-form-item label="图片">
                    <div class="upload" @click="handleUpload">
                        <input ref="file" type="file" style="display:none;" @change="uploadFile($event)">
                        <img v-if="form.advertisingImgsUrl" :src="form.advertisingImgsUrl">
                        <span v-else v-text="uploadStatus"></span>
                    </div>
                </el-form-item>
                <el-form-item label="链接" prop="advertisingUrl">
                    <el-input v-model.trim="form.advertisingUrl" placeholder="http://"></el-input>
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
import upload from "@/static/js/common/upload.js";
import wangeditor from "@/static/js/common/wangeditor.js";
import {url} from "@/static/js/common/commonUrl.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            uploadStatus: "未上传",
            modifier: "",
            editor: "",
            loading: false,
            form: {
                advertisingId: "",
                advertisingTitle: "",
                advertisingDescribe: "",
                advertisingLocation: "",
                advertisingImgsUrl: "",
                advertisingUrl: "",
                timeStamp: Date.parse(new Date())
               
            },
            rules: {
                advertisingTitle: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                advertisingLocation: [
                    { required: true, message: "请选择位置", trigger: "blur" }
                ],
                advertisingImgsUrl: [
                    { required: true, message: "图片不能为空", trigger: "blur" }
                ],
                advertisingDescribe: [
                    { required: true, message: "请填写内容", trigger: "blur" }
                ],
                advertisingUrl: [
                    { required: true, message: "请输入链接", trigger: "blur" }
                ],
            },
            options: [{
                value: '',
                label: '全部'
                }, {
                value: '用户端首页',
                label: '用户端首页'
                }, {
                value: '用户端健康页',
                label: '用户端健康页'
                }, {
                value: '医生端首页',
                label: '医生端首页'
                }
            ],
        }
    },
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.modifier = item.loginName
    },
    methods: {
        loadComponent(id) {
            this.form.advertisingId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.advertisingTitle = "";           
            this.form.advertisingLocation = "";
            this.form.advertisingImgsUrl = "";
            this.form.advertisingUrl = "";
            this.form.advertisingDescribe = ""
        },
        getListData() {
            this.loading = true;
            var data = {
                advertisingId: this.form.advertisingId,
            };
            var config = {
                type: 5,
                name: "advertising/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
               
                this.form.advertisingTitle =  response.data.data.advertisingTitle;
                this.form.advertisingLocation =  response.data.data.advertisingLocation;
                this.form.advertisingImgsUrl =  response.data.data.advertisingImgsUrl;
                this.form.advertisingUrl =  response.data.data.advertisingUrl;
                this.form.advertisingDescribe =  response.data.data.advertisingDescribe;
                this.getWangEditor();
                this.loading = false;
            });
        },
        getWangEditor(){
            this.editor = wangeditor("wangeditor");
            this.editor.create();
            this.editor.txt.html(this.form.advertisingDescribe);
        },
         handleUpload() {
            this.$refs.file.click();
        },
        uploadFile(event) {
            var that = this;
            that.form.advertisingImgsUrl = "";
            that.uploadStatus = "上传中";
            function callBack(data){
                that.uploadStatus = "未上传";
                if(data.data) {
                    that.form.advertisingImgsUrl = url + data.data;
                }else{
                    that.uploadStatus = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        
        handleSubmit() {
            if(this.editor.txt.text()){
                this.form.advertisingDescribe = this.editor.txt.html();
            }else{
                this.form.advertisingDescribe = "";
            }
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
                        name: "advertising/update",
                        data: this.form,
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
    @import url("../../../../../static/css/menu/dialog.css");
</style>
