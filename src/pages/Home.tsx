import { Heart, MessageCircle, ChevronRight, ArrowRight, Star, ShoppingBag, Plus, Play, Bell, Mail, Search, Volume2, VolumeX, MousePointer2, Zap, LayoutDashboard, Store, Truck, Briefcase, Activity } from "lucide-react";
import { useData } from "../hooks/useData";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Landing from "../components/Landing";
import Logo from "../components/layout/Logo";
import "../css/dashboard.css";
import React from "react";

import { useTheme } from "../context/ThemeContext";

export default function Home() {
    const { data, loading } = useData();
    const { user, profile } = useAuth();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

    if (loading || !data) return (
        <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center">
            <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-32 h-32 bg-[#22c55e] rounded-full blur-3xl opacity-20"
            />
            <div className="relative">
                <Logo size={120} className="rounded-[2.5rem] shadow-[0_0_50px_rgba(34,197,94,0.3)] transition-transform animate-pulse" />
            </div>
            <p className="mt-12 text-white/40 font-black uppercase tracking-[0.8em] text-[10px] animate-pulse pl-[0.8em]">Djapero</p>
        </div>
    );

    // If guest, show the Landing Page
    if (!user) {
        return <Landing />;
    }

    const products = data?.products || [];
    const marketItems = data?.marketItems || [];

    const stats = [
        { label: "Commandes", value: "24", icon: ShoppingBag, color: "text-[#a3e635]" },
        { label: "Activité", value: "Premium", icon: Activity, color: "text-emerald-400" },
        { label: "Récompenses", value: "1250 pts", icon: Star, color: "text-amber-400" },
    ];

    return (
        <div className={`min-h-screen pb-20 relative overflow-hidden transition-colors duration-500 ${isLight ? 'bg-[#f8fafc] text-slate-900 selection:bg-[#6aa84f] selection:text-white' : 'bg-[#020617] text-white selection:bg-[#a3e635] selection:text-black'}`}>
            
            {/* DYNAMIC BACKGROUND (WAVVA STYLE) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-mesh ${isLight ? 'bg-[#6aa84f]/20' : 'bg-[#a3e635]/10'}`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] animate-mesh ${isLight ? 'bg-[#274e13]/10' : 'bg-[#064e3b]/20'}`} style={{ animationDelay: '-5s' }} />
            </div>

            {/* DASHBOARD HEADER */}
            <header className="relative pt-32 pb-20 px-6 md:px-12">
                <div className={`absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b pointer-events-none ${isLight ? 'from-[#6aa84f]/10 to-transparent' : 'from-[#a3e635]/5 to-transparent'}`} />
                <div className={`absolute top-20 right-20 w-64 h-64 rounded-full blur-[100px] animate-pulse ${isLight ? 'bg-[#6aa84f]/20' : 'bg-[#a3e635]/10'}`} />

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`px-3 py-1 border rounded-full ${isLight ? 'bg-[#6aa84f]/10 border-[#6aa84f]/30' : 'bg-[#a3e635]/10 border-[#a3e635]/20'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-[#6aa84f]' : 'text-[#a3e635]'}`}>Espace Membre</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-white/20'}`}>Connecté en tant que {profile?.fullName || user.email}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-[1000] uppercase tracking-tighter leading-none">
                                HELLO, <br/>
                                <span className={isLight ? 'text-[#6aa84f]' : 'text-[#a3e635]'}>{profile?.fullName?.split(' ')[0] || "UTILISATEUR"}</span>
                            </h1>
                        </motion.div>

                        <div className={`grid grid-cols-3 gap-4 md:gap-8 backdrop-blur-xl border p-6 md:p-8 rounded-[2.5rem] shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center md:text-left">
                                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                        <stat.icon size={14} className={isLight ? 'text-[#6aa84f]' : stat.color} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{stat.label}</span>
                                    </div>
                                    <p className={`text-xl md:text-2xl font-[1000] uppercase tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTIONS QUICK ACCESS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Marketplace", icon: Store, path: "/marché", color: isLight ? "bg-[#6aa84f] text-white shadow-lg" : "bg-[#a3e635] text-black" },
                            { name: "Catalogue", icon: ShoppingBag, path: "/produits", color: isLight ? "bg-white border-black/10 text-black shadow-sm" : "bg-white/5 border-white/10 text-white" },
                            { name: "Services", icon: Briefcase, path: "/services", color: isLight ? "bg-white border-black/10 text-black shadow-sm" : "bg-white/5 border-white/10 text-white" },
                            { name: "Livraison", icon: Truck, path: "/livraison", color: isLight ? "bg-white border-black/10 text-black shadow-sm" : "bg-white/5 border-white/10 text-white" },
                        ].map((action, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => navigate(action.path)}
                                className={`flex flex-col items-center justify-center p-8 rounded-[3rem] transition-all group ${action.color} border hover:scale-105 active:scale-95`}
                            >
                                <action.icon size={32} className={`mb-4 group-hover:scale-110 transition-transform ${isLight && action.name !== 'Marketplace' ? 'text-black' : ''}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isLight && action.name !== "Marketplace" ? "text-black/60" : ""}`}>{action.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-32">
                {/* EXPLORE SECTION */}
                <section className={`relative p-8 md:p-16 border rounded-[4rem] md:rounded-[6rem] backdrop-blur-3xl overflow-hidden group/section transition-colors duration-500 shadow-2xl ${isLight ? 'bg-white/40 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 ${isLight ? 'bg-[#6aa84f]/10' : 'bg-[#a3e635]/5'}`} />
                    <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 ${isLight ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`} />
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`w-12 h-1 rounded-full ${isLight ? 'bg-[#6aa84f]' : 'bg-[#a3e635]'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isLight ? 'text-[#6aa84f]' : 'text-[#a3e635]'}`}>Marché Djapero</span>
                            </div>
                            <h3 className={`text-4xl md:text-6xl font-[1000] uppercase tracking-tighter leading-none mb-4 ${isLight ? 'text-slate-900' : ''}`}>Sélection <span className={isLight ? 'text-[#6aa84f]' : 'text-[#a3e635]'}>Premium</span></h3>
                            <p className={`text-base font-bold uppercase tracking-widest text-[10px] ${isLight ? 'text-slate-500' : 'text-white/40'}`}>Découvrez nos arrivages hebdomadaires certifiés qualité.</p>
                        </div>
                        <button 
                            onClick={() => navigate("/produits")} 
                            className={`group/btn relative px-10 py-4 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg ${isLight ? 'bg-white border border-slate-200' : 'bg-white'}`}
                        >
                            <span className="relative z-10">Tout explorer</span>
                            <div className={`absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ${isLight ? 'bg-[#6aa84f]' : 'bg-[#a3e635]'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                        {products.length > 0 ? products.slice(0, 3).map((product: any, idx: number) => (
                            <motion.div 
                                key={product.id}
                                whileHover={{ y: -10 }}
                                className={`group cursor-pointer border rounded-[3rem] p-6 transition-all relative flex flex-col shadow-2xl ${isLight ? 'bg-white border-slate-200 hover:bg-slate-50 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]' : 'bg-[#0f172a] border-white/5 hover:bg-[#131d33] hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)]'}`}
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden mb-8">
                                    <img 
                                        src={product.imageUrl || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2"} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt={product.name}
                                    />
                                    <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg ${isLight ? 'bg-[#6aa84f] text-white' : 'bg-[#a3e635] text-black'}`}>
                                        NOUVEAU
                                    </div>
                                </div>
                                <div className="px-2 pb-2 flex-grow">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`text-2xl font-black uppercase tracking-tighter truncate max-w-[70%] ${isLight ? 'text-slate-900' : 'text-white'}`}>{product.name}</h4>
                                        <span className={`text-2xl font-black italic tracking-tighter ${isLight ? 'text-[#6aa84f]' : 'text-[#a3e635]'}`}>{product.price}</span>
                                    </div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-8 ${isLight ? 'text-slate-400' : 'text-white/20'}`}>{product.category}</p>
                                    
                                    <button className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl ${isLight ? 'bg-slate-900 text-white hover:bg-[#6aa84f]' : 'bg-white text-black hover:bg-[#a3e635]'}`}>
                                        Détails du Produit
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className={`col-span-full py-20 text-center rounded-[3rem] border border-dashed font-black uppercase tracking-[0.4em] ${isLight ? 'bg-white border-slate-300 text-slate-400' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                Chargement des exclusivités...
                            </div>
                        )}
                    </div>
                </section>

                {/* BOTTOM CTA */}
                <section className={`rounded-[4rem] p-12 md:p-24 overflow-hidden relative group transition-colors duration-500 shadow-2xl ${isLight ? 'bg-[#6aa84f] text-white' : 'bg-[#a3e635] text-black'}`}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl text-center md:text-left">
                            <h2 className="text-4xl md:text-6xl font-[1000] uppercase tracking-tighter leading-[0.9] mb-6">Besoin d'un service <br/> sur-mesure ?</h2>
                            <p className={`text-lg font-bold ${isLight ? 'text-white/80' : 'text-black/60'}`}>Contactez notre équipe d'experts pour vos projets agricoles ou de communication.</p>
                        </div>
                        <button className={`px-16 py-8 rounded-3xl font-[1000] uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all ${isLight ? 'bg-white text-[#274e13]' : 'bg-black text-white'}`}>
                            Démarrer un projet
                        </button>
                    </div>
                </section>
            </div>

            {/* PRODUCT MODAL */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl ${isLight ? 'bg-white/80' : 'bg-black/90'}`}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`w-full max-w-4xl rounded-[4rem] overflow-hidden border shadow-2xl flex flex-col md:flex-row ${isLight ? 'bg-white border-slate-200 shadow-[0_50px_100px_rgba(0,0,0,0.1)]' : 'bg-[#0f172a] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)]'}`}
                        >
                            <div className={`w-full md:w-1/2 flex items-center justify-center border-r overflow-hidden ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                                <img src={selectedProduct.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={selectedProduct.name} />
                            </div>
                            <div className="w-full md:w-1/2 p-12 relative flex flex-col">
                                <button onClick={() => setSelectedProduct(null)} className={`absolute top-8 right-8 transition-colors ${isLight ? 'text-slate-400 hover:text-slate-900' : 'text-white/40 hover:text-white'}`}>
                                    <X size={24} />
                                </button>
                                <div className="mb-10">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-[#6aa84f]' : 'text-[#a3e635]'}`}>{selectedProduct.category}</span>
                                    <h2 className={`text-5xl font-[1000] uppercase tracking-tighter mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedProduct.name}</h2>
                                    <p className={`text-3xl font-black mt-4 ${isLight ? 'text-[#6aa84f]' : 'text-[#a3e635]'}`}>{selectedProduct.price}</p>
                                </div>
                                <p className={`text-sm leading-relaxed mb-10 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>{selectedProduct.description || "Un produit d'excellence sélectionné avec soin par Djapero Group pour garantir une fraîcheur et une qualité inégalées."}</p>
                                <a 
                                    href={`https://wa.me/${data?.settings?.whatsapp || ''}?text=Bonjour Djapero, je souhaite commander : ${selectedProduct.name}`}
                                    className={`mt-auto w-full py-6 rounded-2xl font-black uppercase tracking-widest text-center hover:scale-[1.02] active:scale-[0.98] transition-all ${isLight ? 'bg-[#6aa84f] text-white shadow-lg shadow-[#6aa84f]/20' : 'bg-[#a3e635] text-black'}`}
                                >
                                    Commander sur WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function X({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    );
}

