import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import CommonToolbar from "../../../../../components/admin/common-toolbar";
import RetailerPackagingMaterialList from "../../../../../components/admin/retailers/packaging-material-list-result";
import { MainContainer } from "../../../../../components/layout";
import { retailer } from "../../../../../http";


export default function RetailerPackageingMaterial() {
  const { retailer_id } = useParams();
  const [open, setOpen] = React.useState(false);
  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);
  const { data } = useQuery(["retailer-name", retailer_id], () =>
  retailer("get", { params: retailer_id })
);

const retailerName = React.useMemo(() => {
  if (data?.status) return data.data?.retailer_name;
  return "";
}, [data]);
  return (
    <MainContainer>
      <CommonToolbar
        title={`${retailerName || ""}/Packaging Material`}
        onAddProps={{ title: "Add Packaging Material", onClick: onAdd }}
      
      />
      <Box sx={{ mt: 3 }}>
        <RetailerPackagingMaterialList searchText="" addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
