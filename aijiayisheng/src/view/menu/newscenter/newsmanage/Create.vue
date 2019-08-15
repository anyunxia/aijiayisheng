<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>新增新闻</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="发布人">
                    <span v-if="modifier" v-text="modifier"></span>
                </el-form-item>
                <el-form-item label="标题" prop="newsTitle" class="other_titleInput">
                     <el-input type="text" placeholder="请输入标题" v-model.trim="form.newsTitle" maxlength="40" resize="none" show-word-limit></el-input>
                </el-form-item>
                
                <el-form-item label="类型" prop="newsType">
                    <el-select v-model.trim="form.newsType">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="广场信息" value="1"></el-option>
                        <el-option label="医疗新闻" value="2"></el-option>
                        <el-option label="健康保养" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="头图" prop="newsImgsUrl">
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
            <el-button type="success" size="small" @click="handleSubmit">发布</el-button>
            <el-button type="primary" size="small" @click="handleClose">取消</el-button>
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
            remnantTitle: 0,
            editor: "",
            uploadStatus: "未上传",
            timeStamp:"",
            modifier: "",
            form: {
                newsTitle: "",
                newsContent: "",
                newsWriter:"",
                newsType: "",
                newsImgsUrl: "",
                timeStamp: Date.parse(new Date())
                
            },
            rules: {
                newsTitle: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
               
                newsType: [
                    { required: true, message: "类型不能为空", trigger: "blur" }
                ],
                newsContent: [
                    { required: true, message: "内容不能为空", trigger: "blur" }
                ]
                // newsImgsUrl: [
                //     { required: true, message: "请上传图片", trigger: "change" }
                // ],
            },
        }
    },
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.modifier = item.loginName
    },
    methods: {
        descInputTitle(){
            var txtValTit = this.form.newsTitle.length;
            this.remnantTitle = 0 + txtValTit;
        },
        loadComponent() {
            this.getRenderData();
            this.getWangEditor();
        },
        getRenderData(){
            this.form.newsTitle = "";
            this.form.newsType = "";
            this.form.newsContent = "";
            this.form.newsWriter = "",
            this.form.newsImgsUrl = "",
            this.timeStamp = Date.parse(new Date())
        },
        getWangEditor(){
            this.editor = wangeditor("wangeditor");
            this.editor.create();
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
                    console.log(data)
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
                    const loading = this.$loading({
                        lock: true,
                        text: "提交中...",
                        spinner: "el-icon-loading",
                        background: "rgba(255, 255, 255, 0.7)",
                        target: document.querySelector(".form-content"),
                    });
                    var config = {
                        type: 5,
                        name: "news/save",
                        data: this.form,
                        model: "News",
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
    @import url("../../../../static/css/menu/dialog.css");
    .other_titleInput /deep/ .el-form-item__error{
        position:static !important;
    }
    .number_title{
        line-height:18px;
    }
</style>
