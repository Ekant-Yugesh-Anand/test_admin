import React from "react";
import { useMediaQuery, Divider, Drawer, Box, List } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import NavItem from "./nav-item";
import Logo from "./logo";
import sideBarMainList from "./sidebar-list";

export default function DashboardSidebar(props: {
  open: boolean;
  onClose: () => void;
}) {
  const { open, onClose } = props;
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  const location = useLocation();

  React.useEffect(() => {
    if (open) {
      onClose?.();
    }
  }, [location.pathname]);

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 1 }}>
            <Link to="/dashboard">
              <Logo />
            </Link>
          </Box>
        </div>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ flexGrow: 1 }} component="nav">
          {sideBarMainList.map((item, index) =>
            item.child ? (
              <NavItem
                key={index.toString()}
                icon={item.icon}
                href={item.href}
                title={item.title}
              >
                <List disablePadding>
                  {item.child.map((itemTwo, index) => (
                    <NavItem
                      key={index.toString()}
                      icon={itemTwo.icon}
                      href={itemTwo.href}
                      title={itemTwo.title}
                    />
                  ))}
                </List>
              </NavItem>
            ) : (
              <NavItem
                key={index.toString()}
                icon={item.icon}
                href={item.href}
                title={item.title}
              />
            )
          )}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
}
