import React from "react";
import { MainContainer } from "../../../components/layout";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import OrdersToolbar, {
  type DatesType,
} from "../../../components/admin/orders/orders-toolbar";
import { shopOrders } from "../../../http";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import AllOrdersListResults from "../../../components/admin/orders/all-orders-list-results";
import {
  addComma,
  addSno,
  addTaxNetAmount,
  dateTimeFormatTable,
  formatDate,
  formatVolume,
  formatWeight,
  getFragile,
  margeAsList,
  margeRowTable,
  orderStatusReadable,
  queryToStr,
  removeEsc,
} from "../../../components/admin/utils";
import { allOrdersFields, gstFields } from "../../../constants";
import useStateWithCallback from "../../../hooks/useStateWithCallback";

export default function AllOrders() {
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const gstRef = React.useRef<any>(null);
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

  const exportHandle = async (gst?: boolean) => {
    try {
      dispatch(setPageLoading(true));

      const getParams = () => {
        if (gst === true) {
          return {
            params: "invoicecsv"
          };
        }
        return { params: "allcsv" };
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
          "delivered_date",
          "delivered_time"
        );
        // for reshedule date
        csvData = dateTimeFormatTable(
          csvData,
          "reschedule_date",
          "reschedule_time"
        );
        csvData = dateTimeFormatTable(csvData, "accept_date", "accept_time");
        csvData = dateTimeFormatTable(csvData, "cancel_date", "cancel_time");

        // marge two column
        csvData = margeRowTable(
          csvData,
          ["retailer_company_name", "retailer_name"],
          "selected_retailer"
        );
        // order readable from
        csvData = orderStatusReadable(csvData);
        // marge list as a farmer shipping address
        csvData = margeAsList(
          csvData,
          [
            "shipping_village",
            "shipping_sub_district",
            "shipping_district",
            "shipping_state",
            "shipping_pincode",
          ],
          "farmer_shipping_address"
        );
        // marge list as a farmer billing address
        csvData = margeAsList(
          csvData,
          [
            "billing_village",
            "billing_sub_district",
            "billing_district",
            "billing_state",
            "billing_pincode",
          ],
          "farmer_billing_address"
        );
        // add tax and net amount
        csvData = addTaxNetAmount(csvData);

        // add ' before the string

        csvData = addComma(csvData);

        //get fragile
        csvData = getFragile(csvData);

        // convert date
        csvData = formatDate(csvData);
        // format weight
        csvData = formatWeight(csvData);
        // format volume
        csvData = formatVolume(csvData);

        // remove esc
        csvData = removeEsc(csvData);

        gst == true
          ? setCsvData(csvData, () => {
              gstRef.current.link.click();
              dispatch(setPageLoading(false));
            })
          : setCsvData(csvData, () => {
              ref.current.link.click();
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
        exportProps={{
          ref,
          data: csvData,
          headers: allOrdersFields,
          filename: `all-orders-csv`,
          onClick: exportHandle,
        }}
        gstProps={{
          ref: gstRef,
          data: csvData,
          headers: gstFields,
          filename: `Delivery Gst report`,
          onClick: () => exportHandle(true),
        }}
      >
        All Orders
      </OrdersToolbar>
      <Box sx={{ mt: 3 }}>
        <AllOrdersListResults searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
