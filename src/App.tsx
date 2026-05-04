/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Delivery from "./pages/Delivery";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Market from "./pages/Market";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="app-layout">
      {!isAdminPage && <Navbar />}
      <div className={isAdminPage ? "w-full" : "main-wrapper"}>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/livraison" element={<Delivery />} />
            <Route path="/marché" element={<Market />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={user ? <Admin /> : <Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {!isAdminPage && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

