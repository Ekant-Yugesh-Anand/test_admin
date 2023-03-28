import axios from "axios";
import { auth0BaseUrl, auth0Config } from "../config";
import jwtDecode from "jwt-decode";
import dayJS from "dayjs";

export const authToken = () => {
  if (typeof window !== "undefined") {
    const tokenDetail = localStorage.getItem("token_detail");
    if (tokenDetail) {
      const tokenDetailJSON = JSON.parse(tokenDetail);
      return tokenDetailJSON;
    }
  }
  return null;
};

export const auth0Api = axios.create({
  baseURL: auth0BaseUrl.concat("api/v2/"),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const getAuth0AdminToken = () => {
  // make option for Admin JWT
  const options = {
    method: "POST",
    url: auth0BaseUrl.concat("oauth/token"),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: auth0Config,
  };
  // call request method
  return axios.request(options);
};

// get token on expired
auth0Api.interceptors.request.use(async (req) => {
  const token = authToken();

  const tokenRequest = async () => {
    const res = await getAuth0AdminToken();
    localStorage.setItem("token_detail", JSON.stringify(res.data));
    req.headers!.Authorization = `${res.data.token_type} ${res.data.access_token}`;
    return req;
  };

  if (token) {
    req.headers!.Authorization = `${token?.token_type} ${token?.access_token}`;
    const user = jwtDecode(token.access_token) as { [key: string]: any };
    const isExpired = dayJS.unix(user.exp).diff(dayJS()) < 1;
    if (!isExpired) return req;

    return await tokenRequest();
  }

  return await tokenRequest();
});
