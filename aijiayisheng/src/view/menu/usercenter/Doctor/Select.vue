<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>查看信息</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form">
                <el-form-item label="用户ID">
                    <span v-if="form.doctorId" v-text="form.doctorId"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="创建时间">
                    <span v-if="form.doctorCreatedate">{{form.doctorCreatedate|dateFormat}}</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="最后登录时间">
                    <span v-if="form.doctorZhdlsj">{{form.doctorZhdlsj|dateFormat}}</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="当前状态">
                    <span v-if="form.doctorZhzt==1">正常</span>
                    <span v-else-if="form.doctorZhzt==2">冻结</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="手机号">
                    <span v-if="form.doctorSjh" v-html="form.doctorSjh"></span>
                    <span v-else>--</span> 
                </el-form-item>              
                <el-form-item label="姓名">
                    <span v-if="form.doctorXm" v-text="form.doctorXm"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="职称">
                    <span v-if="form.doctorYsjb" v-html="form.doctorYsjb"></span>
                    <span v-else>--</span>
                </el-form-item>
                 <el-form-item label="所在医院">
                    <span v-if="form.doctorOrgName" v-text="form.doctorOrgName"></span>
                    <span v-else>--</span> 
                </el-form-item>
                <el-form-item label="一级科室">
                    <span v-if="form.doctorOrgYjoffice" v-text="form.doctorOrgYjoffice"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="二级科室">
                    <span v-if="form.doctorOffice" v-html="form.doctorOffice"></span>
                    <span v-else>--</span>
                 </el-form-item>
                 <el-form-item label="性别">
                    <span v-if="form.doctorXb==1">男</span>
                    <span v-else-if="form.doctorXb==2">女</span>
                    <span v-else-if="form.doctorXb==3">其他</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="身份证">
                    <span v-if="form.doctorSfz" v-html="form.doctorSfz"></span>
                    <span v-else>--</span>
                </el-form-item>
                 <el-form-item label="医生头像">
                    <img v-if="form.doctorTx" :src="form.doctorTx">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="身份证照片">
                    <img v-if="form.yszsSfzzm" :src="form.yszsSfzzm" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                    <img v-if="form.yszsSfzfm" :src="form.yszsSfzfm" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="手持身份证照片">
                    <img v-if="form.yszsScsfzzp  " :src="form.yszsScsfzzp" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="医师资格证">
                    <img v-if="form.yszsYszgz" :src="form.yszsYszgz" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="职业证书">
                    <img v-if="form.yszsZyzs" :src="form.yszsZyzs" class="img" @click="handleChangeImg($event)">
                    <span v-else>未上传</span>
                </el-form-item>
                <el-form-item label="专长介绍">
                    <span v-if="form.doctorYsjs" v-text="form.doctorYsjs"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="个人简介">
                    <span v-if="form.doctorZcjs" v-text="form.doctorZcjs"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-table :data="tableData" border>
                    <el-table-column label="操作内容" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.recordContent" v-text="scope.row.recordContent"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" align="center" width="170">
                        <template slot-scope="scope">
                            <span v-if="scope.row.recordDatetime">{{scope.row.recordDatetime|dateFormat}}</span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.recordUserName" v-text="scope.row.recordUserName"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作角色分类" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.recordRole" v-text="scope.row.recordRole"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.recordRemark" v-text="scope.row.recordRemark"></span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-share" @click="handleSelect(scope.$index, scope.row.recordId)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="primary" size="small" plain @click="handleClose">关闭</el-button>
        </div>
        <!-- 嵌套的内层弹框 -->
        <el-dialog width="50%" top="5vh" :visible.sync="innerVisible" append-to-body>
            <Nestselect ref="selectDialog" @closeDialog="closeDialog"></Nestselect>  
        </el-dialog>
               
        <div class='popContainer' v-show="ischoose"></div>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import Nestselect from "./Nestselect.vue"
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
            ischoose:false,
            loading: false,
            tableData: [],
            form: {
                doctorId: "",
                doctorCreatedate: "",
                doctorZhdlsj: "",
                doctorZhzt: "",
                doctorYsjb: "",
                doctorYsjs: "",
                doctorXm: "",
                doctorSfz: "",
                doctorXb: "",
                doctorZcjs: "",
                doctorHy: "",
                yszsSfzzm: "",
                yszsSfzfm: "",
                yszsScsfzzp: "",
                yszsYszgz: "",
                yszsZyzs: "",
                doctorSjh: "",
                recordDatetime: "",
                doctorOrgName: "",
                doctorOrgYjoffice: "",
                doctorOffice: "",
                doctorTx: ""
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
            this.form.doctorId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.doctorCreatedate = "";
            this.form.doctorZhdlsj = "";
            this.form.doctorZhzt = "";
            this.form.doctorYsjb = "";
            this.form.doctorYsjs = "";
            this.form.doctorXm = "";
            this.form.doctorSfz = "";
            this.form.doctorXb = "";
            this.form.doctorHy = "";
            this.form.yszsSfzzm = "";
            this.form.yszsSfzfm = "";
            this.form.yszsScsfzzp = "";
            this.form.yszsYszgz = "";
            this.form.yszsZyzs = "";
            this.form.doctorSjh = "";
            this.form.doctorOrgName= "";
            this.form.doctorOrgYjoffice= "";
            this.form.doctorOffice= "";
            this.form.doctorTx = "";
            this.form.doctorZcjs = "";
            
            // this.form.recordDatetime = "";
        },
        getListData() {
            this.loading = true;
            var data = {
                doctorId: this.form.doctorId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "doctor/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form = response.data.data
                this.tableData = response.data.data.doctorRecord;
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
        //点击图片放大
        handleChangeImg($event){
            if($event.currentTarget.className=='img'){
                $event.currentTarget.className='img active';
                this.ischoose=true;
            }else{
                $event.currentTarget.className='img';
                 this.ischoose=false;
            }
        }
        
    
    }
}
</script>

<style scoped>
    @import url("../../../../static/css/menu/dialog.css");
  .el-form-item {
    margin-bottom: 0;
    }
    div.popContainer{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.3);
        z-index: 99;
    }
    .img{
        display: inline-block;
        width: 160px !important;
        height: 120px !important;
        transform: scale(1);    
    }
    .img.active {    
        transform: scale(3);          /*图片需要放大3倍*/
        position: fixed;           /*是相对于前面的容器定位的，此处要放大的图片，不能使用position：relative；以及float，否则会导致z-index无效*/
        left:50%;
        top:50%;
        /* margin-left:20px;
        margin-top:15px; */
        z-index: 100;
     }  
</style>
