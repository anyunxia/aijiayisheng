
<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>新增科室</p>
             <el-form ref="ruleForm" label-width="120px" label-position="left" status-icon>
             <el-form-item label="新增科室" class="outersele">
                    <ul>
                        <li class="left">一级科室
                            <ul>
                                <el-input placeholder="请输入内容" v-model="oneModel" class="input-with-select">
                                    <el-button slot="append" @click="handleAddOne">保存</el-button>
                                </el-input>  
                                <div class="left-contain">
                                    <li v-for="(item, index) in sourceList" :key="index">
                                        <el-tag v-if="active == index" closable @click="handleOneElem(item, index)" @close="handlebtnoneClose(item, index)" :class="{active : active == index}">{{item.departmentsName}}</el-tag>
                                        <el-tag v-else @click="handleOneElem(item, index)" @close="handlebtnoneClose(item, index)" :class="{active : active == index}">{{item.departmentsName}}</el-tag>
                                    </li>
                                </div> 

                                <p class="btnp" ref="btnp">请新增科室</p>
                            </ul>
                        </li>
                        <li class="right">二级科室
                            <ul>
                                <el-input placeholder="请输入内容" v-model="twoModel" class="input-with-select">
                                    <el-button slot="append" @click="handleAddTwo">保存</el-button>
                                </el-input>  
                                <div class="left-contain" style="border-left:none;"> 
                                    <template  v-if="sourceList[index]">
                                         <li v-for="(val, ind) in sourceList[index].departments" :key="ind">
                                            <el-tag closable @close="handlebtntwoClose(val)">{{val.departmentsName}}</el-tag>
                                        </li> 
                                    </template>
                                </div> 
                            </ul>
                        </li>
                    </ul>

                </el-form-item>   
         </el-form>
        </div>
        <div class="form-button">
            <!-- <el-button type="primary" size="small" plain @click="handleClose">上一步</el-button> -->
            <el-button type="success" size="small" @click="handleSubmit">确定</el-button>
        </div>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
export default {
    props: {
        departmentsHospitalCode:{
            type: String,
            default: ''

        },
        departmentsHospitalId:{
            type: String,
            default: ''

        },
         departmentsHospitalName:{
            type: String,
            default: ''

        },
         dialog:{
            type: Object,
            default: {}

        },
    },
   
    data() {
        return{
            icon: "el-icon-rank",
            oneModel: '',
            twoModel: '',
            sourceList: [],
            index: -1,
            departFid:"",
            active:-1,
            tempElem: {},
            // departmentsHospitalCode: "",
            // departmentsHospitalId: ""
        }
    },
    methods: {
         getListData() {
            this.loading = true;
            var data = {
                departmentsHospitalId:this.departmentsHospitalId,
                departmentsFid:0,
                departmentsHospitalCode:this.departmentsHospitalCode,
                timeStamp: Date.parse(new Date()) //年月日
            };
            var config = {
                type: 5,
                name: "depart/query",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => {
                if(response.data){
                    console.log(response.data.data)
                    this.sourceList = response.data.data
                    this.loading = false;
                    
                }
            });
        },
        //点击新增了的一级科室条目存值
        handleOneElem (elem, index) {
            this.tempElem = elem
            this.active = index;
            this.index = index
        },
        //点击一级科室新增按钮
        handleAddOne () {
            if(this.oneModel != ''){
                 var data = {
                    departmentsHospitalId: this.departmentsHospitalId,
                    departmentsHospitalCode:this.departmentsHospitalCode,
                    departmentsName: this.oneModel,
                    departmentsFid: 0,
                    timeStamp: Date.parse(new Date()) //年月日
                };
                var config = {
                    type: 5,
                    name: "depart/save",
                    data: data,
                    model: "Policydoc",
                    controller: "get_list",
                };
                web(config).then((response) => {
                    // this.sourceList.push({ departmentsName: this.oneModel, departments: })
                    this.sourceList.push(response.data.data)
                    
                })
            }else{
                this.$message({ message: '请输入一级科室', type: 'warning' }); 
            }
        },
       
        //点击一级科室删除按钮
        handlebtnoneClose(item, index) {
            var data = {
                    departmentsId: item.departmentsId,
                    timeStamp: Date.parse(new Date()) //年月日
                };
                var config = {
                    type: 5,
                    name: "depart/delete",
                    data: data,
                    model: "Policydoc",
                    controller: "get_list",
                };
                web(config).then((response) => { 
                    this.sourceList.splice(index, 1);
                })
             
        },
         //点击二级科室新增按钮
       handleAddTwo () {
            if(this.twoModel == '') {
                this.$message({ message: '请输入二级科室', type: 'warning' });
                return false;
            }
            if(JSON.stringify(this.tempElem) != "{}"){
                if (this.sourceList[this.index].departments == null) {
                    this.sourceList[this.index].departments = []
                }  
                var data = {
                    departmentsHospitalId: this.tempElem.departmentsHospitalId,
                    departmentsHospitalCode: this.tempElem.departmentsHospitalCode,
                    departmentsName: this.twoModel,
                    departmentsFid: this.tempElem.departmentsId,
                    timeStamp: Date.parse(new Date()) //年月日
                };
                var config = {
                    type: 5,
                    name: "depart/save",
                    data: data,
                    model: "Policydoc",
                    controller: "get_list",
                };
                web(config).then((response) => { 
                    
                    this.sourceList[this.index].departments.push(response.data.data)
                })
                
             }else{
                this.$message({
                    message: '请先选择要添加的一级科室',
                    type: 'warning'
                });
             }
        },
        //点击二级科室删除按钮
        handlebtntwoClose(tag){
            var data = {
                departmentsId: tag.departmentsId,
                timeStamp: Date.parse(new Date()) //年月日
            };
            var config = {
                type: 5,
                name: "depart/delete",
                data: data,
                model: "Policydoc",
                controller: "get_list",
            };
            web(config).then((response) => { 
                this.sourceList[this.index].departments.splice(this.sourceList[this.index].departments.indexOf(tag), 1);
                this.$message.success(response.data.msg);
            })
            
        },
        // loadComponent(id) {
        //     this.form.historyId = id;
        //     this.getRenderData();
        //     this.getListData();            
        // },
        // computed: {
        //     cuIndex: function () {
        //     // `this` 指向 vm 实例
        //         return this.index
        //     }
        // },
         //点击提交
        handleSubmit() {
            if(this.sourceList == ''){
                this.$refs.btnp.style.display = 'block'
            }else{
                this.$refs.btnp.style.display = 'none'
                this.dialog.visible = false
            }
             
        },
        handleClose() {
            this.$emit("closeDialog");
        },
        changeDialog() {
            this.icon = this.icon == "el-icon-rank" ? "el-icon-menu" : "el-icon-rank";
            this.$emit("changeDialog");
        }
    },
   
   mounted(){
       this.getListData()
   }
}
</script>

<style scoped>
    @import url("../../../../../static/css/menu/dialog.css");
     .other_titleInput /deep/ .el-form-item__error{
        position:static !important;
    }
    .number_title{
        line-height:18px;
    }
    .outersele:before {
        content: '*';
        color: #F56C6C;
        float:left;
       margin-top:12px;
       margin-right:3px;
    }
    .outersele /deep/ .el-form-item__label{
        width:110px !important;
    }
    .el-form-item__content ul{
        width: 100%;
        height:30px;
        margin-left:-40px;
        margin-bottom:-5px;
    }
    .el-form-item__content ul li{
        list-style: none;
        float:left;
        text-align: center;
        
       
       
    }
    .el-form-item__content ul .left{
        width:225px;
        border-right:1px solid #E4E7ED;
        border-top:1px solid #E4E7ED;
        border-left:1px solid #E4E7ED;
        text-align: center;
        position: relative;
    }
    .el-form-item__content ul .right{
        width:225px;
        border-right:1px solid #E4E7ED;
        border-top:1px solid #E4E7ED;
        text-align: center;
    }
    .left-contain{
        width:100%;
        height:250px;
        border:1px solid #ccc;
        border-top:none;
        overflow-y: auto;
    }
    .left-contain li{
        width:100%;
    }
    .left-contain li span{
        display: block;
        width:100%;
    }
    .el-form-item__content ul li{
        list-style: none;
        float: left;
        text-align: left;
       
    }
    .el-form-item__content ul li .el-tag{
       display: flex;
       width:100%;
       justify-content: space-between;
    }
    /* .left-contain /deep/ .el-tag .el-icon-close{
        text-align: right !important;
    } */
    .left-contain /deep/ .el-tag .el-icon-close{
        /* right:0 !important; */
        left:-3px;
        top:8px;
    }
    .el-tag {
        background-color: #fff !important;
        color:#333;
    }
    .active {
        background: #ccc !important;
    }
    .el-form-item__content ul .left .btnp{
        position: absolute;
        top:310px;
        color: #F56C6C;
        font-size: 12px;
        display: none;
    }
</style>
