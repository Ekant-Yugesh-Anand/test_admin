import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Container } from "@mui/material";
import { MainContainer } from "../../../../../components/layout";
import { retailer, shopOrders } from "../../../../../http";
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
  formatDate,
  formatVolume,
  formatWeight,
  getFragile,
  margeAsList,
  margeRowTable,
  queryToStr,
  removeEsc,
  setExtraValue,
} from "../../../../../components/admin/utils";
import { setPageLoading } from "../../../../../redux/slices/admin-slice";
import { ordersFields } from "../../../../../constants";
import { getStrOrderStatus } from "../../../../../constants/messages";

export default function RetailerOrders() {
  const { retailer_id } = useParams();
  const [orderStatus, setOrderStatus] = React.useState("21");
  const [searchText, setSearchText] = React.useState("");
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
            ...(value ? { search_orders: value } : {}),
          })
      );
    } else {
      setSearchText(value ? `?search_orders=${value}` : "");
    }
  };

  const exportHandler = async () => {
    try {
      dispatch(setPageLoading(true));
      const x = queryToStr(
        orderStatus != "21"
          ? {
              order_status: orderStatus,
              retailer_id,
            }
          : {
              retailer_id,
            }
      );
      const res = await shopOrders("get", {
        params: "retailercsv",
        postfix: searchText ? `${searchText}&${x}` : `?${x}`,
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

        csvData = dateTimeFormatTable(csvData, "accept_date", "accept_time");
        csvData = dateTimeFormatTable(csvData, "cancel_date", "cancel_time");
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

        // add ' before the string

        csvData = addComma(csvData);

        // convert date
        csvData = formatDate(csvData);

        // convert weight
        csvData = formatWeight(csvData);
        // convert fragile
        csvData = getFragile(csvData);

        // format volume
        csvData = formatVolume(csvData);
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
      <OrdersTab onSetOrderStatus={setOrderStatus} />
      <MainContainer>
        <Container>
          <OrdersToolbar
            onSearch={searchHandler}
            exportProps={{
              ref,
              data: csvData,
              headers: ordersFields(orderStatus),
              filename: `retailer-order-csv`,
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
              />
            </CardContent>
          </Card>
        </Container>
      </MainContainer>
    </>
  );
}
