// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import LoginPage from './pages/login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/protectedRoute'
import PublicRoute from './components/publicRoute'
import DashboardLayout from './layouts/dashboardLayout'
import TransactionsPage from './pages/transactions'
import SettingsPage from './pages/settings'
import { CategoryProvider } from './contexts/categoryContext'
import { TransactionsProvider } from './contexts/transactionsContext'
import { UserProvider } from './contexts/userContext'
import DashboardPage from './pages/dashboard'




const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element:
          <UserProvider>
            <CategoryProvider>
              <TransactionsProvider>
                <DashboardLayout />
              </TransactionsProvider>
            </CategoryProvider>
          </UserProvider>,
        children: [
          { path: "/", element: <DashboardPage/>},
          { path: "/transactions", element: <TransactionsPage /> },
          { path: "/settings", element: <SettingsPage /> },
        ]
      },
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // {/* </StrictMode>, */}
)
