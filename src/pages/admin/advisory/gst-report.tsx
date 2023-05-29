import React, { useEffect } from "react";
import { MainContainer } from "../../../components/layout";
import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { type DatesType } from "../../../components/admin/orders/orders-toolbar";
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
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import CommonToolbar from "../../../components/admin/common-toolbar";
import { shopAdvisory } from "../../../http/server-api/server-apis";
import RowSearch from "../../../components/table/row-search";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { CSVLink } from "react-csv";
import { advisoryInvoiceField, gstFields } from "../../../constants";

export default function GSTReport() {
  const [searchText, setSearchText] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);

  const [dates, setDates] = React.useState<DatesType>({
    from: null,
    to: null,
  });
  const endMinDate = React.useMemo(
    () => (dates.from === null ? undefined : dates.from),
    [dates.from]
  );

  const ref = React.useRef<any>(null);
  const gstRef = React.useRef<any>(null);
  const igstRef = React.useRef<any>(null);
  const dispatch = useDispatch();

  const gstInvoiceHandler = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopOrders("get", {
        postfix: searchText ? `${searchText}` : ``,
        params: "invoicecsv",
      });
      if (res?.status === 200) {
        let csvData = (res.data.orders as Array<Record<string, any>>) || [];

        // indexing
        csvData = addSno(csvData);
        // for order date
        csvData = dateTimeFormatTable(csvData, "order_date", "order_time");
        // for delivery date
        csvData = dateTimeFormatTable(csvData, "accept_date", "accept_time");

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

  const packageInvoiceHandler = async () => {
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

  const handleChangeDate = (key: string) => (newValue: Dayjs | null) =>
    setDates({ ...dates, [key]: newValue });

  const onReset = () => {
    setSearchValue("");
    onSearch && onSearch("", { from: null, to: null });
    setDates({ from: null, to: null });
  };

  const onSearch = (value: string, dates: DatesType) => {
    if (dates.from && dates.to) {
      setSearchText(
        "?" +
          queryToStr({
            date_from: dates.from.format("YYYY-MM-DD"),
            date_to: dates.to.format("YYYY-MM-DD"),
            ...(value ? { search_orders: value, search: value } : {}),
          })
      );
    } else {
      setSearchText(value ? `?search_orders=${value}&search=${value}` : "");
    }
  };
  useEffect(() => {
    onSearch(searchValue, dates);
  }, [searchValue, dates]);

  return (
    <MainContainer>
      <CSVLink
        data={csvData}
        headers={gstFields("gst")}
        filename={`Delivery GST report`}
        target="_blank"
        ref={gstRef}
      />
      <CSVLink
        data={csvData}
        headers={gstFields("igst")}
        filename={`Delivery IGST report`}
        target="_blank"
        ref={igstRef}
      />
      <CSVLink
        data={csvData}
        headers={advisoryInvoiceField}
        filename={`Advisory-invoice-csv`}
        target="_blank"
        ref={ref}
      />

      <CommonToolbar title="GST Report" />
      <div className="flex justify-center items-center h-[80vh] ">
        <div className="bg-white rounded-lg p-20 w-[80%] ">
          <div className="card">
            <p className="py-5 font-bold text-2xl ">Download Report</p>
            <div className="grid md:grid-cols-2 gap-2">
              <RowSearch
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
              />
              <div className="flex justify-around gap-2">
                <DatePicker
                  label="Start Date"
                  inputFormat="DD/MM/YYYY"
                  value={dates.from}
                  onChange={handleChangeDate("from")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      color="secondary"
                      sx={{
                        "& .MuiInputBase-input:focus": {
                          boxShadow: "none",
                        },
                      }}
                      size="small"
                    />
                  )}
                />
                <DatePicker
                  label="End Date"
                  inputFormat="DD/MM/YYYY"
                  minDate={endMinDate}
                  value={dates.to}
                  onChange={handleChangeDate("to")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      color="secondary"
                      sx={{
                        "& .MuiInputBase-input:focus": {
                          boxShadow: "none",
                        },
                      }}
                      size="small"
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end gap-5 p-10">
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={packageInvoiceHandler}
              >
                Package Invoice
              </Button>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={gstInvoiceHandler}
              >
                Delivery Invoice
              </Button>
              <Button
                sx={{
                  borderColor: "neutral.200",
                  color: "neutral.600",
                  "&:hover": {
                    borderColor: "neutral.300",
                    color: "neutral.800",
                  },
                }}
                variant="outlined"
                size="small"
                onClick={onReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
