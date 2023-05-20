import React from "react";
import { Typography } from "@mui/material";
import DataTable from "../../table/data-table";
import dayjs from "dayjs";
import OrderStatus from "./order-status";
import { useQuery } from "@tanstack/react-query";
import SerialNumber from "../serial-number";

import { useParams } from "react-router-dom";
import { shopOrderLog } from "../../../http/server-api/server-apis";

export default function OrderLogList() {
  const { order_id } = useParams();

  const postfix = React.useMemo(() => {
    return `?order_id=${order_id}`;
  }, [order_id]);

  const { isLoading, data } = useQuery(
    ["order-log", postfix],
    () =>
      shopOrderLog("get", {
        postfix,
        params: "log",
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      if (Array.isArray(data.data?.logs)) {
        return data.data;
      } else {
        return { logs: [] };
      }
    } else
      return {
        logs: [],
      };
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => (
          <SerialNumber cell={cell} page={0} size={getData.logs.length} />
        ),
        width: "5%",
      },

      {
        Header: "Order Status",
        accessor: "order_status",
        Cell: (cell: any) => <OrderStatus value={cell.value} />,
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
        data={getData.logs}
        showNotFound={getData.logs.length === 0}
      />
    </>
  );
}
