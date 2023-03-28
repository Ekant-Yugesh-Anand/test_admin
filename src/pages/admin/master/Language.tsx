import Box from "@mui/material/Box";
import React from "react";
import CommonToolbar from "../../../components/admin/common-toolbar";
import LanguageList from "../../../components/admin/master/LanguageList";
import { MainContainer } from "../../../components/layout";

export default function Languages() {
  const [open, setOpen] = React.useState(false);

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <MainContainer>
      <CommonToolbar
        title="Languages"
        onAddProps={{ title: "Add Language", onClick: onAdd }}
      />
      <Box sx={{ mt: 3 }}>
        <LanguageList searchText="" addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
