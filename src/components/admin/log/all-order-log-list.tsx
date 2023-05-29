import React from "react";
import { Typography } from "@mui/material";
import DataTable from "../../table/data-table";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import SerialNumber from "../serial-number";
import { shopOrderLog } from "../../../http/server-api/server-apis";
import OrderStatus from "../orders/order-status";
import TablePagination from "../../table/table-pagination";
import usePaginate from "../../../hooks/usePaginate";
import { queryToStr } from "../utils";

export default function AllOrderLogList(props: { searchText: string }) {
  const { searchText } = props;
  const { page, setPage, size, setSize } = usePaginate();

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [page, size, searchText]);

  const { isLoading, data } = useQuery(
    ["order-log", postfix],
    () =>
      shopOrderLog("get", {
        params: searchText ? "search" : "",
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    } else
      return {
        totalItems: 0,
        totalPages: 0,
        logs: [],
      };
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => <SerialNumber cell={cell} page={0} size={size} />,
        width: "5%",
      },
      {
        Header: "Order Id",
        accessor: "main_order_no",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {cell.value}
            </Typography>
          </>
        ),
      },
      {
        Header: "Suborder No",
        accessor: "suborder_no",
        width: "8%",
        Cell: (cell: any) => (
          <Typography textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Order Status",
        accessor: "order_status",
        Cell: (cell: any) => <OrderStatus value={cell.value} />,
      },{
        Header: "Farmer Name",
        accessor: "customer_name",
        Cell: (cell: any) => (
          <Typography textAlign="center" fontSize={"small"} >
            {cell.value} 
          </Typography>
        ),
      },
      
      {
        Header: "Retailer Name",
        accessor: "retailer_name",
        Cell: (cell: any) => (
          <Typography textAlign="center" fontSize={"small"} >
            {cell.value} ( {cell.row.original.retailer_company_name} )
          </Typography>
        ),
      },
      {
        Header: "Partner Name",
        accessor: "partner_name",
        Cell: (cell: any) => (
          <Typography textAlign="center" fontSize={"small"} >
            {cell.value} 
          </Typography>
        ),
      },
      {
        Header: "Agent Name",
        accessor: "agent_name",
        Cell: (cell: any) => (
          <Typography textAlign="center" fontSize={"small"} >
            {cell.value} 
          </Typography>
        ),
      },
      {
        Header: "Date",
        accessor: "doc",

        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("D-MMM-YYYY")}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("hh:mm a")}
            </Typography>
          </>
        ),
      },
      {
        Header: "Logged By",
        accessor: "user",

        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {cell.value}
            </Typography>
          </>
        ),
      },
      {
        Header: "Type",
        accessor: "type",

        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {cell.value}
            </Typography>
          </>
        ),
      },
    ],
    [postfix]
  );

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.logs || []}
        showNotFound={getData?.totalItems === 0}
        components={{
          pagination: (
            <TablePagination
              page={page}
              pageSize={size}
              totalItems={getData?.totalItems}
              count={getData?.totalPages}
              onChangePage={setPage}
              onPageSizeSelect={setSize}
            />
          ),
        }}
      />
    </>
  );
}
