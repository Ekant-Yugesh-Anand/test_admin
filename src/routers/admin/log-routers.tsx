import AllOrderLog from "../../pages/admin/log/all-order-log";
import NotificationLog from "../../pages/admin/log/notification-log";

export default {
  path: "/log",
  children: [
    {
      path: "order",
      element: <AllOrderLog />,
    },
    {
        path: "notification",
        element: <NotificationLog />,
      },
  

  ],
};
