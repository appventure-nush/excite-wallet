import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from './theme'

import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import LoginPage from './routes/login'
import StudentMainPage from './routes/student_main_view'
import StudentTopupPage from './routes/student_topup'
import StudentPaymentPage from './routes/student_payment_view'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
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
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
