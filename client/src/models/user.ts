// model "User" used for localstorage.
export default class User {
    username: string;
    email: string;
    password: string;
    sNum: string;
    name: string;
    phoneNum: string;
    semester: string;

    constructor(obj?: User) {
        this.username = obj?.username || "";
        this.email = obj?.email || "";
        this.password = obj?.password || "";
        this.sNum = obj?.sNum || "";
        this.name = obj?.name || "";
        this.phoneNum = obj?.phoneNum || "";
        this.semester = obj?.semester || "";
    }
}
