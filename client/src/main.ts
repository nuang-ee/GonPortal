import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { ValidationProvider } from 'vee-validate';
import axios from 'axios';
import VueCookies from "vue-cookies-ts";

Vue.component('ValidationProvider', ValidationProvider);
Vue.use(VueCookies);

Vue.prototype.$Axios = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App) 
}).$mount("#app");
