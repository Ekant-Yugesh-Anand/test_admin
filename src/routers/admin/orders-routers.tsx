import NewOrders from "../../pages/admin/orders/new-orders";
import InProcessOrders from "../../pages/admin/orders/in-process";
import AcceptedOrders from "../../pages/admin/orders/accepted";
import OutForDeliveryOrders from "../../pages/admin/orders/out-for-delivery";
import DeliveredOrders from "../../pages/admin/orders/delivered";
import CancelledOrders from "../../pages/admin/orders/cancelled";
import ReturnOrders from "../../pages/admin/orders/return";
import OrderInvoicePrint from "../../pages/admin/orders/order-invoice";
import OrderDetails from "../../pages/admin/orders/OrderDetails";
import AllOrders from "../../pages/admin/orders/all-orders";
import FailedOrders from "../../pages/admin/orders/failed";
import OrderLog from "../../pages/admin/orders/log";
import WaitingOrder from "../../pages/admin/orders/waiting-orders";

export default {
  path: "/orders",
  children: [
    {
      path: "all-orders",
      element: <AllOrders />,
    },
    {
      path: "new-orders",
      element: <NewOrders />,
    },
    {
      path: "order-invoice-print/:order_id",
      element: <OrderInvoicePrint />,
    },
    {
      path: "order-details/:order_id",
      element: <OrderDetails />,
    },
    {
      path: "orders-accepted",
      element: <AcceptedOrders />,
    },
    {
      path: "waiting-order",
      element: <WaitingOrder />,
    },
    {
      path: "orders-in-progress",
      element: <InProcessOrders />,
    },
    {
      path: "orders-out-for-delivery",
      element: <OutForDeliveryOrders />,
    },
    {
      path: "orders-delivered",
      element: <DeliveredOrders />,
    },
    {
      path: "orders-cancelled",
      element: <CancelledOrders />,
    },
    {
      path: "orders-return",
      element: <ReturnOrders />,
    },
    {
      path: "orders-failed",
      element: <FailedOrders/>,
    },
    {
      path: "log/:order_id",
      element: <OrderLog />,
    },
  

  ],
};
