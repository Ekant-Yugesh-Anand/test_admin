import React from "react";
import { MainContainer } from "../../../components/layout";
import { Box } from "@mui/material";
import OrdersToolbar from "../../../components/admin/orders/orders-toolbar";
import { AiFillPrinter as PrintIcon } from "react-icons/ai";
import { FaSave as SaveIcon } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { reactToPdf } from "../../../components/admin/utils";
import NotificationLogList from "../../../components/admin/log/notifiaction-log-list";
import CommonToolbar from "../../../components/admin/common-toolbar";

export default function NotificationLog() {
  let componentRef = React.useRef<any>(null);
  const [searchText, setSearchText] = React.useState("");

  const searchHandler = (value: string) =>
    setSearchText(value ? `/search?search_log=${value}` : "");

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
          reactToPdf(componentRef.current, `Order-logs.pdf`),
      },
      { icon: <PrintIcon size={20} />, name: "Print", onClick: onPrint },
    ],
    []
  );
  return (
    <>
      <MainContainer>
      <CommonToolbar onSearch={searchHandler} title="Notification Log" />
        <Box sx={{ mt: 3 }} ref={componentRef}>
          <NotificationLogList searchText={searchText} />
        </Box>
      </MainContainer>

      {/* <SpeedDialTooltipAction actions={actions} /> */}
    </>
  );
}
