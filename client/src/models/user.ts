// model "User" used for localstorage.
export default class User {
  username: string;
  email: string;
  password: string;
  sNum: string;
  name: string;
  phoneNum: string;
  semester: string;
  
  constructor(
    username: string,
    email: string,
    password: string,
    sNum: string,
    name: string,
    phoneNum: string,
    semester: string
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.sNum = sNum;
    this.name = name;
    this.phoneNum = phoneNum;
    this.semester = semester;
  }
}
