import React from "react";
import Box from "@mui/material/Box";
import { MainContainer } from "../../../components/layout";
import CommonToolbar from "../../../components/admin/common-toolbar";
import NotificationList from "../../../components/admin/master/notification-list";

export default function Notification() {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const searchHandler = (value: string) =>
    setSearchText(value ? `/search?search_notification=${value}` : "");

  return (
    <MainContainer>
      <CommonToolbar
        title="Notifications"
        onSearch={searchHandler}
        onAddProps={{
          title: "Add Notificaton",
          onClick: onAdd,
        }}
      />
      <Box sx={{ mt: 2 }}>
        <NotificationList searchText={searchText} addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
