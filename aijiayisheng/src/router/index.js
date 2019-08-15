import Vue from 'vue'
import VueRouter from 'vue-router'
import route from './route.js'

Vue.use(VueRouter)



// 路由配置
const RouterConfig = {
    mode: 'hash',
    routes: route,
};

// 路由定义
const router = new VueRouter(RouterConfig);

const findPath = ((path)=>{
    var menuItem = JSON.parse(localStorage.getItem("menuItem"));
    var findPath = false
    var findButton = (menuItem)=>{
            menuItem.map((item)=>{
                if (item.sectionlist.length > 0) {
                    findButton(item.sectionlist);
                }else{
                    findPath = true
                    return
                }
            });
    };
    findButton(menuItem);
    return findPath;
});


// 路由设置
router.beforeEach((to, from, next) => {
  var userMessage = localStorage.getItem("userMessage");
  if(userMessage){
      if(to.path == "/userlatform/Useralldata"){
           next();   
      }else{
        var menuPower = findPath(to.path);
        if(menuPower && to.matched.length != 0 && to.meta.type == "已登录") {
            next();    
        }else{
            next("/userlatform/Useralldata");
        }
      }
  }else{
      if(to.matched.length != 0 && to.meta.type == "未登录"){    
          next();
      }else{
          next("/login");
      }
  }
});

router.afterEach((to) => { 
  window.scrollTo(0, 0);
});

// 暴露路由
export default router;
