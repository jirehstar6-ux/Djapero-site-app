import { useState, useEffect } from "react";
import { useData } from "../hooks/useData";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
    ShoppingBag, 
    Store, 
    Briefcase, 
    Video, 
    Truck, 
    Users, 
    Sparkles, 
    ArrowRight,
    Search,
    Bell,
    Settings as SettingsIcon,
    LayoutDashboard
} from "lucide-react";

export default function Home() {
    const { data, loading } = useData();
    const { user, profile, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    if (loading || !data) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
            <div className="w-12 h-12 border-4 border-[#a3e635] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const navItems = [
        { 
            name: "Catalogue", 
            path: "/produits", 
            icon: ShoppingBag, 
            color: "from-blue-500 to-blue-600", 
            count: data.products?.length || 0,
            desc: "Découvrez nos produits frais"
        },
        { 
            name: "Marché", 
            path: "/marché", 
            icon: Store, 
            color: "from-emerald-500 to-emerald-600", 
            count: data.marketProducts?.length || 0,
            desc: "Le meilleur de nos producteurs"
        },
        { 
            name: "Services", 
            path: "/services", 
            icon: Briefcase, 
            color: "from-purple-500 to-purple-600", 
            count: data.services?.length || 0,
            desc: "Solutions sur mesure"
        },
        { 
            name: "Vidéos", 
            path: "/videos", 
            icon: Video, 
            color: "from-red-500 to-red-600", 
            count: data.videos?.length || 0,
            desc: "Djapero en action"
        },
        { 
            name: "Livraison", 
            path: "/livraison", 
            icon: Truck, 
            color: "from-amber-500 to-amber-600",
            desc: "Suivez vos colis en direct"
        },
        { 
            name: "Équipe", 
            path: "/equipe", 
            icon: Users, 
            color: "from-indigo-500 to-indigo-600", 
            count: data.team?.length || 0,
            desc: "Rencontrez les experts"
        },
    ];

    return (
        <div className="min-h-screen bg-[#f7f8fa] font-sans overflow-x-hidden">
            {/* Top Bar Navigation */}
            <div className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-10 fixed top-0 z-40">
                <div className="flex items-center gap-2">
                    {data.settings?.logoUrl ? (
                         <img src={data.settings.logoUrl} className="h-8 w-auto object-contain" alt="Djapero Logo" />
                    ) : (
                        <div className="w-10 h-10 bg-[#a3e635] rounded-xl flex items-center justify-center text-[#0f172a] shadow-lg shadow-[#a3e635]/20">
                            <ShoppingBag size={20} strokeWidth={2.5} />
                        </div>
                    )}
                    <span className="font-black uppercase tracking-tighter text-slate-900 hidden sm:block">Djapero Dashboard</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64' : 'w-10'}`}>
                        <button 
                            onClick={() => {
                                if (isSearchOpen && searchQuery) {
                                    navigate(`/produits?q=${encodeURIComponent(searchQuery)}`);
                                } else {
                                    setIsSearchOpen(!isSearchOpen);
                                }
                            }}
                            className={`p-2 transition-colors relative z-10 ${isSearchOpen ? 'text-[#a3e635]' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            <Search size={20} />
                        </button>
                        <input 
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && navigate(`/produits?q=${encodeURIComponent(searchQuery)}`)}
                            className={`absolute right-0 bg-slate-50 border border-slate-100 rounded-full py-2 pl-4 pr-10 outline-none text-xs font-bold transition-all duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0 scale-90 pointer-events-none'}`}
                        />
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
                        <Bell size={20} />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                    <button 
                        onClick={() => navigate("/admin")}
                        className="p-2 text-slate-400 hover:text-[#a3e635] transition-colors"
                    >
                        <SettingsIcon size={20} />
                    </button>
                </div>
            </div>

            <main className="w-full pt-28 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
                {/* Hero Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 shadow-xl shadow-slate-200 overflow-hidden">
                                {data.settings?.logoUrl ? (
                                    <img src={data.settings.logoUrl} alt="Djapero" className="w-full h-auto object-contain" />
                                ) : (
                                    <ShoppingBag className="text-[#a3e635]" size={24} />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#a3e635] text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Espace Membre</span>
                                <span className="text-slate-900 text-[11px] font-black uppercase tracking-tighter">Tableau de bord</span>
                            </div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#0f172a] uppercase leading-none">
                            Salut, <span className="text-[#a3e635]">{profile?.fullName?.split(' ')[0] || user?.email?.split('@')[0]}</span>
                        </h2>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6"
                        >
                            <button 
                                onClick={() => navigate("/bienvenue")}
                                className="flex items-center gap-4 bg-white border border-slate-200 text-slate-800 font-black px-8 py-5 rounded-[24px] hover:bg-slate-50 active:scale-95 transition-all shadow-xl shadow-slate-200/50 text-sm uppercase tracking-[0.1em] group"
                            >
                                <Sparkles size={22} className="text-[#a3e635] group-hover:scale-125 transition-transform" />
                                Revoir l'accueil Djapero
                            </button>
                        </motion.div>

                        <p className="mt-8 text-slate-500 font-medium text-lg leading-relaxed max-w-xl">
                            Ravi de vous revoir. Votre écosystème Djapero est synchronisé et prêt à l'emploi. 
                            Explorez vos services ci-dessous.
                        </p>
                    </motion.div>
                </div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 h-full">
                    {/* Big Stats / Welcome Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-4 bg-[#0f172a] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200/50 min-h-[300px] flex flex-col justify-between"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-[#a3e635] rounded-2xl flex items-center justify-center text-[#0f172a] mb-8 shadow-lg shadow-[#a3e635]/20">
                                <LayoutDashboard size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-4">
                                Performance <br /><span className="text-[#a3e635]">Djapero Group</span>
                            </h3>
                            <p className="text-slate-400 max-w-sm text-sm md:text-base font-medium">
                                Visualisez l'état global de vos opérations et accédez à vos outils privilégiés en un clic.
                            </p>
                        </div>

                        <div className="flex gap-8 relative z-10 pt-8 border-t border-white/5">
                            <div>
                                <div className="text-3xl font-black text-[#a3e635]">{data.products?.length || 0}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Produits</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white">{data.services?.length || 0}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Établissements</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white">2.4k</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Visites</div>
                            </div>
                        </div>

                        {/* Background Visual Elements */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#a3e635]/10 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-1000">
                             {data.settings?.logoUrl ? (
                                 <img src={data.settings.logoUrl} className="w-48 grayscale invert brightness-0" alt="" />
                             ) : (
                                 <ShoppingBag size={80} className="text-white opacity-20" />
                             )}
                        </div>
                    </motion.div>

                    {/* Compact Action Items */}
                    {navItems.map((item, idx) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className={`${idx < 2 ? 'lg:col-span-2' : 'lg:col-span-3'} group rounded-[32px] bg-white border border-white shadow-sm hover:shadow-xl hover:border-[#a3e635]/20 transition-all duration-500 cursor-pointer overflow-hidden p-8 flex flex-col justify-between`}
                            onClick={() => navigate(item.path)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                                    <item.icon size={24} />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                                    <ArrowRight size={18} className="text-slate-900" />
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{item.name}</h4>
                                    {item.count !== undefined && (
                                        <span className="text-xs font-bold text-[#a3e635] bg-[#a3e635]/10 px-2 py-0.5 rounded-full">{item.count}</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Quick Setting Card */}
                    {isAdmin && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="lg:col-span-3 bg-slate-900 rounded-[32px] p-8 text-white flex items-center justify-between group cursor-pointer hover:bg-black transition-colors"
                            onClick={() => navigate("/admin")}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                                    <SettingsIcon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase tracking-tighter">Configuration</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Paramètres Système</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-slate-600 group-hover:text-[#a3e635] transition-colors" />
                        </motion.div>
                    )}

                    {/* User profile at the bottom */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="lg:col-span-6 bg-white border border-slate-100 rounded-[32px] p-6 flex items-center justify-between mt-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full border-4 border-[#a3e635]/10 overflow-hidden bg-slate-50 shadow-inner">
                                {profile?.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg font-black text-slate-400">
                                        {profile?.fullName?.charAt(0) || user?.email?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">
                                    {profile?.fullName || user?.email?.split('@')[0]}
                                </h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compte actif • {user?.email}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate("/auth")}
                            className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-slate-100"
                        >
                            Gérer le compte
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
