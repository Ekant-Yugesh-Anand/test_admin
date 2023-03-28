import {
  CancelledOrders,
  DataSkuPricing,
  DataSkuUnit,
  InputSaleDetails,
} from "../../pages/admin/retailer-report";

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
  ],
};
