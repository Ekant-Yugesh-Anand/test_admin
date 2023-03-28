import React from "react";
import { MainContainer } from "../../../components/layout";
import { Box } from "@mui/material";
import OrdersToolbar from "../../../components/admin/orders/orders-toolbar";
import { AiFillPrinter as PrintIcon } from "react-icons/ai";
import { FaSave as SaveIcon } from "react-icons/fa";
import OrderLogList from "../../../components/admin/orders/OrderLogList";
import SpeedDialTooltipAction from "../../../components/admin/speed-dial-tooltip-action";
import { useReactToPrint } from "react-to-print";
import { reactToPdf } from "../../../components/admin/utils";
import { useParams } from "react-router-dom";

export default function OrderLog() {
  let componentRef = React.useRef<any>(null);
  const { order_id } = useParams();


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
    size: auto;
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
      {
      icon: <SaveIcon size={20} />,
      name: "Save",
      onClick: () =>
        reactToPdf(componentRef.current, `Order-${order_id}.pdf`),
      },
      { icon: <PrintIcon size={20} />, name: "Print", onClick: onPrint },
    ],
    []
  );
  return (
    <>
        <MainContainer>
      <OrdersToolbar>Order Log</OrdersToolbar>
      <Box sx={{ mt: 3 }} ref={componentRef}>
        <OrderLogList />
      </Box>
    </MainContainer>

    {/* <SpeedDialTooltipAction actions={actions} /> */}

    
    </>

    
  );
}
