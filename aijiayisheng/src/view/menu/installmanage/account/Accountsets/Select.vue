<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>查看账号</p>   
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                    <el-form-item label="账户账号:">
                        <span v-if="form.loginAccount" v-text="form.loginAccount"></span>
                        <span v-else>未填写</span>
                    </el-form-item>
                <el-form-item label="账户密码:">
                    <span v-if="form.loginPassword" v-html="form.loginPassword"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="角色名称:">
                    <span v-if="form.loginName" v-html="form.loginName"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="角色分类:">
                    <span v-if="form.loginRoleName == '1'">管理员</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="备注信息:">
                    <span v-if="form.loginNote" v-html="form.loginNote"></span>
                    <span v-else>未填写</span>
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
            roleId: "",
            form: {
                loginId: "",
                loginAccount: "",
                loginPassword: "",
                loginName: "",
                loginRoleName: "",
                loginNote: ""
            },
        }
    },
    methods: {
        loadComponent(id) {
            this.form.loginId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.loginAccount = "";
            this.form.loginPassword = "";
            this.form.loginName = "";
            this.form.loginRoleName = "";
            this.form.loginNote = "";
        },
        getListData() {
            this.loading = true;
            var data = {
                loginId: this.form.loginId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type:5,
                name: "sys/queryone",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form.loginAccount = response.data.data.loginAccount;
                this.form.loginPassword = "******";
                this.form.loginName = response.data.data.loginName;
                this.form.loginRoleName = response.data.data.loginRoleId;
                this.form.loginNote = response.data.data.loginNote;
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
