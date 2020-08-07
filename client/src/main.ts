import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

// get env settings from .env file, which should exist in same dir.
import * as dotenv from "dotenv"

import axios from 'axios'

Vue.prototype.$Axios = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App) 
}).$mount("#app");
