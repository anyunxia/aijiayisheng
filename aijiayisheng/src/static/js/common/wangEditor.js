import wangEditor from "wangEditor";


const wangeditor = (id) => {
    var editor = new wangEditor(document.querySelector("#wangeditor"));
   
    editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
    ];
//------------------------------------------------------------------------------
// function Video(editor) {
//     this.editor = editor;
//     this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-play"><i/></div>');
//     this.type = 'panel';
 
//     // 当前是否 active 状态
//     this._active = false;
// }
// Video.prototype = {

//     constructor: Video,
 
//     onClick: function onClick() {
//         this._createInsertPanel();
//     },
 
//     _createInsertPanel: function _createInsertPanel() {
//         var editor = this.editor;
//         var uploadVideo = editor.uploadVideo;
//         var config = editor.config;
 
//         // id
//         var upTriggerId = getRandom('up-trigger');
//         var upFileId = getRandom('up-file');
 
//         // tabs 的配置
//         var tabsConfig = [{
//             title: '上传 video',
//             tpl: '<div class="w-e-up-img-container">\n                    ' +
//             '<div id="' + upTriggerId + '" class="w-e-up-btn">\n                        ' +
//             '<i class="w-e-icon-upload2"></i>\n                    </div>\n                    ' +
//             '<div style="display:none;">\n                        <input id="' + upFileId + '" type="file" multiple="multiple" accept="audio/mp4, video/mp4"/>\n                    ' +
//             '</div>\n                            </div>',
//             events: [{
//                 // 触发选择视频
//                 selector: '#' + upTriggerId,
//                 type: 'click',
//                 fn: function fn() {
//                     var $file = $('#' + upFileId);
//                     var fileElem = $file[0];
//                     if (fileElem) {
//                         fileElem.click();
//                     } else {
//                         // 返回 true 可关闭 panel
//                         return true;
//                     }
//                 }
//             }, {
//                 // 选择视频完毕
//                 selector: '#' + upFileId,
//                 type: 'change',
//                 fn: function fn() {
//                     var $file = $('#' + upFileId);
//                     var fileElem = $file[0];
//                     if (!fileElem) {
//                         // 返回 true 可关闭 panel
//                         return true;
//                     }
 
//                     // 获取选中的 file 对象列表
//                     var fileList = fileElem.files;
//                     if (fileList.length) {
//                         uploadVideo.uploadVideo(fileList);
//                     }
 
//                     // 返回 true 可关闭 panel
//                     return true;
//                 }
//             }]
//         }
//         ]; // tabs end
 
//         // 判断 tabs 的显示
//         var tabsConfigResult = [];
//         tabsConfigResult.push(tabsConfig[0]);
 
//         // 创建 panel 并显示
//         var panel = new Panel(this, {
//             width: 300,
//             tabs: tabsConfigResult
//         });
//         panel.show();
 
//         // 记录属性
//         this.panel = panel;
//     },
 
//     // 试图改变 active 状态
//     tryChangeActive: function tryChangeActive(e) {
//         var editor = this.editor;
//         var $elem = this.$elem;
//         if (editor._selectedImg) {
//             this._active = true;
//             $elem.addClass('w-e-active');
//         } else {
//             this._active = false;
//             $elem.removeClass('w-e-active');
//         }
//     }
// };
 
 
// /*
//     所有菜单的汇总
// */
 
// // 存储菜单的构造函数
// var MenuConstructors = {};
 
// MenuConstructors.video = Video;
 
// /*
//  上传视频
//  */
 
// // 构造函数
// function UploadVideo(editor) {
//     this.editor = editor;
// }
 
// // 原型
// UploadVideo.prototype = {
//         constructor: UploadVideo,
//     // 根据 debug 弹出不同的信息
//     _alert: function _alert(alertInfo, debugInfo) {
//         var editor = this.editor;
//         var debug = editor.config.debug;
//         // var debug = true;
//         var customAlert = editor.config.customAlert;
 
//         if (debug) {
//             throw new Error('wangEditor: ' + (debugInfo || alertInfo));
//         } else {
//             if (customAlert && typeof customAlert === 'function') {
//                 customAlert(alertInfo);
//             } else {
//                 alert(alertInfo);
//             }
//         }
//     },
//         // 上传视频
//         uploadVideo: function uploadVideo(files) {
//             var _this3 = this;
 
//             if (!files || !files.length) {
//                 return;
//             }
 
//             // ------------------------------ 获取配置信息 ------------------------------
//             var editor = this.editor;
//             var config = editor.config;
//             var uploadImgServer = "/file/upload";
//             // var uploadImgShowBase64 = config.uploadImgShowBase64;
 
//             var maxSize = 100 * 1024 * 1024;       //100M
//             var maxSizeM = maxSize / 1000 / 1000;
//             var maxLength = 1;
//             var uploadFileName = "file";
//             var uploadImgParams = config.uploadImgParams || {};
//             // var uploadImgParamsWithUrl = config.uploadImgParamsWithUrl;
//             var uploadImgHeaders = {};
//             var hooks = config.uploadImgHooks || {};
//             var timeout = 5 * 60 * 1000;        //5 min
//             var withCredentials = config.withCredentials;
//             if (withCredentials == null) {
//                 withCredentials = false;
//             }
 
//             // ------------------------------ 验证文件信息 ------------------------------
//             var resultFiles = [];
//             var errInfo = [];
//             arrForEach(files, function (file) {
//                 var name = file.name;
//                 var size = file.size;
 
//                 // chrome 低版本 name === undefined
//                 if (!name || !size) {
//                     return;
//                 }
 
//                 if (/\.(mp4)$/i.test(name) === false) {
//                     // 后缀名不合法，不是图片
//                     errInfo.push('\u3010' + name + '\u3011\u4E0D\u662F\u56FE\u7247');
//                     return;
//                 }
//                 if (maxSize < size) {
//                     // 上传图片过大
//                     errInfo.push('\u3010' + name + '\u3011\u5927\u4E8E ' + maxSizeM + 'M');
//                     return;
//                 }
 
//                 // 验证通过的加入结果列表
//                 resultFiles.push(file);
//             });
//             // 抛出验证信息
//             if (errInfo.length) {
//                 this._alert('视频验证未通过: \n' + errInfo.join('\n'));
//                 return;
//             }
//             if (resultFiles.length > maxLength) {
//                 this._alert('一次最多上传' + maxLength + '个视频');
//                 return;
//             }
 
//             // ------------------------------ 自定义上传 ------------------------------
//             // 添加视频数据
//             var formdata = new FormData();
//             arrForEach(resultFiles, function (file) {
//                 var name = uploadFileName || file.name;
//                 formdata.append(name, file);
//             });
 
//             // ------------------------------ 上传视频 ------------------------------
//             if (uploadImgServer && typeof uploadImgServer === 'string') {
//                 // 添加参数
//                 var uploadImgServerArr = uploadImgServer.split('#');
//                 uploadImgServer = uploadImgServerArr[0];
//                 var uploadImgServerHash = uploadImgServerArr[1] || '';
//                 objForEach(uploadImgParams, function (key, val) {
//                     val = encodeURIComponent(val);
 
//                     // 第一，将参数拼接到 url 中
//                     if (uploadImgParamsWithUrl) {
//                         if (uploadImgServer.indexOf('?') > 0) {
//                             uploadImgServer += '&';
//                         } else {
//                             uploadImgServer += '?';
//                         }
//                         uploadImgServer = uploadImgServer + key + '=' + val;
//                     }
 
//                     // 第二，将参数添加到 formdata 中
//                     formdata.append(key, val);
//                 });
//                 if (uploadImgServerHash) {
//                     uploadImgServer += '#' + uploadImgServerHash;
//                 }
 
//                 // 定义 xhr
//                 var xhr = new XMLHttpRequest();
//                 xhr.open('POST', uploadImgServer);
 
//                 // 设置超时
//                 xhr.timeout = timeout;
//                 xhr.ontimeout = function () {
//                     // hook - timeout
//                     if (hooks.timeout && typeof hooks.timeout === 'function') {
//                         hooks.timeout(xhr, editor);
//                     }
 
//                     _this3._alert('上传图片超时');
//                 };
 
//                 // 监控 progress
//                 if (xhr.upload) {
//                     xhr.upload.onprogress = function (e) {
//                         var percent = void 0;
//                         // 进度条
//                         var progressBar = new Progress(editor);
//                         if (e.lengthComputable) {
//                             percent = e.loaded / e.total;
//                             progressBar.show(percent);
//                         }
//                     };
//                 }
 
//                 // 返回数据
//                 xhr.onreadystatechange = function () {
//                     var result = void 0;
//                     if (xhr.readyState === 4) {
//                         if (xhr.status < 200 || xhr.status >= 300) {
//                             // hook - error
//                             if (hooks.error && typeof hooks.error === 'function') {
//                                 hooks.error(xhr, editor);
//                             }
 
//                             // xhr 返回状态错误
//                             _this3._alert('上传视频发生错误', '\u4E0A\u4F20\u56FE\u7247\u53D1\u751F\u9519\u8BEF\uFF0C\u670D\u52A1\u5668\u8FD4\u56DE\u72B6\u6001\u662F ' + xhr.status);
//                             return;
//                         }
 
//                         result = xhr.responseText;
//                         if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) !== 'object') {
//                             try {
//                                 result = JSON.parse(result);
//                             } catch (ex) {
//                                 // hook - fail
//                                 if (hooks.fail && typeof hooks.fail === 'function') {
//                                     hooks.fail(xhr, editor, result);
//                                 }
 
//                                 _this3._alert('上传视频失败', '上传视频返回结果错误，返回结果是: ' + result);
//                                 return;
//                             }
//                         }
//                         if (!hooks.customInsert && result.errno != '0') {
//                             // hook - fail
//                             if (hooks.fail && typeof hooks.fail === 'function') {
//                                 hooks.fail(xhr, editor, result);
//                             }
 
//                             // 数据错误
//                             _this3._alert('上传视频失败', '上传视频返回结果错误，返回结果 errno=' + result.errno);
//                         } else {
//                             if (hooks.customInsert && typeof hooks.customInsert === 'function') {
//                                 // 使用者自定义插入方法
//                                 // var _video_src = ' <video class="video-js" controls preload="auto" data-setup="{}"><source src="' + result.obj + '" type="video/mp4"></video>'
//                                 editor.cmd.do('insertHTML', '<video src="' + result.obj + '" style="max-width: 50%;max-height:50%;" controls autobuffer />');
//                                 _this3._alert("upload successfully")
//                                 // hooks.customInsert(_this3.insertLinkImg.bind(_this3), result, editor);
//                             } else {
//                                 // 将图片插入编辑器
//                                 var data = result.data || [];
//                                 data.forEach(function (link) {
//                                     _this3.insertLinkImg(link);
//                                 });
//                             }
 
//                             // hook - success
//                             if (hooks.success && typeof hooks.success === 'function') {
//                                 hooks.success(xhr, editor, result);
//                             }
//                         }
//                     }
//                 };
 
//                 // hook - before
//                 if (hooks.before && typeof hooks.before === 'function') {
//                     var beforeResult = hooks.before(xhr, editor, resultFiles);
//                     if (beforeResult && (typeof beforeResult === 'undefined' ? 'undefined' : _typeof(beforeResult)) === 'object') {
//                         if (beforeResult.prevent) {
//                             // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
//                             this._alert(beforeResult.msg);
//                             return;
//                         }
//                     }
//                 }
 
//                 // 自定义 headers
//                 objForEach(uploadImgHeaders, function (key, val) {
//                     xhr.setRequestHeader(key, val);
//                 });
 
//                 // 跨域传 cookie
//                 xhr.withCredentials = withCredentials;
 
//                 // 发送请求
//                 xhr.send(formdata);
 
//                 // 注意，要 return 。不去操作接下来的 base64 显示方式
//                 return;
//             }
//         }
//     };
 
 
 
// // 修改原型
// editor.prototype = {
//     constructor: editor,
 
//     // 添加视频上传
//     _initUploadVideo: function _initUploadVideo() {
//         this.uploadVideo = new UploadVideo(this);
//     },
//     // 创建编辑器
//     create: function create() {
     
//         // 添加 视频上传
//         this._initUploadVideo();
//     },
 
// };
//------------------------------------------------------------------------------
    /* 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！ */

    // /* 使用 base64 保存图片 */
    // editor.customConfig.uploadImgShowBase64 = true;
    /* 上传图片到服务器 */
    /* 自定义 fileName */
    editor.customConfig.uploadFileName = "imagefile";
    /* 服务器地址 */
    editor.customConfig.uploadImgServer = "http://192.168.0.124:8887/web/upload/file";
    // 线上地址
    // editor.customConfig.uploadImgServer = "http://mm.aiminerva.com/pc/upload/file";
    /* 监听函数 */
    editor.customConfig.uploadImgHooks = {
        /*
        insertImg: 富文本插入图片回调;
        result: 服务器返回数据;
        editor: 富文本编辑器对象;
        */
        customInsert: function (insertImg, result) {
            console.log(result)
            if (result.status == 200) {
                var ur = 'http://image.aiminerva.cn/'
                var url = ur + result.data;
                insertImg(url);
            }
        }
    };

    // 将图片大小限制为 3M
    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;

    // 限制一次最多上传 5 张图片
    editor.customConfig.uploadImgMaxLength = 5;

    // 隐藏网络图片tab
    editor.customConfig.showLinkImg = false;

    // 绑定文本值
    // var changeValue = (value) => {
    // this.form.text = value;
    // };

    return editor;

    // 创建文本：editor.create();
    // 获取文本：var content = editor.txt.html(); || var content = editor.txt.text();
    // 设置文本：editor.txt.html(content); || editor.txt.text(content);
};

export default wangeditor;