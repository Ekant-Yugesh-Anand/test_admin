import React from "react";
import { Box } from "@mui/material";
import OrdersTab from "../../../components/admin/orders/orders-dashboard/orders-tab";
import OrdersToolbar, {
  DatesType,
} from "../../../components/admin/orders/orders-toolbar";
import { MainContainer } from "../../../components/layout";
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
  orderStatusReadable,
  queryToStr,
  removeEsc,
  setExtraValue,
} from "../../../components/admin/utils";
import OrdersListResults from "../../../components/admin/orders/orders-list-results";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import { useDispatch } from "react-redux";
import { ordersFields } from "../../../constants";
import { shopOrdersReturn } from "../../../http/server-api/server-apis";

export default function Return() {
  const [orderStatus, setOrderStatus] = React.useState("1");
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
            ...(value ? { search: value } : {}),
          })
      );
    } else {
      setSearchText(value ? `?search=${value}` : "");
    }
  };

  const labelLists = React.useMemo(
    () => [
      {
        label: "new orders",
        order_status: "1",
      },
      {
        label: "accepted orders",
        order_status: "2",
      },
      {
        label: "waiting orders",
        order_status: "4",
      },
      {
        label: " in process orders",
        order_status: "5",
      },

      {
        label: "out for picked up orders",
        order_status: "7",
      },
      {
        label: "resheduled orders",
        order_status: "8",
      },
      {
        label: "picked up form (farmer)",
        order_status: "9",
      },
      {
        label: "returned ",
        order_status: "11",
      },
      {
        label: "cancelled orders",
        order_status: "3,6",
      },
      // {
      //   label: "refunded ",
      //   order_status: "12",
      // },
      // {
      //   label: "restored orders",
      //   order_status: "13,14",
      // },
    ],
    []
  );

  const dispatch = useDispatch();

  const exportHandler = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopOrdersReturn("get", {
        params: "agent/csv",
        postfix: searchText
          ? `${searchText}&return_order_status=${orderStatus}`
          : `?return_order_status=${orderStatus}`,
      });
      if (res?.status === 200) {
        let csvData = res.data || [];
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
        // order readable from

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

        //get fragile
        csvData = getFragile(csvData);

        // format weight
        csvData = formatWeight(csvData);
        // format volume
        csvData = formatVolume(csvData);
        // // set Order Status
        // csvData = setExtraValue(
        //   csvData,
        //   "order_status",
        //   getStrOrderStatus(orderStatus)
        // );

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
        <Box sx={{ mt: 10 }}>
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
              variant="return"
              moveCellShow
            />
          </Box>
        </Box>
      </MainContainer>
    </>
  );
}
