import AuthService from "../services/AuthService";
import { Module } from 'vuex'
import { register } from 'register-service-worker';

const userGetResult = localStorage.getItem("user");
const user = userGetResult ? JSON.parse(userGetResult) : null;

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth: Module<any, any> = {
  namespaced: true,
  state: initialState,
  actions: {
    async login ({ commit }, user) {
      const loginResult = await AuthService.login(user);
      if (loginResult) {
        commit("loginSuccess", user);
        return user;
      }
      else {
        commit("loginFailure");
        return loginResult;
      }
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
    async register({ commit }, user) {
      const registerResult = await AuthService.register(user);
      if (registerResult) {
          commit("registerSuccess");
          return registerResult.data;
        }
      else {
          commit("registerFailure");
          return registerResult;
        }
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
  },
};
