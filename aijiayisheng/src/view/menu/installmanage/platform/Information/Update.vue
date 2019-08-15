<template>
    <div  class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form" :rules="rules" status-icon>
                <el-form-item label="修改人">
                    <span v-text="amend_user"></span>
                </el-form-item>
                <el-form-item label="应用" prop="protocolPort">
                    <el-select v-model.trim="form.protocolPort">
                        <el-option label="用户端" value="1"></el-option>
                        <el-option label="医生端" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="protocolName">
                     <el-input v-model.trim="form.protocolName" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="protocolContent">
                    <div id="wangeditor"></div>
                </el-form-item>
                <el-form-item label="备注">
                     <el-input v-model.trim="form.historyRemarks" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="success" size="small" plain @click="handleSubmit">提交</el-button>
            <el-button type="primary" size="small" plain @click="handleClose">关闭</el-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import web from "@/static/js/common/web.js";
import wangeditor from "@/static/js/common/wangeditor.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            amend_user: "",
            editor: "",
            loading: false,
            form: {
                protocolId: "",
                historyUpdateName: "",
                protocolName: "",
                protocolPort: "",
                protocolContent: "",
                historyRemarks: "",
                timeStamp: Date.parse(new Date()),
            },
            rules: {
                protocolName: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                protocolPort: [
                    { required: true, message: "请选择应用", trigger: "blur" }
                ],
                protocolContent: [
                    { required: true, message: "内容不能为空", trigger: "blur" }
                ]
            }
        }
    },
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.amend_user = item.loginName
    },
    methods: {
        loadComponent(id) {
            this.form.protocolId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.protocolName = "";
            this.form.protocolPort = "";
            this.form.historyUpdateName = "";
            this.form.protocolContent = "";
            this.form.historyRemarks = "";
        },
        getWangEditor(){
            this.editor = wangeditor("wangeditor");
            this.editor.create();
            this.editor.txt.html(this.form.protocolContent);
        },
        getListData() {
            this.loading = true;
            var data = {
                protocolId: this.form.protocolId,
            };
            var config = {
                type: 5,
                name: "protocol/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                console.log(response)
                this.form.protocolName = response.data.data.protocolName;
                this.form.protocolContent = response.data.data.protocolContent;
                this.form.protocolPort = response.data.data.protocolPort.toString();
                this.getWangEditor();
                this.loading = false;
            });
        },
        handleSubmit() {
            if(this.editor.txt.text()){
                this.form.protocolContent = this.editor.txt.html();
            }else{
                this.form.protocolContent = "";
            }
            this.form.historyUpdateName = this.amend_user;
            this.form.protocolPort = parseInt(this.form.protocolPort)
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
                        name: "protocol/update",
                        data: this.form,
                        model: "Policydoc",
                        controller: "edit",
                    };
                    web(config).then((response) => {
                         console.log(response.data)
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
    @import url("../../../../../static/css/menu/dialog.css");
    .el-textarea /deep/ textarea{
        min-height: 200px !important;
    }
</style>
