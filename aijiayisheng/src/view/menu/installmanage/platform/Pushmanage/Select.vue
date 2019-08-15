<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>查看推送</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                <el-form-item label="发布人"><span>{{form.pushIssuer ? form.pushIssuer : "--"}}</span></el-form-item>
                <el-form-item label="发布时间">
                    <span v-if="form.pushDateTime">{{form.pushDateTime|dateFormat}}</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="标题"><span>{{form.pushName ? form.pushName : "--"}}</span></el-form-item>
                <el-form-item label="内容">
                    <span v-if="form.pushContent" v-html="form.pushContent"></span>
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
import { parseTime } from "@/static/js/common/common.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            loading: false,
            form: {
                pushId: "",
                pushIssuer: "",
                pushDateTime: "",
                pushName: "",
                pushContent: ""
            },
        }
    },
    filters:{
        dateFormat(val){
            if (!val) {
                return false;
            } 
            return parseTime(val);
        }
    },
    methods: {
        loadComponent(id) {
            this.form.pushId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.pushIssuer= "";
            this.form.pushDateTime = "";
            this.form.pushName= "";
            this.form.pushContent = "";
        },
        getListData() {
            this.loading = true;
            var data = {
                pushId: this.form.pushId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "push/queryid",
                data: data,
                model: "Policyana",
                controller: "detail",
            };
            web(config).then((response) => {
                console.log(response)
                this.form.pushIssuer= response.data.data.pushIssuer;
                this.form.pushDateTime = response.data.data.pushDateTime;
                this.form.pushName= response.data.data.pushName;
                this.form.pushContent = response.data.data.pushContent;
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
