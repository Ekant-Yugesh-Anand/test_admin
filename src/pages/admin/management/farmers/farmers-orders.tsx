import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import FarmersOrdersListResults from "../../../../components/admin/farmers/farmers-orders-list-results";
import { MainContainer } from "../../../../components/layout";
import {
  addSno,
  addTaxNetAmount,
  dateTimeFormatTable,
  formatVolume,
  formatWeight,
  getFragile,
  margeAsList,
  margeRowTable,
  orderStatusReadable,
  queryToStr,
  removeEsc,
} from "../../../../components/admin/utils";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { farmers, shopOrders } from "../../../../http";
import { allOrdersFields } from "../../../../constants";
import OrdersToolbar, {
  DatesType,
} from "../../../../components/admin/orders/orders-toolbar";
import { useQuery } from "@tanstack/react-query";

export default function FarmersOrders() {
  const { customer_id } = useParams();
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const { data } = useQuery(["farmer-name"], () =>
    farmers("get", { params: customer_id })
  );

  const customerName = React.useMemo(() => {
    if (data?.status) return data.data?.customer_name;
    return "";
  }, [data]);

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
      const res = await shopOrders("get", {
        postfix: searchText
          ? `${searchText}&customer_id=${customer_id}`
          : `?customer_id=${customer_id}`,
        params: "customercsv",
      });
      if (res?.status === 200) {
        let csvData = res.data.orders || [];
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
        // format weight
        csvData = formatWeight(csvData);
        // format volume
        csvData = formatVolume(csvData);
        // add tax and net amount
        csvData = addTaxNetAmount(csvData);
        //get fragile
        csvData = getFragile(csvData);

        // remove esc
        csvData = removeEsc(csvData);

        setCsvData(csvData, () => {
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
          filename: `farmers-orders-csv`,
          onClick: exportHandle,
        }}
      >
        {customerName} / Farmers Orders
      </OrdersToolbar>
      <Box sx={{ mt: 3 }}>
        <FarmersOrdersListResults
          customerId={customer_id as string}
          searchText={searchText}
        />
      </Box>
    </MainContainer>
  );
}
