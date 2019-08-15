<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>查看广告</p>
            <el-form ref="ruleForm" label-width="120px" v-loading="loading" label-position="left" :model="form">
                <el-form-item label="发布人"><span>{{form.platform_publisher ? form.platform_publisher : "--"}}</span></el-form-item>
                <el-form-item label="标题"><span>{{form.advertisingTitle ? form.advertisingTitle : "--"}}</span></el-form-item>
                <el-form-item label="位置"><span>{{form.advertisingLocation ? form.advertisingLocation : "--"}}</span></el-form-item>
                <el-form-item label="内容">
                    <span v-if="form.advertisingDescribe" v-html="form.advertisingDescribe"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="图片">
                    <img v-if="form.advertisingImgsUrl" :src="form.advertisingImgsUrl">
                    <span v-else>未上传</span>
                </el-form-item>
                 <el-form-item label="链接"><span>{{form.advertisingUrl ? form.advertisingUrl : "--"}}</span></el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="primary" size="small" plain @click="handleClose">关闭</el-button>
        </div>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            loading: false,
            form: {
                advertisingId: "",
                platform_publisher: "",
                advertisingLocation: "",
                advertisingTitle: "",
                advertisingDescribe: "",
                advertisingImgsUrl: "",
                advertisingUrl: ""
            },
        }
    },
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.form.platform_publisher = item.loginName
    },
    methods: {
        loadComponent(id) {
            this.form.advertisingId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.advertisingLocation = "";
            this.form.advertisingTitle= "";
            this.form.advertisingDescribe = "";
            this.form.advertisingImgsUrl = "";
            this.form.advertisingUrl = "";
        },
        getListData() {
            this.loading = true;
            var data = {
                advertisingId: this.form.advertisingId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "advertising/queryid",
                data: data,
                model: "Policyana",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form.advertisingLocation = response.data.data.advertisingLocation;
                this.form.advertisingTitle= response.data.data.advertisingTitle;
                this.form.advertisingDescribe = response.data.data.advertisingDescribe;
                this.form.advertisingImgsUrl = response.data.data.advertisingImgsUrl;
                this.form.advertisingUrl = response.data.data.advertisingUrl;
                this.loading = false;
            });
        },
        handleClose() {
            this.$emit("closeDialog");
        },
        changeDialog() {
            this.icon = this.icon == "el-icon-rank" ? "el-icon-menu" : "el-icon-rank";
            this.$emit("changeDialog");
        }
    },
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/dialog.css");
   
</style>
