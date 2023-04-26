import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { shopOrders } from "../../../http";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import dayjs from "dayjs";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import LinkRouter from "../../../routers/LinkRouter";
import OrderStatus from "./order-status";
import { useQuery } from "@tanstack/react-query";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import MoveOrdersDialog from "./move-orders/move-orders-dailog";
import { MdOutlineDriveFileMove } from "react-icons/md";
import { VscReferences } from "react-icons/vsc";
import StatsDialog from "./stats/stats-dialog";

export default function AllOrdersListResults(props: { searchText: string }) {
  const { page, setPage, size, setSize } = usePaginate();
  const { searchText } = props;
  const [moveOrder, setMoveOrder] = React.useState({
    open: false,
    values: {},
    orderStatus: "0",
  });
  const [stats, setStats] = React.useState({
    open: false,
    values: {},
  });
  const onCloseMoveOrder = () =>
    setMoveOrder({ open: false, values: {}, orderStatus: "0" });

    const onCloseStats = () =>
    setStats({ open: false, values: {}});  

  const postfix = React.useMemo(() => {
    return searchText
      ? `${searchText}&page=${page}&size=${size}`
      : `?page=${page}&size=${size}`;
  }, [searchText, page, size]);

  const { isLoading, data, refetch } = useQuery(
    ["all-order", postfix],
    () =>
      shopOrders("get", {
        postfix,
      }),
   
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
        Header: "Order Status",
        accessor: "order_status",
        width: "8%",
        Cell: (cell: any) => <OrderStatus value={cell.value} />,
      },
      {
        Header: "Order Date",
        accessor: "order_date",
        width: "10%",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("DD-MMM-YYYY")}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("hh:mm a")}
            </Typography>
          </>
        ),
      },
      {
        Header: "Amount",
        accessor: "grand_total",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            ₹{cell.value}
          </Typography>
        ),
      },
      {
        Header: "Total Cargill Margin Amt.",
        accessor: "grand_cargill_margin_amount",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            {cell.value ? `₹${(+cell.value).toFixed(2)}` :""}
          </Typography>
        ),
      },
      {
        Header: "Volume",
        accessor: "grand_dimension",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            {cell.value && cell.value > 0 ? (
              <>
                {cell.value} cm<sup>3</sup>
              </>
            ) : null}
          </Typography>
        ),
      },
      {
        Header: "Weight",
        accessor: "grand_weight",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            {cell.value && cell.value > 0 ? (
              cell.value < 999 ? (
                <>{cell.value} gm</>
              ) : (
                <>{+cell.value / 1000} Kg</>
              )
            ) : null}
          </Typography>
        ),
      },
      {
        Header: "Payment Method",
        accessor: "payment_method",
        width: "8%",
        Cell: (cell: any) => {
          return (
            <>
              <Typography textAlign="center" fontSize={"small"}>
                {cell.value}
              </Typography>

              {cell.value === "Razorpay" ? (
                cell.row.values.payment_status != 20 ? (
                  <Typography
                    color="secondary"
                    fontSize={"small"}
                    textAlign="center"
                  >
                    Payment success
                  </Typography>
                ) : (
                  <Typography
                    fontSize={"small"}
                    color="error"
                    textAlign="center"
                  >
                    Payment failed
                  </Typography>
                )
              ) : null}
            </>
          );
        },
      },

      {
        Header: "Farmer Name",
        accessor: "customer_name",
      },
      {
        Header: "Retailer Name",
        accessor: "retailer_name",
        width: "15%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize="small">
            {cell.row.original.retailer_company_name} ( {cell.value} )
          </Typography>
        ),
      },
      {
        Header: "Action",
        width: "10%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Move Orders">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setMoveOrder({
                    open: true,
                    values: cell.row.original,
                    orderStatus: `${cell.row.values.order_status}`,
                  })
                }
              >
                <MdOutlineDriveFileMove />
              </IconButton>
            </Tooltip>
            <LinkRouter
              to={`/orders/order-details/${cell.row.original.order_id}?order_status=${cell.row.original.order_status}`}
            >
              <Tooltip title="View Orders">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaEye />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter
              to={`/orders/order-invoice-print/${cell.row.original.order_id}`}
            >
              <Tooltip title="Order Invoice">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaFileInvoice />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter to={`/orders/log/${cell.row.original.order_id}`}>
              <Tooltip title="Order Logs">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <VscReferences />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            {/* <Tooltip title="Stats">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setStats({
                    open: true,
                    values: cell.row.original,
                  })
                }
              >
                <BiStats />
              </IconButton>
            </Tooltip> */}
          </Box>
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
      {moveOrder.open && (
        <MoveOrdersDialog
          open={moveOrder.open}
          orderStatus={moveOrder.orderStatus}
          onClose={onCloseMoveOrder}
          orders={moveOrder.values}
          refetch={refetch}
        />
      )}
      {stats.open && (
        <StatsDialog
          open={stats.open}
          onClose={onCloseStats}
          orders={stats.values}
        />
      )}
    </>
  );
}
