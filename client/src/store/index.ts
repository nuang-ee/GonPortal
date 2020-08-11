import Vue from "vue";
import Vuex from "vuex";
import Axios from 'axios';
import { auth } from './auth_module'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { auth }
});
