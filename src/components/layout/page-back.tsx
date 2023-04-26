import React from "react";
import { Button, Box } from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";

function PageBreadcrumbs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onBack = () => navigate(-1);

  const addMarginTop = React.useMemo(() => {
    const lists = [
      "retailer-dashboard/retailer-orders",
      "partner-dashboard/partner-orders",
      "retailer-dashboard/retailer-sku-units",
      "partner-dashboard/partner-orders",
    ];
    for (const iterator of lists) {
      if (pathname.includes(iterator)) {
        return 10;
      }
    }
    return 1;
  }, [pathname]);

  const backOff = React.useMemo(
    () =>
      new Set([
        "/user/change-password",
        "/management/categories",
        "/management/brands",
        "/management/products",
        "/management/farmers",
        "/management/retailers",
        "/management/delivery-partners",
        "/management/trending-products",
        "/management/delivery-charges",
        "/management/crops",
        "/management/ingredients",
        "/dashboard",
        "/auth0-users",
        "/masters/packages",
        "/masters/units",
        "/masters/areas",
        "/masters/banner",
        "/masters/reason",
        "/masters/languages",
        "/masters/coupon",
        "/masters/notification",
        "/masters/packaging-material",
        "/shopping-cart",
        "/shopping-cart",
        "/shopping-cart",
        "/retailer-report/input-sale-details",
        "/retailer-report/cancelled-orders",
        "/retailer-report/data-sku-pricing",
        "/retailer-report/margin-report",
        "/retailer-report/packaging-material",
        "/orders/all-orders",
        "/orders/new-orders",
        "/orders/orders-accepted",
        "/orders/orders-in-progress",
        "/orders/orders-out-for-delivery",
        "/orders/orders-delivered",
        "/orders/orders-returning",
        "/orders/orders-returned",
        "/orders/orders-cancelled",
        "/orders/orders-failed",
        "/retailer-report/data-sku-unit",
        "/retailer-report/data-sku-pricing",
        "/retailer-report/cancelled-orders",
        "/retailer-report/input-sale-details",
        "/log/order",
        "/log/notification",
      ]),
    []
  );

  return backOff.has(pathname) ? null : (
    <Box mt={addMarginTop} mb={1} mx={2} display="inline" alignSelf="end">
      <Button
        variant="outlined"
        startIcon={<BiArrowBack size={20} />}
        sx={{
          p: 0,
          px: 0.5,
          borderColor: "neutral.200",
          color: "neutral.600",
          "&:hover": {
            borderColor: "neutral.300",
            color: "neutral.800",
          },
        }}
        onClick={onBack}
      >
        Back
      </Button>
    </Box>
  );
}

export default React.memo(PageBreadcrumbs);
