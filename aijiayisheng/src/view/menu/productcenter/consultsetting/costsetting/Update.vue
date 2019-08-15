<template>
    <div  class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>新增医院</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form" :rules="rules" status-icon>
                <el-form-item label="参数名称" prop="newsTitle">
                    <el-input v-model.trim="form.newsTitle" placeholder="咨询费比例"></el-input>
                </el-form-item>
                <el-form-item label="设置比例" prop="setscale">
                    <el-input v-model.trim="form.setscale" placeholder="30" style="width:97% !important;"></el-input> %
                </el-form-item>
                <el-form-item label="说明" prop="recordNotes" class="other_input">
                    <textarea maxlength="100字" @input="descInput" v-model="form.recordNotes" placeholder="平台对咨询与私人医生服务的抽成比例" class="other_textarea"/>
                    <span class="number_title"><i>{{remnant}}</i>/100字</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="success" size="small" plain @click="handleSubmit">确定</el-button>
            <el-button type="primary" size="small" plain @click="handleClose">取消</el-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import web from "@/static/js/common/web.js";

export default {
    data() {
        return{
            icon: "el-icon-rank",
            editor: "",
            remnant: 0,
            loading: false,
            form: {
                newsId: "",
                newsTitle: "",
                setscale: "",
                recordNotes: "",
                timeStamp : Date.parse(new Date())           
            },
            rules: {
                newsTitle: [
                    { required: true, message: "参数名称不能为空", trigger: "blur" }
                ],
                setscale: [
                    { required: true, message: "设置比例不能为空", trigger: "blur" }
                ],
                 recordNotes: [
                    { required: true, message: "请输入说明信息", trigger: "blur" }
                ]
               
            }
        }
    },
    methods: {
        descInput(){
            var txtVal = this.form.recordNotes.length;
            this.remnant = 0 + txtVal;
        },
        loadComponent(id) {
            this.form.newsId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.newsTitle = "1";
            this.form.setscale = "1";
            this.form.recordNotes = "1";
        },
        getListData() {
            // this.loading = true;
            // var data = {
            //    newsId: this.form.newsId,
            // };
            // var config = {
            //     type: 5,
            //     name: "news/queryid",
            //     data: data,
            //     model: "Policydoc",
            //     controller: "detail",
            // };
            // web(config).then((response) => {
            //     this.form.newsTitle = response.data.data.newsTitle;
            //     this.form.setscale = response.data.data.newsTitle;
            //     this.form.recordNotes = response.data.data.recordNotes;
            //     this.loading = false;
            // });
        },
      
        
        handleSubmit() {
           
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
                        name: "news/update",
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
    @import url("../../../../../static/css/menu/dialog.css");
   
</style>
