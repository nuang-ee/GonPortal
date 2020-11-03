/* Helper methods of axios module's HTTP request & responses */
/* Actual calls to the REST API server is done by the functions in this file */

import axios from "axios";
import User from "../models/user";
import { BACKEND_URI } from "../config";

const API_URL = `${BACKEND_URI}/recruit/users/auth` ||
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
        document.cookie =
            "token" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie =
            "refreshToken" +
            "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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
        console.log(response);
        return response.data;
    }
}

export default new AuthService();
