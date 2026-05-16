import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    ShoppingBag, Truck, Briefcase, 
    Users, Phone, LayoutDashboard, Settings, User, LogOut,
    Plus, ChevronLeft, Store, Bell, ShieldCheck,
    Sun, Moon, PlaySquare
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../../hooks/useData";
import Logo from "./Logo";

export default function Sidebar() {
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return true;
    });
    const [showNotifs, setShowNotifs] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const { data } = useData();
    const { theme, setTheme } = useTheme();

    const notifications = data?.notifications || [];

    useEffect(() => {
        if (!isVisible) {
            document.body.classList.add("sidebar-hidden");
        } else {
            document.body.classList.remove("sidebar-hidden");
        }
    }, [isVisible]);

    const navLinks = [
        { name: "Tableau de bord", path: "/accueil", icon: LayoutDashboard },
        { name: "Catalogue", path: "/produits", icon: ShoppingBag },
        { name: "Marché", path: "/marché", icon: Store },
        { name: "Services", path: "/services", icon: Briefcase },
        { name: "Vidéos", path: "/videos", icon: PlaySquare },
        { name: "Livraison", path: "/livraison", icon: Truck },
        { name: "Équipe", path: "/equipe", icon: Users },
        { name: "Contact", path: "/contact", icon: Phone },
        { name: "Administration", path: "/admin", icon: ShieldCheck, adminOnly: true },
    ];

    const SidebarContent = ({ showText = false }: { showText?: boolean }) => (
        <div className={`flex flex-col items-center justify-start py-6 rounded-[32px] w-16 bg-transparent border-0 shadow-none ${showText ? 'w-full px-4' : ''}`}>
            
            {/* User Profile in Sidebar */}
            <div className={`flex flex-col items-center mb-4`}>
                <div className={`rounded-full border overflow-hidden ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-10 h-10 object-cover" />
                    ) : (
                        <div className={`w-10 h-10 flex items-center justify-center ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>
                            <User className={theme === 'dark' ? 'text-white/40' : 'text-slate-400'} size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Nav Links */}
            <nav className={`flex flex-col items-center gap-3 w-full shrink-0`}>
                {navLinks.filter(l => !l.adminOnly).map((link) => {
                    const isActive = location.pathname === link.path;
                    const isDarkish = theme === 'dark' || theme === 'green';
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`group flex items-center justify-center w-12 h-12 rounded-full transition-all relative ${isActive ? (isDarkish ? "bg-emerald-900/30 text-emerald-400 font-bold" : "bg-emerald-100 text-emerald-700 font-bold") : (isDarkish ? "text-white/60 hover:bg-white/5" : "text-slate-500 hover:bg-black/5")}`}
                            title={link.name}
                        >
                            <link.icon size={22} />
                        </Link>
                    );
                })}

                {isAdmin && (
                    <div className={`h-px shrink-0 w-8 my-2 ${theme === 'dark' || theme === 'green' ? 'bg-white/5' : 'bg-black/5'}`} />
                )}

                {isAdmin && navLinks.filter(l => l.adminOnly).map((link) => {
                    const isActive = location.pathname === link.path;
                    const isDarkish = theme === 'dark' || theme === 'green';
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`group flex items-center justify-center w-12 h-12 rounded-full transition-all relative ${isActive ? (isDarkish ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700") : (isDarkish ? "text-white/60 hover:bg-white/5" : "text-slate-500 hover:bg-black/5")}`}
                            title={link.name}
                        >
                            <link.icon size={22} />
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 flex flex-col items-center gap-3 shrink-0">
                {/* Theme Switcher Dots */}
                <div className={`flex flex-col gap-2 p-2 rounded-full ${theme === 'dark' || theme === 'green' ? 'bg-white/5' : 'bg-slate-50'}`}>
                    <button 
                        onClick={() => setTheme('light')}
                        className={`w-4 h-4 rounded-full border border-slate-200 bg-white transition-all ${theme === 'light' ? 'scale-125 ring-2 ring-emerald-500 ring-offset-2 ring-offset-transparent' : 'opacity-60 hover:opacity-100'}`}
                        title="Thème Clair"
                    />
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`w-4 h-4 rounded-full border border-slate-700 bg-[#020617] transition-all ${theme === 'dark' ? 'scale-125 ring-2 ring-emerald-500 ring-offset-2 ring-offset-transparent' : 'opacity-60 hover:opacity-100'}`}
                        title="Thème Sombre"
                    />
                    <button 
                        onClick={() => setTheme('green')}
                        className={`w-4 h-4 rounded-full border border-emerald-600 bg-[#1b4332] transition-all ${theme === 'green' ? 'scale-125 ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent' : 'opacity-60 hover:opacity-100'}`}
                        title="Thème Vert Feuille"
                    />
                </div>

                <div className={`h-px w-8 ${theme === 'dark' || theme === 'green' ? 'bg-white/5' : 'bg-black/5'}`} />

                <button 
                    onClick={async () => {
                        await logout();
                        navigate("/auth");
                    }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all text-red-500 hover:bg-red-50`}
                    title="Déconnexion"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop and Mobile Toggle Button */}
            <button 
                onClick={() => setIsVisible(!isVisible)}
                className={`flex fixed bottom-8 lg:bottom-auto lg:top-8 ${isVisible ? 'left-[90px] lg:left-[104px]' : 'left-8'} z-[1100] w-12 h-12 rounded-full lg:rounded-2xl items-center justify-center transition-all duration-500 shadow-2xl group ${theme === 'dark' || theme === 'green' ? 'bg-black/80 backdrop-blur-md border border-white/10 text-white hover:bg-emerald-500 hover:text-white' : 'bg-white border border-slate-200 text-slate-800 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'}`}
                title={isVisible ? "Masquer le menu" : "Afficher le menu"}
            >
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {isVisible ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>

            {/* Application Sidebar */}
            <motion.aside 
                layout
                initial={false}
                animate={{ 
                    x: isVisible ? 0 : -150,
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.9
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="sidebar"
            >
                <SidebarContent />
            </motion.aside>
        </>
    );
}

