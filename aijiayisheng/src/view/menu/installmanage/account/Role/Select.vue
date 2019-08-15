<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form" disabled>
                <el-form-item label="角色名称">
                    <span v-if="form.role_name" v-html="form.role_name"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="备注信息">
                    <span v-if="form.desc" v-html="form.desc"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="权限列表">
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
                            :default-expanded-keys="form.auth_ids"
                        >
                        </el-tree>
                    </div>
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
export default {
    data() {
        return{
            icon: "el-icon-rank",
            treeData: [],
            checkAll: false,
            defaultTree: [],
            defaultProps: {
                children: "sub",//指定子树为节点对象的某个属性值
                label: "title"//指定节点标签为节点对象的某个属性值
            },
            form: {
                role_id: "",
                role_name: "",
                desc: "",
                auth_ids: [],
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
                console.log(response.data)
                this.treeData = response.data;
            });
        },
        getRenderData(){
            this.form.role_name = "";
            this.form.desc = "";
            this.form.auth_ids = [];
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
                this.form.auth_ids = response.data.auth_ids.split(",");
                console.log( response.data)
                this.$refs.tree.setCheckedKeys(this.form.auth_ids);
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
