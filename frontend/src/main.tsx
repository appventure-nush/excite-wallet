import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme";

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import LoginPage from "./routes/login";
import StudentMainPage from "./routes/student_main_view";
import StudentTopupPage from "./routes/student_topup";
import StudentPaymentPage from "./routes/student_payment_view";
import BoothMainPage from "./routes/booth_main_view";
import BoothConfirmPaymentPage from "./routes/booth_confirm_payment_view";
import AdminPage from "./routes/admin_view";
import UserProvider from "./UserProvider";
import StudentTransactionHistoryPage from "./routes/student_transactions_view";
import StudentTopupHistoryPage from "./routes/student_topups_view";
import AdminAddPage from "./routes/admin_add_account";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Outlet />
      </UserProvider>
    ),
    children: [
      {
        path: "/",
        element: <LoginPage />,
        index: true,
      },
      {
        path: "/student",
        element: <StudentMainPage />,
      },
      {
        path: "/student/topup",
        element: <StudentTopupPage />,
      },
      {
        path: "/student/payment",
        element: <StudentPaymentPage />,
      },
      {
        path: "/student/transactions",
        element: <StudentTransactionHistoryPage />,
      },
      {
        path: "/student/topups",
        element: <StudentTopupHistoryPage />,
      },
      {
        path: "/booth",
        element: <BoothMainPage />,
      },
      {
        path: "/booth/payment",
        element: <BoothConfirmPaymentPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/admin/add",
        element: <AdminAddPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
