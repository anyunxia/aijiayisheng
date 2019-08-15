<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增医院</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                <el-form-item label="参数名称"><span>{{form.newsWriter ? form.newsWriter : "--"}}</span></el-form-item>
                <el-form-item label="设置比例"><span>{{form.newsTitle ? form.newsTitle : "--"}}</span></el-form-item>
                <el-form-item label="说明"><span>{{form.address ? form.address : "--"}}</span></el-form-item>
    
                
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
                address: ""
                
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
            this.form.address = "";
            
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
                this.form.address = response.data.data.address;
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
    @import url("../../../../../static/css/menu/dialog.css");
</style>
