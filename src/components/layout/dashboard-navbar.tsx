import { useState, useRef } from "react";
import styled from "@emotion/styled";
import { AppBar, Toolbar, IconButton, Avatar, Box, Button } from "@mui/material";
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"
import { shopRefreshToken } from "../../http/server-api/server-apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UpdateToken } from "../../redux/slices/acessTokenSlice";
import jwt_decode from "jwt-decode";
import React from "react";
import { CMSUrl } from "../../http/config";
// import AccountPopover from "./account-popover";

const DashboardNavbarRoot = styled(AppBar)`
  background: rgba(244, 247, 254, 0.2) center center / cover;
  filter: none;
  backdrop-filter: blur(20px);
  border-style: solid;
  border-color: #e6e8f0;
  border-width: 0px 0px thin;
`;

const MenuIcons = styled(AiOutlineMenuFold)`
  font-size: 1.25rem;
`;

const UserCircleIcon = styled(FaUserCircle)`
  font-size: 2.25rem;
`;

export default function DashboardNavbar(props: { onSidebarOpen: () => void }) {
  const { onSidebarOpen } = props;
  const settingsRef = useRef(null);
  const navigate = useNavigate()
  // const [openAccountPopover, setOpenAccountPopover] = useState(false);

  // const {
  //   acessTokenSlice: { auth, isAuthenticated }
  // } = useSelector((state: RootState) => state);
  // const dispatch = useDispatch()



  // React.useEffect(() => {
  //   let isMounted = true
  //   let intervalId = setInterval(async () => {
  //     if (auth.token && auth.expiry) {
  //       let expiryTime = parseInt(auth.expiry)
  //       let currentTime = new Date(Date.now()).getTime()
  //       if (currentTime > (expiryTime * 1000) - 20000) {
  //         try {
  //           console.log(expiryTime)
  //           const res: any = await shopRefreshToken("get", {
  //             postfix: `?refresh_token=${auth.refreshToken}`
  //           })
  //           if (res.data) {
  //             if (res.data.access_token) {
  //               let decoded: any = jwt_decode(res.data.access_token);
  //               console.log(res.data.acessToken, decoded)
  //               dispatch(UpdateToken({ token: `Bearer ${res.data.access_token}`, expiry: decoded?.exp, refreshToken: res.data.refresh_token }))
  //             }
  //           }
  //         } catch (err) {
  //           dispatch(UpdateToken({ token: "", expiry: "", refreshToken: "" }))
  //         }
  //       }
  //     }
  //   },
  //     10000);

  //   return () => {
  //     clearInterval(intervalId); 
  //     isMounted = false 
  //   }

  // }, [auth])

  // const updateToken = async () => {
  //   try {
  //     const res: any = await shopRefreshToken("get", {
  //       postfix: `?refresh_token=${auth.refreshToken}`
  //     })
  //     if (res.data) {
  //       if (res.data.access_token) {
  //         let decoded: any = jwt_decode(res.data.access_token);
  //         dispatch(UpdateToken({ token: `Bearer ${res.data.access_token}`, expiry: decoded?.exp, refreshToken: res.data.refresh_token }))
  //       } else {
  //         console.log("token could not verified")
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
          boxShadow: "none",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcons />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {/* <Avatar
            onClick={() => setOpenAccountPopover(true)}
            ref={settingsRef}
            sx={{
              cursor: "pointer",
              height: 40,
              width: 40,
              ml: 1,
            }}
            src="https://picsum.photos/200/300"
          >
            <UserCircleIcon />
          </Avatar> */}

          <Button color="secondary" onClick={() => window.open(CMSUrl, "_self")}>Back to CMS</Button>


        </Toolbar>
      </DashboardNavbarRoot>
      {/* <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      /> */}
    </>
  );
}

