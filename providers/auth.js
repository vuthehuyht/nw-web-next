import request from "lib/request";

export const login = async (payload) =>
  (
    await fetch(`${process.env.DOMAIN_NAME}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ ...payload }),
    })
  ).json();

export const handleLogin = (payload) =>
  request("/login", { ...payload })
    .then((data) => data)
    .catch((err) => ({ err, status: "error" }));
