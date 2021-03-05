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
// rgv
Vue.prototype.$address = 'http://192.168.102.125:8099';
Vue.prototype.$socketUrl = 'ws://192.168.102.125:8099/websocket';
// stacker
Vue.prototype.$stacker = 'http://localhost:8087';
Vue.prototype.$stacketSocketUrl = 'ws://localhost:8087/deviceInfoPush';
Vue.directive('clickoutside', Clickoutside);
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
