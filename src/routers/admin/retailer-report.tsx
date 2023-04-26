import {
  CancelledOrders,
  DataSkuPricing,
  DataSkuUnit,
  InputSaleDetails,
} from "../../pages/admin/retailer-report";
import MarginReport from "../../pages/admin/retailer-report/margin-report";
import PackagingMaterialReport from "../../pages/admin/retailer-report/packaging-material";
import TaxationReport from "../../pages/admin/retailer-report/taxation-report";

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
    {
      path: "taxation-report",
      element: <TaxationReport />,
    },
    {
      path: "packaging-material",
      element: <PackagingMaterialReport />,
    },
  ],
};
