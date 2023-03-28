import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaSave as SaveIcon } from "react-icons/fa";
import { AiFillPrinter as PrintIcon } from "react-icons/ai";
import CommonToolbar from "../../../components/admin/common-toolbar";
import { MainContainer } from "../../../components/layout";
import {
  InvoiceHead,
  InvoiceBody,
} from "../../../components/admin/orders/invoice";
import { shopOrders } from "../../../http";
import { useReactToPrint } from "react-to-print";
import SpeedDialTooltipAction from "../../../components/admin/speed-dial-tooltip-action";
import InvoiceFooter from "../../../components/admin/orders/invoice/invoice-footer";
import { reactToPdf } from "../../../components/admin/utils";

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
      margin: 0mm;
    }
`;

export default function OrderInvoice() {
  const { order_id } = useParams();
  let componentRef = React.useRef<any>(null);
  const pefComponentRef = React.useRef<any>(null);

  const onPrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle,
  });

  const { data } = useQuery([`order-orderDetail-${order_id}`], () =>
    shopOrders("get", { params: order_id })
  );

  const order = React.useMemo(() => {
    if (data?.status === 200) return data.data?.orders[0];
    return {};
  }, [data]);

  const actions = React.useMemo(
    () => [
      {
        icon: <SaveIcon size={20} />,
        name: "Save",
        onClick: () => reactToPdf(pefComponentRef.current, "invoice-pdf.pdf"),
      },
      { icon: <PrintIcon size={20} />, name: "Print", onClick: onPrint },
    ],
    []
  );

  return (
    <>
      <MainContainer ref={pefComponentRef}>
        <CommonToolbar title={`${order?.retailer_name} / Order Invoice`} />
        <Box mt={1} ref={componentRef} component="div" className="print:mx-2">
          <InvoiceHead order={order} />
          <InvoiceBody order={order} orderId={order_id as string} />
          <InvoiceFooter order={order} />
        </Box>
      </MainContainer>
      <SpeedDialTooltipAction actions={actions} />
    </>
  );
}
