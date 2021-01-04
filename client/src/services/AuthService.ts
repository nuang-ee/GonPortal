/* Helper methods of axios module's HTTP request & responses */
/* Actual calls to the REST API server is done by the functions in this file */

import axios from "axios";
import User from "../models/user";
import { BACKEND_URI } from "../config";
import Cookies from "js-cookie";

const API_URL =
    `${BACKEND_URI}/recruit/users/auth` ||
    "http://localhost:18081/recruit/users/auth";

class AuthService {
    async login(user: User) {
        const response = await axios.post(
            `${API_URL}/login`,
            {
                username: user.username,
                password: user.password,
            },
            { withCredentials: true }
        );

        return response.data;
    }

    logout() {
        // request invalidation of cookie to server side.
    }

    async register(user: User) {
        const response = await axios.post(`${API_URL}/register`, {
            username: user.username,
            email: user.email,
            password: user.password,
            sNum: user.sNum,
            name: user.name,
            phoneNum: user.phoneNum,
        });
        return response.data;
    }
}

export default new AuthService();
