import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaSave as SaveIcon } from "react-icons/fa";
import { AiFillPrinter as PrintIcon } from "react-icons/ai";
import CommonToolbar from "../../../components/admin/common-toolbar";
import { MainContainer } from "../../../components/layout";
import { useReactToPrint } from "react-to-print";
import SpeedDialTooltipAction from "../../../components/admin/speed-dial-tooltip-action";
import { reactToPdf } from "../../../components/admin/utils";
import { shopAdvisory } from "../../../http/server-api/server-apis";
import {
  InvoiceBody,
  InvoiceHead,
} from "../../../components/admin/advisory/invoice";
import InvoiceFooter from "../../../components/admin/advisory/invoice/invoice-footer";

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

export default function AdvisoryInvoicePrint() {
  const { advisory_id } = useParams();
  let componentRef = React.useRef<any>(null);
  const pefComponentRef = React.useRef<any>(null);

  const onPrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle,
  });

  const { data } = useQuery([`advisory-invoice-${advisory_id}`], () =>
    shopAdvisory("get", { params: advisory_id })
  );

  const packageOrder = React.useMemo(() => {
    if (data?.status === 200) return data.data;
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
      <MainContainer ref={pefComponentRef} className=" mx-5">
        <Box className="container mx-auto">
          <CommonToolbar
            title={`${packageOrder?.farmer_name} / Advisory Package Invoice`}
          />
          <Box mt={1} ref={componentRef} component="div" className="print:mx-2">
            <InvoiceHead advisoryPackage={packageOrder} />
            <InvoiceBody advisoryPackage={packageOrder} />
            <InvoiceFooter />
          </Box>
        </Box>
      </MainContainer>
      <SpeedDialTooltipAction actions={actions} />
    </>
  );
}
