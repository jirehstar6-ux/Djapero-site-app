import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    Menu, X, ShoppingBag, Truck, Briefcase, 
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
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [showNotifs, setShowNotifs] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const { data } = useData();
    const { theme, toggleTheme } = useTheme();

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

    const SidebarContent = () => (
        <div className="flex flex-col min-h-full w-full items-center py-0 px-0">
            <div className="sidebar-logo mb-6 shrink-0 relative pt-8">
                <Link to="/accueil" className="transition-transform hover:scale-105 active:scale-95">
                    <Logo size={64} className="rounded-3xl" />
                </Link>
            </div>
            
            <button 
                onClick={toggleTheme}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 border transition-all hover:scale-105 active:scale-95 ${theme === 'light' ? 'bg-black/5 border-black/10 text-black/60 hover:bg-black/10 hover:text-black' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                title={theme === 'light' ? "Passer en mode sombre" : "Passer en mode clair"}
            >
                {theme === 'light' ? <Moon size={22} className="text-[#6aa84f]" /> : <Sun size={22} className="text-[#a3e635]" />}
            </button>

            <nav className="flex flex-col items-center gap-3 w-full shrink-0">
                {navLinks.filter(l => !l.adminOnly).map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`group flex items-center justify-center w-14 h-14 rounded-[20px] transition-all relative ${isActive ? (theme === 'light' ? "bg-[#6aa84f]/15 text-[#6aa84f]" : "bg-[#a3e635]/15 text-[#a3e635]") : (theme === 'light' ? "text-slate-500 hover:text-slate-900 hover:bg-black/5" : "text-white/40 hover:text-white hover:bg-white/5")}`}
                            onClick={() => setIsMobileOpen(false)}
                            title={link.name}
                        >
                            {isActive && (
                                <div className={`absolute left-[-16px] top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-md ${theme === 'light' ? 'bg-[#6aa84f]' : 'bg-[#a3e635]'}`} />
                            )}
                            <link.icon size={28} />
                        </Link>
                    );
                })}

                {isAdmin && (
                    <div className={`w-10 h-px my-3 shrink-0 ${theme === 'light' ? 'bg-black/10' : 'bg-white/10'}`} />
                )}

                {isAdmin && navLinks.filter(l => l.adminOnly).map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`group flex items-center justify-center w-14 h-14 rounded-[20px] transition-all relative border border-green-500/10 hover:bg-green-500/5 ${isActive ? (theme === 'light' ? "bg-green-500/20 text-[#6aa84f]" : "bg-green-500/20 text-[#a3e635]") : (theme === 'light' ? "text-green-600/40 hover:text-green-600" : "text-green-400/40 hover:text-green-400")}`}
                            onClick={() => setIsMobileOpen(false)}
                            title={link.name}
                        >
                            {isActive && (
                                <div className={`absolute left-[-16px] top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-md ${theme === 'light' ? 'bg-[#6aa84f]' : 'bg-[#a3e635]'}`} />
                            )}
                            <link.icon size={28} />
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-10 pb-4 flex flex-col items-center gap-6 shrink-0">
                {user && (
                    <div className={`w-12 h-12 rounded-full border overflow-hidden ring-4 ${theme === 'light' ? 'border-black/20 ring-black/5' : 'border-white/20 ring-white/5'}`}>
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'bg-black/10' : 'bg-white/10'}`}>
                                <User className={theme === 'light' ? 'text-black/40' : 'text-white/40'} size={24} />
                            </div>
                        )}
                    </div>
                )}
                <button 
                    onClick={async () => {
                        await logout();
                        navigate("/auth");
                    }}
                    className="flex items-center justify-center w-14 h-14 rounded-[20px] transition-all relative text-red-500/50 hover:text-red-500 hover:bg-red-500/5"
                    title="Déconnexion"
                >
                    <LogOut size={28} />
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Toggle Button */}
            <button 
                onClick={() => setIsVisible(!isVisible)}
                className={`hidden lg:flex fixed top-8 ${isVisible ? 'left-[104px]' : 'left-8'} z-[1100] w-12 h-12 rounded-2xl items-center justify-center transition-all duration-500 shadow-2xl group ${theme === 'light' ? 'bg-white border border-slate-200 text-slate-800 hover:bg-[#6aa84f] hover:text-white hover:border-[#6aa84f]' : 'bg-[#020617] border border-white/10 text-white hover:bg-[#a3e635] hover:text-black hover:shadow-[0_0_30px_rgba(163,230,53,0.3)]'}`}
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
                                <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
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

            {/* Desktop Sidebar */}
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

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-[#020617] shadow-sm border-b border-white/5 flex items-center justify-between px-6 z-50">
                <Link to="/accueil" className="text-xl font-[1000] text-white flex items-center gap-4 tracking-tighter uppercase">
                    <Logo size={48} className="rounded-2xl" />
                    Djapero
                </Link>
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100/50 active:scale-95 transition-transform"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-[1000]"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside 
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="sidebar fixed top-0 left-0 h-full w-[280px] z-[1001] antialiased"
                        >
                            <button 
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

