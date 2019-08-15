<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
             <p>新增分类</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model.trim="form.role_name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <!-- <el-form-item label="备注信息">
                    <el-input v-model.trim="form.desc"></el-input>
                </el-form-item> -->
                 <el-form-item label="备注信息" class="other_input">
                    <textarea maxlength="100" @input="descInput" v-model.trim="form.role_desc" placeholder="请输入备注信息" class="other_textarea"/>
                    <span class="number_accessOperating"><i>{{remnant}}</i>/100字</span>
                </el-form-item>
                <el-form-item label="选择权限">
                    <el-checkbox v-model.trim="checkAll" @change="handleCheckAll">选择全部</el-checkbox>
                    <div class="dialogTree">
                        <el-tree
                            ref="tree"
                            show-checkbox
                            check-strictly
                            default-expand-all
                            :data="treeData"
                            node-key="menuId"
                            :props="defaultProps"
                            @check-change="handleCheck"
                        >
                        </el-tree>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="success" size="small" plain @click="handlesectionlistmit">提交</el-button>
            <el-button type="primary" size="small" plain @click="handleClose">关闭</el-button>
        </div>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
export default {
    data() {
        var validateRolename = (rule, value, callback) => {
           var regular = /^[\u4e00-\u9fa5]{1,8}$/;
            if(regular.test(value)){
                callback();
            }else{
                callback(new Error("请输入正确角色的名称!"));
            }
        };
        return{
            remnant: 0,
            icon: "el-icon-rank",
            treeData: [
                // {
                //     accessOperating:"数据统计",
                //     auth_id:"1",
                //     pid:"0",
                //     sectionlist:[
                //         {
                //             accessOperating:"用户分析",
                //             auth_id:"11", 
                //             pid:"1"
                           
                //         },
                //         {
                //             accessOperating:"订单分析",
                //             auth_id:"12",
                //             pid:"1" 
                //         }
                //     ]
                // },
                // {
                //     accessOperating:"设置管理",
                //     auth_id:"2",
                //     pid:"0",
                //     sectionlist:[
                //         {
                //             accessOperating:"账号管理",
                //             auth_id:"21",
                //             pid:"2",
                //             sectionlist:[
                //                 {
                //                     accessOperating:"新增",
                //                     auth_id:"22", 
                //                     pid:"26",  
                //                 },
                //                 {
                //                     accessOperating:"查看",
                //                     auth_id:"23", 
                //                     pid:"26",  
                //                 },
                //                 {
                //                     accessOperating:"编辑",
                //                     auth_id:"24", 
                //                     pid:"26",  
                //                 },
                //                 {
                //                     accessOperating:"删除",
                //                     auth_id:"25", 
                //                     pid:"26",  
                //                 }
                //             ]
                //         },
                //         {
                //             accessOperating:"平台管理",
                //             auth_id:"27",
                //             pid:"2",
                //             sectionlist:[
                //                 {
                //                     accessOperating:"新增",
                //                     auth_id:"28", 
                //                     pid:"31",  
                //                 },
                //                 {
                //                     accessOperating:"查看",
                //                     auth_id:"29", 
                //                     pid:"31",  
                //                 },
                //                 {
                //                     accessOperating:"编辑",
                //                     auth_id:"30", 
                //                     pid:"31",  
                //                 }
                //             ]
                //         }
                //     ]
                // },
                // {
                //     accessOperating:"用户分析",
                //     auth_id:"3",
                //     pid:"0",
                //     sectionlist:[
                //         {
                //             accessOperating:"用户管理",
                //             auth_id:"31", 
                //             pid:"3",
                //             sectionlist:[
                //                 {
                //                     accessOperating:"查看",
                //                     auth_id:"32", 
                //                     pid:"34",  
                //                 },
                //                 {
                //                     accessOperating:"编辑",
                //                     auth_id:"33", 
                //                     pid:"34",  
                //                 }
                //             ]
                //         }
                //     ]
                // },
                // {
                //     accessOperating:"财务中心",
                //     auth_id:"4",
                //     pid:"0",
                //     sectionlist:[
                //         {
                //             accessOperating:"分类订单",
                //             auth_id:"41", 
                //             pid:"4"
                //         }
                //     ]
                // }
            ],
            checkAll: false,
            defaultTree: [],
            defaultProps: {
                children: "sectionlist",
                label: "menuName"
            },
            form: {
                role_name: "",
                role_desc: "",
                auth_ids: []
            },
            rules: {
                role_name: [ 
                    { required: true, message: "角色名称不能为空", trigger: "blur" },
                    { validator: validateRolename, trigger: "blur" },
                ]
            },
        }
    },
    methods: {
        descInput(){
            var txtVal = this.form.role_desc.length;
            this.remnant = 0 + txtVal;
        },
        loadComponent() {
            this.treeData = [];
            this.form.role_name = "";
            this.form.auth_ids = [];
            this.getTreeData();
            this.getRenderData();
        },
        getTreeData() {
            var config = {
                type: 5,
                name: "menu/querytree",
                data: {
                    timeStamp: Date.parse(new Date())
                },
                model: "Auth",
                controller: "get_auth",
            };
            web(config).then((response) => {
                console.log(response.data)
                 this.treeData = response.data.data;
                    // this.treeData = this.treeData;
                   
            });
        },
        getRenderData(){
            this.form.role_name = "";
            this.form.auth_ids = [];
        },
        getTreeKey(data) {
            data.map((item)=>{
                console.log(item)
                if("sectionlist" in item){
                    this.getTreeKey(item.sectionlist);
                }
                this.defaultTree.push(item.menuId);
            });
        },
        handleCheckAll(status){
            this.checkAll = status;
            if(status){
                this.getTreeKey(this.treeData);
                this.$refs.tree.setCheckedKeys(this.defaultTree);
            }else{
                this.defaultTree = [];
                this.$refs.tree.setCheckedKeys(this.defaultTree);
            }
        },
        // 节点选中状态发生变化时的回调
        handleCheck(data, status) {
            if(status){
                this.$refs.tree.setChecked(data.auth_id, true);
                if(data.pid != 0){
                    var findData = ((dataItem, key)=>{
                        dataItem.map((item)=>{
                            // console.log(dataItem)
                            if("sectionlist" in item){
                                findData(item.sectionlist, key);
                            }
                            if(item.auth_id == key){
                                this.$refs.tree.setChecked(item.auth_id, true);
                                if(item.pid != 0){
                                    findData(this.treeData, item.pid);
                                }
                            }
                        });
                    });
                    findData(this.treeData, data.pid);
                }
            }else{
                this.$refs.tree.setChecked(data.auth_id, false);
                var findData = ((dataItem)=>{
                    if("sectionlist" in dataItem){
                        dataItem.sectionlist.map((item)=>{
                            this.$refs.tree.setChecked(item.auth_id, false);
                            if("sectionlist" in item){
                                findData(item.sectionlist);
                            }
                        });
                    }
                });
                findData(data);
            }
        },

        // 提交时的函数
        handlesectionlistmit() {
            this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    this.form.auth_ids = this.$refs.tree.getCheckedKeys().join(",");
                    const loading = this.$loading({
                        lock: true,
                        text: "提交中...",
                        spinner: "el-icon-loading",
                        background: "rgba(255, 255, 255, 0.7)",
                        target: document.querySelector(".form-content"),
                    });
                    var config = {
                        type: 2,
                        name: "role_add",
                        data: this.form,
                        model: "Role",
                        controller: "add",
                    };
                    web(config).then((response) => {
                        if(response.data.code == 200){
                            this.$message.success(response.data.msg);
                            this.$emit("sectionlistmitDialog");
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
    .dialogTree /deep/ .el-tree .el-tree-node__children .el-tree-node__children .el-tree-node {
        width: 140px !important;
        float: left !important;
    }
</style>
