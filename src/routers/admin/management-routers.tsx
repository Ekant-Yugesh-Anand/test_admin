import Farmers from "../../pages/admin/management/farmers/Farmers";
import {
  Categories,
  SubCategories,
} from "../../pages/admin/management/categories";
import { Brands } from "../../pages/admin/management/brands";
import {
  CreateDeliveryPartner,
  DeliveryAgents,
  DeliveryPartners,
  DeliveryPartnersRetailer,
  RetrieveUpdateDeliveryPartner,
} from "../../pages/admin/management/delivery-partners";
import {
  CreateProducts,
  FilteredProduct,
  ProductCsvImport,
  Products,
  RetrieveUpdateProduct,
  ShopProductDetails,
  ProductLanguage,
} from "../../pages/admin/management/products";
import {
  CreateRetailers,
  RetailerArea,
  RetailerDashboard,
  Retailers,
  RetrieveUpdateRetailers,
} from "../../pages/admin/management/retailers";
import {
  RetailerOrderCancelled,
  RetailerOrders,
  RetailerSaleDetails,
  RetailerSkuPricing,
  RetailerSkuUnits,
  RetailerTargetAchievement,
} from "../../pages/admin/management/retailers/retailerDashboard";
import ProductImages from "../../pages/admin/management/products/product-images";
import FarmersOrders from "../../pages/admin/management/farmers/farmers-orders";
import { DeliveryCharges } from "../../pages/admin/management/delivery-charge";
import { TrendingProducts } from "../../pages/admin/management/trending-product";
import {
  DeliveryPartnerDashboard,
  PartnerOrders,
  PartnerSaleDetails,
  PartnerTargetAchievement,
  PartnerUpiPaymentLog,
} from "../../pages/admin/management/delivery-partners/partner-dashboard";
import PartnerCancelledOrders from "../../pages/admin/management/delivery-partners/partner-dashboard/partner-cancelled-orders";
import DeliveryPartnerArea from "../../pages/admin/management/delivery-partners/delivery-partner-area";
import RetailerSkuImport from "../../pages/admin/management/retailers/retailerDashboard/retailer-sku-units-import";
import OrderDetails from "../../pages/admin/orders/OrderDetails";
import BrandCsvImport from "../../pages/admin/management/brands/BrandCsvImport";
import { Crops } from "../../pages/admin/management/crops";
import CropCsvImport from "../../pages/admin/management/crops/CropCsvImport";
import Ingredients from "../../pages/admin/management/ingredients/ingredients";
import RetailersCategory from "../../pages/admin/management/retailers/Category";
import AddCategory from "../../pages/admin/management/retailers/AddCategory";
import RetailerSubCategory from "../../pages/admin/management/retailers/SubCategory";
import RetailerPackageingMaterial from "../../pages/admin/management/retailers/retailerDashboard/retailer-packaging-material";

export default {
  path: "/management",
  children: [
    {
      path: "farmers",
      children: [
        {
          path: "",
          element: <Farmers />,
        },
        {
          path: ":customer_id",
          element: <FarmersOrders />,
        },
      ],
    },
    {
      path: "retailers",
      children: [
        {
          path: "",
          element: <Retailers />,
        },
        {
          path: "new",
          element: <CreateRetailers />,
        },
        {
          path: "area/:retailer_id",
          element: <RetailerArea />,
        },
        {
          path: ":retailer_id",
          children: [
            {
              path: "",
              element: <RetrieveUpdateRetailers />,
            },
          ],
        },
        {
          path: ":retailer_id/retailer-dashboard",
          children: [
            {
              path: "",
              element: <RetailerDashboard />,
            },
            {
              path: "category",
              children: [
                {
                  path: "",
                  element: <RetailersCategory />,
                },
                {
                  path: ":category_id",
                  element: <RetailerSubCategory />,
                },
                {
                  path: "add_category",
                  element: <AddCategory />,
                },
              ],
            },
            {
              path: "packaging-material",
              children: [
                {
                  path: "",
                  element: <RetailerPackageingMaterial />,
                },
               
              ],
            },
            {
              path: "retailer-orders",
              children: [
                {
                  path: "",
                  element: <RetailerOrders />,
                },
                {
                  path: ":order_id",
                  element: <OrderDetails />,
                },
              ],
            },
            {
              path: "retailer-sku-units",
              children: [
                {
                  path: "",
                  element: <RetailerSkuUnits />,
                },
                {
                  path: "retailer-sku-import",
                  element: <RetailerSkuImport />,
                },
              ],
            },
            {
              path: "retailer-sku-pricing",
              element: <RetailerSkuPricing />,
            },
            {
              path: "retailer-input-sale-details",
              element: <RetailerSaleDetails />,
            },
            {
              path: "retailer-cancelled-orders",
              element: <RetailerOrderCancelled />,
            },
            {
              path: "retailer-target-achievement",
              element: <RetailerTargetAchievement />,
            },
          ],
        },
      ],
    },
    {
      path: "categories",
      children: [
        {
          path: "",
          element: <Categories />,
        },
        {
          path: ":parent_category_id/products",
          children: [
            { path: "", element: <FilteredProduct /> },
            {
              path: ":sku_id",
              children: [
                {
                  path: "",
                  element: <RetrieveUpdateProduct />,
                },
                {
                  path: "product-more-images",
                  element: <ProductImages />,
                },
                {
                  path: "product-details",
                  element: <ShopProductDetails />,
                },
                {
                  path: "product-language",
                  element: <ProductLanguage />,
                },
              ],
            },
          ],
        },
        {
          path: ":parent_category_id/sub-categories",
          children: [
            { path: "", element: <SubCategories /> },
            {
              path: ":subcategory_id/products",
              children: [
                {
                  path: "",
                  element: <FilteredProduct />,
                },
                {
                  path: ":sku_id",
                  children: [
                    {
                      path: "",
                      element: <RetrieveUpdateProduct />,
                    },
                    {
                      path: "product-more-images",
                      element: <ProductImages />,
                    },
                    {
                      path: "product-details",
                      element: <ShopProductDetails />,
                    },
                    {
                      path: "product-language",
                      element: <ProductLanguage />,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "brands",
      children: [
        {
          path: "",
          element: <Brands />,
        },
        {
          path: "brand-csv-import",
          element: <BrandCsvImport />,
        },
      ],
    },
    {
      path: "ingredients",
      children: [
        {
          path: "",
          element: <Ingredients />,
        },
      ],
    },
    {
      path: "crops",
      children: [
        {
          path: "",
          element: <Crops />,
        },
        {
          path: "crop-csv-import",
          element: <CropCsvImport />,
        },
      ],
    },
    {
      path: "delivery-partners",
      children: [
        {
          path: "",
          element: <DeliveryPartners />,
        },
        {
          path: "new",
          element: <CreateDeliveryPartner />,
        },
        {
          path: "area/:partner_id",
          element: <DeliveryPartnerArea />,
        },
        {
          path: ":partner_id",
          children: [
            {
              path: "",
              element: <RetrieveUpdateDeliveryPartner />,
            },
            {
              path: "dp-retailer",
              element: <DeliveryPartnersRetailer />,
            },
            {
              path: "dp-agents",
              element: <DeliveryAgents />,
            },
            {
              path: "partner-dashboard",
              children: [
                {
                  path: "",
                  element: <DeliveryPartnerDashboard />,
                },
                {
                  path: "partner-orders",
                  children: [
                    { path: "", element: <PartnerOrders /> },
                    {
                      path: ":order_id",
                      element: <OrderDetails />,
                    },
                  ],
                },
                {
                  path: "partner-input-sale-details",
                  element: <PartnerSaleDetails />,
                },
                {
                  path: "partner-cancelled-orders",
                  element: <PartnerCancelledOrders />,
                },
                {
                  path: "partner-upi-payment-log",
                  element: <PartnerUpiPaymentLog />,
                },
                {
                  path: "partner-target-achievement",
                  element: <PartnerTargetAchievement />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "products",
      children: [
        {
          path: "",
          element: <Products />,
        },
        {
          path: "new",
          element: <CreateProducts />,
        },
        {
          path: "product-csv-import",
          children: [
            {
              path: "",
              element: <ProductCsvImport />,
            },
          ],
        },
        {
          path: ":sku_id",
          children: [
            {
              path: "",
              element: <RetrieveUpdateProduct />,
            },
            {
              path: "product-more-images",
              element: <ProductImages />,
            },
            {
              path: "product-details",
              element: <ShopProductDetails />,
            },
            {
              path: "product-language",
              element: <ProductLanguage />,
            },
          ],
        },
      ],
    },
    {
      path: "delivery-charges",
      element: <DeliveryCharges />,
    },
    {
      path: "trending-products",
      element: <TrendingProducts />,
    },
  ],
};
