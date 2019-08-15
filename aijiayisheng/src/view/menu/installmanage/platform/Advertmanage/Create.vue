<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增广告</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="发布人">
                    <span v-if="modifier" v-text="modifier"></span>
                </el-form-item>
                <el-form-item label="标题" prop="advertisingTitle" class="other_titleInput">
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
                <!-- <el-form-item label="内容" prop="advertisingDescribe" class="other_input">
                    <textarea maxlength="100" @input="descInput" v-model="form.advertisingDescribe" placeholder="请输入内容" class="other_textarea"/>
                    <span class="number_title"><i>{{remnant}}</i>/100字</span>
                </el-form-item> -->
                <el-form-item label="内容" prop="advertisingDescribe">
                    <div id="wangeditor"></div>
                </el-form-item>
                <el-form-item label="图片" prop="advertisingImgsUrl">
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
             <!-- <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%" append-to-body>
                <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisiblefalse">确 定</el-button>
                </span>
        </el-dialog> -->
        </div>
         
        <div class="form-button">
            <el-button type="primary" size="small" plain @click="handleClose">取消</el-button>
            <el-button type="success" size="small" plain @click="handleSubmit">发布</el-button>
        </div>
        
    </div>
</template>

<script>
import axios from "axios";
import upload from "@/static/js/common/upload.js";
import web from "@/static/js/common/web.js";
import wangeditor from "@/static/js/common/wangeditor.js";
import {url} from "@/static/js/common/commonUrl.js";
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
export default {
    components: {
        VueCropper
    },
    data() {
        return{
            icon: "el-icon-rank",
            editor: "",
            uploadStatus: "未上传",
            modifier: "老王",
             dialogVisible: false,
             imgSrc: '',
             filedata: "",
            form: {
                advertisingTitle: "",
                advertisingDescribe: "",
                advertisingLocation: "",
                advertisingImgsUrl: "",
                advertisingUrl: "",
                
            },
            rules: {
                advertisingTitle: [
                    { required: true, message: "标题不能为空", trigger: "change" }
                ],
                advertisingLocation: [
                    { required: true, message: "请选择位置", trigger: "change" }
                ],
                advertisingDescribe: [
                    { required: true, message: "请填写内容", trigger: "change" }
                ],
                advertisingImgsUrl: [
                    { required: true, message: "请上传图片", trigger: "change" }
                ],
                advertisingUrl: [
                    { required: true, message: "请输入链接", trigger: "change" }
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
        loadComponent() {
            this.getRenderData();
            this.getWangEditor();
        },
        getRenderData(){
            this.form.advertisingTitle = "",
            this.form.advertisingDescribe = "",
            this.form.advertisingLocation = "",
            this.form.advertisingImgsUrl = "",
            this.form.advertisingUrl = ""
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
            that.form.advertisingImgsUrl = "";
            that.uploadStatus = "上传中";
            function callBack(data){
                that.uploadStatus = "未上传";
                if(data.data) {
                    console.log(data)
                    that.form.advertisingImgsUrl = url + data.data;
                }else{
                    that.uploadStatus = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        
        handleSubmit() {
            if(this.editor.txt.text()){
                this.form.advertisingDescribe =  this.editor.txt.html();
            }else{
                this.form.advertisingDescribe = "";
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
                        name: "advertising/save",
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
</style>
