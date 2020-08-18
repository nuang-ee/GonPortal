/* Helper methods of axios module's HTTP request & responses */

import axios from "axios";
import User from "../models/user";

const API_URL = "http://localhost:18081/users/auth";

class AuthService {
  async login(user: User) {
    const response = await axios.post(`${API_URL}/login`, {
        username: user.username,
        password: user.password
    });
    if (response.data.accessToken) localStorage.setItem("user", JSON.stringify(response.data));
    
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user: User) {
    return axios.post(`${API_URL}/register`, {
      uid: user.username,
      email: user.email,
      password: user.password,
      sNum: user.sNum,
      name: user.name,
      phoneNum: user.phoneNum
    });
  }
}

export default new AuthService();
