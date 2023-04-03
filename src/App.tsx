import React from "react"
import AppRouter from "./routers/AppRouter";
import { useSelector, useDispatch, } from "react-redux";
import { RootState } from "./redux/store";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { CssBaseline } from "@mui/material";
import LoadingDialogBox from "./components/dialog-box/loading-dialog-box";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSearchParams } from "react-router-dom"
import { UpdateToken } from "./redux/slices/acessTokenSlice"
import jwt_decode from "jwt-decode";
import { shopRefreshToken } from "./http/server-api/server-apis";
import { setPageLoading } from "./redux/slices/admin-slice";

export default function App() {
  const dispatch = useDispatch()
  let [searchParams] = useSearchParams()

  const token = searchParams.get("token")
  const refreshToken = searchParams.get("refreshToken")

  const {
    adminSlice: { pageLoading }, acessTokenSlice: { auth }
  } = useSelector((state: RootState) => state);


  React.useEffect(() => {
    if (token) {
      let decoded: any = jwt_decode(token);
      dispatch(UpdateToken({ token: `Bearer ${token}`, refreshToken: `${refreshToken}`, expiry: decoded?.exp }))
    }
  }, [token, refreshToken])

  React.useEffect(() => {
    dispatch(setPageLoading(false))
  }, [])


 

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <div>
          <SnackbarProvider
            maxSnack={2}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <AppRouter />
          </SnackbarProvider>
          <LoadingDialogBox open={pageLoading} />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
