import { createBrowserRouter, Navigate } from "react-router";
import OnboardingPage from "../pages/onboarding/Onboarding";
import ScanPage from "../pages/scan/Scan";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import CustomerAppLayout from "../layouts/CustomerAppLayout";
import BerandaPage from "../pages/app/Beranda";
import MenuPage from "../pages/app/Menu";
import CartPage from "../pages/app/Cart";
import GamesPage from "../pages/app/Games";
import LoyaltyPage from "../pages/app/Loyalty";
import RewardsPage from "../pages/app/Rewards";
import ChallengesPage from "../pages/app/Challenges";
import ProfilePage from "../pages/app/Profile";
import OrderConfirmationPage from "../pages/app/OrderConfirmation";
import LandingPage from "../pages/landing/LandingPage";

// ─── Placeholder for modules not yet built ────────────────────────────────────
function Placeholder({ name }: { name: string }) {
  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="flex-1 flex flex-col items-center justify-center py-16 gap-3"
    >
      <div className="text-5xl">🎲</div>
      <h1 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-bold text-[#1C1410]">
        {name}
      </h1>
      <p className="text-[#6B4436] text-sm">Modul ini sedang dalam pembangunan</p>
      <div className="bg-[#45A1FD] text-white px-4 py-1.5 rounded-full text-sm">
        Sebangku Board Game Cafe
      </div>
    </div>
  );
}

// ─── Full-page placeholder (for non-app routes) ───────────────────────────────
function PagePlaceholder({ name }: { name: string }) {
  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#EBF5FF] gap-3"
    >
      <div className="text-6xl">🎲</div>
      <h1 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-bold text-[#1C1410]">
        {name}
      </h1>
      <p className="text-[#6B4436] text-sm">Halaman ini sedang dalam pembangunan</p>
      <div className="inline-block bg-[#45A1FD] text-white px-4 py-1.5 rounded-full text-sm">
        Sebangku Board Game Cafe
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  // ── Public routes ────────────────────────────────────────────────────────────
  { path: "/",        element: <LandingPage /> },
  { path: "/scan", element: <ScanPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },

  // ── Customer App (nested layout) ─────────────────────────────────────────────
  {
    path: "/app",
    element: <CustomerAppLayout />,
    children: [
      { index: true, element: <Navigate to="beranda" replace /> },
      { path: "beranda", element: <BerandaPage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "order-confirmation", element: <OrderConfirmationPage /> },
      { path: "games", element: <GamesPage /> },
      { path: "loyalty", element: <LoyaltyPage /> },
      { path: "rewards", element: <RewardsPage /> },
      { path: "challenges", element: <ChallengesPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

export { router };
