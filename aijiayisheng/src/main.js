// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import store from "./store/index.js";
import moment from 'moment';
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
  
})
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//字体图标库
import "font-awesome/css/font-awesome.min.css";


Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: "#app",
    router: router,
    store,
    render: h => h(App),
})
