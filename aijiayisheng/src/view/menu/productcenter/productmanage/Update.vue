<template>
    <div  class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>编辑商品</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form" :rules="rules" status-icon>
                 <el-form-item label="发布人">
                    <span v-if="modifier" v-text="modifier"></span>
                </el-form-item>
                <el-form-item label="标题" prop="facilityName">
                     <el-input type="text" placeholder="请输入标题" v-model.trim="form.facilityName" maxlength="20" resize="none" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="商品说明" prop="facilityExplain">
                    <el-input v-model.trim="form.facilityExplain" placeholder="商品说明"></el-input>
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
                <el-form-item label="内容" prop="facilityPresentation">        
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
        var validatornumber = (rule, value, callback) => {
            var regular = /^[0-9]*$/;//只允许输入数字
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
            modifier: "",
            loading: false,
            form: {
                facilityId: "",
                facilityName: "",
                newsWriter: "",
                facilityPresentation: "",
                facilityPicture: "",
                facilityCommodityMoney: "",
                facilityConveyMoney: "",
                facilityKc: "",
                facilityExplain: "",    
                timeStamp : Date.parse(new Date())     
            },
            rules: {
                facilityName: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                facilityExplain: [
                    { required: true, message: "商品说明不能为空", trigger: "blur" }
                ],
                facilityPresentation: [
                    { required: true, message: "内容不能为空", trigger: "blur" }
                ],
                 facilityCommodityMoney: [
                    { required: true, message: "价格不能为空", trigger: "blur" },
                    { validator: validatornumber, trigger: "blur" },
                ],
                facilityConveyMoney: [
                    { required: true, message: "快递费不能为空", trigger: "blur" },
                    { validator: validatornumber, trigger: "blur" },
                ],
                facilityKc: [
                    { required: true, message: "库存不能为空", trigger: "blur" },
                    { validator: validatornumber, trigger: "blur" },
                ],
                 facilityPicture: [
                    { required: true, message: "请上传图片", trigger: "change" }
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
            this.form.facilityId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.facilityName = "";
            this.form.newsWriter = "";
            this.form.facilityPresentation = "";
            this.form.facilityCommodityMoney = "";
            this.form.facilityConveyMoney = "";
            this.form.facilityKc = "";
            this.form.facilityExplain = "";
            this.form.facilityPicture = ""
        },
        getListData() {
            this.loading = true;
            var data = {
               facilityId: this.form.facilityId,
            };
            var config = {
                type: 5,
                name: "facility/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                //  console.log(response.data)
                this.form.facilityName = response.data.data.facilityName;
                this.form.facilityPresentation = response.data.data.facilityPresentation;
                this.form.facilityCommodityMoney = response.data.data.facilityCommodityMoney;
                this.form.facilityConveyMoney = response.data.data.facilityConveyMoney;
                this.form.facilityKc = response.data.data.facilityKc;
                this.form.facilityPicture = response.data.data.facilityPicture;
                this.form.facilityExplain = response.data.data.facilityExplain;
                this.getWangEditor();
                this.loading = false;
            });
        },
        getWangEditor(){
            this.editor = wangeditor("wangeditor");
            this.editor.create();
            this.editor.txt.html(this.form.facilityPresentation);
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
                    that.form.facilityPicture = url + data.data;
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
                        name: "facility/update",
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
    .form-content /deep/ .elseInput{
        width:40% !important;
        margin-right:10px;
    }
</style>
