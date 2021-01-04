/* Actual calls to the REST API server is done by the functions in this file */

import AuthService from "../services/AuthService";
import { Module, Commit } from "vuex";
import Cookies from "js-cookie";
import User from "../models/user";

type userInfo = { username?: string; role?: string };

const username = localStorage.getItem("username");
const role = localStorage.getItem("role");
const initialState =
    username && role
        ? {
              status: { loggedIn: true },
              user: { username: username, role: role },
          }
        : { status: { loggedIn: false }, user: { username: null, role: null } };

export const auth: Module<any, any> = {
    namespaced: true,
    state: initialState,
    actions: {
        async login({ commit }, user: User): Promise<userInfo> {
            try {
                const data = await AuthService.login(user);
                const userInfo = data.userInfo as userInfo;
                commit("LOGINSUCCESS", userInfo);
                return userInfo;
            } catch (e) {
                commit("LOGINFAILURE");
                throw e;
            }
        },
        logout({ commit }): void {
            AuthService.logout();
            commit("LOGOUT");
        },
        async register({ commit }, user: User) {
            const { result, message } = await AuthService.register(user);
            if (!result) {
                commit("REGISTERSUCCESS");
                return message;
            } else {
                commit("REGISTERFAILURE");
                return message;
            }
        },
    },
    mutations: {
        LOGINSUCCESS(state, user: userInfo) {
            state.status.loggedIn = true;
            state.user = user;
            localStorage.setItem("username", user.username as string);
            localStorage.setItem("role", user.role as string);
        },
        LOGINFAILURE(state) {
            state.status.loggedIn = false;
            state.user = null;
            localStorage.clear();
        },
        LOGOUT(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        REGISTERSUCCESS(state) {
            // state.status.loggedIn = false;
        },
        REGISTERFAILURE(state) {
            // state.status.loggedIn = false;
        },
    },
};
