<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>订单详情</p>   
            <el-form ref="ruleForm" label-width="120px" label-position="left" :model="form">
                <el-form-item label="订单号">
                    <span v-if="form.classify_ordercode" v-text="form.classify_ordercode"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="订单类型">
                    <span v-if="form.classify_ordertype" v-html="form.classify_ordertype"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="联系人名称">
                    <span v-if="form.classify_linkman" v-html="form.classify_linkman"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="联系人电话">
                    <span v-if="form.classify_contnumber" v-html="form.classify_contnumber"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="联系人地址">
                    <span v-if="form.classify_contaddress" v-html="form.classify_contaddress"></span>
                    <span v-else>未填写</span>
                </el-form-item>

                <el-form-item label="商品名称">
                    <span v-if="form.classify_productname" v-text="form.classify_productname"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="规格">
                    <span v-if="form.classify_specification" v-html="form.classify_specification"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="数量">
                    <span v-if="form.classify_number" v-html="form.classify_number"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="商品单价">
                    <span v-if="form.classify_productprice" v-html="form.classify_productprice"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="商品总价">
                    <span v-if="form.classify_allprices" v-html="form.classify_allprices"></span>
                    <span v-else>未填写</span>
                </el-form-item>

                <el-form-item label="快递价格">
                    <span v-if="form.classify_deliveryprice" v-text="form.classify_deliveryprice"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="订单总价">
                    <span v-if="form.classify_orderallprices" v-html="form.classify_orderallprices"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="抵扣价格(能量抵扣)">
                    <span v-if="form.classify_deductprices" v-html="form.classify_deductprices"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="优惠劵支付金额">
                    <span v-if="form.classify_youhuiprices" v-html="form.classify_youhuiprices"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="支付价格">
                    <span v-if="form.classify_paymentproces" v-html="form.classify_paymentproces"></span>
                    <span v-else>未填写</span>
                </el-form-item>

                <el-form-item label="支付方式">
                    <span v-if="form.classify_paymenttype" v-text="form.classify_paymenttype"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="购买人账号">
                    <span v-if="form.classify_buyaccount" v-html="form.classify_buyaccount"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="购买时间">
                    <span v-if="form.classify_buydate" v-html="form.classify_buydate"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="支付时间">
                    <span v-if="form.classify_paymentdate" v-html="form.classify_paymentdate"></span>
                    <span v-else>未填写</span>
                </el-form-item>
                <el-form-item label="支付信息">
                    <span v-if="form.classify_paymentinf" v-html="form.classify_paymentinf"></span>
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
export default {
    data() {
        return{
            icon: "el-icon-rank",
            table:{
                classify_ordercode: "201904031348551547",
                classify_ordertype: "挂号",
                classify_linkman: "老王",
                classify_contnumber: "18615468956",
                classify_contaddress: "北京市门头沟区",
                classify_productname: "第二附属医院;专家号",

                classify_specification: "专家号",
                classify_number: "1",
                classify_productprice: "50.00",
                classify_allprices: "50.00",
                classify_deliveryprice: "0.00",
                classify_orderallprices: "50.00",

                classify_deductprices: "0.00",
                classify_youhuiprices: "0.00",
                classify_paymentproces: "50.00",
                classify_paymenttype: "支付宝支付",
                classify_buyaccount: "1265354678",
                classify_buydate: "2019-04-17 19:44:39",

                classify_paymentdate: "2019-04-17 19:44:50",
                classify_paymentinf: "支付宝交易号：201932424142565463"
            },
            form: {
                policy_id: "",

                classify_ordercode: "",
                classify_ordertype: "",
                classify_linkman: "",
                classify_contnumber: "",
                classify_contaddress: "",
                classify_productname: "",

                classify_specification: "",
                classify_number: "",
                classify_productprice: "",
                classify_allprices: "",
                classify_deliveryprice: "",
                classify_orderallprices: "",

                classify_deductprices: "",
                classify_youhuiprices: "",
                classify_paymentproces: "",
                classify_paymenttype: "",
                classify_buyaccount: "",
                classify_buydate: "",

                classify_paymentdate: "",
                classify_paymentinf: ""
            },
        }
    },
    methods: {
        loadComponent(id) {
            this.form.policy_id = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.classify_ordercode = "";
            this.form.classify_ordertype = "";
            this.form.classify_linkman = "";
            this.form.classify_contnumber = "";
            this.form.classify_contaddress = "";
            this.form.classify_productname = "";

            this.form.classify_specification = "";
            this.form.classify_number = "";
            this.form.classify_productprice = "";
            this.form.classify_allprices = "";
            this.form.classify_deliveryprice = "";
            this.form.classify_orderallprices = "";

            this.form.classify_deductprices = "";
            this.form.classify_youhuiprices = "";
            this.form.classify_paymentproces = "";
            this.form.classify_paymenttype = "";
            this.form.classify_buyaccount = "";
            this.form.classify_buydate = "";

            this.form.classify_paymentdate = "",
            this.form.classify_paymentinf = ""
        },
        getListData() {
            var data = {
                station_id: this.form.policy_id,
            };
            // var config = {
            //     type: 2,
            //     name: "policydoc_detail",
            //     data: data,
            //     model: "Policydoc",
            //     controller: "detail",
            // };
            // web(config).then((response) => {
                this.form.classify_ordercode =  this.table.classify_ordercode;
                this.form.classify_ordertype =  this.table.classify_ordertype;
                this.form.classify_linkman =  this.table.classify_linkman;
                this.form.classify_contnumber =  this.table.classify_contnumber;
                this.form.classify_contaddress = this.table.classify_contaddress;
                this.form.classify_productname = this.table.classify_productname;

                this.form.classify_specification = this.table.classify_specification;
                this.form.classify_number = this.table.classify_number;
                this.form.classify_productprice = this.table.classify_productprice;
                this.form.classify_allprices = this.table.classify_allprices;
                this.form.classify_deliveryprice = this.table.classify_deliveryprice;
                this.form.classify_orderallprices = this.table.classify_orderallprices;

                this.form.classify_deductprices = this.table.classify_deductprices;
                this.form.classify_youhuiprices = this.table.classify_youhuiprices;
                this.form.classify_paymentproces = this.table.classify_paymentproces;
                this.form.classify_paymenttype = this.table.classify_paymenttype;
                this.form.classify_buyaccount = this.table.classify_buyaccount;
                this.form.classify_buydate = this.table.classify_buydate;

                this.form.classify_paymentdate = this.table.classify_paymentdate;
                this.form.classify_paymentinf = this.table.classify_paymentinf;
                this.form.account_remark = this.table.account_remark;
            // });
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
  .el-form-item /deep/ .el-form-item__label{
        width:170px !important;
    }
</style>
