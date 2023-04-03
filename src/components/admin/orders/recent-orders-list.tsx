import React from "react";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { NumericFormat } from "react-number-format";
import { Typography, Box, IconButton, Tooltip } from "@mui/material";
import { shopOrders } from "../../../http";
import SerialNumber from "../serial-number";
import OrderStatus from "../orders/order-status";
import DataTable from "../../table/data-table";
import { TextCenter } from "../orders/styles";
import LinkRouter from "../../../routers/LinkRouter";

export default function RecentOrdersList(props: {
  params?: string;
  postfix?: string;
  variant: "retailer" | "partner" | "dashboard";
}) {
  const { params, postfix, variant } = props;

  const { data, isLoading } = useQuery(["recent-orders"], () =>
    shopOrders("get", {
      params,
      postfix,
    })
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => <SerialNumber cell={cell} page={0} size={"10"} />,
        width: "2%",
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
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Order Status",
        accessor: "order_status",
        Cell: (cell: any) => <OrderStatus value={cell.value} />,
      },
      {
        Header: "Order Date",
        accessor: "order_date",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize="small">
              {dayjs(cell.value).format("D-MMM-YYYY")}
            </Typography>
            <Typography textAlign={"center"} fontSize="small">
              {dayjs(cell.value).format("hh:mm a")}
            </Typography>

          </>

        ),
      },
      {
        Header: "Invoice generate date",
        accessor: (row: any) => row.order_date,
        Cell: (cell: any) => (
          <Typography textAlign={"center"} fontSize="small">
            {dayjs(cell.value).format("D-MMM-YYYY")}
          </Typography>
        ),
      },
      {
        Header: "Delivery Date",
        accessor: "delivered_date",
        Cell: (cell: any) => (
          <Typography textAlign={"center"} fontSize="small">
            {cell.value ? dayjs(cell.value).format("D-MMM-YYYY") : ""}
          </Typography>
        ),
      },
      {
        Header: "Retailer",
        accessor: "retailer_name",
        width: "15%",
        Cell: (cell: any) => (
          <TextCenter fontWeight={"600"} fontSize="small">
            {cell.row.original.retailer_company_name} ( {cell.value} )
          </TextCenter>
        ),
      },
      {
        Header: "Farmer Name",
        accessor: "customer_name",
        Cell: (cell: any) => (
          <TextCenter fontSize="small">{cell.value}</TextCenter>
        ),
      },
      {
        Header: "Delivery Address",
        accessor:"shipping_village",
        width:"15%",
        Cell: (cell: any) => (
          <>
          <TextCenter fontSize="small">{cell.value}</TextCenter>
          <TextCenter fontSize="small">{cell.row.original?.shipping_sub_district}</TextCenter>
          <TextCenter fontSize="small">{cell.row.original?.shipping_district}</TextCenter>
          <TextCenter fontSize="small">{cell.row.original?.shipping_district}</TextCenter>          
          </>
        ),
      },
      
      {
        Header: "Total Value",
        accessor: "grand_total",
        Cell: (cell: any) => (
          <TextCenter fontWeight={"600"} fontSize="small">
            <NumericFormat value={cell.value} prefix="₹ " displayType="text" />
          </TextCenter>
        ),
      },
      {
        Header: "Agent Id",
        accessor: "agent_id",
        Cell: (cell: any) => (
          <TextCenter fontSize="small">{cell.value}</TextCenter>
        ),
      },
      {
        Header: "Agent name",
        accessor: "agent_name",
        Cell: (cell: any) => (
          <TextCenter fontSize="small">{cell.value}</TextCenter>
        ),
      },
    ],
    []
  );

  const dashboardColumns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => <SerialNumber cell={cell} page={0} size={"10"} />,
        width: "2%",
      },
      {
        Header: "Order ID",
        accessor: "main_order_no",
        width: "10%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Suborder No",
        accessor: "suborder_no",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },

      {
        Header: "Order Date",
        accessor: "order_date",
        width: "10%",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize="small">
              {dayjs(cell.value).format("D-MMM-YYYY")}
            </Typography>
            <Typography textAlign={"center"} fontSize="small">
              {dayjs(cell.value).format("hh:mm a")}
            </Typography>
          </>

        ),
      },
      {
        Header: "Order Status",
        accessor: "order_status",
        width: "15%",
        Cell: (cell: any) => <OrderStatus value={cell.value} />,
      },
      {
        Header: "Amount",
        accessor: "grand_total",
        width: "10%",
        Cell: (cell: any) => (
          <TextCenter fontWeight={"600"} fontSize="small">
            <NumericFormat value={cell.value} prefix="₹ " displayType="text" />
          </TextCenter>
        ),
      },
      {
        Header: "Farmer Name",
        accessor: "customer_name",
        Cell: (cell: any) => (
          <TextCenter fontSize="small">{cell.value}</TextCenter>
        ),
      },
      {
        Header: "Retailer",
        accessor: "retailer_name",
        Cell: (cell: any) => (
          <TextCenter fontWeight={"600"} fontSize="small">
            {cell.row.original.retailer_company_name} ( {cell.value} )
          </TextCenter>
        ),
      },
      {
        Header: "Action",
        width: "5%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
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
          </Box>
        ),
      },
    ],
    []
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
    <DataTable
      loading={isLoading}
      columns={variant === "dashboard" ? dashboardColumns : columns}
      data={getData.orders}
      showNotFound={getData.totalItems === 0}
    />
  );
}
