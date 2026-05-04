import { useState, useEffect } from "react";
import { 
    LayoutDashboard, Box, Video as VideoIcon, Briefcase, Camera as CameraIcon, Settings, ShieldCheck,
    LogOut, Eye, ShoppingBag, Plus, Edit2, Trash2, Save, X, CloudUpload, Store as StoreIcon, MapPin, Phone, Filter, Bell, Play,
    Image as ImageIcon, Monitor, Users, User, Mail, Star, Heart, Maximize2, Lock
} from "lucide-react";
import { useData, Product, Video, Service, Real, Settings as AppSettings, Notification, MarketItem, UserProfile } from "../hooks/useData";
import { motion, AnimatePresence } from "motion/react";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
    const { 
        data, 
        loading: dataLoading, 
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        addVideo,
        updateVideo,
        deleteVideo,
        addService,
        updateService,
        deleteService,
        addMarketItem,
        updateMarketItem,
        deleteMarketItem,
        addNotification,
        deleteNotification,
        addReal,
        updateReal,
        deleteReal
    } = useData();
    const { user, login, logout, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState("accueil");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Notifications state for local handling
    const [notifModal, setNotifModal] = useState<any>(null);
    const [sendingNotif, setSendingNotif] = useState(false);

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const newNotif: Omit<Notification, 'id'> = {
                title: formData.get("title") as string,
                message: formData.get("message") as string,
                type: formData.get("type") as any,
                createdAt: Date.now(),
                active: true
            };

            setSendingNotif(true);
            const success = await addNotification(newNotif);
            setSendingNotif(false);
            if (success) {
                setNotifModal(null);
                alert("✅ Notification envoyée !");
            } else {
                alert("❌ Erreur lors de l'envoi.");
            }
        } catch (err: any) {
            console.error("Notif error:", err);
            setSendingNotif(false);
            alert("❌ Erreur lors de l'envoi de la notification.");
        }
    };

    const handleDeleteNotification = async (id: string) => {
        if (!window.confirm("Supprimer cette notification ?")) return;
        await deleteNotification(id);
    };

    const handleDeleteMarketItem = async (id: string) => {
        if (!window.confirm("Supprimer cet article ?")) return;
        await deleteMarketItem(id);
    };

    const [videoSrcType, setVideoSrcType] = useState<'youtube' | 'file'>('youtube');
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");

    // Modal states
    const [productModal, setProductModal] = useState<Partial<Product> | null>(null);
    const [videoModal, setVideoModal] = useState<Partial<Video> | null>(null);
    const [serviceModal, setServiceModal] = useState<Partial<Service> | null>(null);
    const [realModal, setRealModal] = useState<Partial<Real> | null>(null);
    const [marketModal, setMarketModal] = useState<Partial<MarketItem> | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [accueilSettings, setAccueilSettings] = useState<Partial<AppSettings>>({});
    const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

    const getYoutubeId = (url: string) => {
        if (!url) return "";
        // Handle direct IDs
        if (url.length === 11 && !url.includes("/") && !url.includes(".")) return url;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    useEffect(() => {
        setPreviewUrl("");
    }, [productModal, videoModal, serviceModal, realModal, marketModal]);

    const handleFileUpload = async (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            setUploading(true);
            setUploadProgress(0);
            const formData = new FormData();
            formData.append("file", file);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/upload", true);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(percent);
                }
            };

            xhr.onload = () => {
                setUploading(false);
                setUploadProgress(0);
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        resolve(result.url);
                    } catch (e) {
                        console.error("Parse error:", e);
                        alert("Erreur lors de la lecture de la réponse du serveur.");
                        resolve(null);
                    }
                } else if (xhr.status === 413) {
                    alert("❌ Fichier trop lourd ! Le serveur limite les envois à 500Mo.");
                    resolve(null);
                } else {
                    let errorMsg = `Erreur serveur (${xhr.status})`;
                    try {
                        const err = JSON.parse(xhr.responseText);
                        errorMsg = err.error || errorMsg;
                    } catch (e) {}
                    alert(`❌ ${errorMsg}`);
                    resolve(null);
                }
            };

            xhr.onerror = () => {
                console.error("XHR Network Error");
                alert("Erreur réseau. Vérifiez votre connexion ou la taille du fichier (Max 500Mo).");
                setUploading(false);
                setUploadProgress(0);
                resolve(null);
            };

            xhr.onabort = () => {
                console.warn("Upload aborted");
                setUploading(false);
                setUploadProgress(0);
                resolve(null);
            };

            xhr.send(formData);
        });
    };

    // Sync local settings with data once loaded
    useEffect(() => {
        if (data?.settings && !hasLoadedSettings) {
            setAccueilSettings(data.settings);
            setHasLoadedSettings(true);
        }
    }, [dataLoading, data, hasLoadedSettings]);

    const resyncSettings = () => {
        if (data?.settings && window.confirm("Réinitialiser les modifications non enregistrées ?")) {
            setAccueilSettings(data.settings);
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleAccueilSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        try {
            const success = await updateSettings(accueilSettings);
            if (success) {
                alert("✅ Contenu Accueil mis à jour avec succès !");
            } else {
                alert("❌ Erreur lors de l'enregistrement.");
            }
        } catch (err: any) {
            console.error("Submit error:", err);
            let message = "Une erreur est survenue lors de l'enregistrement.";
            try {
                const firestoreErr = JSON.parse(err.message);
                message = `Erreur: ${firestoreErr.error}`;
            } catch (e) {
                message = err.message || message;
            }
            alert(`❌ ${message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const updateAccueilField = (field: string, value: any) => {
        setAccueilSettings(prev => ({ ...prev, [field]: value }));
    };

    if (dataLoading || !data) return <div className="p-20 text-center font-black tracking-tighter text-emerald-600 animate-pulse">Chargement Djapero...</div>;

    if (!user || !isAdmin) {
        return (
            <div className="login-screen">
                <div className="login-card">
                    <div className="login-logo text-[#059669] font-black text-3xl mb-8 flex items-center justify-center gap-3 tracking-tighter decoration-4 underline decoration-[#ffbe0b]">
                        Djapero Admin
                    </div>
                    <h2 className="text-xl font-bold mb-2">Accès Administrateur</h2>
                    <p className="text-gray-500 mb-8 text-sm">Veuillez vous connecter avec votre compte administrateur Google.</p>
                    <button 
                        onClick={() => login()}
                        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-3"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-white rounded-full" />
                        Se connecter avec Google
                    </button>
                    {!isAdmin && user && <p className="text-red-500 text-sm mt-4 font-medium">Accès refusé. Vous n'êtes pas administrateur.</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard flex bg-[#f1f5f9] min-h-screen relative">
            {/* Mobile Sidebar Toggle */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-6 right-6 z-[60] bg-[#0f172a] text-white p-4 rounded-2xl shadow-xl border border-white/10 active:scale-95 transition-all"
            >
                {isSidebarOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
            </button>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 z-[50] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0f172a] text-white p-6 flex flex-col z-[55] transition-transform duration-500 transform shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="flex items-center gap-3 mb-12 px-2 group">
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 overflow-hidden shadow-2xl shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                        <img 
                            src="/uploads/djapero-logo.jpg" 
                            alt="Admin Logo" 
                            className="w-full h-full object-cover scale-110" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=100";
                            }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter leading-none mb-1">
                            Djapero<span className="text-emerald-500">.</span>
                        </h1>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/50">Admin Console</p>
                    </div>
                </div>

                <nav className="flex-grow space-y-1.5 overflow-y-auto pr-2 no-scrollbar">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 px-4">Menu Principal</p>
                    {[
                        { id: "accueil", label: "Dashboard", icon: LayoutDashboard },
                        { id: "marche", label: "Le Marché", icon: StoreIcon },
                        { id: "produits", label: "Boutique Officielle", icon: Box },
                        { id: "videos", label: "Vidéos & Reels", icon: VideoIcon },
                        { id: "services", label: "Expertises", icon: Briefcase },
                        { id: "realisations", label: "Portfolio", icon: CameraIcon },
                        { id: "notifications", label: "Notifications", icon: Bell },
                        { id: "membres", label: "Membres", icon: Users },
                        { id: "parametres", label: "Général", icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group font-bold tracking-tight text-sm ${
                                activeTab === item.id 
                                ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" 
                                : "text-white/40 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? "scale-110" : "group-hover:scale-110 transition-transform"} />
                            <span>{item.label}</span>
                            {activeTab === item.id && (
                                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white" />
                            )}
                        </button>
                    ))}
                    
                    <div className="pt-8 mt-8 border-t border-white/5 space-y-3">
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 px-4">Utilitaires</p>
                        <button 
                            onClick={() => {
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `djapero-data-${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                            }}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-xs bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <Save size={16} /> JSON Export
                        </button>
                        <a href="/" target="_blank" className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-xs bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all underline decoration-emerald-500/30">
                            <Eye size={16} /> Site Public
                        </a>
                    </div>
                </nav>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="bg-white/5 rounded-3xl p-4 flex items-center gap-3 mb-6">
                        <img 
                            src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                            className="w-10 h-10 rounded-xl border border-white/10 shadow-lg" 
                            alt="Admin" 
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase text-emerald-500 mb-0.5">Connecté</p>
                            <p className="text-xs font-bold text-white truncate lowercase tracking-tight">{user?.email?.split('@')[0] || "Admin"}</p>
                        </div>
                        <button 
                            onClick={() => logout()}
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center flex-shrink-0"
                            title="Déconnexion"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow lg:ml-64 p-4 md:p-10 w-full overflow-x-hidden relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none -mr-20 -mt-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-900 fill-current">
                        <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" />
                    </svg>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "marche" && (
                        <motion.div key="marche" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Gestion Marketplace</span>
                                    </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] uppercase tracking-tighter leading-none mb-2">
                                Le <span className="text-orange-500">Marché.</span>
                            </h1>
                            <p className="text-gray-400 font-bold text-sm md:text-lg opacity-80 pl-1">Modérez les annonces déposées par la communauté.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setPreviewUrl("");
                                        setMarketModal({});
                                    }}
                                    className="bg-orange-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-tighter flex items-center gap-3 shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 text-sm"
                                >
                                    <Plus size={20} /> Nouveau Produit
                                </button>
                            </header>

                            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6 block">
                                { (data.marketItems || []).map((item, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={item.id} 
                                        className="break-inside-avoid bg-white p-4 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 group hover:-translate-y-1 transition-all inline-block w-full mb-6"
                                    >
                                        <div className="relative h-auto min-h-[150px] rounded-[2.5rem] overflow-hidden mb-6 shadow-inner bg-gray-50 flex items-center justify-center p-0">
                                            <img 
                                                src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} 
                                                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700" 
                                                alt={item.name} 
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
                                                }}
                                            />
                                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-[12px] font-black text-white shadow-lg">
                                                {item.price}
                                            </div>
                                            <div className="absolute left-4 bottom-4 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                {item.category}
                                            </div>
                                        </div>
                                        
                                        <div className="px-2">
                                            <h3 className="text-2xl font-black text-[#0f172a] mb-2 leading-none uppercase tracking-tighter transition-colors group-hover:text-orange-500">{item.name}</h3>
                                            
                                            <div className="flex flex-wrap gap-4 mb-8 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-orange-500" />
                                                    {item.location}
                                                </div>
                                                {item.shopName && (
                                                    <div className="flex items-center gap-2">
                                                        <StoreIcon size={14} className="text-orange-500" />
                                                        {item.shopName}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => {
                                                        setPreviewUrl("");
                                                        setMarketModal(item);
                                                    }}
                                                    className="flex-1 bg-gray-50 text-gray-500 p-4 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                                >
                                                    <Edit2 size={16} /> Éditer
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteMarketItem(item.id)}
                                                    className="w-14 bg-gray-50 text-gray-400 p-4 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {activeTab === "accueil" && (
                        <motion.div key="accueil" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <header className="mb-12 flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Console Management v4.2</span>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] uppercase tracking-tighter leading-[0.8] mb-4">
                                        Tableau de <br/><span className="text-emerald-500">Bord.</span>
                                    </h1>
                                    <p className="text-gray-400 font-bold text-sm md:text-lg opacity-80 max-w-2xl">
                                        Gérez l'ensemble des contenus de votre page principale et suivez l'état de votre écosystème.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={handleAccueilSubmit}
                                        className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 text-sm"
                                    >
                                        <Save size={20} /> Enregistrer Tout
                                    </button>
                                    <button 
                                        onClick={resyncSettings}
                                        className="bg-gray-200 text-gray-600 px-6 py-3 rounded-xl font-black uppercase tracking-tighter text-[10px] hover:bg-gray-300 transition-all active:scale-95 shadow-sm text-center"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                                {[
                                    { label: "Articles Boutique", val: (data.products || []).length, icon: Box, color: "emerald" },
                                    { label: "Vendeurs Marché", val: (data.marketItems || []).length, icon: StoreIcon, color: "orange" },
                                    { label: "Vidéos Social", val: (data.videos || []).length, icon: VideoIcon, color: "blue" },
                                    { label: "Expertises", val: (data.services || []).length, icon: Briefcase, color: "purple" },
                                ].map((stat, i) => (
                                    <motion.div 
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                                    >
                                        <div className={`w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-black text-[#0f172a] tracking-tighter">{stat.val}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Recent Notifications Preview */}
                            <div className="mb-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-[#0f172a]">Dernières Alertes</h3>
                                    <button onClick={() => setActiveTab("notifications")} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">Voir tout</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(data.notifications || []).length === 0 ? (
                                        <div className="col-span-2 bg-white/50 p-8 rounded-[2rem] border border-dashed border-gray-200 text-center">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucune notification active</p>
                                        </div>
                                    ) : (
                                        (data.notifications || []).slice(0, 2).map((n, i) => (
                                            <motion.div 
                                                key={n.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 group"
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${n.type === 'info' ? 'bg-blue-50 text-blue-500' : n.type === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                                                    <Bell size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black text-[#0f172a] uppercase truncate">{n.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium truncate">{n.message}</p>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <form className="space-y-12" onSubmit={handleAccueilSubmit}>
                                {/* Section Banner & Hero */}
                                <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100">
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-blue-600 mb-8 border-b-2 border-blue-50 pb-4">Bannière & Titres</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2">Titre Hero Principal</label>
                                            <input 
                                                value={accueilSettings.heroTitle || ""} 
                                                onChange={e => updateAccueilField('heroTitle', e.target.value)}
                                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 focus:border-blue-500 outline-none font-black uppercase tracking-tighter" 
                                            />
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2 mt-4 block">Sous-titre Hero</label>
                                            <input 
                                                value={accueilSettings.heroSubtitle || ""} 
                                                onChange={e => updateAccueilField('heroSubtitle', e.target.value)}
                                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 focus:border-blue-500 outline-none font-bold text-xs uppercase tracking-widest text-gray-400" 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2">Titre Bannière Studio</label>
                                            <input 
                                                value={accueilSettings.bannerTitle || ""} 
                                                onChange={e => updateAccueilField('bannerTitle', e.target.value)}
                                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 focus:border-blue-500 outline-none font-black uppercase tracking-tighter" 
                                            />
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2 mt-4 block">Description Bannière</label>
                                            <textarea 
                                                value={accueilSettings.bannerDesc || ""} 
                                                onChange={e => updateAccueilField('bannerDesc', e.target.value)}
                                                rows={2} 
                                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 focus:border-blue-500 outline-none font-bold text-xs text-gray-400" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section Features */}
                                <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100">
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-[#059669] mb-8 underline decoration-4 decoration-yellow-400 underline-offset-8">Les 3 Incontournables</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {[1, 2, 3].map(num => (
                                            <div key={num} className="space-y-4 p-6 bg-gray-50 rounded-3xl group border-2 border-transparent hover:border-emerald-200 transition-all">
                                                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Carte {num}</p>
                                        <div className="aspect-auto bg-white rounded-2xl mb-4 overflow-hidden border border-gray-200 shadow-sm relative flex items-center justify-center">
                                                    <img 
                                                        src={(accueilSettings as any)[`feature${num}Img`] || "https://images.unsplash.com/photo-1579311822484-912f9909247f?auto=format&fit=crop&q=80&w=800"} 
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800";
                                                        }}
                                                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                                                    />
                                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                        <CloudUpload className="text-white" size={30} />
                                                        <input 
                                                            type="file" 
                                                            className="hidden" 
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const url = await handleFileUpload(file);
                                                                    if (url) {
                                                                        updateAccueilField(`feature${num}Img`, url);
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <input 
                                                    value={(accueilSettings as any)[`feature${num}Title`] || ""} 
                                                    onChange={e => updateAccueilField(`feature${num}Title`, e.target.value)}
                                                    placeholder="Titre" 
                                                    className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none font-black text-sm" 
                                                />
                                                <input 
                                                    value={(accueilSettings as any)[`feature${num}Desc`] || ""} 
                                                    onChange={e => updateAccueilField(`feature${num}Desc`, e.target.value)}
                                                    placeholder="Sous-titre" 
                                                    className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-[10px] font-bold uppercase tracking-widest" 
                                                />
                                                <div className="relative">
                                                     <input 
                                                        value={(accueilSettings as any)[`feature${num}Img`] || ""} 
                                                        onChange={e => updateAccueilField(`feature${num}Img`, e.target.value)}
                                                        placeholder="URL Image" 
                                                        className="w-full bg-white px-4 py-2 pr-10 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-[9px] text-gray-400 truncate" 
                                                    />
                                                    {(accueilSettings as any)[`feature${num}Img`] && (
                                                        <X 
                                                            size={14} 
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 cursor-pointer"
                                                            onClick={() => updateAccueilField(`feature${num}Img`, "")}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Section Vidéos */}
                                    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100">
                                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-blue-600 mb-8 border-b-2 border-blue-50 pb-4">Vidéos & Publicité Accueil</h3>
                                        <div className="space-y-10">
                                            {/* Hero Media Selection */}
                                            <div className="bg-blue-50/20 p-6 rounded-[2rem] border border-blue-100/50">
                                                <div className="flex justify-between items-center mb-6">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2">Configuration Hero Immersif</label>
                                                    <div className="flex bg-white/50 p-1 rounded-xl border border-blue-100">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => updateAccueilField('heroMode', 'video')}
                                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${(!accueilSettings.heroMode || accueilSettings.heroMode === 'video') ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400'}`}
                                                        >Vidéo</button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => updateAccueilField('heroMode', 'image')}
                                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${accueilSettings.heroMode === 'image' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400'}`}
                                                        >Image</button>
                                                    </div>
                                                </div>

                                                {(!accueilSettings.heroMode || accueilSettings.heroMode === 'video') ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                                        <div>
                                                            <div className="flex gap-2">
                                                                <select 
                                                                    value={accueilSettings.heroVideoId || ""} 
                                                                    onChange={e => updateAccueilField('heroVideoId', e.target.value)}
                                                                    className="flex-1 bg-white px-4 py-4 rounded-2xl border border-blue-100 focus:border-blue-500 outline-none font-bold text-sm appearance-none cursor-pointer uppercase shadow-sm"
                                                                >
                                                                    <option value="">-- Choisir une vidéo --</option>
                                                                    {(data.videos || []).map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                                                                </select>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setVideoModal({});
                                                                        setActiveTab("videos");
                                                                    }}
                                                                    className="p-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors shadow-lg"
                                                                    title="Nouvelle Vidéo"
                                                                >
                                                                    <Plus size={20} />
                                                                </button>
                                                            </div>
                                                            <p className="text-[9px] text-gray-400 mt-2 ml-2 italic">Cette vidéo sera affichée en plein écran au sommet de la page d'accueil.</p>
                                                        </div>
                                                        <div className="aspect-video bg-black/5 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-100 overflow-hidden relative">
                                                            {accueilSettings.heroVideoId ? (
                                                                <>
                                                                    {(() => {
                                                                        const v = (data.videos || []).find(vid => vid.id === accueilSettings.heroVideoId);
                                                                        if (!v) return <div className="text-[10px] font-black uppercase text-gray-300">Vidéo introuvable</div>;
                                                                        
                                                                        if (v.thumbnail) {
                                                                            return <img src={v.thumbnail || undefined} className="w-full h-full object-cover opacity-60" alt="Preview" />;
                                                                        } else if (v.srcType === 'file') {
                                                                            return <video src={v.src || undefined} className="w-full h-full object-cover opacity-60" />;
                                                                        } else {
                                                                            return <img src={`https://img.youtube.com/vi/${v.src}/0.jpg`} className="w-full h-full object-cover opacity-60" alt="Preview" />;
                                                                        }
                                                                    })()}
                                                                    <div className="absolute inset-0 flex items-center justify-center flex-col p-4 text-center bg-blue-500/10 backdrop-blur-[2px]">
                                                                        <Play size={24} className="text-blue-600 mb-2 drop-shadow-lg" />
                                                                        <div className="text-[10px] font-black uppercase text-blue-700 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                                                                            {(data.videos || []).find(v => v.id === accueilSettings.heroVideoId)?.title}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-[10px] font-black uppercase text-gray-300">Aucune sélection</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                                        <div>
                                                            <div className="flex flex-col gap-3">
                                                                <p className="text-[10px] text-gray-500 font-bold leading-relaxed mb-2 uppercase tracking-wide">Chargez une photo haute résolution pour l'arrière-plan de l'accueil.</p>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const input = document.createElement('input');
                                                                        input.type = 'file';
                                                                        input.accept = 'image/*';
                                                                        input.onchange = async (e) => {
                                                                            const file = (e.target as HTMLInputElement).files?.[0];
                                                                            if (file) {
                                                                                const url = await handleFileUpload(file);
                                                                                if (url) updateAccueilField('heroImage', url);
                                                                            }
                                                                        };
                                                                        input.click();
                                                                    }}
                                                                    className="bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg"
                                                                >
                                                                    <CameraIcon size={18} /> {uploading ? "Chargement..." : "Charger Photo Immersive"}
                                                                </button>
                                                                <input 
                                                                    value={accueilSettings.heroImage || ""}
                                                                    onChange={e => updateAccueilField('heroImage', e.target.value)}
                                                                    className="bg-white px-4 py-3 rounded-2xl border border-blue-100 outline-none text-[10px] font-medium text-blue-900/50 italic truncate"
                                                                    placeholder="Lien direct https://..."
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="aspect-video bg-black/5 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-100 overflow-hidden relative group">
                                                            {accueilSettings.heroImage ? (
                                                                <>
                                                                    <img src={accueilSettings.heroImage} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Hero Preview" />
                                                                    <div className="absolute inset-0 bg-black/20" />
                                                                    <div className="absolute bottom-4 left-4">
                                                                        <div className="text-[10px] font-black uppercase text-white bg-blue-600 px-3 py-1 rounded-full shadow-lg">Aperçu Photo Hero</div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-[10px] font-black uppercase text-gray-300 flex flex-col items-center gap-2">
                                                                    <ImageIcon size={24} />
                                                                    <span>Aucune photo</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Publicity Video Selection */}
                                            <div className="bg-[#10b981]/5 p-6 rounded-[2rem] border border-[#10b981]/10">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#059669] ml-2 block mb-4">Configuration Section Publicité</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#059669]/60 mb-2 block ml-2">Titre Publicité</label>
                                                            <input 
                                                                value={accueilSettings.publicityTitle || ""} 
                                                                onChange={e => updateAccueilField('publicityTitle', e.target.value)}
                                                                className="w-full bg-white px-5 py-3 rounded-xl border border-emerald-100 focus:border-emerald-500 outline-none font-black uppercase text-sm" 
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#059669]/60 mb-2 block ml-2">Slogan / Sous-titre</label>
                                                            <input 
                                                                value={accueilSettings.publicitySubtitle || ""} 
                                                                onChange={e => updateAccueilField('publicitySubtitle', e.target.value)}
                                                                placeholder="Ex: Boostez votre visibilité" 
                                                                className="w-full bg-white px-5 py-3 rounded-xl border border-emerald-100 focus:border-emerald-500 outline-none font-bold text-xs" 
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#059669]/60 mb-2 block ml-2">Choisir la vidéo</label>
                                                        <div className="flex gap-2">
                                                            <select 
                                                                value={accueilSettings.publicityVideoId || ""} 
                                                                onChange={e => updateAccueilField('publicityVideoId', e.target.value)}
                                                                className="flex-1 bg-white px-4 py-3 rounded-xl border border-emerald-100 focus:border-emerald-500 outline-none font-bold text-sm appearance-none cursor-pointer uppercase shadow-sm"
                                                            >
                                                                <option value="">-- Choisir une vidéo --</option>
                                                                {(data.videos || []).map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                                                            </select>
                                                            <button 
                                                                type="button"
                                                                onClick={() => {
                                                                    setVideoModal({});
                                                                    setActiveTab("videos");
                                                                }}
                                                                className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg"
                                                                title="Nouvelle Vidéo"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="aspect-video bg-black/5 rounded-xl flex items-center justify-center border-2 border-dashed border-emerald-100 overflow-hidden relative">
                                                        {accueilSettings.publicityVideoId ? (
                                                            <>
                                                                {(() => {
                                                                    const v = (data.videos || []).find(vid => vid.id === accueilSettings.publicityVideoId);
                                                                    if (!v) return <div className="text-[10px] font-black uppercase text-gray-300">Vidéo introuvable</div>;
                                                                    
                                                                    if (v.thumbnail) {
                                                                        return <img src={v.thumbnail || undefined} className="w-full h-full object-cover opacity-60" alt="Preview" />;
                                                                    } else if (v.srcType === 'file') {
                                                                        return <video src={v.src || undefined} className="w-full h-full object-cover opacity-60" />;
                                                                    } else {
                                                                        return <img src={`https://img.youtube.com/vi/${v.src}/0.jpg`} className="w-full h-full object-cover opacity-60" alt="Preview" />;
                                                                    }
                                                                })()}
                                                                <div className="absolute inset-0 flex items-center justify-center flex-col p-4 text-center bg-emerald-500/10 backdrop-blur-[2px]">
                                                                    <Play size={24} className="text-emerald-600 mb-2 drop-shadow-lg" />
                                                                    <div className="text-[10px] font-black uppercase text-emerald-700 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                                                                        {(data.videos || []).find(v => v.id === accueilSettings.publicityVideoId)?.title}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-[10px] font-black uppercase text-gray-300">Aucune vidéo sélectionnée</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="pt-10 border-t border-gray-100/50">
                                                    <div className="flex items-center justify-between mb-6 px-2">
                                                        <div>
                                                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-purple-500 block mb-1">Vidéo de Présentation</label>
                                                            <p className="text-[9px] text-gray-400 font-bold uppercase opacity-60">Cette vidéo s'affiche en grand sur la page d'accueil</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                type="button"
                                                                onClick={() => {
                                                                    setVideoModal({});
                                                                    setVideoSrcType('file');
                                                                    setActiveTab("videos");
                                                                }}
                                                                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <CloudUpload size={12} /> Importer Nouvelle
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                                        <div className="space-y-4">
                                                            <div className="relative">
                                                                <select 
                                                                    value={accueilSettings.introVideoId || ""} 
                                                                    onChange={e => updateAccueilField('introVideoId', e.target.value)}
                                                                    className="w-full bg-white px-6 py-5 rounded-[2rem] border-2 border-purple-100 focus:border-purple-500 outline-none font-black text-xs appearance-none cursor-pointer uppercase shadow-xl transition-all hover:border-purple-200"
                                                                >
                                                                    <option value="">Sélectionner une vidéo existante</option>
                                                                    {(data.videos || []).map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                                                                </select>
                                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                                                                    <LayoutDashboard size={14} />
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="bg-purple-50/50 p-6 rounded-[2rem] border border-purple-100/50">
                                                                <h4 className="text-[10px] font-black text-purple-600 uppercase mb-3 flex items-center gap-2">
                                                                    <Play size={10} fill="currentColor" /> Rendu sur l'accueil
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    <div className="h-2 w-full bg-purple-200/50 rounded-full" />
                                                                    <div className="h-2 w-[80%] bg-purple-200/50 rounded-full" />
                                                                    <div className="h-2 w-[60%] bg-purple-200/50 rounded-full" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="relative group">
                                                            <div className="aspect-video bg-[#0f172a] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-purple-100 relative">
                                                                {accueilSettings.introVideoId ? (
                                                                    <>
                                                                        {(() => {
                                                                            const v = (data.videos || []).find(vid => vid.id === accueilSettings.introVideoId);
                                                                            if (!v || !v.src) return <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase text-white/20">Vidéo introuvable</div>;
                                                                            
                                                                            return (
                                                                                <div className="w-full h-full">
                                                                                    {v.srcType === 'file' ? (
                                                                                        <video 
                                                                                            src={v.src || undefined} 
                                                                                            autoPlay 
                                                                                            muted 
                                                                                            loop 
                                                                                            playsInline 
                                                                                            className="w-full h-full object-cover" 
                                                                                        />
                                                                                    ) : (
                                                                                        <iframe 
                                                                                            src={`https://www.youtube.com/embed/${v.src}?autoplay=1&mute=1&loop=1&playlist=${v.src}&modestbranding=1&rel=0&controls=0`}
                                                                                            className="w-full h-full"
                                                                                            allow="autoplay"
                                                                                        />
                                                                                    )}
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                                                                    <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                                                                                        <div className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1">Aperçu Vidéo</div>
                                                                                        <div className="text-white font-black uppercase text-xs truncate">{v.title}</div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })()}
                                                                    </>
                                                                ) : (
                                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-300">
                                                                            <Play size={24} />
                                                                        </div>
                                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300/50">Aucune vidéo sélectionnée</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                                                                <Monitor size={18} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Statistiques */}
                                    <div className="bg-[#052e16] p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl text-white">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-4">
                                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-emerald-400">Statistiques</h3>
                                            <input name="statsTitle" defaultValue={data.settings.statsTitle || "Statistiques 2024"} className="bg-transparent border-none outline-none text-left md:text-right font-black uppercase text-xs md:text-sm text-white/50 w-full md:w-1/2" />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/50">Valeur 1</label>
                                            <input 
                                                value={accueilSettings.statsValue1 || ""} 
                                                onChange={e => updateAccueilField('statsValue1', e.target.value)}
                                                className="w-full bg-white/5 px-4 py-3 rounded-xl border border-white/10 focus:border-emerald-500 outline-none font-black text-xl text-center" 
                                            />
                                            <input 
                                                value={accueilSettings.statsLabel1 || ""} 
                                                onChange={e => updateAccueilField('statsLabel1', e.target.value)}
                                                placeholder="Label 1" 
                                                className="w-full bg-transparent text-emerald-400 text-center font-black uppercase text-[10px] outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/50">Valeur 2</label>
                                            <input 
                                                value={accueilSettings.statsValue2 || ""} 
                                                onChange={e => updateAccueilField('statsValue2', e.target.value)}
                                                className="w-full bg-white/5 px-4 py-3 rounded-xl border border-white/10 focus:border-emerald-500 outline-none font-black text-xl text-center" 
                                            />
                                            <input 
                                                value={accueilSettings.statsLabel2 || ""} 
                                                onChange={e => updateAccueilField('statsLabel2', e.target.value)}
                                                placeholder="Label 2" 
                                                className="w-full bg-transparent text-emerald-400 text-center font-black uppercase text-[10px] outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/50 ml-2 block mb-2">Citation Inspirationnelle</label>
                                            <textarea 
                                                value={accueilSettings.statsQuote || ""} 
                                                onChange={e => updateAccueilField('statsQuote', e.target.value)}
                                                rows={3} 
                                                className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none text-sm text-white/70 font-medium" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={isSaving || uploading} className="w-full bg-[#10b981] text-white py-6 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-700 transition-all hover:scale-[1.01] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {(isSaving || uploading) ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>{uploading ? "Transfert..." : "Enregistrement..."}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Save size={24} className="md:w-8 md:h-8" /> 
                                            <span className="text-xs md:text-base">Mettre à jour l'accueil</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === "produits" && (
                        <motion.div key="produits" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-14">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-tighter leading-none">Catalogue Produits</h1>
                                    <p className="text-gray-400 font-bold mt-2 opacity-80 underline decoration-emerald-100 underline-offset-4 text-xs md:text-base">Ajoutez et gérez les articles du marché Djapero.</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setProductModal({});
                                        setPreviewUrl("");
                                    }}
                                    className="bg-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-tighter hover:bg-emerald-700 transition-all shadow-xl hover:scale-105 active:scale-95 text-xs md:text-sm w-full md:w-auto"
                                >
                                    <Plus size={20} className="inline-block mr-2" /> Ajouter un produit
                                </button>
                            </div>

                            <div className="admin-product-grid">
                                {(data.products || []).map(p => (
                                    <div key={p.id} className="admin-product-card group">
                                        <div className="h-auto bg-gray-50 flex items-center justify-center p-0 relative">
                                            <img src={p.imageUrl || undefined} alt={p.name} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => {
                                                    setProductModal(p);
                                                    setPreviewUrl(p.imageUrl || "");
                                                }} className="p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"><Edit2 size={18}/></button>
                                                <button 
                                                    onClick={async () => {
                                                        if (confirm("Supprimer ce produit ?")) {
                                                            await deleteProduct(p.id);
                                                        }
                                                    }}
                                                    className="p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                                                >
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">{p.category}</div>
                                            <h3 className="font-black text-lg text-[#0f172a] tracking-tighter leading-tight uppercase group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                                            <div className="mt-4 flex items-center justify-between">
                                                <p className="text-xl font-black text-gray-900 tracking-tighter">{p.price} <span className="text-[10px] opacity-50 uppercase tracking-widest font-bold">FCFA</span></p>
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    <ShoppingBag size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "videos" && (
                        <motion.div key="videos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-14">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-tighter leading-none">Vidéos Sociales & Reels</h1>
                                    <p className="text-gray-400 font-bold mt-2 opacity-80 underline decoration-blue-100 underline-offset-4 text-xs md:text-base">Gérez les vidéos verticales (YouTube Shorts ou Fichiers MP4) pour votre plateforme.</p>
                                </div>
                                <button onClick={() => {
                                    setVideoModal({});
                                    setPreviewUrl("");
                                    setVideoPreviewUrl("");
                                    setVideoSrcType('youtube');
                                }} className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-700 transition-all shadow-xl hover:scale-105 text-xs md:text-sm uppercase w-full md:w-auto"><Plus size={20} className="inline-block mr-2" /> Publier une vidéo</button>
                            </div>
                            <div className="admin-product-grid">
                                {(data.videos || []).map(v => (
                                    <div key={v.id} className="admin-product-card group p-4 bg-white">
                                         <div className="h-auto bg-black rounded-3xl mb-6 overflow-hidden relative shadow-2xl group-hover:shadow-blue-500/20 transition-all">
                                            {v.thumbnail || (v.srcType === 'youtube' && v.src) ? (
                                                <img 
                                                    src={v.thumbnail || (v.src ? `https://img.youtube.com/vi/${v.src}/0.jpg` : undefined)} 
                                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        const img = e.currentTarget;
                                                        if (v.srcType === 'file') img.style.display = 'none';
                                                    }}
                                                />
                                            ) : null}
                                            {(!v.thumbnail && v.srcType === 'file' && v.src) && (
                                                <video src={v.src || undefined} className="w-full h-full object-cover opacity-50" />
                                            )}
                                            {(!v.thumbnail && v.srcType !== 'file' && !v.src) && (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white/10 uppercase font-black tracking-tighter text-4xl -rotate-12 gap-4">
                                                    <span>Social Ads</span>
                                                    <VideoIcon size={40} className="opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${v.srcType === 'file' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}`}>
                                                    {v.srcType === 'file' ? 'Fichier' : 'YouTube'}
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <VideoIcon size={48} className="text-white animate-pulse" />
                                            </div>
                                         </div>
                                         <h3 className="font-black text-lg text-[#0f172a] truncate uppercase tracking-tighter mb-4">{v.title}</h3>
                                         <div className="flex gap-3">
                                            <button onClick={() => {
                                                setVideoModal(v);
                                                setPreviewUrl(v.thumbnail || "");
                                                setVideoPreviewUrl(v.srcType === 'file' ? v.src : "");
                                                setVideoSrcType(v.srcType === 'file' ? 'file' : 'youtube');
                                            }} className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white">Modifier</button>
                                                <button onClick={async () => { if(confirm("Supprimer ?")) await deleteVideo(v.id) }} className="p-3 text-red-400 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 size={18}/></button>
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "realisations" && (
                        <motion.div key="realisations" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-14">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 bg-[#ffbe0b] rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600">Galerie Exclusive</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] uppercase tracking-tighter leading-none">
                                        Port<span className="text-[#ffbe0b]">folio.</span>
                                    </h1>
                                    <p className="text-gray-400 font-bold mt-2 opacity-80 underline decoration-yellow-100 underline-offset-4 text-xs md:text-base">Gérez les créations visuelles exposées avec le nouveau design.</p>
                                </div>
                                <button onClick={() => {
                                    setRealModal({ rating: 5 });
                                    setPreviewUrl("");
                                }} className="bg-[#ffbe0b] text-black px-10 py-5 rounded-2xl font-black uppercase tracking-tighter flex items-center shadow-xl hover:bg-yellow-500 transition-all active:scale-95 text-sm w-full md:w-auto">
                                    <Plus size={20} className="mr-3" /> Ajouter une création
                                </button>
                            </div>

                            <div className="admin-product-grid">
                                {(data.reals || []).map(r => (
                                    <motion.div 
                                        key={r.id} 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="admin-product-card group bg-white p-3 rounded-[2.5rem] relative"
                                    >
                                        {/* Image Section */}
                                        <div className="aspect-[4/5] overflow-hidden rounded-[2rem] relative bg-gray-50 mb-4 group/img">
                                            <img 
                                                src={r.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                alt={r.title}
                                            />
                                            
                                            {/* Badge Overlay */}
                                            {r.badge && (
                                                <div className="absolute top-4 left-4 bg-[#064e3b] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                    {r.badge}
                                                </div>
                                            )}

                                            {/* Quick Actions Overlay */}
                                            <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-500 shadow-xl border border-gray-100 transition-colors">
                                                    <Heart size={16} />
                                                </button>
                                                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-500 shadow-xl border border-gray-100 transition-colors">
                                                    <Maximize2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setRealModal(r);
                                                        setPreviewUrl(r.imageUrl || "");
                                                    }}
                                                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-xl border border-gray-100 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </div>

                                            {/* Delete Action (Simplified) */}
                                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={async () => { if(confirm("Supprimer ?")) await deleteReal(r.id) }}
                                                    className="w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="px-2 pb-2">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{r.category || "Projet"}</p>
                                                    <h3 className="font-black text-sm text-[#0f172a] uppercase tracking-tighter leading-tight group-hover:text-[#ffbe0b] transition-colors">{r.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                                    <span className="text-[10px] font-black text-yellow-600">{r.rating || (4.5 + Math.random() * 0.5).toFixed(1)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-3">
                                                {r.price && (
                                                    <>
                                                        <span className="text-sm font-black text-emerald-600 uppercase tracking-tighter">{r.price}</span>
                                                        {r.oldPrice && (
                                                            <span className="text-[10px] font-bold text-gray-300 line-through uppercase tracking-tighter">{r.oldPrice}</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "notifications" && (
                        <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-14">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-tighter leading-none">Notifications</h1>
                                    <p className="text-gray-400 font-bold mt-2 opacity-80 underline decoration-red-100 underline-offset-4 text-xs md:text-base">Envoyez des messages importants à tous les utilisateurs.</p>
                                </div>
                                <button 
                                    onClick={() => setNotifModal({})}
                                    className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-tighter hover:bg-red-600 transition-all shadow-xl hover:scale-105 active:scale-95 text-xs md:text-sm w-full md:w-auto"
                                >
                                    <Plus size={20} className="inline-block mr-2" /> Créer une alerte
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {(data.notifications || []).length === 0 ? (
                                    <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-200 text-center">
                                        <Bell className="mx-auto text-gray-200 mb-4" size={64} />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Aucune notification envoyée</p>
                                    </div>
                                ) : (
                                    (data.notifications || []).map(n => (
                                        <div key={n.id} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className={`p-4 rounded-2xl ${n.type === 'info' ? 'bg-blue-50 text-blue-500' : n.type === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                                                    <Bell size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter">{n.title}</h3>
                                                    <p className="text-gray-500 font-medium text-sm mt-1">{n.message}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[10px] font-black uppercase bg-gray-50 px-2 py-1 rounded text-gray-400">
                                                            {new Date(n.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${n.type === 'info' ? 'bg-blue-500 text-white' : n.type === 'warning' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'}`}>
                                                            {n.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteNotification(n.id)}
                                                className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "services" && (
                        <motion.div key="services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-14">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-tighter leading-none">Nos Expertises</h1>
                                    <p className="text-gray-400 font-bold mt-2 opacity-80 underline decoration-purple-100 underline-offset-4 text-xs md:text-base">Gérez les services et expertises du Djapero Group.</p>
                                </div>
                                <button onClick={() => {
                                    setServiceModal({});
                                    setPreviewUrl("");
                                }} className="bg-[#10b981] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-tighter hover:bg-emerald-700 transition-all shadow-xl hover:scale-105 text-xs md:text-sm uppercase w-full md:w-auto"><Plus size={20} className="inline-block mr-2" /> Ajouter un service</button>
                            </div>
                            <div className="admin-product-grid">
                                {(data.services || []).map(s => (
                                    <div key={s.id} className="admin-product-card group bg-white">
                                         <div className="h-48 overflow-hidden relative p-8 flex items-center justify-center bg-emerald-50/30">
                                             <img src={s.imageUrl || undefined} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-700"/>
                                         </div>
                                         <div className="p-6">
                                             <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">{s.category}</div>
                                             <h3 className="font-black text-lg text-[#0f172a] truncate uppercase tracking-tighter mb-4">{s.name}</h3>
                                             <div className="flex gap-2">
                                                <button onClick={() => {
                                                    setServiceModal(s);
                                                    setPreviewUrl(s.imageUrl || "");
                                                }} className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#10b981] hover:text-white transition-all">Modifier</button>
                                                <button onClick={async () => { if(confirm("Supprimer ?")) await deleteService(s.id) }} className="p-3 text-red-400 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 size={18}/></button>
                                             </div>
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "membres" && (
                        <motion.div key="membres" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-14">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-tighter leading-none">Membres & Partenaires</h1>
                                    <p className="text-gray-400 font-bold mt-2 opacity-80 underline decoration-emerald-100 underline-offset-4 text-xs md:text-base">Liste des personnes ayant créé un profil sur la plateforme.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(data.users || []).length === 0 ? (
                                    <div className="col-span-full bg-white p-12 rounded-[2rem] border border-dashed border-gray-200 text-center">
                                        <Users className="mx-auto text-gray-200 mb-4" size={64} />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Aucun membre enregistré</p>
                                    </div>
                                ) : (
                                    (data.users || []).map(u => (
                                        <div key={u.uid} className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                                            <div className="relative z-10">
                                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-100/50">
                                                    <User size={32} className="text-emerald-600" />
                                                </div>
                                                <h3 className="text-2xl font-black text-[#0f172a] uppercase tracking-tighter leading-none mb-1">{u.fullName}</h3>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 rounded-lg text-emerald-600">
                                                        <ShieldCheck size={12} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">{u.role}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-lg text-gray-500">
                                                        <Briefcase size={12} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">{u.occupation}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 pt-4 border-t border-gray-50">
                                                    <div className="flex items-center gap-3 group/item">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-emerald-50 group-hover/item:text-emerald-500 transition-colors">
                                                            <Mail size={14} />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500 truncate">{u.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 group/item">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-emerald-50 group-hover/item:text-emerald-500 transition-colors">
                                                            <Phone size={14} />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500">{u.phone || "Non spécifié"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 group/item">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-emerald-50 group-hover/item:text-emerald-500 transition-colors">
                                                            <MapPin size={14} />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500">{u.city || "Non spécifié"}</span>
                                                    </div>
                                                </div>

                                                {u.about && (
                                                    <div className="mt-4 p-3 bg-gray-50 rounded-xl relative">
                                                        <p className="text-[10px] text-gray-400 italic line-clamp-2">"{u.about}"</p>
                                                    </div>
                                                )}

                                                <div className="mt-8 flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Inscrit le {u.completedAt ? (typeof u.completedAt === 'number' ? new Date(u.completedAt).toLocaleDateString() : (u.completedAt as any).toDate?.().toLocaleDateString() || "...") : "..."}</span>
                                                    <div className="flex items-center gap-2 text-emerald-500">
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Actif</span>
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "parametres" && (
                        <motion.div key="parametres" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="mb-10 md:mb-14">
                                <h1 className="text-3xl md:text-5xl font-black text-[#0f172a] uppercase tracking-tighter leading-none mb-4">Configuration</h1>
                                <p className="text-gray-400 font-bold text-base md:text-lg opacity-80">Gérez les informations de contact et les éléments visuels globaux.</p>
                            </div>

                            <div className="max-w-3xl bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[5rem] -mr-10 -mt-10" />
                                <form className="space-y-10 relative z-10" onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const success = await updateSettings({
                                        ...accueilSettings,
                                        whatsapp: formData.get("whatsapp") as string,
                                        call: formData.get("call") as string,
                                    });
                                    if (success) {
                                        alert("Paramètres enregistrées avec succès !");
                                    }
                                }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981] ml-2 block">Numéro WhatsApp</label>
                                            <input name="whatsapp" defaultValue={data.settings.whatsapp} className="w-full bg-emerald-50/30 px-6 py-5 rounded-2xl border-2 border-transparent focus:border-[#10b981] focus:bg-white outline-none transition-all font-black text-lg tracking-tighter" placeholder="228XXXXXXXX" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981] ml-2 block">Téléphone d'Appel</label>
                                            <input name="call" defaultValue={data.settings.call} className="w-full bg-emerald-50/30 px-6 py-5 rounded-2xl border-2 border-transparent focus:border-[#10b981] focus:bg-white outline-none transition-all font-black text-lg tracking-tighter" placeholder="+228 92..." />
                                        </div>
                                    </div>

                                    {/* Login Backgrounds Section */}
                                    <div className="space-y-6 pt-10 border-t border-gray-100">
                                        <div>
                                            <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter leading-none mb-2 underline decoration-emerald-500 underline-offset-4">Fonds de Page de Connexion</h3>
                                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest opacity-80">Gérez les images qui défilent en arrière-plan à l'entrée.</p>
                                        </div>

                                        <div className="space-y-4">
                                            {(accueilSettings.authBackgrounds || []).map((bg, idx) => (
                                                <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 items-start md:items-center group">
                                                    <div className="w-full md:w-32 h-20 bg-gray-200 rounded-xl overflow-hidden shadow-sm shrink-0">
                                                        <img src={bg.url} alt="BG" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 space-y-2 w-full">
                                                        <input 
                                                            className="w-full bg-white px-4 py-2 rounded-lg border border-transparent focus:border-emerald-500 outline-none font-bold text-sm tracking-tighter"
                                                            value={bg.label}
                                                            onChange={(e) => {
                                                                const newBgs = [...(accueilSettings.authBackgrounds || [])];
                                                                newBgs[idx] = { ...bg, label: e.target.value };
                                                                setAccueilSettings({ ...accueilSettings, authBackgrounds: newBgs });
                                                            }}
                                                            placeholder="Libellé (ex: USINE // TRANSFORMATION)"
                                                        />
                                                        <input 
                                                            className="w-full bg-white px-4 py-2 rounded-lg border border-transparent focus:border-emerald-500 outline-none font-medium text-[10px] text-gray-400"
                                                            value={bg.url}
                                                            onChange={(e) => {
                                                                const newBgs = [...(accueilSettings.authBackgrounds || [])];
                                                                newBgs[idx] = { ...bg, url: e.target.value };
                                                                setAccueilSettings({ ...accueilSettings, authBackgrounds: newBgs });
                                                            }}
                                                            placeholder="URL de l'image"
                                                        />
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            const newBgs = (accueilSettings.authBackgrounds || []).filter((_, i) => i !== idx);
                                                            setAccueilSettings({ ...accueilSettings, authBackgrounds: newBgs });
                                                        }}
                                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all self-end md:self-center"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add New Background */}
                                            <div className="p-6 border-2 border-dashed border-emerald-100 rounded-3xl bg-emerald-50/20 flex flex-col items-center gap-4 group hover:bg-emerald-50/40 transition-all">
                                                <div className="flex items-center gap-4 w-full">
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 ml-2">Nouvelle Image de Fond</p>
                                                        <div className="flex gap-4">
                                                            <button 
                                                                type="button"
                                                                onClick={async () => {
                                                                    const input = document.createElement('input');
                                                                    input.type = 'file';
                                                                    input.accept = 'image/*';
                                                                    input.onchange = async (e) => {
                                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                                        if (file) {
                                                                            const url = await handleFileUpload(file);
                                                                            if (url) {
                                                                                const newBgs = [...(accueilSettings.authBackgrounds || []), { url, label: "NOUVELLE IMAGE" }];
                                                                                setAccueilSettings({ ...accueilSettings, authBackgrounds: newBgs });
                                                                            }
                                                                        }
                                                                    };
                                                                    input.click();
                                                                }}
                                                                disabled={uploading}
                                                                className="flex-[2] bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <CloudUpload size={18} /> {uploading ? "Chargement..." : "Charger Image"}
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => {
                                                                    const url = prompt("Lien direct de l'image (https://...)");
                                                                    if (url) {
                                                                        const newBgs = [...(accueilSettings.authBackgrounds || []), { url, label: "IMAGE EXTERNE" }];
                                                                        setAccueilSettings({ ...accueilSettings, authBackgrounds: newBgs });
                                                                    }
                                                                }}
                                                                className="flex-1 bg-white border border-emerald-200 text-emerald-600 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-50 transition-all"
                                                            >
                                                                Lien Direct
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-[#0f172a] text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-[#10b981] transition-all flex items-center justify-center gap-4 shadow-xl transform hover:scale-[1.02] active:scale-95 group mb-4">
                                        <Save size={24} className="group-hover:rotate-12 transition-transform" /> Enregistrer les Paramètres
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={async () => {
                                            const jsonString = JSON.stringify(data, null, 2);
                                            const blob = new Blob([jsonString], { type: "application/json" });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement("a");
                                            a.href = url;
                                            a.download = `djapero-backup-${new Date().toISOString().split('T')[0]}.json`;
                                            a.click();
                                        }}
                                        className="w-full bg-gray-50 text-gray-400 py-4 rounded-xl font-black uppercase tracking-tighter text-[10px] hover:bg-gray-100 transition-all border border-dashed border-gray-200"
                                    >
                                        Générer un Backup (JSON)
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Product Modal */}
            {productModal && (
                <div className="modal-overlay px-4 py-8" onClick={() => setProductModal(null)}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="modal-card p-6 md:p-10 bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-full custom-scrollbar"
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="absolute top-6 right-6 md:top-8 md:right-8 text-gray-400 hover:text-black transition-colors" onClick={() => setProductModal(null)}><X size={24}/></button>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 uppercase tracking-tighter underline decoration-emerald-500 underline-offset-8">Produit Djapero</h2>
                        
                        {/* Live Image Preview */}
                        <div className="mb-8 w-full h-48 bg-gray-50 rounded-3xl flex items-center justify-center p-6 border-2 border-dashed border-gray-100 overflow-hidden relative group">
                            {uploading ? (
                                <div className="text-center w-full px-4">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2 overflow-hidden">
                                        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Chargement... {uploadProgress}%</p>
                                </div>
                            ) : (previewUrl && previewUrl !== "") ? (
                                <img src={previewUrl || undefined} className="max-h-full max-w-full object-contain animate-in fade-in zoom-in duration-300" onError={() => setPreviewUrl("")} />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center gap-2">
                                    <CameraIcon size={40} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Aperçu de l'image</p>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <CloudUpload className="text-white" size={40} />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await handleFileUpload(file);
                                            if (url) setPreviewUrl(url);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const formData = new FormData(e.currentTarget);
                                const updatedProduct = {
                                    name: formData.get("name") as string,
                                    category: formData.get("category") as string,
                                    price: formData.get("price") as string,
                                    description: formData.get("description") as string,
                                    imageUrl: previewUrl || formData.get("imageUrl") as string,
                                    badge: formData.get("badge") as string,
                                    createdAt: productModal.createdAt || Date.now()
                                };

                                if (productModal.id) {
                                    await updateProduct(productModal.id, updatedProduct);
                                } else {
                                    await addProduct(updatedProduct as any);
                                }
                                setProductModal(null);
                                alert("✅ Produit enregistré !");
                            } catch (err: any) {
                                console.error("Product submit error:", err);
                                let errorMsg = "Désolé! Erreur lors de l'enregistrement du produit.";
                                try {
                                    const parsed = JSON.parse(err.message);
                                    errorMsg = `Erreur (${parsed.operationType}): ${parsed.error}`;
                                } catch(e) {
                                    errorMsg = err.message || errorMsg;
                                }
                                alert(`❌ ${errorMsg}`);
                            }
                        }}>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Nom du produit *</label>
                                    <input required name="name" defaultValue={productModal.name} className="w-full bg-neutral-50 px-6 py-3 rounded-xl border border-neutral-100 focus:border-emerald-500 outline-none font-bold" placeholder="Mangues..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Catégorie</label>
                                        <input name="category" defaultValue={productModal.category} className="w-full bg-neutral-50 px-6 py-3 rounded-xl border border-neutral-100 focus:border-emerald-500 outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Prix (FCFA)</label>
                                        <input name="price" defaultValue={productModal.price} className="w-full bg-neutral-50 px-6 py-3 rounded-xl border border-neutral-100 focus:border-emerald-500 outline-none font-bold" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Description</label>
                                    <textarea name="description" defaultValue={productModal.description} className="w-full bg-neutral-50 px-6 py-3 rounded-xl border border-neutral-100 focus:border-emerald-500 outline-none font-medium h-24 resize-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">URL Image</label>
                                    <input 
                                        name="imageUrl" 
                                        defaultValue={productModal.imageUrl} 
                                        onChange={(e) => setPreviewUrl(e.target.value)}
                                        className="w-full bg-neutral-50 px-6 py-3 rounded-xl border border-neutral-100 focus:border-emerald-500 outline-none font-medium text-xs truncate" 
                                        placeholder="https://..." 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Badge (Ex: NEW, PROMO)</label>
                                    <input name="badge" defaultValue={productModal.badge} className="w-full bg-neutral-50 px-6 py-3 rounded-xl border border-neutral-100 focus:border-emerald-500 outline-none font-black uppercase" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-600 transition-colors">
                                Enregistrer
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Video Modal */}
            {videoModal && (
                <div className="modal-overlay px-4 py-8" onClick={() => setVideoModal(null)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-card p-6 md:p-10 bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-full custom-scrollbar" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-6 right-6 md:top-8 md:right-8 text-gray-400 hover:text-black transition-colors" onClick={() => setVideoModal(null)}><X size={24}/></button>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 uppercase tracking-tighter underline decoration-blue-500 underline-offset-8">Vidéo Sociale</h2>
                        
                        {/* Thumbnail Upload Area */}
                        <div className="mb-8 w-full aspect-video bg-[#0f172a] rounded-[2rem] flex items-center justify-center p-0 border-4 border-white shadow-xl overflow-hidden relative group">
                            {(previewUrl || videoModal.thumbnail) ? (
                                <img src={previewUrl || videoModal.thumbnail || undefined} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-80" alt="Preview" onError={() => setPreviewUrl("")} />
                            ) : (
                                <div className="text-white/20 flex flex-col items-center gap-3">
                                    <ImageIcon size={32} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Image de couverture</p>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-blue-600/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer text-white">
                                <CloudUpload size={40} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-3">{previewUrl ? "Changer la couverture" : "Ajouter une couverture"}</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (!file.type.startsWith('image/')) {
                                                alert("Veuillez choisir une IMAGE pour la couverture.");
                                                return;
                                            }
                                            const url = await handleFileUpload(file);
                                            if (url) setPreviewUrl(url);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button 
                                    type="button"
                                    onClick={() => setVideoSrcType('youtube')}
                                    className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${videoSrcType === 'youtube' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-400'}`}
                                >
                                    Lien YouTube
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setVideoSrcType('file')}
                                    className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${videoSrcType === 'file' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-400'}`}
                                >
                                    Fichier Vidéo
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const formData = new FormData(e.currentTarget);
                                    const updatedVideo = {
                                        title: formData.get("title") as string,
                                        caption: formData.get("caption") as string,
                                        src: videoSrcType === 'file' ? videoPreviewUrl : getYoutubeId(formData.get("src") as string),
                                        srcType: videoSrcType, 
                                        thumbnail: previewUrl || formData.get("thumbnail") as string,
                                        createdAt: videoModal.createdAt || Date.now()
                                    };

                                    if (videoModal.id) {
                                        await updateVideo(videoModal.id, updatedVideo);
                                    } else {
                                        await addVideo(updatedVideo as any);
                                    }
                                    setVideoModal(null);
                                    alert("✅ Vidéo publiée !");
                                } catch (err: any) {
                                    console.error("Video submit error:", err);
                                    let errorMsg = "Oups! Erreur lors de la publication de la vidéo.";
                                    try {
                                        const parsed = JSON.parse(err.message);
                                        errorMsg = `Erreur (${parsed.operationType}): ${parsed.error}`;
                                    } catch(e) {
                                        errorMsg = err.message || errorMsg;
                                    }
                                    alert(`❌ ${errorMsg}`);
                                }
                            }}>
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Titre de la vidéo *</label>
                                    <input required name="title" defaultValue={videoModal.title} className="w-full bg-neutral-100/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Légende (Caption)</label>
                                    <input name="caption" defaultValue={videoModal.caption} className="w-full bg-neutral-100/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-medium" placeholder="Ex: Découvrez notre nouveau snack !" />
                                </div>
                                {videoSrcType === 'youtube' ? (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Lien YouTube / Shorts *</label>
                                        <input required name="src" defaultValue={videoModal.src} className="w-full bg-neutral-100/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-medium" placeholder="Ex: https://www.youtube.com/shorts/..." />
                                        <p className="text-[9px] text-gray-400 mt-2 ml-2 italic">Copiez-collez simplement l'adresse de votre vidéo YouTube ou YouTube Shorts.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between ml-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">Fichier Vidéo (MP4, MOV) *</label>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase">Max 500 Mo</span>
                                        </div>
                                        <div className="p-8 bg-blue-50/30 rounded-3xl border-4 border-white shadow-inner flex flex-col items-center justify-center gap-4 relative group hover:bg-blue-50/50 transition-all overflow-hidden min-h-[220px]">
                                            {uploading ? (
                                                <div className="text-center w-full px-6 z-10">
                                                    <div className="w-full bg-white rounded-full h-3 mb-3 overflow-hidden shadow-sm">
                                                        <div className="bg-blue-600 h-3 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.5)]" style={{ width: `${uploadProgress}%` }}></div>
                                                    </div>
                                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Envoi en cours... {uploadProgress}%</p>
                                                    <p className="text-[8px] text-blue-400 mt-2 font-bold uppercase">Ne fermez pas cette fenêtre</p>
                                                    <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-blue-100">
                                                        <p className="text-[8px] text-blue-600 font-bold uppercase leading-relaxed">
                                                            💡 Astuce : Si l'envoi est trop long, essayez de compresser votre vidéo ou utilisez un lien YouTube pour une vitesse instantanée.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (videoPreviewUrl && videoPreviewUrl !== "") ? (
                                                <div className="text-center w-full z-10">
                                                    <div className="aspect-video w-full max-w-[280px] mx-auto bg-black rounded-2xl overflow-hidden mb-4 shadow-2xl ring-4 ring-white relative group/player">
                                                        <video src={videoPreviewUrl || undefined} className="w-full h-full object-cover" autoPlay muted loop />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/player:opacity-100 transition-opacity">
                                                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                                                                <Play size={24} fill="currentColor" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Vidéo importée avec succès !</p>
                                                    <button type="button" onClick={() => setVideoPreviewUrl("")} className="text-red-500 text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all px-6 py-2 rounded-full border-2 border-red-100 flex items-center gap-2 mx-auto justify-center bg-white shadow-sm">
                                                        <Trash2 size={12} /> Supprimer et changer
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center z-10">
                                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-400 mb-4 mx-auto group-hover:scale-110 group-hover:text-blue-600 transition-all">
                                                        <CloudUpload size={32} />
                                                    </div>
                                                    <p className="text-[11px] font-black text-blue-900/60 uppercase tracking-[0.2em] mb-1">Cliquer pour importer</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Le fichier sera transformé en paysage si nécessaire</p>
                                                </div>
                                            )}
                                            {!uploading && (
                                                <input 
                                                    type="file" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                                    accept="video/mp4,video/x-m4v,video/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            if (!file.type.startsWith('video/')) {
                                                                alert("❌ Veuillez choisir un fichier vidéo valide (MP4, MOV, etc.).");
                                                                return;
                                                            }

                                                            const MAX_SIZE = 500 * 1024 * 1024; // 500MB
                                                            if (file.size > MAX_SIZE) {
                                                                alert(`❌ Fichier trop lourd (${(file.size / (1024 * 1024)).toFixed(1)}Mo). La limite est de 500Mo.`);
                                                                return;
                                                            }
                                                            
                                                            console.log(`Starting upload for: ${file.name} (${file.size} bytes)`);
                                                            const url = await handleFileUpload(file);
                                                            if (url) {
                                                                setVideoPreviewUrl(url);
                                                                setTimeout(() => {
                                                                    alert("✅ Vidéo importée avec succès ! Elle s'affichera automatiquement sur le tableau de bord.");
                                                                }, 500);
                                                            } else {
                                                                alert("❌ L'importation a échoué. Vérifiez votre connexion.");
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                            {/* Decorative background for the zone */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
                                        </div>
                                        {videoPreviewUrl && <input type="hidden" name="src" value={videoPreviewUrl} />}
                                    </div>
                                )}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">URL Miniature (Optionnel)</label>
                                    <input 
                                        name="thumbnail" 
                                        defaultValue={videoModal.thumbnail} 
                                        onChange={(e) => setPreviewUrl(e.target.value)}
                                        className="w-full bg-neutral-100/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-medium truncate" 
                                        placeholder="https://..."
                                    />
                                </div>
                                        <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                                            {uploading ? `Chargement ${uploadProgress}%...` : "Publier la vidéo"}
                                        </button>
                            </form>
                    </motion.div>
                </div>
            )}

            {/* Service Modal */}
            {serviceModal && (
                <div className="modal-overlay px-4 py-8" onClick={() => setServiceModal(null)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-card p-6 md:p-10 bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-full custom-scrollbar" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-6 right-6 md:top-8 md:right-8 text-gray-400 hover:text-black transition-colors" onClick={() => setServiceModal(null)}><X size={24}/></button>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 uppercase tracking-tighter underline decoration-[#10b981] underline-offset-8">L'Expertise Djapero</h2>
                        
                        {/* Live Image Preview */}
                        <div className="mb-8 w-full h-40 bg-emerald-50/30 rounded-3xl flex items-center justify-center p-6 border-2 border-dashed border-emerald-100 overflow-hidden relative group">
                            {previewUrl ? (
                                <img src={previewUrl || undefined} className="max-h-full max-w-full object-contain animate-in fade-in zoom-in duration-300" onError={() => setPreviewUrl("")} />
                            ) : (
                                <div className="text-emerald-200 flex flex-col items-center gap-2">
                                    <Briefcase size={32} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Aperçu Icône</p>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <CloudUpload className="text-emerald-500" size={40} />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await handleFileUpload(file);
                                            if (url) setPreviewUrl(url);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const formData = new FormData(e.currentTarget);
                                const updatedService = {
                                    name: formData.get("name") as string,
                                    category: formData.get("category") as string,
                                    description: formData.get("description") as string,
                                    imageUrl: previewUrl || formData.get("imageUrl") as string,
                                    createdAt: serviceModal.createdAt || Date.now()
                                };

                                if (serviceModal.id) {
                                    await updateService(serviceModal.id, updatedService);
                                } else {
                                    await addService(updatedService as any);
                                }
                                setServiceModal(null);
                                alert("✅ Expertise enregistrée !");
                            } catch (err: any) {
                                console.error("Service submit error:", err);
                                let errorMsg = "Attention! Erreur lors de l'enregistrement du service.";
                                try {
                                    const parsed = JSON.parse(err.message);
                                    errorMsg = `Erreur (${parsed.operationType}): ${parsed.error}`;
                                } catch(e) {
                                    errorMsg = err.message || errorMsg;
                                }
                                alert(`❌ ${errorMsg}`);
                            }
                        }}>
                             <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Nom de l'Expertise (Titre) *</label>
                                    <input 
                                        required 
                                        name="name" 
                                        defaultValue={serviceModal.name} 
                                        className="w-full bg-neutral-100/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-[#10b981] outline-none font-black uppercase" 
                                        placeholder="EX: DESIGN GRAPHIQUE"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Catégorie (Sous-titre)</label>
                                    <input 
                                        name="category" 
                                        defaultValue={serviceModal.category} 
                                        className="w-full bg-neutral-100/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-[#10b981] outline-none font-bold uppercase" 
                                        placeholder="EX: CRÉATION DIGITALE"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">URL Image / Icône</label>
                                    <input 
                                        name="imageUrl" 
                                        defaultValue={serviceModal.imageUrl} 
                                        onChange={(e) => setPreviewUrl(e.target.value)}
                                        className="w-full bg-neutral-100/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-[#10b981] outline-none font-medium" 
                                        placeholder="https://..."
                                    />
                                    <p className="text-[9px] text-gray-400 mt-2 ml-2 font-bold uppercase tracking-widest italic">Note: Vous pouvez aussi glisser une image dans le cadre ci-dessus</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-1 block ml-2">Description</label>
                                    <textarea 
                                        name="description" 
                                        defaultValue={serviceModal.description} 
                                        className="w-full bg-neutral-100/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-[#10b981] outline-none font-medium h-32 resize-none" 
                                        placeholder="Description détaillée de l'expertise..."
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-[#10b981] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all hover:scale-[1.02]">
                                Enregistrer l'expertise
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Portfolio Modal */}
            {realModal && (
                <div className="modal-overlay px-4 py-8" onClick={() => setRealModal(null)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-card p-6 md:p-12 bg-white rounded-[3rem] md:rounded-[4rem] w-full max-w-2xl shadow-2xl relative overflow-y-auto max-h-full no-scrollbar px-6 md:px-12" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" onClick={() => setRealModal(null)}><X size={28}/></button>
                        
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-10 h-1 bg-yellow-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600">Portfolio Card Elite</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85] text-[#0f172a]">
                                {realModal.id ? "Détails Création." : "Nouveau Projet."}
                            </h2>
                        </div>
                        
                        {/* Live Image Preview */}
                        <div className="mb-10 w-full aspect-[4/3] bg-gray-50 rounded-[2.5rem] flex items-center justify-center p-0 border-2 border-dashed border-gray-100 overflow-hidden relative group shadow-inner transition-all hover:bg-gray-100/50">
                            {(previewUrl || realModal.imageUrl) ? (
                                <img src={previewUrl || realModal.imageUrl || undefined} className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" onError={() => setPreviewUrl("")} />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                                        <CameraIcon size={40} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Visuel Portfolio</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Image haute qualité recommandée</p>
                                    </div>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                                <CloudUpload className="text-white" size={48} />
                                <p className="text-white font-black text-[12px] uppercase tracking-[0.2em] mt-4">Uploader Photo</p>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await handleFileUpload(file);
                                            if (url) setPreviewUrl(url);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <form className="space-y-8" onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const formData = new FormData(e.currentTarget);
                                const updatedReal = {
                                    title: formData.get("title") as string,
                                    category: formData.get("category") as string,
                                    imageUrl: previewUrl || (formData.get("imageUrl") as string) || (realModal.imageUrl as string),
                                    price: formData.get("price") as string,
                                    oldPrice: formData.get("oldPrice") as string,
                                    rating: Number(formData.get("rating")) || 5,
                                    badge: formData.get("badge") as string,
                                    createdAt: realModal.createdAt || Date.now()
                                };

                                if (realModal.id) {
                                    await updateReal(realModal.id, updatedReal);
                                } else {
                                    await addReal(updatedReal as any);
                                }
                                setRealModal(null);
                                alert("✅ Portfolio mis à jour !");
                            } catch (err: any) {
                                console.error("Real submit error:", err);
                                alert(`❌ Erreur: ${err.message}`);
                            }
                        }}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Nom du Projet / Produit *</label>
                                        <input required name="title" defaultValue={realModal.title} className="admin-input-refined text-lg" placeholder="Djapero Fresh Pack..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Catégorie *</label>
                                        <input required name="category" defaultValue={realModal.category} className="admin-input-refined text-lg" placeholder="Agro-Industrie" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Badge (Ex: 50% off)</label>
                                        <input name="badge" defaultValue={realModal.badge} className="admin-input-refined text-lg" placeholder="50% off" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Prix Actuel</label>
                                            <input name="price" defaultValue={realModal.price} className="admin-input-refined" placeholder="30.00 $" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Prix Promo</label>
                                            <input name="oldPrice" defaultValue={realModal.oldPrice} className="admin-input-refined" placeholder="60.00 $" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Note (1-5)</label>
                                        <input type="number" step="0.1" max="5" min="0" name="rating" defaultValue={realModal.rating || 5} className="admin-input-refined" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">URL Image Alternative</label>
                                        <input name="imageUrl" defaultValue={realModal.imageUrl} onChange={(e) => setPreviewUrl(e.target.value)} className="admin-input-refined text-[10px] truncate" placeholder="https://..." />
                                    </div>
                                </div>
                             </div>
                            
                            <button type="submit" className="w-full bg-[#ffbe0b] text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-yellow-500 transition-all hover:scale-[1.02] active:scale-95">
                                Publier dans le Portfolio
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Market Modal */}
            {marketModal && (
                <div className="modal-overlay px-4 py-8" onClick={() => setMarketModal(null)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-card p-6 md:p-12 bg-white rounded-[3rem] md:rounded-[4rem] w-full max-w-2xl shadow-2xl relative overflow-y-auto max-h-full no-scrollbar" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" onClick={() => setMarketModal(null)}><X size={28}/></button>
                        
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-10 h-1 bg-orange-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Marketplace Entry</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85] text-[#0f172a]">
                                {marketModal.id ? "Détails de l'article." : "Ajouter au Marché."}
                            </h2>
                        </div>

                        {/* Live Image Preview */}
                        <div className="mb-10 w-full h-64 bg-gray-50 rounded-[2.5rem] flex items-center justify-center p-6 border-2 border-dashed border-gray-100 overflow-hidden relative group shadow-inner transition-all hover:bg-gray-100/50">
                            {(previewUrl || marketModal.imageUrl) ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img 
                                        src={previewUrl || marketModal.imageUrl || undefined} 
                                        className={`max-h-full max-w-full object-contain transition-all duration-500 rounded-3xl ${uploading ? 'opacity-30 blur-sm' : 'opacity-100 blur-0'}`} 
                                        onError={() => setPreviewUrl("")} 
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-orange-600 font-black text-xs uppercase tracking-widest animate-pulse">Chargement...</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                                        <CameraIcon size={40} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Aperçu Photo Marché</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Image de couverture</p>
                                    </div>
                                </div>
                            )}
                            {!uploading && (
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <CloudUpload className="text-white" size={48} />
                                        <p className="text-white font-black text-[12px] uppercase tracking-[0.2em]">Charger une image</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const url = await handleFileUpload(file);
                                                if (url) {
                                                    setPreviewUrl(url);
                                                }
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                        
                        <form className="space-y-8" onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const formData = new FormData(e.currentTarget);
                                const itemData = {
                                    name: formData.get("name") as string,
                                    category: formData.get("category") as string,
                                    price: formData.get("price") as string,
                                    location: formData.get("location") as string,
                                    imageUrl: previewUrl || (formData.get("imageUrl") as string) || (marketModal.imageUrl as string),
                                    shopName: formData.get("shopName") as string,
                                    description: formData.get("description") as string,
                                    phone: formData.get("phone") as string,
                                    creatorId: marketModal.creatorId || user?.uid || "",
                                    createdAt: marketModal.createdAt || Date.now()
                                };

                                if (marketModal.id) {
                                    await updateMarketItem(marketModal.id, itemData);
                                } else {
                                    await addMarketItem(itemData as any);
                                }

                                setPreviewUrl("");
                                setMarketModal(null);
                                alert("✅ Article publié sur le marché !");
                            } catch (err: any) {
                                console.error("Market submit error:", err);
                                let errorMsg = "Erreur lors de l'enregistrement.";
                                try {
                                    const parsed = JSON.parse(err.message);
                                    errorMsg = parsed.error;
                                } catch(e) {
                                    errorMsg = err.message || errorMsg;
                                }
                                alert(`❌ ${errorMsg}`);
                            }
                        }}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Nom du produit *</label>
                                        <input 
                                            required 
                                            name="name" 
                                            value={marketModal.name || ""} 
                                            onChange={e => setMarketModal({...marketModal, name: e.target.value})}
                                            className="admin-input-refined text-lg" 
                                            placeholder="Ladoum, Chips, etc." 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Prix *</label>
                                        <input 
                                            required 
                                            name="price" 
                                            value={marketModal.price || ""} 
                                            onChange={e => setMarketModal({...marketModal, price: e.target.value})}
                                            className="admin-input-refined text-lg" 
                                            placeholder="150 000" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Ville / Pays *</label>
                                         <div className="flex items-center gap-3">
                                             <div className="admin-input-icon-wrapper flex-1">
                                                 <MapPin className="admin-input-icon text-orange-500" size={20} />
                                                 <input 
                                                     required 
                                                     name="location" 
                                                     value={marketModal.location || ""} 
                                                     onChange={e => setMarketModal({...marketModal, location: e.target.value})}
                                                     className="admin-input-with-icon text-lg" 
                                                     placeholder="Dakar, Sénégal" 
                                                 />
                                             </div>
                                             <button 
                                                 type="button"
                                                 id="geo-btn-admin-market"
                                                 onClick={() => {
                                                     if ("geolocation" in navigator) {
                                                         const btn = document.getElementById('geo-btn-admin-market');
                                                         if (btn) btn.classList.add('animate-pulse');
                                                         navigator.geolocation.getCurrentPosition(async (position) => {
                                                             try {
                                                                 const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
                                                                 const data = await res.json();
                                                                 const city = data.address.city || data.address.town || data.address.village;
                                                                 const country = data.address.country;
                                                                 const locationStr = city ? `${city}, ${country}` : country;
                                                                 setMarketModal({...marketModal, location: locationStr});
                                                             } catch (err) {
                                                                 alert("Erreur GPS.");
                                                             } finally {
                                                                 if (btn) btn.classList.remove('animate-pulse');
                                                             }
                                                         }, () => {
                                                             alert("GPS désactivé.");
                                                             if (btn) btn.classList.remove('animate-pulse');
                                                         });
                                                     }
                                                 }}
                                                 className="bg-orange-50 text-orange-600 h-[64px] w-[64px] rounded-2xl hover:bg-orange-100 transition-all flex items-center justify-center shrink-0 border border-orange-100/50 active:scale-95"
                                                 title="Me localiser"
                                             >
                                                 <MapPin size={24} />
                                             </button>
                                         </div>
                                     </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Catégorie *</label>
                                        <div className="relative group">
                                            <select 
                                                name="category" 
                                                value={marketModal.category || "legumes"} 
                                                onChange={e => setMarketModal({...marketModal, category: e.target.value})}
                                                className="admin-input-refined appearance-none cursor-pointer pr-16 text-lg"
                                            >
                                                <option value="legumes">Légumes & Fruits</option>
                                                <option value="elevage">Élevage (Moutons...)</option>
                                                <option value="snacks">Chips & Snacks</option>
                                                <option value="biscuits">Biscuits</option>
                                                <option value="accessoires">Accessoires / Autres</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-orange-500 transition-colors">
                                                <Filter size={20} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Boutique (Optionnel)</label>
                                        <div className="admin-input-icon-wrapper">
                                            <StoreIcon className="admin-input-icon text-orange-500" size={20} />
                                            <input 
                                                name="shopName" 
                                                value={marketModal.shopName || ""} 
                                                onChange={e => setMarketModal({...marketModal, shopName: e.target.value})}
                                                className="admin-input-with-icon text-lg" 
                                                placeholder="ex: Ferme Bio" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Téléphone</label>
                                        <div className="admin-input-icon-wrapper">
                                            <Phone className="admin-input-icon text-orange-500" size={20} />
                                            <input 
                                                name="phone" 
                                                value={marketModal.phone || ""} 
                                                onChange={e => setMarketModal({...marketModal, phone: e.target.value})}
                                                className="admin-input-with-icon text-lg" 
                                                placeholder="+228..." 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Description</label>
                                <textarea 
                                    name="description" 
                                    value={marketModal.description || ""} 
                                    onChange={e => setMarketModal({...marketModal, description: e.target.value})}
                                    className="admin-input-refined h-32 py-4 resize-none" 
                                    placeholder="Décrivez votre produit en quelques mots..."
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">URL de l'image (automatique si uploadé)</label>
                                <div className="admin-input-icon-wrapper">
                                    <CameraIcon className="admin-input-icon text-gray-400" size={20} />
                                    <input 
                                        name="imageUrl" 
                                        value={previewUrl || marketModal.imageUrl || ""} 
                                        onChange={(e) => setPreviewUrl(e.target.value)}
                                        className="admin-input-with-icon text-lg" 
                                        placeholder="https://..." 
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setMarketModal(null)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all">Annuler</button>
                                <button type="submit" className="flex-[2] bg-[#0f172a] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-gray-400 hover:bg-orange-500 transition-all hover:scale-[1.02]">
                                    {marketModal.id ? "Sauvegarder" : "Publier l'article"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Notification Modal */}
            {notifModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setNotifModal(null)}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="bg-white w-full max-w-lg rounded-[3rem] p-8 md:p-12 relative shadow-2xl" 
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors" 
                            onClick={() => setNotifModal(null)}
                        >
                            <X size={32} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-3xl font-black tracking-tighter text-[#0f172a] uppercase leading-none mb-2">Nouvelle <br/><span className="text-red-600">Alerte.</span></h2>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest pl-1">Diffusez un message à la communauté.</p>
                        </div>

                        <form onSubmit={handleSendNotification} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Titre du message</label>
                                <input 
                                    name="title" 
                                    required 
                                    className="w-full bg-gray-50 border border-gray-100 px-8 py-5 rounded-[1.5rem] text-gray-900 outline-none focus:bg-white focus:border-red-500 transition-all font-black text-lg" 
                                    placeholder="ex: Promotion Spéciale !" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Contenu de la notification</label>
                                <textarea 
                                    name="message" 
                                    required 
                                    rows={4}
                                    className="w-full bg-gray-50 border border-gray-100 px-8 py-5 rounded-[1.5rem] text-gray-900 outline-none focus:bg-white focus:border-red-500 transition-all font-bold text-sm" 
                                    placeholder="Écrivez votre message ici..." 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Type d'alerte</label>
                                <select 
                                    name="type" 
                                    className="w-full bg-gray-50 border border-gray-100 px-8 py-5 rounded-[1.5rem] text-gray-900 outline-none focus:bg-white focus:border-red-500 transition-all font-black text-lg appearance-none cursor-pointer"
                                >
                                    <option value="info">Information (Bleu)</option>
                                    <option value="warning">Avertissement (Orange)</option>
                                    <option value="urgent">Urgent (Rouge)</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={sendingNotif}
                                className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-4 shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                            >
                                {sendingNotif ? "Envoi en cours..." : <><Bell size={24} /> Envoyer la notification</>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
