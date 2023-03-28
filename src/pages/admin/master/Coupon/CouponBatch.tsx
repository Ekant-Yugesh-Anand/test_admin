import React from "react";
import Box from "@mui/material/Box";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import CouponBatchList from "../../../../components/admin/master/Coupon/CouponBatchList";

export default function CouponBatch() {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const searchHandler = (value: string) => {
    setSearchText(value ? `/searchbatches?search_batch=${value}` : "");
  };


  return (
    <MainContainer>
      <CommonToolbar
        title="Coupon Batches"
        onSearch={searchHandler}
        onAddProps={{
          title: "Generate Coupon",
          onClick: onAdd,
        }}
      />
      <Box sx={{ mt: 2 }}>
        <CouponBatchList searchText={searchText} addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
