import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { MainContainer } from "../../../components/layout";
import OrdersToolbar, {
  type DatesType,
} from "../../../components/admin/orders/orders-toolbar";
import { shopOrders } from "../../../http";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import {
  addSno,
  getTaxationValue,
  queryToStr,
  removeEsc,
} from "../../../components/admin/utils";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import TaxationListResult from "../../../components/admin/orders/taxation-list-results";
import { taxationFields } from "../../../constants/fields/taxation-fields";

export default function TaxationReportTable(props: {
  orderStatus: string;
  title: string;
  filename: string;
  params?: string;
  postfix?: string;
  exportVariant?: "retailer" | "partner";
}) {
  const { orderStatus, title, filename, params, postfix, exportVariant } =
    props;
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

  const dispatch = useDispatch();

  const exportHandler = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopOrders("get", {
        params:
          exportVariant === "retailer"
            ? "retailer"
            : undefined,
        postfix: searchText
          ? `${searchText}&order_status=${orderStatus}`
          : `?order_status=${orderStatus}${postfix ? `&${postfix}` : ""}`,
      });
      if (res?.status === 200) {
        let csvData = res.data.orders || [];
        // indexing
        csvData = addSno(csvData);
        // remove esc
        csvData = removeEsc(csvData);
        
        //get taxationField

        csvData = getTaxationValue(csvData)

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
          headers: taxationFields,
          filename,
          onClick: exportHandler,
        }}
      >
        {title}
      </OrdersToolbar>
      <Box sx={{ mt: 3 }}>
        <TaxationListResult
          searchText={searchText}
          orderStatus={orderStatus}
          params={params}
          postfix={postfix}
          moveCellShow={orderStatus === "5"}
        />
      </Box>
    </MainContainer>
  );
}
