import React from "react";
import { MainContainer } from "../../../components/layout";
import { Box } from "@mui/material";
import AllOrderLogList from "../../../components/admin/log/all-order-log-list";
import CommonToolbar from "../../../components/admin/common-toolbar";
import { queryToStr } from "../../../components/admin/utils";
import { orderLabel } from "../../../components/admin/orders/status";

export default function AllOrderLog() {
  let componentRef = React.useRef<any>(null);
  const [searchText, setSearchText] = React.useState("");

  const searchHandler = (value: string, filter?: string | number) => {
    const getOrderStatus = () => {
      let result = orderLabel.filter((value) => value.id == filter);
      return result["0"]?.label;
    };

    setSearchText(
      "?" +
        queryToStr({
          ...(filter ? { order_status: getOrderStatus() } : {}),
          ...(value ? { search_log: value } : {}),
        })
    );
  };

  return (
    <>
      <MainContainer>
        <CommonToolbar
          onSearch={searchHandler}
          title="All Orders Log"
          filter={true}
        />
        <Box sx={{ mt: 3 }} ref={componentRef}>
          <AllOrderLogList searchText={searchText == "?" ? "": searchText} />
        </Box>
      </MainContainer>

      {/* <SpeedDialTooltipAction actions={actions} /> */}
    </>
  );
}
