import Vue from 'vue'
import axios from 'axios'
import util from './libs/util'
import App from './App'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Clickoutside from 'element-ui/src/utils/clickoutside';
import '../renderer/libs/minx'
Vue.use(ViewUI);
Vue.use(Element);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.prototype.$util = util;
Vue.prototype.$address = 'http://27.223.104.6:48087';
Vue.prototype.$socketUrl = 'ws://27.223.104.6:49003/websocket';
Vue.directive('clickoutside', Clickoutside);
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
