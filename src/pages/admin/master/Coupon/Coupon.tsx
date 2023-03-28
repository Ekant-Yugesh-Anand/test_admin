import React from "react";
import Box from "@mui/material/Box";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import CouponList from "../../../../components/admin/master/Coupon/CouponList";
import { useParams } from "react-router-dom";

export default function CouponBatch() {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const { batch_name } = useParams();

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const searchHandler = (value: string) => {
    setSearchText(value ? `/searchcoupons?search_coupon=${value}` : "");
  };

  return (
    <MainContainer>
      <CommonToolbar
        title={`Coupon - ${batch_name}`}
        onSearch={searchHandler}

      />
      <Box sx={{ mt: 2 }}>
        <CouponList searchText={searchText} addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
