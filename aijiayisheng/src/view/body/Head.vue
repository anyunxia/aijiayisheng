<template>
    <div class="head">
        <div class="head-logo">综合信息平台</div>
        <div class="head-content">
            <div class="content-user">
                <div class="user-img">
                    <img v-if="headUrl" :src="headUrl">
                    <span v-else>未上传</span>
                </div>
                <div class="user-name">
                    <el-dropdown trigger="click" @command="handleMenu">
                        <span class="el-dropdown-link">
                            {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">
                                <i class="el-icon-edit"></i>
                                <span>修改密码</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="2">
                                <i class="el-icon-close"></i>
                                <span>退出登录</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>

        <!-- 修改密码 -->
        <el-dialog
            width="30%"
            :visible="dialog.passwordVisible"
            :close-on-click-modal="false"
            @close="closeDialog"
        >
            <div class="form-content">
                <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                    <el-form-item label="新密码" prop="password">
                        <el-input v-model.trim="form.password"></el-input>
                    </el-form-item>
                </el-form>
                <div class="form-button">
                    <el-button type="success" size="small" plain @click="changPassword">提交</el-button>
                    <el-button type="primary" size="small" plain @click="closeDialog">关闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'js-md5';
import web from "@/static/js/common/web.js";
import getNowDate from '@/static/js/common/getNowDate';
export default {
    data(){
        return{
            username: "未填写",
            headUrl: "",
            dialog: {
                passwordVisible: false,
            },
            form: {
                password: "",
            },
            rules: {
                password: [
                    { required: true, message: "请输入新密码", trigger: "blur" }
                ],
            }
        }
    },
    methods: {
        handleMenu(key) {
            switch(key) {
                case "1":
                    this.dialog.passwordVisible = true;
                break;
                case "2":
                    this.logout();
                break;
            }
        },
        changPassword() {
            var config = {
                type: 2,
                name: "user_edit_pwd",
                data: {password: this.form.password},
                model: "User",
                controller: "edit_pwd",
            }
            web(config).then((response)=>{
                if(response.data.code == 200){
                    this.$message.success("修改成功");
                    localStorage.clear();
                    this.$router.push("/login");
                }else{
                    this.$message.error(response.data.msg);
                    this.closeDialog();
                }
            });
        },
        closeDialog() {
            this.dialog.passwordVisible = false;
        },
        logout() {
            localStorage.clear();
            this.$router.push("/");
        }
    },
    mounted() {
        if(localStorage.getItem("userMessage")){
            var userMessage = JSON.parse(localStorage.getItem("userMessage")); 
            // this.username = userMessage.data.username;
            // this.headUrl = userMessage.data.head_url;
        }
    }
}
</script>

<style scoped>
    @import url("../../static/css/body.css");
</style>
