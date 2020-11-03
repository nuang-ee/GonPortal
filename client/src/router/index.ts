import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import LoginForm from "../components/LoginForm.vue";
import Register from "../views/Register.vue";
import { RouterLinkStub } from "@vue/test-utils";

Vue.use(VueRouter);

const requireAuth = (to: Route, from: Route, next: any) => {
    const isAuthenticated = false;
    if (isAuthenticated) return next();
    next("/login?returnPath=".concat("", to.path));
};

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue"),
    },
    {
        path: "/login",
        name: "Login",
        component: LoginForm,
    },
    {
        path: "/logout",
        name: "Logout",
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Home,
        beforeEnter: requireAuth,
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});

export default router;
