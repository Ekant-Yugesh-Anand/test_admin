import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { FaLock } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";

const PasswordLock = styled(FaLock)`
  font-size: 1.25rem;
`;

const Logout = styled(FiLogOut)`
  font-size: 1.25rem;
`;

export default function AccountPopover(props: {
  anchorEl: any;
  onClose: () => void;
  open: boolean;
}) {
  const { anchorEl, onClose, open } = props;
  const dispatch = useDispatch();

  const onLogout = () => {
    localStorage.removeItem("user-detail");
    dispatch(
      setAuth({
        id: "",
        email: "",
        username: "",
        permissions: {
          isAdmin: false,
          isActive: false,
        },
      })
    );
  };
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: "200px" },
      }}
    >
      <Box
        sx={{
          py: 1,
          px: 2,
        }}
      >
        <Typography variant="overline" fontSize={"small"}>
          Account
        </Typography>
        <Typography color="text.secondary" variant="body2" fontSize={"small"}>
          John Doe
        </Typography>
      </Box>
      <MenuList
        disablePadding
        sx={{
          "& > *": {
            "&:first-of-type": {
              borderTopColor: "divider",
              borderTopStyle: "solid",
              borderTopWidth: "1px",
            },
            padding: "12px 16px",
          },
        }}
      >
        <MenuItem onClick={() => console.log("singout")}>
          <ListItemIcon>
            <PasswordLock />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => console.log("singout")}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText onClick={onLogout}>logout</ListItemText>
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
