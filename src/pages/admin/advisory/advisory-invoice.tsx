import React from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { MainContainer } from "../../../components/layout";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import {
  addComma,
  addSno,
  dateTimeFormatTable,
  getFragile,
  margeAsList,
  queryToStr,
  removeEsc,
} from "../../../components/admin/utils";
import { advisoryInvoiceField } from "../../../constants";
import OrdersToolbar, { DatesType } from "../../../components/admin/orders/orders-toolbar";
import AdvisoryInvoiceListResult from "../../../components/admin/advisory/AdvisoryInvoiceListResult";
import { shopAdvisory } from "../../../http/server-api/server-apis";

export default function AdvisoryInvoice() {
  const [searchText, setSearchText] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);


  const dispatch = useDispatch();

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onSortClose = () => setSortOpen(false);

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

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));

      const res = await shopAdvisory("get", {
        postfix: searchText ? `${searchText}` : ``,
      });
      if (res?.status === 200) {
        let csvData = (res.data as Array<Record<string, any>>) || [];

        // indexing
        csvData = addSno(csvData);
        // for order date
        csvData = dateTimeFormatTable(csvData, "order_date", "order_time");
        // for order date
        csvData = dateTimeFormatTable(csvData, "payment_date", "payment_time");
        // for delivery date
        csvData = dateTimeFormatTable(
          csvData,
          "delivered_date",
          "delivered_time"
        );
      
        // add ' before the string
        csvData = addComma(csvData);

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
        onAddProps={{
          title: "Add",
          onClick: onAdd,
        }}
        exportProps={{
          ref,
          data: csvData,
          filename: `Advisory-invoice-csv`,
          onClick: exportHandle,
          headers: advisoryInvoiceField,
        }}
      >
        Advisory Invoice
      </OrdersToolbar>
      <Box sx={{ mt: 3 }}>
        <AdvisoryInvoiceListResult
          searchText={searchText}
          addOpen={open}
          addClose={onClose}
          sortOpen={sortOpen}
          onSortClose={onSortClose}
        />
      </Box>
    </MainContainer>
  );
}
