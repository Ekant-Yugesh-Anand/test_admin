import React from "react";
import { Box, Typography } from "@mui/material";
import { shopOrders } from "../../../http";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";

export default function DeliveryGSTReportListResult(props: {
  searchText: string;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const { searchText } = props;

  const postfix = React.useMemo(() => {
    return searchText
      ? `${searchText}&page=${page}&size=${size}&order_status=5`
      : `?page=${page}&size=${size}&order_status=5`;
  }, [searchText, page, size]);

  const { isLoading, data, refetch } = useQuery(["delivered-order", postfix], () =>
    shopOrders("get", {
      postfix,
    })
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => (
          <SerialNumber cell={cell} page={page} size={size} />
        ),
        width: "5%",
      },
      {
        Header: "Order ID",
        accessor: "main_order_no",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Suborder No",
        accessor: "suborder_no",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Supplier GSTIN",
        accessor: "supplier_gstin",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            29AAACC3269J1ZG
          </Typography>
        ),
      },
      {
        Header: "Customer GSTIN",
        accessor: "customer_gstin",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            Not Registered
          </Typography>
        ),
      },
      {
        Header: "Document Number",
        accessor: "invoice_no",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {cell.value}
            </Typography>
          </>
        ),
      },

      {
        Header: "Document Date",
        accessor: "accept_date",
        width: "10%",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {cell.value ? dayjs(cell.value).format("DD-MMM-YYYY") : ""}
            </Typography>
          </>
        ),
      },
   
      {
        Header: "Customer Name",
        accessor: "customer_name",
        Cell: (cell: any) => (
            <>
              <Typography textAlign={"center"} fontSize={"small"}>
                {cell.value}
              </Typography>
            </>
          ),
      },
      {
        Header: "Customer Code",
        accessor: "customer_code",
        Cell: (cell: any) => (
            <>
              <Typography textAlign={"center"} fontSize={"small"}>
                {cell.value}
              </Typography>
            </>
          ),
      },
      {
        Header: "Bill to state",
        accessor: "billing_state",
        Cell: (cell: any) => (
            <>
              <Typography textAlign={"center"} fontSize={"small"}>
                {cell.value}
              </Typography>
            </>
          ),
      },
      {
        Header: "Shipping to state",
        accessor: "ship_to_state",
        Cell: (cell: any) => (
            <>
              <Typography textAlign={"center"} fontSize={"small"}>
                {cell.value}
              </Typography>
            </>
          ),
      },
      {
        Header: "POS",
        accessor: "shipping_state",
        Cell: (cell: any) => (
            <>
              <Typography textAlign={"center"} fontSize={"small"}>
                {cell.value}
              </Typography>
            </>
          ),
      },
      {
        Header: "Invoice Value",
        accessor: "delivery_charge",
        Cell: (cell: any) => (
            <>
              <Typography textAlign={"center"} fontSize={"small"}>
              ₹{cell.value}
              </Typography>
            </>
          ),
      },
      
    ],
    [postfix]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    } else
      return {
        totalItems: 0,
        totalPages: 1,
        orders: [],
      };
  }, [data]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData.orders}
        showNotFound={getData.totalItems === 0}
        components={{
          pagination: (
            <TablePagination
              page={page}
              pageSize={size}
              totalItems={getData.totalItems}
              count={getData.totalPages}
              onChangePage={setPage}
              onPageSizeSelect={setSize}
            />
          ),
        }}
      />
    </>
  );
}
