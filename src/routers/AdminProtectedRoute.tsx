import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { UpdateMsgToken, UpdateToken } from "../redux/slices/acessTokenSlice";
import { shopAdmin, shopRefreshToken } from "../http/server-api/server-apis";
import jwt_decode from "jwt-decode";
export default function AdminProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const location = useLocation();
  const {
    acessTokenSlice: { auth, msg, isAuthenticated },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const getSmsToken = React.useCallback(async () => {
    try {
      const res = await shopAdmin("get");
      if (res?.status == 200) {
        let decoded: any = jwt_decode(res.data.access_token);
        dispatch(
          UpdateMsgToken({
            token: `Bearer ` + res.data.access_token,
            refreshToken: res.data.refresh_token,
            expiry: decoded?.exp,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [msg]);

  React.useEffect(() => {
    let isMounted = true;
    let intervalId = setInterval(async () => {
      if (auth.token && auth.expiry) {
        let expiryTime = parseInt(auth.expiry);
        let currentTime = new Date(Date.now()).getTime();
        if (currentTime > expiryTime * 1000 - 20000) {
          try {
            const res: any = await shopRefreshToken("get", {
              postfix: `?refresh_token=${auth.refreshToken}`,
            });
            if (res.data) {
              if (res.data.access_token) {
                let decoded: any = jwt_decode(res.data.access_token);
                dispatch(
                  UpdateToken({
                    token: `Bearer ${res.data.access_token}`,
                    expiry: decoded?.exp,
                    refreshToken: res.data.refresh_token,
                  })
                );
              }
            }
          } catch (err) {
            dispatch(UpdateToken({ token: "", expiry: "", refreshToken: "" }));
          }
        }
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      isMounted = false;
    };
  }, [auth]);

  React.useEffect(() => {
    if (auth.token) {
      getSmsToken();
    }
  }, [auth]);

  return (
    <>
      {isAuthenticated ? (
        children
      ) : (
        <Navigate to="/auth/error" state={{ from: location }} replace />
      )}
    </>
  );
}
