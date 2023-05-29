import AdvisoryInvoice from "../../pages/admin/advisory/advisory-invoice";
import AdvisoryInvoicePrint from "../../pages/admin/advisory/advisory-invoice-print";
import AdvisoryList from "../../pages/admin/advisory/advisory-list";
import DeliveryGSTReport from "../../pages/admin/advisory/delivery-gst-report";
import GSTReport from "../../pages/admin/advisory/gst-report";

export default {
  path: "/report",
  children: [
    {
      path: "invoice",
      children: [
        {
          path: "",
          element: <AdvisoryInvoice />,
        },
        {
          path: ":advisory_id",
          element: <AdvisoryInvoicePrint />,
        },
      ],
    },
    {
      path: "package",
      element: <AdvisoryList />,
    },
    {
      path: "delivery",
      element: <DeliveryGSTReport />,
    },
    {
      path: "gst-report",
      element: <GSTReport />,
    },
  ],
};
