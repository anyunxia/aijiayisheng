<template>
    <div class="form-content">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" :rules="rules" status-icon>
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model.trim="form.role_name"></el-input>
                </el-form-item>
                <el-form-item label="备注信息">
                    <el-input v-model.trim="form.desc"></el-input>
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
                            node-key="auth_id"
                            :props="defaultProps"
                            :default-expanded-keys="form.ids"
                            @check-change="handleCheck"
                        >
                        </el-tree>
                    </div>
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
import web from "@/static/js/common/web.js";
export default {
    data() {
        return{
            ids: [],
            icon: "el-icon-rank",
            treeData: [],
            checkAll: false,
            defaultTree: [],
            defaultProps: {
                children: "sub",
                label: "title"
            },
            form: {
                role_id: "",
                role_name: "",
                desc: "",
                auth_ids: "",
            },
            rules: {
                role_name: [
                    { required: true, message: "角色名称不能为空", trigger: "blur" }
                ],
            },
        }
    },
    methods: {
        loadComponent(id) {
            this.form.role_id = id;
            this.getTreeData();
            this.getRenderData();
            this.getListData();
        },
        getTreeData() {
            var config = {
                type: 2,
                name: "get_auth",
                data: "",
                model: "Auth",
                controller: "get_auth",
            };
            web(config).then((response) => {
                this.treeData = response.data;
            });
        },
        getRenderData(){
            this.ids = [];
            this.form.role_name = "";
            this.form.desc = "";
            this.form.auth_ids = "";
        },
        getListData() {
            var data = {
                role_id: this.form.role_id,
            };
            var config = {
                type: 2,
                name: "role_detail",
                data: data,
                model: "Role",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form.role_name = response.data.role_name;
                this.form.desc = response.data.desc;
                this.form.auth_ids = response.data.auth_ids;
                this.ids = response.data.auth_ids.split(",");
                this.$refs.tree.setCheckedKeys(this.ids);
            });
        },
        getTreeKey(data) {
            data.map((item)=>{
                if("sub" in item){
                    this.getTreeKey(item.sub);
                }
                this.defaultTree.push(item.auth_id);
            });
        },
        handleCheckAll(status) {
            this.checkAll = status;
            if(status){
                this.getTreeKey(this.treeData);
                this.$refs.tree.setCheckedKeys(this.defaultTree);
            }else{
                this.defaultTree = [];
                this.$refs.tree.setCheckedKeys(this.defaultTree);
            }
        },
        handleCheck(data, status) {
            if(status){
                this.$refs.tree.setChecked(data.auth_id, true);
                if(data.pid != 0){
                    var findData = ((dataItem, key)=>{
                        dataItem.map((item)=>{
                            if("sub" in item){
                                findData(item.sub, key);
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
                    if("sub" in dataItem){
                        dataItem.sub.map((item)=>{
                            this.$refs.tree.setChecked(item.auth_id, false);
                            if("sub" in item){
                                findData(item.sub);
                            }
                        });
                    }
                });
                findData(data);
            }
        },
        handleSubmit() {
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
                        name: "role_edit",
                        data: this.form,
                        model: "Role",
                        controller: "edit",
                    };
                    web(config).then((response) => {
                        if(response.data.code == 200){
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
