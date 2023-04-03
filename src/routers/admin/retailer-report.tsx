import {
  CancelledOrders,
  DataSkuPricing,
  DataSkuUnit,
  InputSaleDetails,
} from "../../pages/admin/retailer-report";
import MarginReport from "../../pages/admin/retailer-report/margin-report";

export default {
  path: "/retailer-report",
  children: [
    {
      path: "input-sale-details",
      element: <InputSaleDetails />,
    },
    {
      path: "cancelled-orders",
      element: <CancelledOrders />,
    },
    {
      path: "data-sku-unit",
      element: <DataSkuUnit />,
    },
    {
      path: "data-sku-pricing",
      element: <DataSkuPricing />,
    },
    {
      path: "margin-report",
      element: <MarginReport />,
    },
  ],
};
