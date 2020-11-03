/* Actual calls to the REST API server is done by the functions in this file */

import AuthService from "../services/AuthService";
import { Module } from "vuex";
import { register } from "register-service-worker";
import axios from 'axios';

const userGetResult = localStorage.getItem("user");
const user = userGetResult ? JSON.parse(userGetResult) : null;

const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

export const auth: Module<any, any> = {
    namespaced: true,
    state: initialState,
    actions: {
        async login({ commit }, user) {
            const loginResult = await AuthService.login(user);
            if (loginResult) {
                commit("LOGINSUCCESS", user);
                return user;
            } else {
                commit("LOGINFAILURE");
                return loginResult;
            }
        },
        logout({ commit }) {
            AuthService.logout();
            commit("logout");
        },
        async register({ commit }, user) {
            const {result, message} = await AuthService.register(user);
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
        LOGINSUCCESS(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        LOGINFAILURE(state) {
            state.status.loggedIn = false;
            state.user = null;
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
