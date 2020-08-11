export default function authHeader() {
  const userGetResult = localStorage.getItem("user");
  if (!userGetResult) return {};

  const user = JSON.parse(userGetResult);
  if (user && user.accessToken) {
    return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
}
