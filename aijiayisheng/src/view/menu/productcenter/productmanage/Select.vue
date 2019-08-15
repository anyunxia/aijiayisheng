<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>查看新闻</p>
            <el-form ref="ruleForm" label-width="120px" v-loading="loading" label-position="left" :model="form">
                <el-form-item label="发布人"><span>{{form.facilityFbr ? form.facilityFbr : "--"}}</span></el-form-item>
                <el-form-item label="标题"><span>{{form.facilityName ? form.facilityName : "--"}}</span></el-form-item>
                <el-form-item label="标题"><span>{{form.facilityExplain ? form.facilityExplain : "--"}}</span></el-form-item>
                <el-form-item label="图片">
                    <img v-if="form.facilityPicture" :src="form.facilityPicture">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="价格"><span>{{form.facilityCommodityMoney ? form.facilityCommodityMoney : "--"}}</span></el-form-item>
                <el-form-item label="快递费"><span>{{form.facilityConveyMoney ? form.facilityConveyMoney : "--"}}</span></el-form-item>
                <el-form-item label="库存"> <span>{{form.facilityKc ? form.facilityKc : "--"}}</span></el-form-item>
                <el-form-item label="内容">
                     <span v-if="form.facilityPresentation" v-html="form.facilityPresentation"></span>
                    <span v-else>--</span>
                </el-form-item>
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
                facilityId: "",
                facilityFbr: "",
                facilityName: "",
                facilityPresentation: "",
                facilityCommodityMoney: "",
                facilityConveyMoney: "",
                facilityKc: "",
                facilityPicture: "",
                facilityExplain: ""
            },
        }
    },
    methods: {
        loadComponent(id) {
            this.form.facilityId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.facilityFbr = "";
            this.form.facilityName = "";
            this.form.facilityPresentation = "";
            this.form.facilityCommodityMoney = "";
            this.form.facilityConveyMoney = "";
            this.form.facilityKc = "";
            this.form.facilityPicture = "";
            this.form.facilityExplain = "";
        },
        getListData() {
            this.loading = true;
            var data = {
                facilityId: this.form.facilityId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "facility/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail", 
            };
            web(config).then((response) => {  
                this.form.facilityFbr = response.data.data.facilityFbr;
                this.form.facilityName = response.data.data.facilityName;
                this.form.facilityPresentation = response.data.data.facilityPresentation;
                this.form.facilityCommodityMoney = response.data.data.facilityCommodityMoney;
                this.form.facilityConveyMoney = response.data.data.facilityConveyMoney + '';
                this.form.facilityKc = response.data.data.facilityKc;
                this.form.facilityPicture = response.data.data.facilityPicture;
                this.form.facilityExplain = response.data.data.facilityExplain;
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
    @import url("../../../../static/css/menu/dialog.css");
</style>
