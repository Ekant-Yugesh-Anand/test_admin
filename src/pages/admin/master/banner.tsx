import React from "react";
import Box from "@mui/material/Box";
import CommonToolbar from "../../../components/admin/common-toolbar";
import BannerList from "../../../components/admin/master/banner-list";
import { MainContainer } from "../../../components/layout";

export default function Banner() {
  const [open, setOpen] = React.useState(false);

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <MainContainer>
      <CommonToolbar
        title="Banners"
        onAddProps={{
          onClick: onAdd,
          title: "Add Banner",
        }}
      />
      <Box sx={{ mt: 3 }}>
        <BannerList addOpen={open} addClose={onClose} />
      </Box>
    </MainContainer>
  );
}
