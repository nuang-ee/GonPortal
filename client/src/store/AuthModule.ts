/* Actual calls to the REST API server is done by the functions in this file */

import AuthService from "../services/AuthService";
import { Module } from "vuex";
import axios from 'axios';
import Vue from 'vue';
import jwt from 'jsonwebtoken';

console.log(window.$cookies);
const token = Vue.$cookies.get("token") as string;
const user = token ? jwt.decode(token) : null;
console.log(token);

const initialState = user
    ? { status: { loggedIn: true }, user: user }
    : { status: { loggedIn: false }, user: null };

export const auth: Module<any, any> = {
    namespaced: true,
    state: initialState,
    actions: {
        async login({ commit }, user) {
            const loginResult = await AuthService.login(user);
            if (loginResult) {
                const token = Vue.$cookies.get("token") as string;
                if (!token) {
                    commit("LOGINFAILRE");
                    return loginResult;
                }
                const user = jwt.decode(token);
                console.log(user);
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
