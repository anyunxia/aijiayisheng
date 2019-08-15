<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增商品</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="发布人">
                    <span v-if="facilityFbr" v-text="facilityFbr"></span>
                </el-form-item>
                <el-form-item label="标题" prop="facilityName" class="other_titleInput">
                   <el-input type="text" placeholder="请输入标题" v-model.trim="form.facilityName" maxlength="20" resize="none" show-word-limit></el-input>
                </el-form-item>
                 <el-form-item label="商品说明" prop="facilityExplain">
                    <el-input v-model.trim="form.facilityExplain"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="facilityPicture">
                    <div class="upload" @click="handleUpload">
                        <input ref="file" type="file" style="display:none;" @change="uploadFile($event)">
                        <img v-if="form.facilityPicture" :src="form.facilityPicture">
                        <span v-else v-text="uploadStatus"></span>
                    </div>
                </el-form-item>
                <el-form-item label="价格" prop="facilityCommodityMoney">
                    <el-input v-model.trim="form.facilityCommodityMoney" placeholder="金额" class="elseInput"></el-input>元
                </el-form-item>
                <el-form-item label="快递费" prop="facilityConveyMoney">
                    <el-input v-model.trim="form.facilityConveyMoney" placeholder="金额" class="elseInput"></el-input>元
                </el-form-item>
                <el-form-item label="库存" prop="facilityKc">
                    <el-input v-model.trim="form.facilityKc" placeholder="数量" class="elseInput"></el-input><span>个</span>
                </el-form-item>

                <el-form-item label="上下架" prop="facilityIsputaway">
                    <el-select v-model.trim="form.facilityIsputaway">
                        <el-option label="上架" value="1"></el-option>
                        <el-option label="暂不上架" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="facilityPresentation">
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
        var validatorAccount = (rule, value, callback) => {
            var regular = /^\d{n}$/;
            if(regular.test(value)){
                callback();
            }else{
                callback(new Error("只能输入数字!"));
            }
        };
        return{
            icon: "el-icon-rank",
            uploadStatus: "未上传",
            editor: "",
            timeStamp:"",
            facilityFbr: "",
            form: {
                facilityName: "",
                facilityPresentation: "",
                newsWriter:"",
                facilityPicture: "",
                facilityCommodityMoney: "",
                facilityConveyMoney: "",
                facilityExplain: "",
                facilityKc: "",
                facilityIsputaway: "",
                timeStamp: Date.parse(new Date())
                
            },
            rules: {
                facilityExplain: [
                    { required: true, message: "商品说明不能为空", trigger: "blur" }
                ],
                facilityName: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                facilityPresentation: [
                    { required: true, message: "内容不能为空", trigger: "blur" }
                ],
                facilityCommodityMoney: [
                    { required: true, message: "价格不能为空", trigger: "blur" },
                ],
                facilityConveyMoney: [
                    { required: true, message: "快递费不能为空", trigger: "blur" },
                ],
                facilityKc: [
                    { required: true, message: "库存不能为空", trigger: "blur" },
                    { validator: validatorAccount, trigger: "blur" },
                ],
                facilityIsputaway: [
                    { required: true, message: "请选择上下架", trigger: "blur" }
                ],
                facilityPicture: [
                    { required: true, message: "请上传图片", trigger: "change" }
                ],
            },
        }
    },
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.facilityFbr = item.loginName
    },
    methods: {
        loadComponent() {
            this.getRenderData();
            this.getWangEditor();
        },
        getRenderData(){
            this.form.facilityName = "";
            this.form.facilityCommodityMoney = "";
            this.form.facilityConveyMoney = "";
            this.form.facilityExplain = "";
            this.form.facilityKc = "";
            this.form.facilityIsputaway = "";
            this.form.facilityPicture = "",
            this.form.facilityPresentation = "";
            this.form.newsWriter = "",
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
            that.form.facilityPicture = "";
            that.uploadStatus = "上传中";
            function callBack(data){
                that.uploadStatus = "未上传";
                if(data.data) {
                    that.form.facilityPicture =url + data.data;
                }else{
                    that.uploadStatus = "上传失败";
                }
            };
            upload(event, 2, callBack);
        },
        handleSubmit() {
            if(this.editor.txt.text()){
                this.form.facilityPresentation = this.editor.txt.html();
            }else{
                this.form.facilityPresentation = "";
            }
            this.form.newsWriter = this.facilityFbr,
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
                        name: "facility/save",
                        data: this.form,
                        model: "News",
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
    @import url("../../../../static/css/menu/dialog.css");
    .other_titleInput /deep/ .el-form-item__error{
        position:static !important;
    }
    .number_title{
        line-height:18px;
    }
    .form-content /deep/ .elseInput{
        width:40% !important;
        margin-right:10px;
    }
</style>
