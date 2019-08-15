<template>
    <div class="menu">
        <el-menu class="sidebar-el-menu" :default-active="activeMenu" :default-openeds="arr" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router >
            <template v-for="(item,key) in menuItem">
                <template v-if="item.sectionlist">
                    <el-submenu :index="item.menuId" :key="item.menuId">
                        <template slot="title">
                            <span slot="title">{{ item.menuName }}</span>
                        </template>
                        <template v-for="subItem in item.sectionlist">
                            <el-submenu v-if="subItem.sectionlist.length > 0" :index="'/'+subItem.menuUrl" :key="subItem.menuUrl">
                                <template slot="title">{{ subItem.menuName }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.sectionlist" :key="i" :index="'/'+threeItem.menuUrl">
                                    {{ threeItem.menuName }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="'/'+subItem.menuUrl" :key="subItem.menuUrl">
                                {{ subItem.menuName }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import web from "@/static/js/common/web.js";
import bus from '@/static/js/common/bus.js';
export default {
    data() {
        return{
            arr: ['002','004','007','009','012'],
            home: "/userlatform/Useralldata",
            menuItem: [],                           // 菜单列表
            activeMenu: "",                         // 当前激活菜单的位置
            activeItem: [],                        // 当前激活菜单的列表
            //假数据 ---------------------------------
            
            menuItem: [
        //         {
        //     "creationDatetime": 1558022400000,
        //     "updateDatetime": 1558063529000,
        //     "row": null,
        //     "page": null,
        //     "timeStamp": null,
        //     "menuId": "9",
        //     "menuName": "用户中心",
        //     "menuUrl": "#",
        //     "meunPid": "0",
        //     "menuWeight": 0,
        //     "accessOperating": "save,delete,update,query",
        //     "accessRoleId": "1",
        //     "sectionlist": [
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558063598000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "10",
        //             "menuName": "用户管理",
        //             "menuUrl": "usermanage",
        //             "meunPid": "9",
        //             "menuWeight": 0,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": [
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558063600000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "11",
        //                     "menuName": "医生管理",
        //                     "menuUrl": "usermanage/Doctor",
        //                     "meunPid": "10",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558063595000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "12",
        //                     "menuName": "用户管理",
        //                     "menuUrl": "usermanage/User",
        //                     "meunPid": "10",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 }
        //             ]
        //         }
        //     ]
        // },
        // {
        //     "creationDatetime": 1558022400000,
        //     "updateDatetime": 1558064429000,
        //     "row": null,
        //     "page": null,
        //     "timeStamp": null,
        //     "menuId": "24",
        //     "menuName": "商品中心",
        //     "menuUrl": "#",
        //     "meunPid": "0",
        //     "menuWeight": 0,
        //     "accessOperating": "save,delete,update,query",
        //     "accessRoleId": "1",
        //     "sectionlist": [
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558064431000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "25",
        //             "menuName": "商品管理",
        //             "menuUrl": "productmanage",
        //             "meunPid": "24",
        //             "menuWeight": 0,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": []
        //         },
        //          {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558064431000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "99",
        //             "menuName": "发货管理",
        //             "menuUrl": "shipmentmanage",
        //             "meunPid": "24",
        //             "menuWeight": 0,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": []
        //         },
        //          {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558064431000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "90",
        //             "menuName": "咨询设置",
        //             "menuUrl": "consultsetting",
        //             "meunPid": "24",
        //             "menuWeight": 0,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": [
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064291000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "91",
        //                     "menuName": "医院设置",
        //                     "menuUrl": "consultsetting/hospitalsetting",
        //                     "meunPid": "25",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064298000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "92",
        //                     "menuName": "费用设置",
        //                     "menuUrl": "consultsetting/costsetting",
        //                     "meunPid": "25",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //             ]
        //         }

        //     ]
        // },
        // {
        //     "creationDatetime": 1558022400000,
        //     "updateDatetime": 1558064286000,
        //     "row": null,
        //     "page": null,
        //     "timeStamp": null,
        //     "menuId": "13",
        //     "menuName": "财务中心",
        //     "menuUrl": "#",
        //     "meunPid": "0",
        //     "menuWeight": 0,
        //     "accessOperating": "save,delete,update,query",
        //     "accessRoleId": "1",
        //     "sectionlist": [
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558064288000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "14",
        //             "menuName": "分类订单",
        //             "menuUrl": "classifyorder",
        //             "meunPid": "13",
        //             "menuWeight": 0,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": [
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064291000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "15",
        //                     "menuName": "挂号订单",
        //                     "menuUrl": "classifyorder/Registration",
        //                     "meunPid": "14",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064298000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "18",
        //                     "menuName": "在线咨询",
        //                     "menuUrl": "classifyorder/Advisory",
        //                     "meunPid": "14",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064293000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "16",
        //                     "menuName": "体检订单",
        //                     "menuUrl": "classifyorder/Examination",
        //                     "meunPid": "14",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064296000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "17",
        //                     "menuName": "设备销售订单",
        //                     "menuUrl": "classifyorder/Facilitybuy",
        //                     "meunPid": "14",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 }
        //             ]
        //         },
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558064301000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "19",
        //             "menuName": "财务统计",
        //             "menuUrl": "finance",
        //             "meunPid": "13",
        //             "menuWeight": 0,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": [
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064304000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "20",
        //                     "menuName": "财务数据",
        //                     "menuUrl": "finance/Findata",
        //                     "meunPid": "19",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064306000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "21",
        //                     "menuName": "财务列表",
        //                     "menuUrl": "finance/Finlist",
        //                     "meunPid": "19",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 }
        //             ]
        //         },
        //          {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558064431000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "98",
        //             "menuName": "发票统计",
        //             "menuUrl": "bill",
        //             "meunPid": "13",
        //             "menuWeight": 0,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": []
        //         }
        //     ]
        // },
        // {
        //     "creationDatetime": 1558022400000,
        //     "updateDatetime": 1558064352000,
        //     "row": null,
        //     "page": null,
        //     "timeStamp": null,
        //     "menuId": "22",
        //     "menuName": "新闻中心",
        //     "menuUrl": "#",
        //     "meunPid": "0",
        //     "menuWeight": 0,
        //     "accessOperating": "save,delete,update,query",
        //     "accessRoleId": "1",
        //     "sectionlist": [
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558064383000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "23",
        //             "menuName": "新闻管理",
        //             "menuUrl": "newsmanage",
        //             "meunPid": "22",
        //             "menuWeight": 0,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": []
        //         }
        //     ]
        // },
        // {
        //     "creationDatetime": 1558022400000,
        //     "updateDatetime": 1558062297000,
        //     "row": null,
        //     "page": null,
        //     "timeStamp": null,
        //     "menuId": "1",
        //     "menuName": "数据统计",
        //     "menuUrl": "#",
        //     "meunPid": "0",
        //     "menuWeight": 1,
        //     "accessOperating": "save,delete,update,query",
        //     "accessRoleId": "1",
        //     "sectionlist": [
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558062376000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "2",
        //             "menuName": "用户分析",
        //             "menuUrl": "userlatform",
        //             "meunPid": "1",
        //             "menuWeight": 1,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": [
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064304000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "26",
        //                     "menuName": "全部",
        //                     "menuUrl": "userlatform/Useralldata",
        //                     "meunPid": "2",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064306000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "27",
        //                     "menuName": "IOS",
        //                     "menuUrl": "userlatform/Iosdata",
        //                     "meunPid": "2",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064306000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "28",
        //                     "menuName": "Android",
        //                     "menuUrl": "userlatform/Androiddata",
        //                     "meunPid": "2",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 }]
        //         },
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558062398000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "3",
        //             "menuName": "订单分析",
        //             "menuUrl": "order",
        //             "meunPid": "1",
        //             "menuWeight": 1,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": [
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064304000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "29",
        //                     "menuName": "全部",
        //                     "menuUrl": "order/Ordalldata",
        //                     "meunPid": "3",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064306000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "32",
        //                     "menuName": "设备购买",
        //                     "menuUrl": "order/Ordfacilitybuy",
        //                     "meunPid": "3",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064306000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "30",
        //                     "menuName": "挂号",
        //                     "menuUrl": "order/Ordregist",
        //                     "meunPid": "3",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558064306000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "31",
        //                     "menuName": "体检",
        //                     "menuUrl": "order/Ordexaminat",
        //                     "meunPid": "3",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 }]
        //         }
        //     ]
        // },
        // {
        //     "creationDatetime": 1558022400000,
        //     "updateDatetime": 1558062419000,
        //     "row": null,
        //     "page": null,
        //     "timeStamp": null,
        //     "menuId": "4",
        //     "menuName": "设置管理",
        //     "menuUrl": "#",
        //     "meunPid": "0",
        //     "menuWeight": 2,
        //     "accessOperating": "save,delete,update,query",
        //     "accessRoleId": "1",
        //     "sectionlist": [
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558062540000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "5",
        //             "menuName": "账号管理",
        //             "menuUrl": "account",
        //             "meunPid": "4",
        //             "menuWeight": 2,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": [
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558063499000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "33",
        //                     "menuName": "账号设置",
        //                     "menuUrl": "account/Accountsets",
        //                     "meunPid": "5",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558063502000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "34",
        //                     "menuName": "权限管理",
        //                     "menuUrl": "account/Role",
        //                     "meunPid": "5",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 }
        //             ]
        //         },
        //         {
        //             "creationDatetime": 1558022400000,
        //             "updateDatetime": 1558062624000,
        //             "row": null,
        //             "page": null,
        //             "timeStamp": null,
        //             "menuId": "6",
        //             "menuName": "平台管理",
        //             "menuUrl": "platform",
        //             "meunPid": "4",
        //             "menuWeight": 3,
        //             "accessOperating": "save,delete,update,query",
        //             "accessRoleId": "1",
        //             "sectionlist": [
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558063499000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "7",
        //                     "menuName": "推送管理",
        //                     "menuUrl": "platform/Pushmanage",
        //                     "meunPid": "6",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558063502000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "36",
        //                     "menuName": "广告管理",
        //                     "menuUrl": "platform/Advertmanage",
        //                     "meunPid": "6",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 },
        //                 {
        //                     "creationDatetime": 1558022400000,
        //                     "updateDatetime": 1558063502000,
        //                     "row": null,
        //                     "page": null,
        //                     "timeStamp": null,
        //                     "menuId": "35",
        //                     "menuName": "平台信息",
        //                     "menuUrl": "platform/Information",
        //                     "meunPid": "6",
        //                     "menuWeight": 0,
        //                     "accessOperating": "save,delete,update,query",
        //                     "accessRoleId": "1",
        //                     "sectionlist": []
        //                 }
        //             ]
        //         }
        //     ]
        // }
                                
             ]
        //     // --------------------------------------------------------------
         }
    },
    methods: {
        getMenuItem() {
            var config = {
                type: 5,
                name: "menu/accessmenu",
                data: {timeStamp: Date.parse(new Date())},
                model: "Menu",
                controller: "get_menu",
            }
            web(config).then((response)=>{
                console.log(response)
                if(response.data && response.data.status == 200){
                    console.log(response.data)
                    localStorage.setItem("menuItem", JSON.stringify(response.data.data));
                    this.menuItem = response.data.data;
                    this.pageConfig();
                }else{
                    this.menuItem = [];
                }
                
            });
            
            
        },
        pageConfig() {
            this.tagConfig();
            this.activeMenuConfig();
        },
        tagConfig() {
            if(this.$route.path != this.home){
                var path = this.$route.path;
                var data = [];
                this.menuItem.map((item)=>{
                    if("sectionlist" in item) {
                        item.sectionlist.map((subItem)=>{
                            if("/"+subItem.menuUrl == path) {//如果接口返回的url和当前的url相等
                                // data = subItem;
                                //  this.$store.commit('setBtnPer', subItem.accessOperating.split(','));
                                 localStorage.setItem('setBtnPer',subItem.accessOperating)
                               // console.log(subItem.accessOperating.split(','), '如果没有三级菜单就取二级菜单的按钮')
                            }else{
                                subItem.sectionlist.forEach( elem => {
                                    if("/"+elem.menuUrl == path) {
                                        // this.$store.commit('setBtnPer', elem.accessOperating.split(','));
                                         localStorage.setItem('setBtnPer',elem.accessOperating)
                                      //  console.log(elem, '如果有三级菜单就取三级菜单的按钮')
                                    }   
                                    
                                })
                            }
                        });
                    }else{
                        if("/"+item.menuUrl == path) {
                            data = item;
                        }
                    };
                });
                var tagData = {
                    id: data.menuId,
                    path: "/"+data.menuUrl,
                    title: data.menuName,
                };
                this.$store.commit('addOneTagItem', tagData);
            }
        },
        activeMenuConfig() {
            if(this.$route.path == this.home){
                this.activeMenu = this.home;
                this.activeItem = [];
            }else{
                this.activeMenu = this.$route.path;
                this.menuItem.map((item)=>{
                    if("sectionlist" in item) {
                        item.sectionlist.map((subItem)=>{
                            if("/"+subItem.menuUrl == this.$route.path) {
                                // console.log(subItem)
                                this.activeItem = [""+subItem.meunPid];
                            }
                        });
                    }
                });
            }
        }
    },
    created() {
        this.getMenuItem();
    },
    watch:{
        "$route"(to) {
            this.pageConfig();
        }
    }
}
</script>

<style scoped>
    @import url("../../static/css/body.css");
    /* .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }

    .el-submenu /deep/ .el-menu-item {
        height: 50px;
        line-height: 50px;
        padding: 0 0 0 80px !important;
        min-width: 200px;
    } */
    /* 恢复侧边栏原来样式可以将下面两个删除 */
/* .el-submenu /deep/ .el-submenu__title{
    background: #00152a !important;
}
.el-submenu /deep/ .el-menu-item{
    color: #e6e3e3 !important;
    background-color: rgb(50, 65, 87) !important;
    border-bottom:1px solid #00152a !important;
} */
</style>
