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
                <p>发票信息</p>    
                <el-form-item label="发票状态">
                    <span v-if="form.billstate == 1">已开票</span>
                    <span v-else-if="form.billstate == 2">未开票</span>
                    <span v-else>--</span>
                </el-form-item>
                <!-- 如果发票状态是已开票就显示下面内容 -->
                <div v-show="form.billstate == 1"> 
                    <el-form-item label="发票类型"><span>{{form.billtype ? form.billtype  : "--"}}</span></el-form-item> 
                    <el-form-item label="发票内容"><span>{{form.billcontent ? form.billcontent  : "--"}}</span></el-form-item> 
                    <el-form-item label="抬头类型">
                        <span v-if="form.titlttype == 1">企业</span>
                        <span v-else-if="form.titlttype == 2">个人</span>
                        <span v-else>--</span>
                    </el-form-item>
                    <el-form-item label="发票抬头"><span>{{form.invoicetitle ? form.invoicetitle  : "--"}}</span></el-form-item> 
                    <el-form-item label="税号" v-show="form.titlttype == 1"><span>{{form.dutyparagraph ? form.dutyparagraph : "--"}}</span></el-form-item>
                    <el-form-item label="发票金额"><span>{{form.billmoney ? form.billmoney : "--"}}</span></el-form-item>
                    <el-form-item label="申请日期">
                        <span v-if="form.applydate">{{form.applydate|dateFormat}}</span>
                        <span v-else>--</span>
                    </el-form-item>
                    <el-form-item label="发票号码"><span>{{form.trackingnumber ? form.trackingnumber : "--"}}</span></el-form-item>
                    <el-form-item label="发票详情">
                       <el-button size="mini" @click="innerVisible = true">查看</el-button>
                    </el-form-item>
                    <el-form-item label="合并开票">
                         <el-button size="mini" @click="mergeinnerVisible = true">查看</el-button>
                    </el-form-item>
                </div>   
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="primary" size="small" plain @click="handleClose">关闭</el-button>
        </div>
        <!-- 发票查看 -->
        <el-dialog width="50%" title="发票详情" :visible.sync="innerVisible" append-to-body>
            <div class="el-dialog-div">
                <img v-if="form.billdetails" :src="form.billdetails" style="margin:0 auto;display:block;">
                <span v-else>未上传</span>
            </div>
        </el-dialog>
        <!-- 合并开票查看 -->
        <el-dialog width="50%" title="合并开票" :visible.sync="mergeinnerVisible" append-to-body>
            <div class="el-dialog-div">

                <el-form ref="ruleForm" label-width="120px" label-position="left" :model="mergeform" class="mergeformstyle">
                    <el-form-item label="发票号码："><span>{{mergeform.mergebillnum ? mergeform.mergebillnum : "--"}}</span></el-form-item>
                    <el-form-item label="开票日期：">
                        <span v-if="mergeform.mergebilldate">{{mergeform.mergebilldate|dateFormat}}</span>
                        <span v-else>--</span>
                    </el-form-item>
                    <el-form-item label="发票金额："><span>{{mergeform.mergebillmoney ? mergeform.mergebillmoney : "--"}}元</span></el-form-item>
                </el-form>
                <el-table :data="tableData" border>
                    <el-table-column align="center" label="序号" type="index" width="50">
                        <template slot-scope="scope">{{ scope.$index + (page.page - 1) * page.limit + 1 }}</template>
                    </el-table-column>
                    <el-table-column align="center" label="订单编号" show-overflow-tooltip>
                        <template slot-scope="scope"><span>{{scope.row.mergeordernumber ? scope.row.mergeordernumber : "--"}}</span></template>
                    </el-table-column>
                    <el-table-column align="center" label="消费账号" show-overflow-tooltip>
                        <template slot-scope="scope"><span>{{scope.row.mergeconsumeaccount ? scope.row.mergeconsumeaccount : "--"}}</span></template>
                    </el-table-column>
                    <el-table-column align="center" label="商品" show-overflow-tooltip>
                        <template slot-scope="scope"><span>{{scope.row.mergecommodity ? scope.row.mergecommodity : "--"}}</span></template>
                    </el-table-column>
                    <el-table-column align="center" width="170" label="支付时间" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.mergeDatetime">{{scope.row.mergeDatetime|dateFormat}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单金额" show-overflow-tooltip>
                        <template slot-scope="scope"><span>{{scope.row.mergeordermoney ? scope.row.mergeordermoney : "--"}}</span></template>
                    </el-table-column>
                    <el-table-column align="center" label="实付金额" show-overflow-tooltip>
                        <template slot-scope="scope"><span>{{scope.row.mergerealmoney ? scope.row.mergerealmoney : "--"}}</span></template>
                    </el-table-column>
                    <el-table-column align="center" label="订单类型" show-overflow-tooltip>
                        <template slot-scope="scope"><span>{{scope.row.mergerordertype ? scope.row.mergerordertype : "--"}}</span></template>
                    </el-table-column>
                </el-table>
            </div >
        </el-dialog>
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
            innerVisible: false,
            mergeinnerVisible: false,
            tableData:[{
                mergerordertype: "体检",
                mergerealmoney: "100"
            }],
            page: {
                page: 1,
                limit: 10,
                total: 0,//总条数
            },
            mergeform:{
                mergebillnum: "111111111111111111",
                mergebilldate: 1563264642,
                mergebillmoney: "100"
            },
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
                trackingnumber: "",
                applydate: "",
                billmoney: "",
                dutyparagraph: "",
                invoicetitle:"",
                titlttype: "2",
                billcontent: "",
                billtype: "",
                billstate: "1",
                billdetails: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3674046085,1252384181&fm=26&gp=0.jpg"
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
            this.form.trackingnumber = "";
            this.form.applydate = "";
            this.form.billmoney = "";
            this.form.dutyparagraph = "";
            this.form.invoicetitle = "";
            this.form.titlttype = "";
            this.form.billcontent = "";
            this.form.billtype = "";
            this.form.billstate = "1";
            this.form.billdetails  = "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3674046085,1252384181&fm=26&gp=0.jpg";
            this.form.mergebillnum = "";
            this.form.mergebilldate = "";
            this.form.mergebillmoney  = "";
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
        //         this.form.trackingnumber = response.data.data.trackingnumber;
        //         this.form.applydate = response.data.data.applydate;
        //         this.form.billmoney = response.data.data.billmoney;
        //         this.form.dutyparagraph = response.data.data.dutyparagraph;
        //         this.form.invoicetitle = response.data.data.invoicetitle;
        //         this.form.titlttype = response.data.data.titlttype;
        //         this.form.billcontent = response.data.data.billcontent;
        //         this.form.billtype = response.data.data.billtype;
        //         this.form.billstate = response.data.data.billstate;
        //         this.form.billdetails  = response.data.data.billstate;
        //         this.form.mergebillnum = response.data.data.mergebillnum;
        //         this.form.mergebilldate = response.data.data.mergebilldate;
        //         this.form.mergebillmoney  = response.data.data.mergebillmoney;
        //         this.tableData = response.data.data.list;
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
    .mergeformstyle .el-form-item{
        display: inline-block;
        padding-right:40px;
    }
    .mergeformstyle /deep/ .el-form-item__content{
        display: inline-block !important;
        margin-left: 0 !important;
    }
    .mergeformstyle /deep/ .el-form-item label {
        width: 83px !important;
        padding:0 !important;
        text-align: right !important;
    }
    .el-dialog-div{
    min-height: 40vh;
     overflow: auto;
    }

</style>
