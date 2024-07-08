import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./index.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import store from "./store";
import UserHomePage from "./pages/UserHomePage";
import PrivateRoute from "./components/PrivateRoute";
import NotificationsPage from "./pages/NotificationsPage";
import BookingPage from "./pages/BookingPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ForgotPasswordPage from "./pages/ResetPassword/ForgotPasswordPage.jsx";
import VerificationPage from "./pages/VerificationPage.jsx";
import VerifyEmailPage from "./pages/ResetPassword/VerifyEmailPage.jsx";
import UpdatePasswordPage from "./pages/ResetPassword/UpdatePasswordPage.jsx";
import MaintenanceListPage from "./pages/MaintenanceListPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminHomePage from "./pages/admin/AdminHomePage.jsx";
import AdminPaymentPage from "./pages/admin/AdminPaymentPage.jsx";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage.jsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.jsx";
import MechanicHomePage from "./pages/MechanicHomePage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpw" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerificationPage />} />
      <Route path="/verifypw" element={<VerifyEmailPage />} />
      <Route path="/updatepw" element={<UpdatePasswordPage />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/userHomePage" element={<UserHomePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/list" element={<MaintenanceListPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/mechanicHomePage" element={<MechanicHomePage />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/adminHomePage" element={<AdminHomePage />} />
        <Route path="/adminPaymentPage" element={<AdminPaymentPage />} />
        <Route path="/adminFeedbackPage" element={<AdminFeedbackPage />} />
        <Route path="/adminSettingsPage" element={<AdminSettingsPage />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
