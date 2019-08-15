<template>
	<div class="login">
		<!-- <img src="../../static/img/icon.jpeg" alt="">  -->
		<p>爱家医生管理平台</p>
		<div class="login-content">
			 <div class="content-form">
				 <el-form ref="ruleForm" :model="form" :rules="rules" status-icon>
                    <el-form-item prop="loginAccount" icon="el-icon-people">
                        <el-input class="form-input" type="text" v-model.trim="form.loginAccount" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="loginPassword" >
                        <el-input class="form-input" type="password" v-model.trim="form.loginPassword" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="form-login" type="success" @click="handleLogin">登录</el-button>
                    </el-form-item>                   
                </el-form>
			 </div>
		</div>
	</div>
</template>

<script>
import web from "@/static/js/common/web.js";
import md5 from 'js-md5';
export default {
	data(){
		return{
			form:{
				loginAccount:"",
				loginPassword:"",
			},
			rules:{
				loginAccount: [
                    { required: true, message: "用户名不能为空", trigger: "blur" }
                ],
                loginPassword: [
                    { required: true, message: "密码不能为空", trigger: "blur" }
                ],
			}
		}
	},
	methods:{
		handleLogin(){
            this.$router.push("/userlatform");
			this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    if(!this.loading) {
                        this.loading = true;
                        const loading = this.$loading({
                            lock: true,
                            text: "登录中...",
                            spinner: "el-icon-loading",
                            background: "rgba(255, 255, 255, 0.7)",
                            target: document.querySelector(".login-content"),
                        });
                        var config = {
                            type: 5,
                            name: "sys/login",
                            data: {loginAccount: this.form.loginAccount, loginPassword: md5(this.form.loginPassword), timeStamp:Date.parse(new Date())},
                            model: "User",
                            controller: "login",
                        }
                        web(config).then((response)=>{                          
                            if(response.data.status == 200){
                                this.$message.success("登录成功");
                                localStorage.setItem("userMessage", JSON.stringify(response.data.data));
                                this.$router.push("/userlatform/Useralldata");
                            }else{
                                loading.close();
                                this.loading = false;  
                                this.$message.error(response.data.msg);            
                            }
                        });
                    }
                }
            });
		  }
	},
	mounted(){
        this.$store.commit('clearAllTagItem');
    }

}
</script>

<style scoped>
   @import url("../../static/css/login.css"); 	
</style>
