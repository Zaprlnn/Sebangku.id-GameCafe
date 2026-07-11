import { createBrowserRouter, Navigate } from "react-router";
import OnboardingPage from "../pages/onboarding/Onboarding";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import LandingPage from "../pages/landing/LandingPage";
import CustomerPage from "../pages/app/Customer";
import OwnerPage from "../pages/app/OwnerApp";
import KasirPage from "../pages/app/Kasir";

const router = createBrowserRouter([
  // ── Public routes ────────────────────────────────────────────────────────────
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },

  // ── App Roles Routes ─────────────────────────────────────────────────────────
  {
    path: "/app",
    children: [
      { index: true, element: <Navigate to="customer" replace /> },
      { path: "customer/*", element: <CustomerPage /> },
      { path: "owner/*",    element: <OwnerPage /> },
      { path: "kasir/*",    element: <KasirPage /> },
    ],
  },
]);

export { router };
