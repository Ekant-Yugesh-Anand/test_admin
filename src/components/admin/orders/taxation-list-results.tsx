import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@mui/material";
import { queryToStr } from "../utils";
import { shopOrders } from "../../../http";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import MoveOrdersDialog from "./move-orders/move-orders-dailog";
import ReturnMoveOrdersDialog from "./move-orders/return-move-orders-dailog";

export default function TaxationListResult(props: {
  postfix?: string;
  params?: string;
  orderStatus: string;
  searchText: string;
  otherQuery?: { [key: string]: any };
  moveVariant?: "return" | "normal";
  moveCellShow?: boolean;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const {
    searchText,
    orderStatus,
    params,
    otherQuery,
    postfix: otherPostfix,
    moveVariant,
  } = props;
  const [moveOrder, setMoveOrder] = React.useState({
    open: false,
    values: {},
  });

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      ...otherQuery,
      page,
      size,
      order_status: orderStatus,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size, orderStatus]);

  const { isLoading, data, refetch } = useQuery(
    [`order-${orderStatus}`, postfix],
    () =>
      shopOrders("get", {
        params,
        postfix: otherPostfix ? `${postfix}&${otherPostfix}` : postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onCloseMoveOrder = () => setMoveOrder({ open: false, values: {} });

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
        width: "10%",
        Cell: (cell: any) => (
          <>
            <Typography
              fontWeight={"600"}
              textAlign="center"
              fontSize={"small"}
            >
              {cell.value}
            </Typography>

            <Typography
              className="p-2"
              fontWeight={"400"}
              textAlign="center"
              fontSize={"small"}
            >
              {cell.row.original?.suborder_no}
            </Typography>
          </>
        ),
      },
      {
        Header: "Total Amount",
        accessor: "grand_total",

        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize={"small"} textAlign="center">
            ₹ {cell.value}
          </Typography>
        ),
      },

      {
        Header: "DS Margin",
        accessor: "grand_cargill_margin_amount",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize={"small"} textAlign="center">
            {cell.value > 0 ? `₹${(+cell.value).toFixed(2)}` : "0"}
          </Typography>
        ),
      },
      {
        id: "gst",
        Header: "Gst (DS Margin)",
        accessor: "grand_cargill_margin_amount",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize={"small"} textAlign="center">
            {cell.value > 0 ? `₹${(+cell.value * 0.18).toFixed(2)}` : "0"}
          </Typography>
        ),
      },
      {
        id: "dspayble",
        Header: "Payable to DS",
        accessor: "grand_cargill_margin_amount",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize={"small"} textAlign="center">
            {cell.value > 0
              ? `₹${(+cell.value * 0.18 + +cell.value).toFixed(2)}`
              : 0}
          </Typography>
        ),
      },
      {
        id: "TDS",
        Header: "TDS",
        accessor: "grand_total",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize={"small"} textAlign="center">
            {cell.value > 0 ? `₹${(+cell.value * 0.01).toFixed(2)}` : "0"}
          </Typography>
        ),
      },
      {
        id: "TCS",
        Header: "GST TCS",
        accessor: "grand_total",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize={"small"} textAlign="center">
            {cell.value > 0 ? `₹${(+cell.value * 0.01).toFixed(2)}` : "0"}
          </Typography>
        ),
      },
      {
        id: "retailerPayble",
        Header: "Payable to retailer",
        accessor: "grand_total",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize={"small"} textAlign="center">
            {cell.value
              ? `₹${(
                  +cell.value -
                  (+cell.row.original.grand_cargill_margin_amount * 0.18 +
                    +cell.row.original?.grand_cargill_margin_amount +
                    +cell.value * 0.02)
                ).toFixed(2)}`
              : ""}
          </Typography>
        ),
      },

      {
        Header: "Retailer Name",
        accessor: "retailer_name",
        width: "10%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize="small" textAlign="center">
            {cell.row.original.retailer_company_name} ( {cell.value} )
          </Typography>
        ),
      },
    ],
    [postfix]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    }
    return {
      totalItems: 0,
      totalPages: 1,
      orders: [],
    };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

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
      {moveOrder.open &&
        (moveVariant === "return" ? (
          <ReturnMoveOrdersDialog
            open={moveOrder.open}
            orderStatus={orderStatus}
            onClose={onCloseMoveOrder}
            orders={moveOrder.values}
            refetch={refetch}
          />
        ) : (
          <MoveOrdersDialog
            open={moveOrder.open}
            orderStatus={orderStatus}
            onClose={onCloseMoveOrder}
            orders={moveOrder.values}
            refetch={refetch}
          />
        ))}
    </>
  );
}
