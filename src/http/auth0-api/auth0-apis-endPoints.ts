import { auth0Api } from "./auth0-base";

export const baseFunc = (endURL: string) => {
  return (
    method: "get" | "post" | "patch" | "delete",
    options?: {
      data?: string;
      params?: string;
      postfix?: string;
    }
  ) => {
    const params = options?.params ? "/" + options.params : "";
    let url = `/${endURL}${params}${options?.postfix ? options.postfix : ""}`;
    return auth0Api.request({
      url,
      method,
      data: options?.data,
    });
  };
};

export const auth0Users = baseFunc("users");
