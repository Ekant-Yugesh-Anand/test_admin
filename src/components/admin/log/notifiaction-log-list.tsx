import React from "react";
import { Typography } from "@mui/material";
import DataTable from "../../table/data-table";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import SerialNumber from "../serial-number";
import { shopNotificationLog } from "../../../http/server-api/server-apis";
import TablePagination from "../../table/table-pagination";
import usePaginate from "../../../hooks/usePaginate";
import { queryToStr } from "../utils";

export default function NotificationLogList(props: { searchText: string }) {
  const { searchText } = props;

  const { page, setPage, size, setSize } = usePaginate();
  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [, page, size, searchText]);

  const { isLoading, data } = useQuery(
    ["notification-log", postfix],
    () =>
      shopNotificationLog("get", {
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
        notifications: [],
      };
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => <SerialNumber cell={cell} page={0} size={size} />,
        width:"5%",
      },

      {
        Header: "Log id",
        accessor: "log_id",
        width:"5%",
      },
      {
        Header: "Date",
        accessor: "doc",
        width:"10%",

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
        Header: "Request",
        accessor: "request",
        width:"40%",
      },
      {
        Header: "Response",
        accessor: "response",
        width:"40%",
        Cell: (cell: any) => (
          <Typography
            textAlign={"center"}
            fontSize={"small"}
            className="max-w-[500px] break-words "
          >
            {cell.value}
          </Typography>
        ),
      },
    ],
    []
  );

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.notifications || []}
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
