import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/index.css"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import DashboardLayout from "./layout/DashboardLayout"
import { ThemeProvider } from "./context/theme-provider"
import OverviewPage from "./features/overview"
import TransactionsPage from "./features/transactions"
import CategoriesPage from "./features/categories"
import LoginPage from "./features/login"
import { AlertProvider } from "./context/alert-provider"
import { UserProvider } from "./context/user-provider"
import { PrivateRoute } from "@/routes/private-route"
import { PublicRoute } from "@/routes/public-route"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="overview" replace />,
      },
      {
        path: "overview",
        element: <OverviewPage />,
      },
      {
        path: "transactions",
        element: <TransactionsPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/overview" replace />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <AlertProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AlertProvider>
    </UserProvider>
  </StrictMode>
)
