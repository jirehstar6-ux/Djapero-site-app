import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
    ShoppingBag, 
    Search, 
    MapPin, 
    Filter, 
    Store as StoreIcon, 
    Phone, 
    Plus, 
    X, 
    LayoutDashboard, 
    Shirt, 
    Smartphone, 
    Home as HomeIcon, 
    Briefcase, 
    Sparkles, 
    Car, 
    Package,
    ArrowRight
} from "lucide-react";
import { useData } from "../hooks/useData";

import { useTheme } from "../context/ThemeContext";

const categories = [
    { id: "all", label: "Tout", icon: LayoutDashboard },
    { id: "alimentation", label: "Alimentation", icon: ShoppingBag },
    { id: "vetements", label: "Vêtements", icon: Shirt },
    { id: "electronique", label: "Électronique", icon: Smartphone },
    { id: "immobilier", label: "Immobilier", icon: HomeIcon },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "beauté", label: "Beauté", icon: Sparkles },
    { id: "auto", label: "Auto/Moto", icon: Car },
    { id: "autres", label: "Autres", icon: Package },
];

export default function Market() {
    const { data, loading } = useData();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showCategories, setShowCategories] = useState(true);
    const [showMapsOptions, setShowMapsOptions] = useState(false);

    const rawItems = data?.marketItems || [];
    const [displayCount, setDisplayCount] = useState(10);
    
    const filteredItems = rawItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const displayedItems = filteredItems.slice(0, displayCount);
    const hasMore = filteredItems.length > displayCount;

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isLight ? 'bg-gray-50' : theme === 'dark' ? 'bg-[#020617]' : 'bg-[#1b4332]'}`}>
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-500 pb-20 ${isLight ? 'bg-white text-slate-900' : 'text-white'}`}>
            {/* Header / Hero Section - Professional Light Theme */}
            <div className={`pt-32 pb-24 px-4 relative overflow-hidden border-b transition-colors duration-500 ${isLight ? 'bg-white border-gray-100' : 'border-white/5'}`}>
                {/* Subtle abstract background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] -ml-24 -mb-24" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl text-center md:text-left"
                        >
                            <span className="inline-block bg-orange-500/10 text-orange-600 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] mb-6 border border-orange-500/20">
                                Marketplace Djapero
                            </span>
                            <h1 className={`text-5xl md:text-8xl font-black tracking-tight uppercase leading-[0.9] ${isLight ? 'text-gray-900' : 'text-white'}`}>
                                Le Marché <br />
                                <span className="text-orange-500">Local & Connecté.</span>
                            </h1>
                            <p className={`mt-8 font-medium text-lg md:text-xl leading-relaxed ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
                                Découvrez les meilleurs marchés d'Afrique du Sud et du Togo. <br className="hidden md:block" />
                                <span className={`underline decoration-orange-500 decoration-2 underline-offset-8 ${isLight ? 'text-gray-900' : 'text-white'}`}>Trouvez vos légumes frais</span> et produits de qualité en un instant.
                            </p>
                        </motion.div>
                    </div>

                    {/* Search Bar section on Dark Theme */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-5xl"
                    >
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className={`flex-1 relative group rounded-3xl border transition-all outline-none ${isLight ? 'bg-gray-50 border-gray-200 focus-within:bg-white focus-within:border-orange-500/50' : 'bg-white/5 border-white/10 focus-within:bg-white/10 focus-within:border-orange-500/50'}`}>
                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                    <Search className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={24} />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Que cherchez-vous ? (Légumes, Élevage...)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full bg-transparent rounded-3xl pl-16 pr-5 py-6 outline-none text-base md:text-lg font-bold placeholder:text-slate-400 ${isLight ? 'text-gray-900' : 'text-white'}`}
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <div className={`flex-1 md:w-64 relative group rounded-[2rem] border transition-all ${isLight ? 'bg-gray-50 border-gray-200 focus-within:bg-white focus-within:border-orange-500/50' : 'bg-white/5 border-white/10 focus-within:bg-white/10 focus-within:border-orange-500/50'}`}>
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <MapPin className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    </div>
                                    <select 
                                        className={`w-full bg-transparent rounded-[2rem] pl-14 pr-10 py-6 outline-none text-sm font-bold appearance-none cursor-pointer ${isLight ? 'text-gray-900' : 'text-white'}`}
                                        onChange={(e) => e.target.value && setSearchTerm(e.target.value)}
                                    >
                                        <option value="" className="text-black">Toutes zones</option>
                                        <option value="Togo" className="text-black">Togo</option>
                                        <option value="Afrique du Sud" className="text-black">Afrique du Sud</option>
                                        <option value="Bénin" className="text-black">Bénin</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-slate-500">
                                        <ArrowRight size={16} className="rotate-90" />
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowMapsOptions(!showMapsOptions)}
                                    className={`px-8 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 border shadow-sm ${
                                        showMapsOptions 
                                        ? "bg-orange-500 text-white border-orange-400 shadow-orange-500/20" 
                                        : (isLight ? "bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10")
                                    }`}
                                >
                                    <img src="https://www.google.com/images/branding/product/2x/maps_96in128dp.png" alt="GMaps" className="w-5" />
                                    <span className="hidden sm:inline">Explorer Maps</span>
                                </button>

                                <button 
                                    onClick={() => setShowCategories(!showCategories)}
                                    className={`px-8 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 border shadow-sm ${
                                        showCategories 
                                        ? (isLight ? "bg-white text-slate-900 border-white shadow-xl shadow-white/10" : "bg-white/20 text-white border-white/30 shadow-xl shadow-black/20")
                                        : (isLight ? "bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10")
                                    }`}
                                >
                                    <Filter size={20} strokeWidth={3} />
                                    <span className="hidden sm:inline">Catégories</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-2 items-center flex">Suggestions:</span>
                            {['Légumes', 'Élevage', 'Lomé', 'Cape Town', 'Fruits'].map((tag) => (
                                <button 
                                    key={tag}
                                    onClick={() => setSearchTerm(tag)}
                                    className={`text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-xl transition-all border ${isLight ? 'text-slate-400 bg-gray-50 border-gray-100 hover:bg-orange-500 hover:text-white hover:border-orange-500' : 'text-white/40 bg-white/5 border-white/5 hover:bg-orange-500 hover:text-white hover:border-orange-500'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {showMapsOptions && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mt-6 flex flex-wrap gap-3 backdrop-blur-sm p-6 rounded-3xl border ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/10'}`}
                                >
                                    <div className="w-full mb-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Explorer les marchés locaux sur Google Maps</p>
                                    </div>
                                    <button 
                                        onClick={() => window.open('https://www.google.com/maps/search/marchés+de+légumes+Togo', '_blank')}
                                        className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm flex items-center gap-3 border ${isLight ? 'bg-white text-gray-800 border-gray-100 hover:bg-orange-500 hover:text-white' : 'bg-white/10 text-white border-white/10 hover:bg-orange-500'}`}
                                    >
                                        <MapPin size={16} /> Togo
                                    </button>
                                    <button 
                                        onClick={() => window.open('https://www.google.com/maps/search/markets+in+South+Africa+Cape+Town+Johannesburg', '_blank')}
                                        className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm flex items-center gap-3 border ${isLight ? 'bg-white text-gray-800 border-gray-100 hover:bg-indigo-500 hover:text-white' : 'bg-white/10 text-white border-white/10 hover:bg-indigo-500'}`}
                                    >
                                        <MapPin size={16} /> South Africa
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Categories scroll - Cleaner design */}
            <AnimatePresence>
                {showCategories && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-500 ${isLight ? 'bg-white/90 border-slate-100 shadow-sm' : 'bg-[#020617]/80 border-white/5'}`}
                    >
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex items-center gap-3 overflow-x-auto py-6 no-scrollbar">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all border ${
                                            activeCategory === cat.id 
                                            ? "bg-orange-500 text-white border-orange-400 shadow-xl shadow-orange-500/20" 
                                            : (isLight ? "bg-slate-50 text-slate-400 hover:bg-white hover:text-slate-900 border-slate-100" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border-white/5")
                                        }`}
                                    >
                                        <cat.icon size={16} strokeWidth={3} />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Grid - Improved Cards */}
            <div className="max-w-7xl mx-auto px-4 mt-12 mb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
                    <AnimatePresence mode="popLayout">
                        {displayedItems.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => setSelectedItem(item)}
                                className={`group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border cursor-pointer flex flex-col h-full ${isLight ? 'bg-white border-slate-100' : 'bg-[#0f172a] border-white/5'}`}
                            >
                                {/* Image Container */}
                                <div className={`aspect-[4/5] overflow-hidden relative ${isLight ? 'bg-slate-50' : 'bg-black/20'}`}>
                                    <img 
                                        src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl shadow-sm border border-slate-100">
                                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-5 left-5 right-5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                         <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-xl">
                                             <Plus size={24} strokeWidth={3} />
                                         </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-0.5 bg-orange-500/30 rounded-full" />
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.shopName}</span>
                                    </div>
                                    <h3 className={`text-xl font-black uppercase tracking-tighter leading-tight mb-4 line-clamp-2 min-h-[3rem] ${isLight ? 'text-slate-800' : 'text-white'}`}>
                                        {item.name}
                                    </h3>
                                    
                                    <div className={`mt-auto flex items-center justify-between pt-6 border-t ${isLight ? 'border-slate-50' : 'border-white/5'}`}>
                                        <div className="flex flex-col">
                                            <span className={`text-2xl font-black transition-colors ${isLight ? 'text-slate-900 group-hover:text-orange-500' : 'text-white group-hover:text-orange-500'}`}>
                                                {item.price} <span className="text-[10px] text-slate-400">XAF</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-amber-500 transition-colors">
                                            <MapPin size={12} strokeWidth={3} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{item.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {hasMore && (
                    <div className="mt-12 flex justify-center">
                        <button 
                            onClick={() => setDisplayCount(prev => prev + 10)}
                            className="bg-orange-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                        >
                            Voir Plus d'Articles
                        </button>
                    </div>
                )}

                {filteredItems.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-center py-20 rounded-[3rem] border-2 border-dashed mt-8 ${isLight ? 'bg-white border-gray-100' : 'bg-white/5 border-white/10'}`}
                    >
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-200" size={32} />
                        </div>
                        <h3 className={`text-2xl font-black uppercase tracking-tighter ${isLight ? 'text-gray-900' : 'text-white'}`}>Aucun article trouvé</h3>
                        <p className="text-gray-400 font-medium mt-2">Essayez d'autres mots-clés ou modifiez les filtres.</p>
                        <button 
                            onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                            className="mt-6 px-8 py-3 bg-[#0f172a] text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all border border-white/10"
                        >
                            Réinitialiser
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className={`absolute inset-0 backdrop-blur-md ${isLight ? 'bg-white/60' : 'bg-black/80'}`}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] z-10 border ${isLight ? 'bg-white border-white' : 'bg-[#0f172a] border-white/10'}`}
                        >
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all text-gray-900 active:scale-95"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Side: Image */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-50 overflow-hidden relative">
                                <img 
                                    src={selectedItem.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} 
                                    alt={selectedItem.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ring-2 ring-white">
                                    Article du Marché
                                </div>
                            </div>

                            {/* Right Side: Content */}
                            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto no-scrollbar">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-1 bg-orange-500 rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                                            {selectedItem.category}
                                        </span>
                                    </div>
                                    <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                                        {selectedItem.name}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-6 py-3 rounded-2xl border ${isLight ? 'bg-orange-50 border-orange-100' : 'bg-orange-500/10 border-orange-500/20'}`}>
                                            <span className="text-2xl font-black text-orange-600">{selectedItem.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`space-y-6 mb-8 p-6 md:p-8 rounded-3xl border ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-orange-50 group-hover:scale-110 transition-transform">
                                            <StoreIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendeur / Boutique</p>
                                            <p className={`font-black group-hover:text-orange-500 transition-colors uppercase tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedItem.shopName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-orange-50 group-hover:scale-110 transition-transform">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localisation</p>
                                            <p className={`font-black group-hover:text-orange-500 transition-colors uppercase tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedItem.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                        Description de l'article
                                    </h4>
                                    <p className={`font-medium leading-relaxed ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
                                        {selectedItem.description || "Aucune description détaillée fournie pour cet article."}
                                    </p>
                                </div>

                                <div className="mt-auto flex flex-col gap-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <a 
                                            href={`https://wa.me/${selectedItem.phone || '22892052664'}?text=Bonjour, je suis intéressé par votre article "${selectedItem.name}" sur Djapero Marché.`}
                                            target="_blank"
                                            className="flex items-center justify-center gap-3 py-5 bg-[#25D366] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl hover:scale-[1.02] active:scale-95 group"
                                        >
                                            <Phone size={20} className="group-hover:rotate-12 transition-transform" /> WhatsApp
                                        </a>
                                        <a 
                                            href={`tel:${selectedItem.phone || '22892052664'}`}
                                            className={`flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-95 ${isLight ? 'bg-[#0f172a] text-white hover:bg-orange-500' : 'bg-[#a3e635] text-black hover:bg-white'}`}
                                        >
                                            <Phone size={20} /> Appeler
                                        </a>
                                    </div>
                                    <button 
                                        onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedItem.name + ' ' + selectedItem.location)}`, '_blank')}
                                        className={`flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-sm hover:scale-[1.02] active:scale-95 border-2 ${isLight ? 'bg-white border-slate-100 text-slate-800 hover:border-orange-500 hover:text-orange-500' : 'bg-white/5 border-white/10 text-white hover:border-orange-500 hover:text-orange-500'}`}
                                    >
                                        <MapPin size={20} /> Voir sur Google Maps
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add FAB - Button for users to know they can sell */}
            <div className="fixed bottom-6 right-6 z-[60]">
                <a 
                    href="https://wa.me/22892052664?text=Bonjour,%20je%20souhaite%20publier%20mon%20marché%20ou%20mes%20produits%20sur%20Djapero." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
                >
                    <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20 group-hover:hidden" />
                    <Plus size={32} strokeWidth={3} />
                    
                    {/* Tooltip */}
                    <div className={`absolute right-full mr-4 px-4 py-2 rounded-xl border shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${isLight ? 'bg-white border-slate-100' : 'bg-[#0f172a] border-white/10'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-[#0f172a]' : 'text-white'}`}>Publier mon marché</p>
                    </div>
                </a>
            </div>
        </div>
    );
}
