<template>
    <div>
        <button class="el-dialog__headerbtn headerButton" @click="changeDialog">
            <i :class="icon"></i>
        </button>
        <div class="form-content">
            <p>订单详情</p>
            <el-form ref="ruleForm" label-width="120px" v-loading="loading" label-position="left" :model="form">
                <el-form-item label="订单号"><span>{{form.facilityFbr ? form.facilityFbr : "--"}}</span></el-form-item>
                <el-form-item label="订单类型"><span>{{form.orderState ? form.orderState : "--"}}</span></el-form-item>
                <el-form-item label="联系人名称"><span>{{form.linkname ? form.linkname : "--"}}</span></el-form-item>
                <el-form-item label="联系人电话"><span>{{form.phone ? form.phone : "--"}}</span></el-form-item>
                <el-form-item label="联系地址"><span>{{form.address ? form.address : "--"}}</span></el-form-item>
                <el-form-item label="商品名称"><span>{{form.productname ? form.productname : "--"}}</span></el-form-item>
                <el-form-item label="规格"><span>{{form.specification ? form.specification : "--"}}</span></el-form-item>
                <el-form-item label="数量"><span>{{form.productnum ? form.productnum : "--"}}</span></el-form-item>
                <el-form-item label="商品单价"><span>{{form.productprice ? form.productprice : "--"}}</span></el-form-item>
                <el-form-item label="商品总价"><span>{{form.totalprice ? form.totalprice : "--"}}</span></el-form-item>
                <el-form-item label="快递价格"><span>{{form.expressprice ? form.expressprice : "--"}}</span></el-form-item>
                <el-form-item label="订单总价"><span>{{form.ordertotalprice ? form.ordertotalprice : "--"}}</span></el-form-item>
                <el-form-item label="抵扣价格(能量抵扣)"><span>{{form.deductionprice ? form.deductionprice : "--"}}</span></el-form-item>
                <el-form-item label="优惠券支付金额"><span>{{form.discountprice ? form.discountprice : "--"}}</span></el-form-item>
                <el-form-item label="支付价格"><span>{{form.payprice ? form.payprice : "--"}}</span></el-form-item>
                <el-form-item label="支付方式">
                    <span v-if="form.paypattern" v-text="form.paypattern"></span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="购买人账号"><span>{{form.account ? form.account : "--"}}</span></el-form-item>
                <el-form-item label="购买时间">
                    <span v-if="form.buydate">{{form.buydate|dateFormat}}</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="支付时间">
                    <span v-if="form.paydate">{{form.paydate|dateFormat}}</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="支付信息">
                    <span v-if="form.payinf" v-text="form.payinf"></span>
                    <span v-else>--</span>
                </el-form-item>
                <p>物流信息</p>    
                 <el-form-item label="收货人名称"><span>{{form.consignee ? form.consignee : "--"}}</span></el-form-item>
                 <el-form-item label="收货人电话"><span>{{form.consigneephone ? form.consigneephone : "--"}}</span></el-form-item>
                 <el-form-item label="收货地址"><span>{{form.consigneeadd ? form.consigneeadd : "--"}}</span></el-form-item>
                <el-form-item label="发货状态">
                    <span v-if="form.shipstatus == 1">已发货</span>
                    <span v-else-if="form.shipstatus == 2">未发货</span>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item label="快递公司"><span>{{form.expresscompany ? form.expresscompany : "--"}}</span></el-form-item>
                <el-form-item label="快递单号"><span>{{form.trackingnumber ? form.trackingnumber : "--"}}</span></el-form-item>
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
                facilityId: "",
                facilityFbr: "",
                orderState: "",
                linkname: "",
                phone: "", 
                address: "",
                productname: "", 
                specification : "",
                productnum: "",
                productprice: "", 
                totalprice: "",
                expressprice: "",
                ordertotalprice: "", 
                deductionprice: "",
                discountprice: "", 
                payprice: "",
                paypattern: "",
                account: "",
                buydate: "",
                paydate: "",
                payinf: "",
                consignee: "",
                consigneephone: "",
                consigneeadd: "",
                shipstatus: "",
                expresscompany: "",
                trackingnumber: ""
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
            this.form.facilityId = id;
            this.getRenderData();
            this.getListData();
        },
        getRenderData(){
            this.form.facilityFbr = "";
            this.form.orderState = "";
            this.form.linkname = "";
            this.form.phone = ""; 
            this.form.address = "";
            this.form.productname = ""; 
            this.form.specification  = "";
            this.form.productnum = "";
            this.form.productprice = ""; 
            this.form.totalprice = "";
            this.form.expressprice = "";
            this.form.ordertotalprice = ""; 
            this.form.deductionprice = "";
            this.form.discountprice = ""; 
            this.form.payprice = "";
            this.form.paypattern = "";
            this.form.account = "";
            this.form.buydate = "";
            this.form.paydate = "";
            this.form.payinf = "";
            this.form.consignee = "";
            this.form.consigneephone = "";
            this.form.consigneeadd = "";
            this.form.shipstatus = "";
            this.form.expresscompany = "";
            this.form.trackingnumber = ""
        },
        // getListData() {
        //     this.loading = true;
        //     var data = {
        //         facilityId: this.form.facilityId,
        //         timeStamp: Date.parse(new Date())
        //     };
        //     var config = {
        //         type: 5,
        //         name: "facility/queryid",
        //         data: data,
        //         model: "Policydoc",
        //         controller: "detail", 
        //     };
        //     web(config).then((response) => {  
        //         this.form.facilityFbr = response.data.data.facilityFbr;
        //         this.form.orderState = response.data.data.orderState;
        //         this.form.linkname = response.data.data.linkname;
        //         this.form.phone = response.data.data.phone; 
        //         this.form.address = response.data.data.address;
        //         this.form.productname = response.data.data.productname; 
        //         this.form.specification  = response.data.data.specification;
        //         this.form.productnum = response.data.data.productnum;
        //         this.form.productprice = response.data.data.productprice; 
        //         this.form.totalprice = response.data.data.totalprice;
        //         this.form.expressprice = response.data.data.expressprice;
        //         this.form.ordertotalprice = response.data.data.ordertotalprice; 
        //         this.form.deductionprice = response.data.data.deductionprice;
        //         this.form.discountprice = response.data.data.discountprice; 
        //         this.form.payprice = response.data.data.payprice;
        //         this.form.paypattern = response.data.data.paypattern;
        //         this.form.account = response.data.data.account;
        //         this.form.buydate = response.data.data.buydate;
        //         this.form.paydate = response.data.data.paydate;
        //         this.form.payinf = response.data.data.payinf;
        //         this.form.consignee = response.data.data.consignee;
        //         this.form.consigneephone = response.data.data.consigneephone;
        //         this.form.consigneeadd = response.data.data.consigneeadd;
        //         this.form.shipstatus = response.data.data.shipstatus;
        //         this.form.expresscompany = response.data.data.expresscompany;
        //         this.form.trackingnumber = response.data.data.trackingnumber;
        //         this.loading = false;
        //     });
        // },
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
    @import url("../../../../static/css/menu/dialog.css");
    .el-form-item {
        margin-bottom:0 !important; 
    }
    .el-form-item /deep/ label{
        width:150px !important;
    }
</style>
