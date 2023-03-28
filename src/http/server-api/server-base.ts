import axios from "axios";
import { baseUrl, imgJwt } from "../config";
import { store } from "../../redux/store"

const getAccessToken = () => {
  return store.getState().acessTokenSlice.auth.token
}

export const api = axios.create({
  baseURL: baseUrl,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const api2 = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: getAccessToken(),
    // token: `Bearer ${imgJwt}`,
  },
});

export type HttpMethod = "get" | "post" | "put" | "delete";
export type HttpOption = {
  data?: string | FormData;
  params?: string;
  postfix?: string;
};

export const baseFunc = (endURL: string) => {
  return (method: HttpMethod, options?: HttpOption) => {
    const params = options?.params ? "/" + options.params : "";
    let url = `/${endURL}${params}`;
    if (options?.postfix) {
      url += options.postfix;
    }
    const header = {
      "Content-Type":
        options?.data instanceof FormData
          ? "multipart/form-data"
          : "application/json",
      Authorization: getAccessToken()
    };
    if (method.toLowerCase() === "get") {
      return api.get(url, {
        headers: {
          Authorization: getAccessToken()
        }
      });
    } else if (method.toLowerCase() === "post") {
      return api.post(url, options?.data, { headers: header });
    } else if (method.toLowerCase() === "put") {
      return api.put(url, options?.data, { headers: header });
    } else if (method.toLowerCase() === "delete") {
      if (options?.data)
        return api.delete(url, {
          headers: header,
          data: options?.data,
        });
      else
        return api.delete(url, {
          headers: header,
          data: JSON.stringify({ deleted: 1 }),
        });
    }
  };
};
