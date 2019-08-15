<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>查看新闻</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                <el-form-item label="发布人"><span>{{form.newsWriter ? form.newsWriter : "--"}}</span></el-form-item>
                <el-form-item label="标题"><span>{{form.newsTitle ? form.newsTitle : "--"}}</span></el-form-item>
                <el-form-item label="类型">
                    <span v-if="form.newsType == 1">广场信息</span>
                    <span v-else-if ="form.newsType == 2">医疗新闻</span>
                    <span v-else-if ="form.newsType == 3">健康保健</span>
                     <span v-else>--</span>
                </el-form-item>
                <el-form-item label="图片">
                    <img v-if="form.newsImgsUrl" :src="form.newsImgsUrl">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="内容">
                     <span v-if="form.newsContent" v-html="form.newsContent"></span>
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
                newsId: "",
                newsWriter: "",
                newsTitle: "",
                newsType: "",
                newsContent: "",
                newsImgsUrl: ""
            },
        }
    },
    methods: {
        loadComponent(id) {
            this.form.newsId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.newsWriter = "";
            this.form.newsTitle = "";
            this.form.newsType = "";
            this.form.newsContent = "";
            this.form.newsImgsUrl = "";
        },
       
        getListData() {
            this.loading = true;
            var data = {
                newsId: this.form.newsId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "news/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                console.log(response.data)
                this.form.newsWriter = response.data.data.newsWriter;
                this.form.newsTitle = response.data.data.newsTitle;
                this.form.newsType = response.data.data.newsType;
                this.form.newsImgsUrl = response.data.data.newsImgsUrl;
                this.form.newsContent = response.data.data.newsContent;
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
    }
}
</script>

<style scoped>
    @import url("../../../../static/css/menu/dialog.css");
</style>
