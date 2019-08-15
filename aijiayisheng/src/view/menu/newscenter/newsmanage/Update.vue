<template>
    <div  class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>编辑新闻</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form" :rules="rules" status-icon>
                 <el-form-item label="发布人">
                    <span v-if="modifier" v-text="modifier"></span>
                </el-form-item>
                <el-form-item label="标题:" prop="newsTitle">
                    <el-input v-model.trim="form.newsTitle" placeholder="admin"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="newsType">
                    <el-select v-model="form.newsType" placeholder="请选择">
                        <el-option label="广场信息" value="1"></el-option>
                        <el-option label="医疗新闻" value="2"></el-option>
                        <el-option label="健康保健" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
                    <div class="upload" @click="handleUpload">
                        <input ref="file" type="file" style="display:none;" @change="uploadFile($event)">
                        <img v-if="form.newsImgsUrl" :src="form.newsImgsUrl">
                        <span v-else v-text="uploadStatus"></span>
                    </div>
                </el-form-item>
                <el-form-item label="内容" prop="newsContent">
                    <div id="wangeditor"></div>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="success" size="small" plain @click="handleSubmit">重新发布</el-button>
            <el-button type="primary" size="small" plain @click="handleClose">取消</el-button>
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
            editor: "",
            modifier: "",
            uploadStatus: "未上传",
            loading: false,
            form: {
                newsId: "",
                newsTitle: "",
                newsWriter: "",
                newsType: "",
                newsContent: "",
                newsImgsUrl: "",
                timeStamp : Date.parse(new Date())           
            },
            rules: {
                newsTitle: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                newsType: [
                    { required: true, message: "请选择类型", trigger: "blur" }
                ],
                newsContent: [
                    { required: true, message: "内容不能为空", trigger: "blur" }
                ],
                newsImgsUrl: [
                    { required: true, message: "图片不能为空", trigger: "blur" }
                ],
            }
        }
    },
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.modifier = item.loginName
    },
    methods: {
        loadComponent(id) {
            this.form.newsId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.newsTitle = "";
            this.form.newsWriter = "";
            this.form.newsType = "";
            this.form.newsContent = "";
            this.form.newsImgsUrl = "";
        },
        getListData() {
            var data = {
               newsId: this.form.newsId,
            };
            var config = {
                type: 5,
                name: "news/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                //  console.log(response.data)
                this.loading = true;
                this.form.newsTitle = response.data.data.newsTitle;
                this.form.newsType = response.data.data.newsType;
                this.form.newsContent = response.data.data.newsContent;
                this.form.newsImgsUrl =  response.data.data.newsImgsUrl;
                this.getWangEditor();
                this.loading = false;
            });
        },
        getWangEditor(){
            this.editor = wangeditor("wangeditor");
            this.editor.create();
            this.editor.txt.html(this.form.newsContent);
        },
         handleUpload() {
            this.$refs.file.click();
        },
        uploadFile(event) {
            var that = this;
            that.form.newsImgsUrl = "";
            that.uploadStatus = "上传中";
            function callBack(data){
                that.uploadStatus = "未上传";
                if(data.data) {
                    that.form.newsImgsUrl = url + data.data;
                }else{
                    that.uploadStatus = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        handleSubmit() {
            if(this.editor.txt.text()){
                this.form.newsContent = this.editor.txt.html();
            }else{
                this.form.newsContent = "";
            }
            this.form.newsWriter = this.modifier,
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
                        name: "news/update",
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
    @import url("../../../../static/css/menu/dialog.css");
   
</style>
