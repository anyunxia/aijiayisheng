<template>
    <div  class="addaccount">
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>订单详情</p>
            <el-form ref="ruleForm" label-width="120px" label-position="left" v-loading="loading" :model="form" :rules="rules" status-icon>
                <el-form-item label="订单号"><span>{{form.facilityFbr ? form.facilityFbr : "--"}}</span></el-form-item>
                <el-form-item label="订单类型"><span>{{form.orderState ? form.orderState : "--"}}</span></el-form-item>
                <el-form-item label="收货人名称"><span>{{form.consignee ? form.consignee : "--"}}</span></el-form-item>
                <el-form-item label="收货人电话"><span>{{form.consigneephone ? form.consigneephone : "--"}}</span></el-form-item>
                <el-form-item label="收货地址"><span>{{form.consigneeadd ? form.consigneeadd : "--"}}</span></el-form-item>
                <el-form-item label="商品名称"><span>{{form.productname ? form.productname : "--"}}</span></el-form-item>
                <el-form-item label="规格"><span>{{form.specification ? form.specification : "--"}}</span></el-form-item>
                <el-form-item label="数量"><span>{{form.productnum ? form.productnum : "--"}}</span></el-form-item>
                <el-form-item label="商品单价"><span>{{form.productprice ? form.productprice : "--"}}</span></el-form-item>
                <el-form-item label="商品总价"><span>{{form.totalprice ? form.totalprice : "--"}}</span></el-form-item>
                <el-form-item label="支付价格"><span>{{form.payprice ? form.payprice : "--"}}</span></el-form-item>
                <el-form-item label="购买人账号"><span>{{form.account ? form.account : "--"}}</span></el-form-item>
                <el-form-item label="支付时间"><span v-if="form.paydate">{{form.paydate|dateFormat}}</span><span v-else>--</span></el-form-item>
                <p>物流信息</p>
                <el-form-item label="快递名称" prop="expressname">
                    <el-input v-model.trim="form.expressname" placeholder="请输入快递名称" class="elseInput"></el-input>
                </el-form-item>
                <el-form-item label="快递单号" prop="trackingnumber">
                    <el-input v-model.trim="form.trackingnumber" placeholder="请输入快递单号" class="elseInput"></el-input>
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
import {url} from "@/static/js/common/commonUrl.js";
import { parseTime } from "@/static/js/common/common.js";
export default {
    data() {
        return{
            icon: "el-icon-rank",
            loading: false,
            form: {
                facilityId: "",
                facilityFbr: "",
                orderState: "", 
                productname: "", 
                specification : "",
                productnum: "",
                productprice: "", 
                totalprice: "",
                payprice: "",
                account: "",
                paydate: "",
                consignee: "",
                consigneephone: "",
                consigneeadd: "",
                expressname: "",
                trackingnumber: ""  
            },
            rules: {
                expressname: [
                    { required: true, message: "快递名称不能为空", trigger: "blur" }
                ],
                trackingnumber: [
                    { required: true, message: "快递单号不能为空", trigger: "blur" }
                ]
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
            this.form.facilityId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.facilityFbr = "";
            this.form.orderState = ""; 
            this.form.productname = ""; 
            this.form.specification = "";
            this.form.productnum = "";
            this.form.productprice = ""; 
            this.form.totalprice = "";
            this.form.payprice = "";
            this.form.account = "";
            this.form.paydate = "";
            this.form.consignee = "";
            this.form.consigneephone = "";
            this.form.consigneeadd = "";
            this.form.expressname = "";
            this.form.trackingnumber = ""
        },
        getListData() {
            this.loading = true;
            var data = {
                facilityId: this.form.facilityId,
                timeStamp: Date.parse(new Date())
            };
            var config = {
                type: 5,
                name: "facility/queryid",
                data: data,
                model: "Policydoc",
                controller: "detail",
            };
            web(config).then((response) => {
                this.form.facilityFbr = response.data.data.facilityName;
                this.form.orderState = response.data.data.orderState;
                this.form.productname = response.data.data.productname;
                this.form.specification = response.data.data.specification;
                this.form.productnum = response.data.data.productnum;
                this.form.productprice = response.data.data.productprice; 
                this.form.totalprice = response.data.data.totalprice;
                this.form.payprice = response.data.data.payprice;
                this.form.account = response.data.data.account;
                this.form.paydate = response.data.data.paydate;
                this.form.consignee = response.data.data.consignee;
                this.form.consigneephone = response.data.data.consigneephone;
                this.form.consigneeadd = response.data.data.consigneeadd;
                this.loading = false;
            });
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
                    var data = {
                        expressname:this.form.expressname,
                        trackingnumber:this.form.expressname
                    }
                    var config = {
                        type: 5,
                        name: "facility/update",
                        data: data,
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
    @import url("../../../../static/css/menu/dialog.css");
    .form-content /deep/ .elseInput{
        width:40% !important;
        margin-right:10px;
    }
</style>
