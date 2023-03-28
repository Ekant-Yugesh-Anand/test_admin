import { Navigate, useRoutes } from "react-router-dom";
import NotFound from "../pages/errors/404";
import auth0Routers from "./admin/auth0-routers";
import managementRouters from "./admin/management-routers";
import masterRouters from "./admin/master-routers";
import ordersReportsRouters from "./admin/orders-reports-routers";
import ordersRouters from "./admin/orders-routers";
import AdminProtectedRoute from "./AdminProtectedRoute";
import PublicRouter from "./PublicRouter";
import cartRouters from "./admin/cart-routers";
import Login from "../pages/auth/Login";
import LoginFailed from "../pages/auth/LoginFailed";
import ChangePassword from "../pages/admin/user/change-password";
import { DashboardLayout } from "../components/layout";
import Dashboard from "../pages/admin/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import retailerReport from "./admin/retailer-report";
import logRouters from "./admin/log-routers";

const queryClient = new QueryClient();

export default function AppRouter() {
  const RouteElement = useRoutes([
    {
      path: "/",
      element: (
        <AdminProtectedRoute>
          <DashboardLayout />
        </AdminProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={"/dashboard"} replace />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "user/change-password",
          element: <ChangePassword />,
        },
        auth0Routers,
        managementRouters,
        masterRouters,
        ordersReportsRouters,
        ordersRouters,
        retailerReport,
        cartRouters,
        logRouters
      ],
    },
    {
      path: "/auth/login",
      element: (
        <PublicRouter>
          <Login />
        </PublicRouter>
      ),
    },
    {
      path: "/auth/error",
      element: (
        <PublicRouter>
          <LoginFailed />
        </PublicRouter>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      {RouteElement}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
