/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import SuccessAnimation from "./components/SuccessAnimation";
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
import { useEffect } from "react";
import { db, auth } from "./lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./lib/firestore-errors";

function AppContent() {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/auth";
  const isAdminPage = location.pathname.toLowerCase().startsWith("/admin");
  const isHomePage = location.pathname === "/accueil";
  const isBienvenuePage = location.pathname === "/bienvenue";

  // Visit Logger

  useEffect(() => {
    const logVisit = async () => {
      // Don't log if we're still loading or if the user is an admin
      if (loading || isAdmin) return;
      
      const pathForWrite = "visits";
      try {
        await addDoc(collection(db, pathForWrite), {
          userId: user?.uid || null,
          email: user?.email || null,
          path: location.pathname,
          userAgent: window.navigator.userAgent,
          createdAt: Date.now()
        });
      } catch (error) {
        // Only log to console, don't throw to avoid crashing the app
        try {
          handleFirestoreError(auth, error, OperationType.CREATE, pathForWrite);
        } catch (wrappedError) {
          console.error("Visit Logging Error:", wrappedError);
        }
      }
    };
    
    // Slight delay to ensure auth and page state are stable
    const timer = setTimeout(logVisit, 3000);
    return () => clearTimeout(timer);
  }, [location.pathname, user?.uid, user?.email, isAdmin, loading]);

  // Global Redirect Effect
  useEffect(() => {
    if (!loading && user) {
      if (!profile && !isAdmin && !isAuthPage && !isBienvenuePage) {
        navigate("/auth");
      }
    } else if (!loading && !user && !isAuthPage && !isBienvenuePage) {
      navigate("/auth");
    }
  }, [user, profile, isAdmin, loading, location.pathname, navigate, isAuthPage, isBienvenuePage]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.1)]"></div>
        <div className="space-y-2">
          <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Djapero Group Initialisation (v1.2)...</p>
          <p className="text-gray-300 text-[8px] font-bold uppercase tracking-widest italic">Attente de la connexion sécurisée</p>
        </div>
        
        {/* Force Bypass for network issues */}
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 rounded-full border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all text-[8px] font-black uppercase tracking-widest"
        >
          Si bloqué, cliquez pour recharger
        </button>
      </div>
    </div>
  );

  const hideLayout = isAuthPage || isAdminPage || isBienvenuePage;
  const hideFooter = isAuthPage || isAdminPage || isBienvenuePage;

  return (
    <div className="app-layout">
      {!hideLayout && <Navbar />}
      <div className={hideLayout ? "w-full" : "main-wrapper"}>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/bienvenue" /> : <Navigate to="/accueil" />} />
            <Route path="/accueil" element={<Home />} />
            <Route path="/bienvenue" element={<SuccessAnimation isAdmin={!!isAdmin} />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/livraison" element={<Delivery />} />
            <Route path="/marché" element={<Market />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/" />} />
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

