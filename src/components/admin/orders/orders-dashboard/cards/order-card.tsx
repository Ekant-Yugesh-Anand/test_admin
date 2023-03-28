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

const label1 = [
  { title: "farmer name", accessor: "customer_name" },
  {
    title: "farmer address",
    accessor: [
      "shipping_village ,",
      "shipping_sub_district ,",
      "shipping_district ,",
      "shipping_state  - ",
      "shipping_pincode",
    ],
  },
  { title: "partner name", accessor: "partner_name" },
  { title: "partner address", accessor: "partner_address" },
  { title: "agent name", accessor: "agent_name" },
  { title: "vehicle", accessor: "vehicle" },
  { title: "vehicle number ", accessor: "vehicle_number" },
  { title: "remark", accessor: "remark" },
];

const label2 = [
  { title: "order no", accessor: "main_order_no" },
  { title: "suborder no", accessor: "suborder_no" },

  {
    title: "order date",
    accessor: "order_date",
    Cell: (cell: any) => (
      <Typography>{dayjs(cell.value).format("D-MMM-YYYY")}</Typography>
    ),
  },
  { title: "order amount", accessor: "grand_total" },
  {
    title: "order weight",
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
    title: "order volume",
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

  const onPrint = () =>
    navigate(`/orders/order-invoice-print/${order?.order_id}`);

  return (
    <Card elevation={4}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item sm={12} lg={8}>
            <Grid container spacing={1} justifyContent="space-between">
              {obj1.map((item, index) => (
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
              ))}
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
                <IconButton
                  color="warning"
                  aria-label="upload picture"
                  component="label"
                >
                  <Typography>C.O.D</Typography>
                </IconButton>
              )}
            </Box>
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
