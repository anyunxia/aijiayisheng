
const loginRouter = {
    path: "/login",
    meta:{ title: "登录", type: "未登录" },
    component: resolve => require(["@/view/login/Login.vue"],resolve),
}

const adminRouter = {
    path: "/admin",
    meta: { title: "后台管理" },
    component: resolve => require(["@/view/body/Body.vue"], resolve),
    children: [
        {path: "/", meta: { title: "首页", type: "已登录" }, component: resolve => require(["@/view/menu/datastatist/userlatform/List.vue"], resolve)},
    ]
};

const shujuRouter = {
    path: "/admin",
    meta: { title: "数据统计" },
    component: resolve => require(["@/view/body/Body.vue"], resolve),
    children: [
        {path: "/userlatform", meta: { title: "用户分析", type: "已登录" }, component: resolve => require(["@/view/menu/datastatist/userlatform/List.vue"], resolve),
            children: [
                {
                    path: "/userlatform/Useralldata", 
                    meta: { title: "全部", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/datastatist/userlatform/Useralldata/List.vue"], resolve),
                },
                {
                    path: "/userlatform/Iosdata", 
                    meta: { title: "IOS", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/datastatist/userlatform/Iosdata/List.vue"], resolve),
                },
                {
                    path: "/userlatform/Androiddata", 
                    meta: { title: "Android", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/datastatist/userlatform/Androiddata/List.vue"], resolve),
                }
            ]
        },
        {path: "/order", meta: { title: "订单分析", type: "已登录" }, component: resolve => require(["@/view/menu/datastatist/order/List.vue"], resolve),
            children: [
                {
                    path: "/order/Ordalldata", 
                    meta: { title: "全部", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/datastatist/order/Ordalldata/List.vue"], resolve),
                },
                {
                    path: "/order/Ordregist", 
                    meta: { title: "挂号", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/datastatist/order/Ordregist/List.vue"], resolve),
                },
                {
                    path: "/order/Ordexaminat", 
                    meta: { title: "体检", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/datastatist/order/Ordexaminat/List.vue"], resolve),
                },
                {
                    path: "/order/Ordfacilitybuy", 
                    meta: { title: "设备购买", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/datastatist/order/Ordfacilitybuy/List.vue"], resolve),
                }
            ]
         },
    ]
};

const shezhiRouter = {
    path: "/admin",
    meta: { title: "设置管理" },
    component: resolve => require(["@/view/body/Body.vue"], resolve),
    children: [
        {path: "/account", meta: { title: "账号管理", type: "已登录" }, component: resolve => require(["@/view/menu/installmanage/account/List.vue"], resolve),
            children: [
                {
                    path: "/account/Accountsets", 
                    meta: { title: "账号设置", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/installmanage/account/Accountsets/List.vue"], resolve),
                },
                {
                    path: "/account/Role", 
                    meta: { title: "权限管理", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/installmanage/account/Role/List.vue"], resolve),
                }
            ]
        },
        {path: "/platform", meta: { title: "平台管理", type: "已登录" }, component: resolve => require(["@/view/menu/installmanage/platform/List.vue"], resolve),
            children: [
                {
                    path: "/platform/Information", 
                    meta: { title: "平台信息", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/installmanage/platform/Information/List.vue"], resolve),
                },
                {
                    path: "/platform/Pushmanage", 
                    meta: { title: "推送管理", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/installmanage/platform/Pushmanage/List.vue"], resolve),
                },
                {
                    path: "/platform/Advertmanage", 
                    meta: { title: "广告管理", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/installmanage/platform/Advertmanage/List.vue"], resolve),
                }
            ]
        },
    ]
};
const userRouter = {
    path: "/admin",
    meta: { title: "用户中心" },
    component: resolve => require(["@/view/body/Body.vue"], resolve),
    children: [
        {
            path: "/usermanage", meta: { title: "用户管理", type: "已登录" },component: resolve => require(["@/view/menu/usercenter/List.vue"], resolve),
                children: [
                    {
                        path: "/usermanage/User", 
                        meta: { title: "用户管理", type: "已登录" }, 
                        component: resolve => require(["@/view/menu/usercenter/User/List.vue"], resolve),
                    },
                    {
                        path: "/usermanage/Doctor", 
                        meta: { title: "医生管理", type: "已登录" }, 
                        component: resolve => require(["@/view/menu/usercenter/Doctor/List.vue"], resolve),
                    },
                    
                ]
        }
    ]
};
const financeRouter = {
    path: "/admin",
    meta: { title: "财务中心" },
    component: resolve => require(["@/view/body/Body.vue"], resolve),
    children: [
        {path: "/classifyorder", meta: { title: "分类订单", type: "已登录" }, component: resolve => require(["@/view/menu/financecenter/classifyorder/List.vue"], resolve),
            children: [
                {
                    path: "/classifyorder/Alldata", 
                    meta: { title: "全部", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/financecenter/classifyorder/Alldata/List.vue"], resolve),
                },
                {
                    path: "/classifyorder/Registration", 
                    meta: { title: "挂号订单", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/financecenter/classifyorder/Registration/List.vue"], resolve),
                },
                {
                    path: "/classifyorder/Examination", 
                    meta: { title: "体检订单", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/financecenter/classifyorder/Examination/List.vue"], resolve),
                },
                {
                    path: "/classifyorder/Facilitybuy", 
                    meta: { title: "设备销售订单", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/financecenter/classifyorder/Facilitybuy/List.vue"], resolve),
                },
                {
                    path: "/classifyorder/Advisory", 
                    meta: { title: "在线咨询", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/financecenter/classifyorder/Advisory/List.vue"], resolve),
                },
                
            ]
        },
        {path: "/finance", meta: { title: "财务收支", type: "已登录" }, component: resolve => require(["@/view/menu/financecenter/finance/List.vue"], resolve),
            children: [
                {
                    path: "/finance/Findata", 
                    meta: { title: "数据", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/financecenter/finance/Findata/List.vue"], resolve),
                },
                {
                    path: "/finance/Finlist", 
                    meta: { title: "列表", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/financecenter/finance/Finlist/List.vue"], resolve),
                }
            ]
        },
        {path: "/bill", meta: { title: "发票统计", type: "已登录" }, component: resolve => require(["@/view/menu/financecenter/bill/List.vue"], resolve),}
    ]
};
const newsRouter = {
    path: "/admin",
    meta: { title: "新闻中心" },
    component: resolve => require(["@/view/body/Body.vue"], resolve),
    children: [
        {path: "/newsmanage", meta: { title: "新闻管理", type: "已登录" }, component: resolve => require(["@/view/menu/newscenter/newsmanage/List.vue"], resolve)}
    ]
};
const  productRouter = {
    path: "/admin",
    meta: { title: "商品中心" },
    component: resolve => require(["@/view/body/Body.vue"], resolve),
    children: [
        {path: "/productmanage", meta: { title: "商品管理", type: "已登录" }, component: resolve => require(["@/view/menu/productcenter/productmanage/List.vue"], resolve)},
        {path: "/shipmentmanage", meta: { title: "发货管理", type: "已登录" }, component: resolve => require(["@/view/menu/productcenter/shipmentmanage/List.vue"], resolve)},
        {
            path: "/consultsetting", meta: { title: "咨询设置", type: "已登录" }, component: resolve => require(["@/view/menu/productcenter/consultsetting/List.vue"], resolve),
            children: [
                {
                    path: "/consultsetting/hospitalsetting", 
                    meta: { title: "医院设置", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/productcenter/consultsetting/hospitalsetting/List.vue"], resolve),
                },
                {
                    path: "/consultsetting/costsetting", 
                    meta: { title: "费用设置", type: "已登录" }, 
                    component: resolve => require(["@/view/menu/productcenter/consultsetting/costsetting/List.vue"], resolve),
                }
                
            ]
        },
    ]
};

const route = [
    loginRouter,
    shujuRouter,
    shezhiRouter,
    userRouter,
    financeRouter,
    newsRouter,
    productRouter
]
export default route;