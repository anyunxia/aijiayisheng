<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>查看详情</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                <el-form-item label="修改人"><span>{{form.amend_user ? form.amend_user : "--"}}</span></el-form-item>
                <el-form-item label="修改时间">
                    <span v-if="form.updateDatetime">{{form.updateDatetime|dateFormat}}</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="应用">
                    <span v-if="form.protocolPort==1">用户端</span>
                    <span v-else>医生端</span>
                </el-form-item>
                <el-form-item label="标题"><span>{{form.protocolName ? form.protocolName : "--"}}</span></el-form-item>
                <el-form-item label="内容">
                    <span v-if="form.protocolContent" v-html="form.protocolContent"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="修改记录">
                        <el-table :data="tableData" border>
                            <el-table-column align="center" label="修改人" show-overflow-tooltip>
                                <template slot-scope="scope">{{scope.row.historyUpdateName ? scope.row.historyUpdateName : "--"}}</template>
                            </el-table-column>
                            <el-table-column align="center" width="170" label="修改时间" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.updateDatetime">{{scope.row.updateDatetime|dateFormat}}</span>
                                    <span v-else>--</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="修改备注" show-overflow-tooltip>
                                <template slot-scope="scope">{{scope.row.historyRemarks ? scope.row.historyRemarks : "--"}}</template>
                            </el-table-column>
                           <el-table-column align="center" label="历史版本查看">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.historyId)">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                </el-form-item>
                
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="primary" size="small" plain @click="handleClose">关闭</el-button>
        </div>
         <!-- 嵌套的内层弹框 -->
        <el-dialog width="50%" top="5vh" :visible.sync="innerVisible" append-to-body>
            <Nestselect ref="selectDialog" @closeDialog="closeDialog"></Nestselect>  
        </el-dialog>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import Nestselect from "./Nestselect.vue"
import moment from 'moment';
import { getNowFormatDate, parseTime } from "@/static/js/common/common.js";
export default {
    components:{
        Nestselect
    },
    data() {
        return{
            icon: "el-icon-rank",
            outerVisible: false,
            innerVisible:false,
            loading: false,
            form: {
                protocolId: "",
                amend_user: "",
                updateDatetime: "",
                protocolName: "",
                protocolPort: "",
                protocolContent: "",
            },
            tableData: []
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
    mounted(){
        var item = JSON.parse(localStorage.getItem("userMessage"))
        this.form.amend_user = item.loginName
    },
    methods: {
        loadComponent(id) {
            this.form.protocolId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.updateDatetime = "";
            this.form.protocolName = "";
            this.form.protocolPort = "";
            this.form.protocolContent = "";           
        },
        getListData() {
            this.loading = true;
            var data = {
                protocolId: this.form.protocolId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "protocol/queryid",
                data: data,
                model: "Policyana",
                controller: "detail",
            };
            web(config).then((response) => {
                // console.log(response.data)
                this.form.updateDatetime = response.data.data.updateDatetime;
                this.form.protocolName = response.data.data.protocolName;
                this.form.protocolPort = response.data.data.protocolPort;
                this.form.protocolContent = response.data.data.protocolContent;
                this.tableData = response.data.data.list;
                this.loading = false;
                
            });
        },
        handleClose() {
            this.$emit("closeDialog");
        },
        changeDialog() {
            this.icon = this.icon == "el-icon-rank" ? "el-icon-menu" : "el-icon-rank";
            this.$emit("changeDialog");
        },
        handleSelect(key, id) {
            this.innerVisible=true
            setTimeout(()=>{
                this.$refs.selectDialog.loadComponent(id);
            },100);
        },
         closeDialog() {
            this.innerVisible = false;
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
   /* .protocolContent span{
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
    } */
</style>
