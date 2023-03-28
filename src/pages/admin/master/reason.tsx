import React from "react";
import Box from "@mui/material/Box";
import { MainContainer } from "../../../components/layout";
import CommonToolbar from "../../../components/admin/common-toolbar";
import ReasonList from "../../../components/admin/master/reason-list";

export default function Reason() {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const searchHandler = (value: string) =>
    setSearchText(value ? `/search?search_reason=${value}` : "");

  return (
    <MainContainer>
      <CommonToolbar
        title="Reason"
        onSearch={searchHandler}
        onAddProps={{
          title: "Add Reason",
          onClick: onAdd,
        }}
      />
      <Box sx={{ mt: 2 }}>
        <ReasonList searchText={searchText} addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
