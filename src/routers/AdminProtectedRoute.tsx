// import React from "react";
// import { useLocation, Navigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../redux/store";
// import { UpdateToken } from "../redux/slices/acessTokenSlice";
// // import { RootState } from "../redux/store";
// // import { setAuth } from "../redux/slices/authSlice";

// export default function AdminProtectedRoute({
//   children,
// }: {
//   children: JSX.Element;
// }) {
//   const location = useLocation();
//   const [isAuthenticated, setIsAuthenticated] = React.useState(true)
//   const {
//     acessTokenSlice: { auth }
//   } = useSelector((state: RootState) => state);
//   const dispatch = useDispatch()


//   // const { user, isAuth } = useSelector((state: RootState) => state.authSlice);
//   // const dispatch = useDispatch();


//   // React.useEffect(() => {
//   //   if (values) {
//   //     const { username } = JSON.parse(values);
//   //     dispatch(
//   //       setAuth({
//   //         id: "4545",
//   //         email: "",
//   //         username: username,
//   //         permissions: {
//   //           isAdmin: true,
//   //           isActive: true,
//   //         },
//   //       })
//   //     );
//   //   }
//   // }, []);
//   React.useEffect(() => {
//     setInterval(() => {
//       if (auth.expiry) {
//         let expiryTime = parseInt(auth.expiry)
//         let currentTime = new Date(Date.now()).getTime()
//         if (currentTime > expiryTime * 1000) {
//           dispatch(UpdateToken({ token: ``, expiry: "" }))
//           setIsAuthenticated(false)
//         }
//       }
//     },
//       5000);

//   }, [auth])

//   return (
//     <>
//       {/* {isAuth && user?.permissions.isActive && user?.permissions.isAdmin ? ( */}
//       {isAuthenticated ? (
//         children
//       ) : (
//         <Navigate to="/auth/error" state={{ from: location }} replace />
//         // <Navigate to="/auth/login" state={{ from: location }} replace />
//       )}
//     </>
//   );
// }

import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { UpdateToken } from "../redux/slices/acessTokenSlice";
import { shopRefreshToken } from "../http/server-api/server-apis";
import jwt_decode from "jwt-decode";
export default function AdminProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const location = useLocation();
  const {
    acessTokenSlice: { auth, isAuthenticated }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch()

  React.useEffect(() => {
    let isMounted = true
    let intervalId = setInterval(async () => {
      if (auth.token && auth.expiry) {
        let expiryTime = parseInt(auth.expiry)
        let currentTime = new Date(Date.now()).getTime()
        if (currentTime > (expiryTime * 1000) - 20000) {
          try {
            const res: any = await shopRefreshToken("get", {
              postfix: `?refresh_token=${auth.refreshToken}`
            })
            if (res.data) {
              if (res.data.access_token) {
                let decoded: any = jwt_decode(res.data.access_token);
                dispatch(UpdateToken({ token: `Bearer ${res.data.access_token}`, expiry: decoded?.exp, refreshToken: res.data.refresh_token }))
              }
            }
          } catch (err) {
            dispatch(UpdateToken({ token: "", expiry: "", refreshToken: "" }))
          }
        }
      }
    },
      5000);

    return () => {
      clearInterval(intervalId); 
      isMounted = false 
    }

  }, [auth])


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

