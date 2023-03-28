import React from "react";
import { Box } from "@mui/material";
import OrdersTab from "../../../components/admin/orders/orders-dashboard/orders-tab";
import OrdersToolbar, {
  DatesType,
} from "../../../components/admin/orders/orders-toolbar";
import { MainContainer } from "../../../components/layout";
import {
  addSno,
  addTaxNetAmount,
  dateTimeFormatTable,
  margeAsList,
  margeRowTable,
  queryToStr,
  removeEsc,
  setExtraValue,
} from "../../../components/admin/utils";
import OrdersListResults from "../../../components/admin/orders/orders-list-results";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import { useDispatch } from "react-redux";
import { shopOrders } from "../../../http";
import { getStrOrderStatus } from "../../../constants/messages";
import { ordersFields } from "../../../constants";

export default function Return() {
  const [orderStatus, setOrderStatus] = React.useState("6");
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);

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

  const labelLists = React.useMemo(
    () => [
      {
        label: "new orders",
        order_status: "6",
      },
      {
        label: "accepted orders",
        order_status: "8",
      },
      {
        label: "in process",
        order_status: "12",
      },
      {
        label: "pickup",
        order_status: "14",
      },
      {
        label: "out for pickup",
        order_status: "16",
      },
      {
        label: "returning",
        order_status: "17",
      },
      {
        label: "returned",
        order_status: "18",
      },
      {
        label: "cancel",
        order_status: "11,13,15",
      },
    ],
    []
  );

  const dispatch = useDispatch();

  const exportHandler = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopOrders("get", {
        params: "csv",
        postfix: searchText
          ? `${searchText}&order_status=${orderStatus}`
          : `?order_status=${orderStatus}`,
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
        // set Order Status
        csvData = setExtraValue(
          csvData,
          "order_status",
          getStrOrderStatus(orderStatus)
        );

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
    <>
      <OrdersTab
        onSetOrderStatus={setOrderStatus}
        labelStatusList={labelLists}
      />
      <MainContainer>
        <OrdersToolbar
          onSearch={searchHandler}
          exportProps={{
            ref,
            data: csvData,
            headers: ordersFields(orderStatus),
            filename: `return-orders-csv`,
            onClick: exportHandler,
          }}
        >
          Return Orders
        </OrdersToolbar>
        <Box sx={{ mt: 3 }}>
          <OrdersListResults
            searchText={searchText}
            orderStatus={orderStatus}
            moveVariant="return"
            moveCellShow
          />
        </Box>
      </MainContainer>
    </>
  );
}
