import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import OrdersDetailsList from "../list/orders-details-list";
import { LabelText } from "../styled";
import { useNavigate } from "react-router-dom";
import usePrintData from "../../../../../hooks/usePrintData";
import OrderStatus from "../../order-status";
import { BsCheck2All } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { GiBackwardTime } from "react-icons/gi";

const label1 = [
  { title: "Farmer name", accessor: "customer_name" },
  {
    title: "Farmer address",
    accessor: [
      "shipping_village ,",
      "shipping_sub_district ,",
      "shipping_district ,",
      "shipping_state  - ",
      "shipping_pincode",
    ],
  },
  { title: "Partner name", accessor: "partner_name" },
  { title: "Partner address", accessor: "partner_address" },
  { title: "Agent name", accessor: "agent_name" },
  { title: "Vehicle", accessor: "vehicle" },
  { title: "Vehicle number ", accessor: "vehicle_number" },
  { title: "Remark", accessor: "remark" },
];

const label2 = [
  {
    title: "Order no",
    accessor: "main_order_no",
    Cell: (cell: any) => (
      <>
        {cell.original?.reschedule == "yes" ? <s>{cell.value}</s> : cell.value}
      </>
    ),
  },
  { title: "Suborder no", accessor: "suborder_no" },

  {
    title: "Order date",
    accessor: "order_date",
    Cell: (cell: any) => (
      <Typography>{dayjs(cell.value).format("D-MMM-YYYY")}</Typography>
    ),
  },
  { title: "Order amount", accessor: "grand_total" },
  {
    title: "Order weight",
    accessor: "grand_weight",
    Cell: (cell: any) => {
      return cell.value > 0 ? (
        <Typography>
          {`${
            cell.value > 999 ? `${+cell.value / 1000} kg` : `${+cell.value} gm`
          }`}{" "}
        </Typography>
      ) : null;
    },
  },
  {
    title: "Order volume",
    accessor: "grand_dimension",
    Cell: (cell: any) => {
      return cell.value > 0 ? (
        <Typography>
          {cell.value}cm<sup>3</sup>
        </Typography>
      ) : null;
    },
  },
];
const label3 = [
  { title: "Reshedule", accessor: "reschedule" },
  {
    title: "Reshedule Date",
    accessor: "reschedule_date",
    Cell: (cell: any) => (
      <>
        {cell.value ? (
          <>
            {" "}
            {dayjs(cell.value).format("D-MMM-YYYY")}{" "}
            {dayjs(cell.value).format("hh:mm a")}{" "}
          </>
        ) : null}
      </>
    ),
  },
  { title: "Reshedule reason", accessor: "reschedule_reason" },
  { title: "Reshedule other reason", accessor: "reschedule_other_reason" },
];
const label4 = [
  { title: "Return reason", accessor: "return_reason_name" },
  { title: "Return Type", accessor: "return_type" },
  { title: "Other Return Reason", accessor: "return_other_reason" },
  {
    title: "Return Date",
    accessor: "return_date",
    Cell: (cell: any) => (
      <>
        {cell.value ? (
          <>
            {" "}
            {dayjs(cell.value).format("D-MMM-YYYY")}{" "}
            {dayjs(cell.value).format("hh:mm a")}{" "}
          </>
        ) : null}
      </>
    ),
  },
  { title: "Return Partner Name", accessor: "return_partner_name" },
  { title: "Return Partner Mobile", accessor: "return_partner_phone_no" },
  { title: "Return Partner Email", accessor: "return_partner_email_id" },
  { title: "Return Agent Name", accessor: "return_agent_name" },
  { title: "Return Agent Mobile", accessor: "return_agent_phone_no" },
  { title: "Return Agent Email", accessor: "return_agent_email_id" },

];

function OrderCard(props: { order?: { [key: string]: any } }) {
  const { order } = props;

  const navigate = useNavigate();

  const [orderDetailShow, setOderDetailShow] = React.useState(false);

  const { printData: obj1 } = usePrintData({
    labels: label2,
    data: order,
  });
  const { printData: obj2 } = usePrintData({
    labels: label1,
    data: order,
  });
  const { printData: obj3 } = usePrintData({
    labels: label3,
    data: order,
  });
  const { printData: obj4 } = usePrintData({
    labels: label4,
    data: order,
  });

  const onPrint = () =>
    navigate(`/orders/order-invoice-print/${order?.order_id}`);

  return (
    <Card elevation={4}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item sm={12} lg={8}>
            <Grid container spacing={1} justifyContent="space-between">
              {obj1.map((item, index) => {
                if (item.get("Cell")?.props?.children)
                  return (
                    <Grid key={index} item lg={4}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <LabelText>{item.get("title")}:</LabelText>
                        {item.get("Cell")}
                      </Box>
                    </Grid>
                  );
              })}
            </Grid>
            <Grid item>
              <Grid item lg={12}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LabelText>Order status:</LabelText>
                  <OrderStatus retailer={true} value={order?.order_status} />
                </Box>
              </Grid>

              {obj2.map((item, index) => {
                if (item.get("Cell")?.props?.children)
                  return (
                    <Grid key={index} item lg={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <LabelText>{item.get("title")}:</LabelText>
                        <Typography>{item.get("Cell")}</Typography>
                      </Box>
                    </Grid>
                  );
              })}

              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <LabelText>Payment Method:</LabelText>
                    <Typography>
                      {order?.payment_method === "Cash"
                        ? "C.O.D"
                        : order?.payment_method}
                    </Typography>
                  </Box>
                </Grid>
                {order?.payment_method === "Razorpay" ? (
                  <Grid item lg={4}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <LabelText>Payment Status:</LabelText>
                      <Typography>
                        {order?.order_status != "20" ? "Success" : "Failed"}
                      </Typography>
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between">
              {obj3.map((item, index) => {
                if (item.get("Cell")?.props?.children)
                  return (
                    <Grid key={index} item lg={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <LabelText>{item.get("title")}:</LabelText>
                        {item.get("Cell")}
                      </Box>
                    </Grid>
                  );
              })}
            </Grid>
            <Grid container justifyContent="space-between">
              {obj4.map((item, index) => {
                if (item.get("Cell")?.props?.children)
                  return (
                    <Grid key={index} item lg={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <LabelText>{item.get("title")}:</LabelText>
                        {item.get("Cell")}
                      </Box>
                    </Grid>
                  );
              })}
            </Grid>
          </Grid>

          <Grid item sm={12} lg={4}>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => setOderDetailShow(!orderDetailShow)}
              >
                Products
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() =>
                  navigate(
                    `${order?.order_id}?order_status=${order?.order_status}`
                  )
                }
              >
                View
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={onPrint}
              >
                Print
              </Button>

              {order?.payment_method == "Razorpay" ? (
                order?.order_status != "20" ? (
                  <IconButton
                    color="secondary"
                    aria-label="upload picture"
                    component="label"
                  >
                    <BsCheck2All color="secondary"></BsCheck2All>
                    <Typography>Paid</Typography>
                  </IconButton>
                ) : (
                  <IconButton
                    color="error"
                    aria-label="upload picture"
                    component="label"
                  >
                    <BsX color="error" />
                    <Typography>Payment Failed</Typography>
                  </IconButton>
                )
              ) : (
                <>
                  <IconButton
                    color="warning"
                    aria-label="upload picture"
                    component="label"
                  >
                    <Typography>C.O.D</Typography>
                  </IconButton>
                </>
              )}
            </Box>
            {order?.reschedule == "yes" ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 2,
                  my: 2,
                }}
              >
                <GiBackwardTime fontWeight="bold" color="red" />
                <Typography fontWeight="bold" color="red">
                  Resheduled
                </Typography>
              </Box>
            ) : null}
          </Grid>
        </Grid>
        <Collapse in={orderDetailShow}>
          <OrdersDetailsList key={order?.order_id} orderId={order?.order_id} />
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default React.memo(OrderCard);
