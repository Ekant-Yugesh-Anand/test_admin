import React from "react";
import { MainContainer } from "../../../components/layout";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import OrdersToolbar, {
  type DatesType,
} from "../../../components/admin/orders/orders-toolbar";
import { shopOrders } from "../../../http";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import {
  addComma,
  addSno,
  addTaxNetAmount,
  dateTimeFormatTable,
  manipulateGst,
  queryToStr,
  removeEsc,
} from "../../../components/admin/utils";
import {  gstFields } from "../../../constants";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import DeliveryGSTReportListResult from "../../../components/admin/advisory/DeliveryGstReportListResult";

export default function DeliveryGSTReport() {
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const gstRef = React.useRef<any>(null);
  const igstRef = React.useRef<any>(null);
  const dispatch = useDispatch();

  const searchHandler = (value: string, dates: DatesType) => {
    if (dates.from && dates.to) {
      setSearchText(
        "?" +
          queryToStr({
            date_from: dates.from.format("YYYY-MM-DD"),
            date_to: dates.to.format("YYYY-MM-DD"),
            ...(value ? { search_orders: value } : {}),
          })
      );
    } else {
      setSearchText(value ? `?search_orders=${value}` : "");
    }
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const getParams = () => {
        return {
          params: "invoicecsv",
        };
      };
      const res = await shopOrders("get", {
        postfix: searchText ? `${searchText}` : ``,
        ...getParams(),
      });
      if (res?.status === 200) {
        let csvData = (res.data.orders as Array<Record<string, any>>) || [];

        // indexing
        csvData = addSno(csvData);
        // for order date
        csvData = dateTimeFormatTable(csvData, "order_date", "order_time");
        // for delivery date
        csvData = dateTimeFormatTable(
          csvData,
          "accept_date",
          "accept_time"
        );

        // add tax and net amount
        csvData = addTaxNetAmount(csvData);

        // add ' before the string
        csvData = addComma(csvData);

        // remove esc
        csvData = removeEsc(csvData);

        csvData = manipulateGst(csvData);

        setCsvData(csvData, () => {
          gstRef.current.link.click();
          igstRef.current.link.click();
          dispatch(setPageLoading(false));
        });
      }
    } catch (error) {
      console.log(error);
      dispatch(setPageLoading(false));
    }
  };

  return (
    <MainContainer>
      <OrdersToolbar
        onSearch={searchHandler}
        gstProps={{
          ref: gstRef,
          igstRef: igstRef,
          data: csvData,
          headers: gstFields("gst"),
          iHeaders: gstFields("igst"),
          filename: `Delivery GST report`,
          iFilename: `Delivery IGST report`,
          onClick: () => exportHandle(),
        }}
      >
        Delivery GST Report
      </OrdersToolbar>
      <Box sx={{ mt: 3 }}>
        <DeliveryGSTReportListResult searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
