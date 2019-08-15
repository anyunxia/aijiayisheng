import router from "@/router/index.js";
import { Message } from "element-ui";
import axios from "axios";
import qs from "qs";
import md5 from "js-md5";

// 拦截器
axios.interceptors.response.use(response => {
    if (response.data) {
        if (response.data.status == 501) {
            Message.error("登陆已失效，返回登陆页面");
            localStorage.clear();
            router.push("/login");
        }else if(response.data.status == 601){
            Message.error("该账户已在另一台设备登录,请重新登录");
            localStorage.clear();
            router.push("/login");
        }
    }
    return response;
}, () => {
    Message.error("服务器连接失败");
});

// 定义请求地址
 let URL = "http://192.168.0.130:8887/web";//本地服务
// let URL = "http://mm.aiminerva.com/pc";//线上地址

/*
    自定义配置信息
    method      # 接口名称
    headers     # 请求信息
    timeout     # 请求超时
    baseURL     # 如果 "url" 为全路径，该位置会被替换
    url         # 接口地址（接口名称/全路径）
    data        # 请求数据
*/

let postConfig = function (request) {
    // 配置信息
    var type = request.type;                        // 请求类型
    var name = request.name;                        // 请求名称
    var data = request.data;                        // 请求数据
    var timeStamp = new Date().getTime();           // 请求时间
    data.timeStamp = timeStamp;                     // 时间放入
    var KEY = "33a17099c6644a38aa9811da1f117b7a";   // 约定密钥
    var verify = md5(md5(name + data + KEY))        // 参数验证

    // 根据需求配置请求方式
    var config;
    switch (type) {
        case 5:
            config = {
                method: "post",
                headers: { "Content-Type": "application/json" },
                timeout: 60000,
                baseURL: URL,
                url: name + "?verify=" + verify,
                data: data,
            };
            break;
            case 3:
            config = {
                method: "post",
                headers: {"Content-Type": "application/json"},
                timeout: 60000,
                baseURL: URL,
                url: name + "?verify=" + verify,
                data: data,
            };
        break;
    }
    return axios(config);
};

export default postConfig;