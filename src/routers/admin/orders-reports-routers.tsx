import { AmountCollectionReport } from "../../pages/admin/reports/amount-collection-report";
import { OrderFulFillment } from "../../pages/admin/reports/order-fulfillment";
import { InvoiceWiseDelivery } from "../../pages/admin/reports/invoice-wise-delivery-status";
import { DsMarginClaims } from "../../pages/admin/reports/ds-margin-claims";
import { Sale } from "../../pages/admin/reports/sale";

export default {
  path: "/reports",
  children: [
    {
      path: "amount-collection-report",
      children: [
        {
          path: "",
          element: <AmountCollectionReport />,
        },
      ],
    },
    {
      path: "invoice-wise-delivery-status",
      children: [
        {
          path: "",
          element: <InvoiceWiseDelivery />,
        },
      ],
    },
    {
      path: "ds-margin-claims",
      children: [
        {
          path: "",
          element: <DsMarginClaims />,
        },
      ],
    },
    {
      path: "order-fulfillment",
      children: [
        {
          path: "",
          element: <OrderFulFillment />,
        },
      ],
    },
    {
      path: "sale",
      children: [
        {
          path: "",
          element: <Sale />,
        },
      ],
    },
  ],
};
