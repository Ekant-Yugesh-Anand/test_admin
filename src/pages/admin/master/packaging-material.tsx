import Box from "@mui/material/Box";
import React from "react";
import CommonToolbar from "../../../components/admin/common-toolbar";
import PackagingMaterialList from "../../../components/admin/master/packaging-material-list";
import { MainContainer } from "../../../components/layout";

export default function PackageingMaterial() {
  const [open, setOpen] = React.useState(false);
  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);
  return (
    <MainContainer>
      <CommonToolbar
        title="Packaging Material"
        onAddProps={{ title: "Add Packaging Material", onClick: onAdd }}
      
      />
      <Box sx={{ mt: 3 }}>
        <PackagingMaterialList searchText="" addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
