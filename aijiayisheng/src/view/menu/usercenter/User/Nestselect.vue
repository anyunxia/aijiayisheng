<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>查看历史详情</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form">
                <el-form-item label="操作内容">
                    <span v-if="form.recordContent" v-text="form.recordContent"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="操作时间">
                    <span v-if="form.recordDatetime">{{form.recordDatetime|dateFormat}}</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="操作人">
                    <span v-if="form.recordPerson" v-text="form.recordPerson"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="操作角色分类">
                    <span v-if="form.recordRole" v-text="form.recordRole"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="备注">
                    <span v-if="form.recordNotes" v-text="form.recordNotes"></span>
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
import { getNowFormatDate,parseTime } from "@/static/js/common/common.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            form: {
                recordId: "",
                recordContent: "",
                recordDatetime: "",
                recordPerson: "",
                recordRole: "",
                recordNotes: ""
            }
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
            this.form.recordId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.recordContent = "";
            this.form.recordDatetime = "";
            this.form.recordPerson = "";  
            this.form.recordRole = "";  
            this.form.recordNotes = "";           
        },
        getListData() {
            var data = {
                recordId: this.form.recordId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "record/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form.recordContent = response.data.data.recordContent;
                this.form.recordDatetime = response.data.data.recordDatetime;
                this.form.recordPerson = response.data.data.recordPerson;
                this.form.recordRole = response.data.data.recordRole;
                this.form.recordNotes = response.data.data.recordNotes;
               
            });
        },
        handleClose() {
            this.$emit("closeDialog");
        },
        changeDialog() {
            this.icon = this.icon == "el-icon-rank" ? "el-icon-menu" : "el-icon-rank";
            this.$emit("changeDialog");
        },
        handleSelect(){
            this.innerVisible=true
        }
    
    },
    created(){
        this.$nextTick(()=>{
            this.getListData()
        })
        
    }
}
</script>

<style scoped>
    @import url("../../../../static/css/menu/dialog.css");
  .el-form-item {
    margin-bottom: 0;
}
</style>
