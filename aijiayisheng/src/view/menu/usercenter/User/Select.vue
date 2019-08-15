<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>查看信息</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                <el-form-item label="用户id">
                    <span v-if="form.dwellerId" v-text="form.dwellerId"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="创建时间">
                    <span v-if="form.dwellerCreatdate">{{form.dwellerCreatdate|dateFormat}}</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="最后登录时间">
                    <span v-if="form.dwellerLastTime">{{form.dwellerLastTime|dateFormat}}</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="当前状态">
                    <!-- <span v-if="form.dwellerAccountState" v-text="form.dwellerAccountState"></span> -->
                    <span v-if="form.dwellerAccountState==1">正常</span>
                    <span v-else-if="form.dwellerAccountState==2">冻结</span>
                    <span v-else-if="form.dwellerAccountState==3">删除</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="qq绑定">
                    <span v-if="form.dwellerQq" v-text="form.dwellerQq"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="微信绑定">
                    <span v-if="form.dwellerWechat" v-text="form.dwellerWechat"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="姓名">
                    <span v-if="form.dwellerName" v-text="form.dwellerName"></span>
                    <span v-else>未填写</span>
                </el-form-item>

                <el-form-item label="身份证">
                    <span v-if="form.dwellerIdcard" v-html="form.dwellerIdcard"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="年龄">
                    <span v-if="form.policy_age" v-html="form.policy_age"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="性别">
                    <!-- <span v-if="form.dwellerSex" v-html="form.dwellerSex"></span> -->
                    <span v-if="form.dwellerSex==1">男</span>
                    <span v-else-if="form.dwellerSex==2">女</span>
                    <span v-else-if="form.dwellerSex==3">其它</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="是否已婚">
                    <!-- <span v-if="form.dwellerMarriage" v-text="form.dwellerMarriage"></span> -->
                    <span v-if="form.dwellerMarriage==1">未婚</span>
                    <span v-else-if="form.dwellerMarriage==2">已婚</span>
                    <span v-else-if="form.dwellerMarriage==3">丧偶</span>
                    <span v-else-if="form.dwellerMarriage==4">离婚</span>
                    <span v-else-if="form.dwellerMarriage==4">未说明的离婚状况</span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="操作记录">
                    <el-table :data="tableData" border>
                        <el-table-column label="操作内容" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.recordContent" v-text="scope.row.recordContent"></span>
                                <span v-else>无</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作时间" width="170" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.recordDatetime">{{scope.row.recordDatetime|dateFormat}}</span>
                                <span v-else>无</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.recordPerson" v-text="scope.row.recordPerson"></span>
                                <span v-else>无</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作角色分类" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.recordRole" v-text="scope.row.recordRole"></span>
                                <span v-else>无</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.recordNotes" v-text="scope.row.recordNotes"></span>
                                <span v-else>无</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.recordId)">查看</el-button>
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
import Nestselect from "./Nestselect.vue";
import { parseTime } from "@/static/js/common/common.js";
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
                dwellerId: "",
                dwellerCreatdate: "",
                dwellerLastTime: "",
                dwellerAccountState: "",
                dwellerQq: "",
                dwellerWechat: "",
                dwellerName: "",
                dwellerIdcard: "",
                policy_age: "",
                dwellerSex: "",
                dwellerMarriage: ""
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
    methods: {
        loadComponent(id) {
            this.form.dwellerId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.dwellerCreatdate = "";
            this.form.dwellerLastTime = "";
            this.form.dwellerAccountState = "";
            this.form.dwellerQq = "";
            this.form.dwellerWechat = "";
            this.form. dwellerName = "";
            this.form.dwellerIdcard = "";
            this.form.policy_age = "";
            this.form.dwellerSex = "";
            this.form.dwellerMarriage = "";
        },
        getListData() {
            this.loading = true;
            var data = {
                dwellerId: this.form.dwellerId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "dweller/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form.dwellerId = response.data.data.dwellerId;
                this.form.dwellerCreatdate = response.data.data.dwellerCreatdate;
                this.form.dwellerLastTime = response.data.data.dwellerLastTime;
                this.form.dwellerAccountState = response.data.data.dwellerAccountState;
                this.form.dwellerQq = response.data.data.dwellerQq;
                this.form.dwellerWechat =response.data.data.dwellerWechat;
                this.form. dwellerName = response.data.data.dwellerName;
                this.form.dwellerIdcard = response.data.data.dwellerIdcard;
                this.form.dwellerSex = response.data.data.dwellerSex;
                this.form.dwellerMarriage = response.data.data.dwellerMarriage;
                this.tableData = response.data.data.sectionlist;
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
        },
    
    }
}
</script>

<style scoped>
    @import url("../../../../static/css/menu/dialog.css");
  .el-form-item {
    margin-bottom: 0;
}
</style>
