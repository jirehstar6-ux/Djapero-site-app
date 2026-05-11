/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Delivery from "./pages/Delivery";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Market from "./pages/Market";
import Videos from "./pages/Videos";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import InstallPWA from "./components/InstallPWA";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function AppContent() {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const isIntroPage = location.pathname === "/";
  const isHomePage = location.pathname === "/accueil";
  const isAuthPage = location.pathname === "/auth";
  const isAdminPage = location.pathname.startsWith("/admin");

  // Force onboarding if logged in but no profile (unless admin)
  if (user && !profile && !isAdmin && !isAuthPage && !isHomePage && !isIntroPage) {
    return <Navigate to="/auth" />;
  }

  // Force login for everything else
  if (!user && !isHomePage && !isAuthPage && !isIntroPage) {
    return <Navigate to="/accueil" />;
  }

  // Show Navbar and Sidebar ONLY if the user is authenticated and not on special pages
  const isLandingPage = isHomePage && !user;
  const hideLayout = isIntroPage || isLandingPage || isAuthPage || isAdminPage;
  const hideFooter = isIntroPage || isAuthPage || isAdminPage;

  return (
    <div className="app-layout">
      {!hideLayout && <Navbar />}
      <div className={hideLayout ? "w-full" : "main-wrapper"}>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/accueil" element={<Home />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/livraison" element={<Delivery />} />
            <Route path="/marché" element={<Market />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={user ? <Admin /> : <Navigate to="/" />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {!hideFooter && <Footer />}
        <InstallPWA />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

