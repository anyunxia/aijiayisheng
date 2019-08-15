import web from "./web.js";
import {Message} from 'element-ui';

const upload = (event, type, callBack)=>{
    // 获取上传的文件
    var file = event.target.files[0];
    if(file){
        // 判断文件类型     1: 文件； 2: 图片；
        var status = false;
        switch(type){
            case 1:
                status = true;
            break;
            case 2:
                var list = [
                    "image/gif",
                    "image/jpeg",
                    "image/png",
                ];
                list.map((item)=>{
                    if(item == file.type){
                        status = true;
                    }
                });
            break;
        }
        if(status){
            // 文件大小校验的动作
            if(file.size == 0){
                Message.error("不能上传空文件!");
                callBack();
            }else if(file.size > 1024 * 1024 * 20){
                Message.error("大小不能超过 20MB!");
                callBack();
            }else{
                // 服务器存储
                var data = new FormData();
                data.append('imagefile', file);
                console.log(file)
                var config = {
                    type: 3,
                    name: "upload/file",
                    data: data,
                    model: "Upload",
                    controller: "upload",
                };
                web(config).then((response)=>{
                    if(response.status == 200){
                        Message.success("上传文件成功!");
                        callBack(response.data);
                    }else{
                        Message.error("服务器响应失败!");
                        callBack();
                    }
                });
            };
        }else{
            Message.error("暂不支持上传的文件类型!");
            callBack();
        }
    }else{
        callBack();
    }
};

export default upload;