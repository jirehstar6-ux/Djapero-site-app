import { Link, useLocation } from "react-router-dom";
import { 
    Leaf, Menu, X, ShoppingBag, Truck, Briefcase, 
    Users, Phone, LayoutDashboard, Settings, User, LogOut,
    Plus, PanelLeftClose, PanelLeftOpen, Store, Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../../hooks/useData";

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const { data } = useData();

    const notifications = data?.notifications || [];

    useEffect(() => {
        if (isCollapsed) {
            document.body.classList.add("sidebar-collapsed");
        } else {
            document.body.classList.remove("sidebar-collapsed");
        }
    }, [isCollapsed]);

    const navLinks = [
        { name: "Tableau de bord", path: "/", icon: LayoutDashboard },
        { name: "Boutique", path: "/produits", icon: ShoppingBag },
        { name: "Marché", path: "/marché", icon: Store },
        { name: "Livraison", path: "/livraison", icon: Truck },
        { name: "Expertises", path: "/services", icon: Briefcase },
        { name: "Équipe", path: "/equipe", icon: Users },
        { name: "Contact", path: "/contact", icon: Phone },
        { name: "Paramètres", path: "/admin", icon: Settings },
    ];

    const SidebarContent = () => (
        <>
            <button 
                className="sidebar-toggle-btn hidden lg:flex group" 
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute -left-1 w-1 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isCollapsed ? (
                        <PanelLeftOpen size={20} className="text-emerald-600 transition-transform group-hover:scale-110" />
                    ) : (
                        <PanelLeftClose size={20} className="text-emerald-600 transition-transform group-hover:scale-110" />
                    )}
                </div>
            </button>

            <div className="sidebar-logo flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded-full shrink-0 ring-2 ring-white/5 border border-white/10 overflow-hidden w-12 h-12">
                    <img src="/uploads/djapero-logo.jpg" alt="Logo" className="w-full h-full object-cover scale-110" />
                </div>
                <motion.span 
                    initial={false}
                    animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
                    className="whitespace-nowrap overflow-hidden"
                >
                    Djapero.
                </motion.span>
            </div>

            <div className="px-6 mb-6">
                <button 
                    onClick={() => setShowNotifs(!showNotifs)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group overflow-hidden ${showNotifs ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                    <div className="relative">
                        <Bell size={20} className={notifications.length > 0 ? "animate-bounce" : ""} />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-emerald-900" />
                        )}
                    </div>
                    {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest text-white/70">Notifications</span>}
                </button>

                <AnimatePresence>
                    {showNotifs && !isCollapsed && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 space-y-2 max-h-48 overflow-y-auto no-scrollbar"
                        >
                            {notifications.length === 0 ? (
                                <p className="text-[10px] text-white/30 text-center py-4 uppercase font-black">Aucune alerte</p>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[10px] font-black uppercase text-emerald-400 mb-1">{notif.title}</p>
                                        <p className="text-[9px] text-white/60 line-clamp-2">{notif.message}</p>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button className="btn-upload-new">
                <Plus size={24} />
                {!isCollapsed && <span className="ml-2">Nouveau</span>}
            </button>

            <nav className="sidebar-nav">
                {!isCollapsed && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-6 mb-4">Menu Principal</p>}
                {navLinks.slice(0, 6).map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`sidebar-link ${isActive ? "active" : ""}`}
                            onClick={() => setIsMobileOpen(false)}
                            title={isCollapsed ? link.name : ""}
                        >
                            <link.icon size={20} className="shrink-0" />
                            {!isCollapsed && <span className="tracking-tight">{link.name}</span>}
                        </Link>
                    );
                })}

                {!isCollapsed && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-6 mt-8 mb-4">Assistance & Admin</p>}
                {navLinks.slice(6).map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`sidebar-link ${isActive ? "active" : ""}`}
                            onClick={() => setIsMobileOpen(false)}
                            title={isCollapsed ? link.name : ""}
                        >
                            <link.icon size={20} className="shrink-0" />
                            {!isCollapsed && <span className="tracking-tight">{link.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                {/* User Profile Card */}
                <div className={`flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/5 ${isCollapsed ? 'justify-center p-2' : ''}`}>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <User className="text-white" size={20} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">{user?.displayName || (user?.email?.split('@')[0]) || "Invité"}</p>
                            <p className="text-[10px] text-white/50 truncate font-bold uppercase tracking-widest">{user?.email || "Djapero Group"}</p>
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <div className="sidebar-promo-card">
                        <h3 className="font-bold text-xs uppercase tracking-tighter">Premium</h3>
                        <p className="text-[10px] opacity-70 mb-3">Accédez à toutes les fonctionnalités.</p>
                        <button className="bg-white text-emerald-600 w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95">Upgrade</button>
                    </div>
                )}

                <button 
                    onClick={logout}
                    className={`w-full flex items-center gap-4 px-6 py-3 rounded-full font-bold text-white/70 hover:text-white transition-all text-sm mt-2 hover:bg-white/5 ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? "Déconnexion" : ""}
                >
                    <LogOut size={18} className="shrink-0" /> {!isCollapsed && <span>Déconnexion</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`sidebar hidden lg:flex ${isCollapsed ? 'collapsed' : ''}`}>
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-6 z-50">
                <Link to="/" className="text-2xl font-black text-[#0f172a] flex items-center gap-3 tracking-tighter">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-500/10 overflow-hidden ring-2 ring-emerald-500/5">
                        <img src="/uploads/djapero-logo.jpg" alt="Logo" className="w-full h-full object-cover scale-110" />
                    </div>
                    Djapero.
                </Link>
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100/50 active:scale-95 transition-transform"
                >
                    <Menu size={20} />
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

