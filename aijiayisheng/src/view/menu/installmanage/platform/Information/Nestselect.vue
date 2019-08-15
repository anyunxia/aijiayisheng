
<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>查看历史详情</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                <el-form-item label="修改人">
                    <span v-if="form.historyUpdateName" v-text="form.historyUpdateName"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="修改时间">
                    <span v-if="form.updateDatetime">{{form.updateDatetime|dateFormat}}</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="标题">
                    <span v-if="form.historyProtocolName" v-text="form.historyProtocolName"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="内容" class="amend_content"> 
                    <span v-if="form.historyProtocolContent" v-html="form.historyProtocolContent"></span>
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
import { parseTime } from "@/static/js/common/common.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            loading: false,
            form: {
                historyId: "",
                historyUpdateName: "",
                updateDatetime: "",
                historyProtocolName: "",
                historyProtocolContent: "",
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
            this.form.historyId = id;
            this.getRenderData();
            this.getListData();            
        },
        getRenderData(){
            this.form.historyUpdateName = "";
            this.form.updateDatetime = "";
            this.form.historyProtocolName = "";  
            this.form.historyProtocolContent = "";           
        },
        getListData() {
            this.loading = true;
             var data = {
                historyId: this.form.historyId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "protocol/queryhistory",
                data: data,
                model: "Policyana",
                controller: "detail",
            };
            web(config).then((response) => {
               if(response.data){
                    this.form.historyUpdateName = response.data.data.historyUpdateName;
                    this.form.updateDatetime = response.data.data.updateDatetime;
                    this.form.historyProtocolName = response.data.data.historyProtocolName;
                    this.form.historyProtocolContent = response.data.data.historyProtocolContent;
                    this.loading = false;
                }
               
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
     /* .el-form-item /deep/ .el-form-item__label {
        margin-left: 192px;
        text-align:right;
        padding: 0 30px 0 0;
    }
   .el-form--label-left{
       padding-top:100px;
   } */
   .historyProtocolContent span{
       display: inline-block;
       width:90%;
       height:150px;
       overflow-y: auto;
       line-height:30px;
       border:1px solid #ccc;
       margin-top:12px;
       padding:0 15px;

   }
   ::-webkit-scrollbar {
        width: 6px !important;
        height: 4px !important;
    }
   ::-webkit-scrollbar-thumb {
        background-color:rgba(0, 0, 0, 0.3);
        background-clip: padding-box;
        height: 5px;
        border-radius: 9px;
    }
</style>
