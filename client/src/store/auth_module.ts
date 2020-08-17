import AuthService from "../services/auth_service";
import { Module } from 'vuex'

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
        return Promise.resolve(user);
      }
      else {
        commit("loginFailure");
        return Promise.reject(loginResult);
      }
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        (response) => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
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
