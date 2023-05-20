import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Card, CardContent, Container } from "@mui/material";
import { MainContainer } from "../../../../../components/layout";
import { retailer, shopOrders, shopOrdersReturn } from "../../../../../http";
import OrdersTab from "../../../../../components/admin/orders/orders-dashboard/orders-tab";
import RetailerOrdersListResults from "../../../../../components/admin/retailers/retailer-orders-list-results";
import OrdersToolbar, {
  DatesType,
} from "../../../../../components/admin/orders/orders-toolbar";
import useStateWithCallback from "../../../../../hooks/useStateWithCallback";
import {
  addComma,
  addSno,
  addTaxNetAmount,
  dateTimeFormatTable,
  formatVolume,
  formatWeight,
  getFragile,
  margeAsList,
  margeRowTable,
  queryToStr,
  removeEsc,
  setOrderStatusValue,
} from "../../../../../components/admin/utils";
import { setPageLoading } from "../../../../../redux/slices/admin-slice";
import { ordersFields } from "../../../../../constants";

export default function RetailerOrders() {
  const { retailer_id } = useParams();
  const [orderStatus, setOrderStatus] = React.useState("21");
  const [searchText, setSearchText] = React.useState("");
  const [returnOrder, setReturnOrder] = React.useState(false);

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);

  const dispatch = useDispatch();

  const { data } = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );

  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name;
    return "";
  }, [data]);

  const searchHandler = (value: string, dates: DatesType) => {
    if (dates.from && dates.to) {
      setSearchText(
        "?" +
          queryToStr({
            date_from: dates.from.format("YYYY-MM-DD"),
            date_to: dates.to.format("YYYY-MM-DD"),
            ...(value
              ? returnOrder
                ? { search: value }
                : { search_orders: value }
              : {}),
          })
      );
    } else {
      setSearchText(
        value
          ? returnOrder
            ? `?search=${value}`
            : `?search_orders=${value}`
          : ""
      );
    }
  };

  const exportHandler = async () => {
    try {
      dispatch(setPageLoading(true));
      const x = queryToStr(
        orderStatus == "21"
          ? {
              retailer_id,
            }
          : returnOrder
          ? {
              return_order_status: orderStatus,
              retailer_id,
            }
          : {
              order_status: orderStatus,
              retailer_id,
            }
      );

      const res = returnOrder
        ? await shopOrdersReturn("get", {
            params: "retailer/csv",
            postfix: searchText ? `${searchText}&${x}` : `?${x}`,
          })
        : await shopOrders("get", {
            params: "retailercsv",
            postfix: searchText ? `${searchText}&${x}` : `?${x}`,
          });
      if (res?.status === 200) {
        let csvData = returnOrder ? res.data || [] : res.data.orders || [];
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
        csvData = dateTimeFormatTable(csvData, "return_date", "return_time");

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
            "shipping_subdistrict",
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
            "billing_subdistrict",
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

        // convert weight
        csvData = formatWeight(csvData);
        // convert fragile
        csvData = getFragile(csvData);

        // format volume
        csvData = formatVolume(csvData);
        // set Order Status

        csvData = setOrderStatusValue(csvData, "order_status", orderStatus);

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
        onSetReturn={setReturnOrder}
      />
      <MainContainer>
        <Box mt={10}>
          <OrdersToolbar
            onSearch={searchHandler}
            exportProps={{
              ref,
              data: csvData,
              headers: ordersFields(orderStatus),
              filename: returnOrder
                ? `return-retailer-order-csv`
                : `retailer-order-csv`,
              onClick: exportHandler,
            }}
          >
            {retailerName} / Retailer Orders
          </OrdersToolbar>
          <Card sx={{ mt: 1 }}>
            <CardContent sx={{ minHeight: 180 }}>
              <RetailerOrdersListResults
                searchText={searchText}
                orderStatus={orderStatus != "21" ? orderStatus : undefined}
                retailerId={retailer_id as string}
                returnOrder={returnOrder}
              />
            </CardContent>
          </Card>
        </Box>
      </MainContainer>
    </>
  );
}
