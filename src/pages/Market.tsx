import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Tag, ShoppingCart, Filter, Coffee, Pizza, Layout, Heart, X, Phone, Store as StoreIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData, MarketItem } from '../hooks/useData';

const MARKET_CATEGORIES = [
    { id: 'all', label: 'Tout', icon: Layout },
    { id: 'legumes', label: 'Légumes', icon: Heart },
    { id: 'elevage', label: 'Moutons/Élevage', icon: Tag },
    { id: 'snacks', label: 'Chips & Snacks', icon: Pizza },
    { id: 'biscuits', label: 'Biscuits', icon: Coffee },
    { id: 'accessoires', label: 'Accessoires', icon: ShoppingCart },
];

const Market = () => {
    const { user, isAdmin } = useAuth();
    const { data, loading, deleteMarketItem } = useData();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

    const handleDeleteItem = async (itemId: string) => {
        if (!data || !window.confirm("Supprimer cet article ?")) return;
        try {
            const success = await deleteMarketItem(itemId);
            if (!success) alert("Erreur lors de la suppression.");
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    if (loading || !data) return <div className="p-20 text-center font-black tracking-tighter text-emerald-600 animate-pulse">Chargement Marché...</div>;

    const filteredItems = (data?.marketItems || []).filter(item => {
        const matchesSearch = (item.name || '').toLowerCase().includes(search.toLowerCase()) || 
                             (item.description || '').toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === 'all' || item.category === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 relative overflow-x-hidden">
            {/* Africa Background Sketch - Improved */}
            <div className="absolute top-20 right-[-10%] opacity-[0.05] pointer-events-none rotate-12">
                <svg width="600" height="800" viewBox="0 0 100 130" fill="currentColor">
                    <path d="M45,5 C55,4 65,5 75,10 C85,15 90,25 92,35 C94,45 90,55 85,65 C80,75 75,85 78,95 C80,105 85,115 82,125 C78,135 65,140 50,140 C35,140 20,135 15,125 C10,115 12,105 18,95 C25,85 28,75 22,65 C15,55 10,45 12,35 C15,25 25,15 35,8 C40,6 42,5 45,5 Z" 
                          stroke="currentColor" strokeWidth="0.5" fill="none" />
                    <path d="M35,30 L65,30 M40,60 L70,60 M30,90 L60,90" stroke="currentColor" strokeWidth="0.2" opacity="0.3" />
                </svg>
            </div>

            {/* Header / Search */}
            <header className="bg-emerald-600 pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 uppercase"
                    >
                        Marché <span className="text-yellow-400">Djapero.</span>
                    </motion.h1>
                    
                    <div className="relative group max-w-2xl mx-auto">
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/30 transition-all"></div>
                        <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl border-4 border-emerald-500/20">
                            <div className="pl-6 text-emerald-500">
                                <Search size={24} />
                            </div>
                            <input 
                                type="text"
                                placeholder="Que cherchez-vous ? (Mouton, Chips, Légumes...)"
                                className="flex-1 bg-transparent px-4 py-4 text-gray-800 font-bold outline-none placeholder:text-gray-400 text-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="bg-emerald-500 text-white px-8 py-4 rounded-full font-black uppercase tracking-tighter hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                                Trouver
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Categories */}
            <section className="relative z-20 -mt-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar scroll-smooth">
                        {MARKET_CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black uppercase tracking-tighter whitespace-nowrap transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${
                                        activeTab === cat.id 
                                        ? 'bg-yellow-400 text-black border-2 border-black/5' 
                                        : 'bg-white text-gray-500 border-2 border-transparent hover:border-emerald-100 focus:outline-none'
                                    }`}
                                >
                                    <Icon size={18} />
                                    {cat.label}
                                </button>
                            );
                        })}
                        {/* Extra spacer for scroll ending */}
                        <div className="min-w-[40px] h-4 md:hidden" aria-hidden="true" />
                    </div>
                </div>
            </section>

            {/* Grid */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs mb-2">Offres du jour</p>
                        <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase leading-[0.8]">De l'Afrique, Pour vous.</h2>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-emerald-50 hover:text-emerald-500 transition-colors">
                            <Filter size={18} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-3 md:gap-8 max-w-none">
                    <AnimatePresence>
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                onClick={() => setSelectedItem(item)}
                                className="group relative bg-[#0f172a] rounded-[3.5rem] p-4 border border-white/5 hover:border-[#a3e635]/30 shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-500 cursor-pointer flex flex-col h-full"
                            >
                                {(isAdmin || (user && user.uid === item.creatorId)) && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteItem(item.id);
                                        }}
                                        className="absolute top-6 left-6 z-20 bg-red-500/90 backdrop-blur-md text-white p-2.5 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                    >
                                        <X size={18} />
                                    </button>
                                )}

                                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-6">
                                    <motion.img 
                                        src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'} 
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                                        alt={item.name}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 bg-[#a3e635] text-black px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg z-10">
                                        NOUVEAU
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <div className="px-2 pb-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-xl md:text-2xl font-[1000] text-white uppercase tracking-tighter truncate max-w-[65%]">{item.name}</h3>
                                        <span className="text-xl md:text-2xl font-[1000] text-[#a3e635] italic tracking-tighter flex items-baseline">
                                            {item.price} 
                                            <span className="text-[10px] opacity-40 uppercase tracking-widest ml-1 font-black underline-offset-2">FCFA</span>
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#a3e635]/30 mb-8">
                                        {MARKET_CATEGORIES.find(c => c.id === item.category)?.label || item.category}
                                    </p>
                                    
                                    <button className="w-full py-5 rounded-[1.8rem] bg-white text-black font-[1000] uppercase text-[10px] tracking-[0.2em] hover:bg-[#a3e635] transition-all shadow-xl group-hover:scale-[1.02] active:scale-95">
                                        Détails du Produit
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredItems.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tighter text-center">Aucun résultat trouvé</h3>
                        <p className="text-gray-400 mt-2 font-medium">Réessayez avec d'autres mots-clés ou explorez nos catégories.</p>
                    </div>
                )}
            </main>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-full max-h-[85vh] lg:max-h-[700px]"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/10 hover:bg-black/20 text-black flex items-center justify-center rounded-full transition-all active:scale-90"
                                onClick={() => setSelectedItem(null)}
                            >
                                <X size={24} />
                            </button>

                            <div className="w-full md:w-1/2 bg-white relative overflow-hidden group flex items-center justify-center">
                                <img 
                                    src={selectedItem.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    alt={selectedItem.name}
                                />
                                <div className="absolute top-8 left-8 z-10">
                                    <span className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xl shadow-2xl">
                                        {selectedItem.price} FCFA
                                    </span>
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col bg-white">
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 bg-emerald-50 px-4 py-1.5 rounded-full">
                                            Exclusivité Djapero
                                        </span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0f172a] uppercase leading-[0.85] mb-6">
                                        {selectedItem.name}
                                    </h2>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Locatisation</p>
                                            <div className="flex items-center gap-2 text-[#0f172a] font-bold text-xs uppercase tracking-tighter">
                                                <MapPin size={14} className="text-orange-500" />
                                                {selectedItem.location}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Source</p>
                                            <div className="flex items-center gap-2 text-[#0f172a] font-bold text-xs uppercase tracking-tighter">
                                                <StoreIcon size={14} className="text-emerald-500" />
                                                {selectedItem.shopName || "Producteur local"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group bg-[#f8fafc] p-6 rounded-3xl mb-8 border border-[#e2e8f0]/30">
                                        <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                                            {selectedItem.description || "Ce produit d'exception a été sélectionné avec soin par l'équipe Djapero pour garantir une fraîcheur et une qualité inégalées à nos clients. Commandez maintenant pour un goût authentique de l'Afrique."}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-gray-100 space-y-4">
                                    <a 
                                        href={`https://wa.me/${selectedItem.phone || '22800000000'}?text=${encodeURIComponent(`Bonjour Djapero ! Je souhaite commander le produit : ${selectedItem.name} (${selectedItem.price} FCFA)`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#25D366] text-white py-5 px-8 rounded-3xl font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(37,211,102,0.3)] hover:bg-black transition-all active:scale-95 group relative overflow-hidden text-center leading-tight"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                                        <Phone size={24} className="group-hover:rotate-12 transition-transform shrink-0" />
                                        <span>Commander Maintenant</span>
                                    </a>
                                    <div className="flex justify-center gap-6">
                                         <div className="flex items-center gap-2">
                                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                             <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Paiement Mobile</span>
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                             <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Livraison Rapide</span>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Google Maps Geographic Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 mt-24">
                <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row min-h-[500px]">
                    <div className="p-10 md:p-16 lg:w-1/2 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200">
                                <MapPin size={32} className="text-white" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase leading-[0.85] mb-6">Localisez nos <br/>marchés <span className="text-emerald-600">Locaux.</span></h2>
                            <p className="text-gray-500 font-bold mb-10 text-lg leading-relaxed">Trouvez instantanément le marché le plus proche de chez vous. Que vous cherchiez des légumes frais, du bétail ou nos snacks artisanaux, Google Maps vous guide directement vers l'Afrique authentique.</p>
                            
                            <a 
                                href="https://www.google.com/maps/search/marche+africain+local" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-4 bg-emerald-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-tighter hover:bg-emerald-700 transition-all shadow-2xl active:scale-95 group"
                            >
                                <Search size={20} className="group-hover:rotate-12 transition-transform" />
                                Ouvrir dans Google Maps
                            </a>
                        </div>
                    </div>
                    <div className="lg:w-1/2 h-[400px] lg:h-auto bg-gray-50 relative group cursor-pointer overflow-hidden">
                        {/* Mock Map / Iframe Container */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"></div>
                        <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors"></div>
                        
                        {/* Static Map elements */}
                        <div className="absolute top-1/4 left-1/3 p-4 bg-white rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
                             <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white"><MapPin size={16}/></div>
                             <span className="font-black text-xs uppercase tracking-tighter">Marché Central</span>
                        </div>
                        <div className="absolute bottom-1/3 right-1/4 p-4 bg-white rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse delay-700">
                             <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black"><Search size={16}/></div>
                             <span className="font-black text-xs uppercase tracking-tighter">Point de Vente</span>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl border border-white max-w-xs text-center transform -rotate-2">
                                <p className="text-gray-900 font-black tracking-tighter text-xl mb-2 text-center">Navigation Temps Réel</p>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Connecté à Google Maps API</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Market;
