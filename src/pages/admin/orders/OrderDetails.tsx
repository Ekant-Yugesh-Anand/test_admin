import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
// import { FaSave as SaveIcon } from "react-icons/fa";
import { AiFillPrinter as PrintIcon } from "react-icons/ai";
import { MainContainer } from "../../../components/layout";
import { shopOrders } from "../../../http";
import { Box, Grid } from "@mui/material";
import OrderDetailCard from "../../../components/admin/orders/order-detail-card";
import dayjs from "dayjs";
// import { reactToPdf } from "../../../components/admin/utils";
import CommonToolbar from "../../../components/admin/common-toolbar";
import OrderDetailsList from "../../../components/admin/orders/order-detail-list";
import { useQuery } from "@tanstack/react-query";
import SpeedDialTooltipAction from "../../../components/admin/speed-dial-tooltip-action";
// import DeliverChargeDialog from "../../../components/admin/orders/form-dialog/DeliveryChargeDialog";

const orderLabel = [
  { label: "Order ID", accessor: "main_order_no" },
  { label: "Sub Order ID", accessor: "suborder_no" },
  {
    label: "Order Date",
    accessor: "order_date",
    Cell: (cell: any) => <>{dayjs(cell.value).format("D-MMM-YYYY")}</>,
  },
  { label: "Grand Total", accessor: "grand_total" },
  { label: "Delivery Charge", accessor: "delivery_charge" },
  { label: "Invoice No", accessor: "invoice_no" },
  {
    label: "Weight",
    accessor: "grand_weight",
    Cell: (cell: any) => (
      <>
        {cell.value && cell.value > 0 ? (
          cell.value < 999 ? (
            <>{cell.value} gm</>
          ) : (
            <>{+cell.value / 1000} Kg</>
          )
        ) : null}
      </>
    ),
  },
  {
    label: "Volume",
    accessor: "grand_dimension",
    Cell: (cell: any) => (
      <>
        {cell.value && cell.value > 0 ? (
          <>
            {cell.value} cm<sup>3</sup>
          </>
        ) : null}
      </>
    ),
  },

  {
    label: "Total cargill margin Amount",
    accessor: "grand_cargill_margin_amount",
  },
];

const retailerLabel = [
  { label: "Retailer Name", accessor: "retailer_name" },
  { label: "Mobile", accessor: "retailer_phone_no" },
  { label: "Email", accessor: "retailer_email_id" },
];

const customerLabel = [
  { label: "Customer Name", accessor: "customer_name" },
  { label: "Mobile", accessor: "customer_phone_no" },
  { label: "Email", accessor: "customer_email_id" },
];

const partnerLabel = [
  { label: "Partner Name", accessor: "partner_name" },
  { label: "Mobile", accessor: "partner_phone_no" },
  { label: "Email", accessor: "partner_email_id" },
];
const agentLabel = [
  { label: "Agent Name", accessor: "agent_name" },
  { label: "Mobile", accessor: "agent_phone_no" },
  { label: "Email", accessor: "agent_email_id" },
  { label: "Vehicle", accessor: "vehicle" },
  { label: "Vehicle Number", accessor: "vehicle_number" },
  { label: "Remark", accessor: "remark" },
];

const billingLabel = [
  { label: "Name", accessor: "billing_name" },
  { label: "Village", accessor: "billing_village" },
  { label: "District", accessor: "billing_district" },
  { label: "Sub District", accessor: "billing_subdistrict" },
  { label: "State", accessor: "billing_state" },
  { label: "Pincode", accessor: "billing_pincode" },
];

const shippingLabel = [
  { label: "Name", accessor: "shipping_name" },
  { label: "Village", accessor: "shipping_village" },
  { label: "District", accessor: "shipping_district" },
  { label: "Sub District", accessor: "shipping_subdistrict" },
  { label: "State", accessor: "shipping_state" },
  { label: "Pincode", accessor: "shipping_pincode" },
];
const cancelLabel = [
  { label: "Cancel Reason Name", accessor: "reason_name" },
  { label: "Cancel Reason Method", accessor: "type" },
  { label: "Other Cancel Reason", accessor: "other_reason" },
];
const paymentLabel = [
  { label: "Coupon Code", accessor: "boucher_code" },
  { label: "Coupon Amount", accessor: "boucher_amount" },
];
const resheduleLabel = [
  { label: "Reshedule", accessor: "reschedule" },
  {
    label: "Reshedule Date",
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
  { label: "Reshedule reason", accessor: "reschedule_reason" },
  { label: "Reshedule other reason", accessor: "reschedule_other_reason" },
];
const returnResheduleLabel = [
  { label: "Reshedule", accessor: "return_reschedule" },
  {
    label: "Reshedule Date",
    accessor: "return_reschedule_date",
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
  { label: "Reshedule reason", accessor: "return_reschedule_reason" },
  {
    label: "Reshedule other reason",
    accessor: "return_reschedule_other_reason",
  },
];

const returnRetailerCancelledReason = [
  { label: "Retailer Cancel Reason", accessor: "return_retailer_cancelreason" },
  { label: "Retailer Cancel type", accessor: "return_retailer_canceltype" },
  {
    label: "Retailer Cancel Other Reason",
    accessor: "return_retailer_cancelotherreason",
  },

];
const returnPartnerCancelReason =[
  { label: "Partner Cancel Reason", accessor: "return_partner_cancelreason" },
  { label: "Partner Cancel type", accessor: "return_partner_canceltype" },
  {
    label: "Partner Cancel Other Reason",
    accessor: "return_partner_cancelotherreason",
  },
]
const returnLabel = [
  { label: "Return reason", accessor: "return_reason_name" },
  { label: "Return Type", accessor: "return_type" },
  { label: "Other Return Reason", accessor: "return_other_reason" },
  {
    label: "Return Date",
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
];

const returnPartnerLabel = [
  { label: "Partner Name", accessor: "return_partner_name" },
  { label: "Mobile", accessor: "return_partner_phone_no" },
  { label: "Email", accessor: "return_partner_email_id" },
];
const returnAgentLabel = [
  { label: "Agent Name", accessor: "return_agent_name" },
  { label: "Mobile", accessor: "return_agent_phone_no" },
  { label: "Email", accessor: "return_agent_email_id" },
];

export default function OrderDetails() {
  const [open, setOpen] = React.useState(false);
  const { order_id } = useParams();
  let componentRef = React.useRef<any>(null);
  const location = useLocation();

  const orderStatus = React.useMemo(
    () => new URLSearchParams(location.search).get("order_status"),
    [location]
  );

  const { refetch, data } = useQuery([`order-orderDetail-${order_id}`], () =>
    shopOrders("get", { params: order_id })
  );

  const order = React.useMemo(() => {
    if (data?.status === 200) return data.data?.orders[0];
    return {};
  }, [data]);

  const pageStyle = `
  @media all {
    .page-break {
      display: none;
    }
  }
  
  @media print {
    html, body {
      height: initial !important;
      overflow: initial !important;
      -webkit-print-color-adjust: exact;
    }
    body {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      filter: grayscale(100%);
    }
  }
  
  @media print {
    .page-break {
      margin-top: 1rem;
      display: block;
      page-break-before: auto;
    }
  }
  
  @page {
    size: landscape;
    margin: 3mm;
    margin-top: 15mm;
  }
`;

  const onPrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle,
  });

  const actions = React.useMemo(
    () => [
      // {
      // icon: <SaveIcon size={20} />,
      // name: "Save",
      // onClick: () =>
      //   reactToPdf(componentRef.current, "order-details-pdf.pdf"),
      // },
      { icon: <PrintIcon size={20} />, name: "Print", onClick: onPrint },
    ],
    []
  );

  const getExtraColumn = () => {
    let extraLabel = [];
    if (order.reschedule == "yes")
      extraLabel.push({ title: "Reschedule", labelObj: resheduleLabel });
    if (order.boucher_amount)
      extraLabel.push({ title: "Coupon", labelObj: paymentLabel });
    if (order.return_order_status) {
      extraLabel.push({ title: "Return", labelObj: returnLabel });
      extraLabel.push({
        title: "Return Delivery Partner",
        labelObj: returnPartnerLabel,
      });
      extraLabel.push({
        title: "Return Delivery Agent",
        labelObj: returnAgentLabel,
      });
      if (order.return_order_status == 8)
        extraLabel.push({
          title: "Return Reshedule ",
          labelObj: returnResheduleLabel,
        });
      if (order.return_order_status == 3 || order.return_order_status == 6 ) 
        extraLabel.push({
          title: "Return Cancelled ",
          labelObj: order.return_order_status == 3 ? returnRetailerCancelledReason : returnPartnerCancelReason,
        });
    }
    return extraLabel;
  };

  const collectionLabel = [
    {
      title: "View Order",
      labelObj: (orderStatus: string) => {
        if (orderStatus == "7") return [...orderLabel, ...cancelLabel];
        else if (orderStatus == "9") return [...orderLabel, ...cancelLabel];
        else if (orderStatus == "10") return [...orderLabel, ...cancelLabel];
        else if (orderStatus === "5")
          return [
            ...orderLabel,
            {
              label: "Delivery Date",
              accessor: "delivered_date",
              Cell: (cell: any) => (
                <>{dayjs(cell.value).format("D-MMM-YYYY")}</>
              ),
            },
            { label: "Payment Method", accessor: "payment_method" },
            { label: "Amount Recieve", accessor: "amount_receive" },
            { label: "Payment To", accessor: "payment_to" },
          ];
        return orderLabel;
      },
    },
    { title: "Retailer", labelObj: retailerLabel },
    { title: "Delivery Partner", labelObj: partnerLabel },
    { title: "Delivery Agent", labelObj: agentLabel },
    { title: "Customer", labelObj: customerLabel },
    { title: "Billing", labelObj: billingLabel },
    { title: "Shipping", labelObj: shippingLabel },
    ...getExtraColumn(),
  ];
  return (
    <>
      <MainContainer>
        {/* <Container> */}
        <CommonToolbar
          title={`${order?.retailer_name} / Order Details`}
          // onAddProps={{
          //   title: "Update Delivery Charge",
          //   onClick: () => setOpen(true),
          // }}
        />
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={2}
          p={1}
          mx={5}
          component="div"
          ref={componentRef}
        >
          <Grid container spacing={2}>
            {collectionLabel.map((item, index) => (
              <Grid key={index} item md={6} lg={4}>
                <OrderDetailCard
                  title={item.title}
                  labels={
                    typeof item.labelObj === "function"
                      ? item.labelObj(orderStatus as string)
                      : item.labelObj
                  }
                  data={order}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <OrderDetailsList
                orderId={order_id as string}
                grandTotal={order?.grand_total || 0}
              />
            </Grid>
          </Grid>
        </Box>
        {/* </Container> */}
      </MainContainer>
      {/* <DeliverChargeDialog
        open={open}
        close={() => setOpen(false)}
        DeliveryCharge={order?.delivery_charge}
        OrderId={order_id}
        reload={refetch}
      /> */}
      <SpeedDialTooltipAction actions={actions} />
    </>
  );
}
