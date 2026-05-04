import { useState } from "react";
import { Search, ShoppingBag, Phone as WhatsApp, Phone, X, ArrowLeft, Heart, Share2 } from "lucide-react";
import { useData } from "../hooks/useData";
import { motion, AnimatePresence } from "motion/react";

export default function Products() {
    const { data, loading } = useData();
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    if (loading || !data) return <div className="p-20 text-center">Chargement...</div>;

    const filteredProducts = data.products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-container pt-20">
            <main className="main-content">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Sélection Premium</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0f172a] uppercase leading-none">
                            Nos Produits <span className="text-emerald-500">Frais</span>
                        </h2>
                        <p className="text-gray-400 font-medium mt-2">De la terre à votre table, fraîcheur garantie.</p>
                    </div>
                    <div className="w-full md:max-w-md relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un produit..." 
                            className="w-full pl-14 pr-8 py-4 rounded-2xl border-2 border-transparent bg-white shadow-xl shadow-emerald-900/5 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-gray-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-emerald-100">
                        <ShoppingBag size={80} className="mx-auto mb-6 text-emerald-100" />
                        <p className="text-2xl font-black text-gray-300 uppercase tracking-tighter">Aucun produit trouvé</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((p, idx) => (
                            <motion.div 
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setSelectedProduct(p)}
                                className="group relative bg-white rounded-[2.5rem] p-6 shadow-xl shadow-emerald-900/5 border border-emerald-50/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all flex flex-col h-full cursor-pointer"
                            >
                                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#fbfbfb] mb-6 flex items-center justify-center p-4 group-hover:bg-emerald-50/40 transition-colors">
                                    <motion.img 
                                        src={p.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} 
                                        alt={p.name} 
                                        className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                                        whileHover={{ scale: 1.1, rotate: 2 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    />
                                    {p.badge && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="bg-[#fb923c] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-orange-500/20">
                                                {p.badge}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-emerald-600 text-[12px] shadow-xl border border-emerald-50 flex items-center">
                                        {p.price} 
                                        {!p.price.toString().toUpperCase().includes('FCFA') && (
                                            <span className="text-[8px] opacity-40 uppercase tracking-widest ml-1">FCFA</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <h3 className="text-xl font-black text-[#0f172a] mb-2 uppercase tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors h-14 line-clamp-2">{p.name}</h3>
                                    <div className="min-h-[80px]">
                                        <p className="text-gray-400 text-xs font-medium line-clamp-3 mb-6 leading-relaxed bg-neutral-50/50 p-4 rounded-xl border border-neutral-100/50 flex-grow">
                                            {p.description || "Un produit d'exception sélectionné pour sa fraîcheur et sa qualité incomparable."}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto space-y-3">
                                        <a 
                                            href={`https://wa.me/${data.settings.whatsapp}?text=Bonjour, je souhaite commander : ${p.name}`}
                                            target="_blank"
                                            className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <WhatsApp size={16} /> WhatsApp
                                        </a>
                                        <a 
                                            href={`tel:${data.settings.call}`} 
                                            className="flex items-center justify-center gap-3 w-full py-4 bg-white hover:bg-neutral-50 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-neutral-100 transition-all hover:border-emerald-200"
                                        >
                                            <Phone size={16} /> Appeler
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {selectedProduct && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedProduct(null)}
                                className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"
                            />
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                            >
                                <button 
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                                >
                                    <X size={24} className="text-gray-900" />
                                </button>

                                {/* Left Side: Image */}
                                <div className="w-full md:w-1/2 bg-[#f8fafc] p-8 md:p-14 flex items-center justify-center relative">
                                    <motion.img 
                                        layoutId={`img-${selectedProduct.id}`}
                                        src={selectedProduct.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} 
                                        alt={selectedProduct.name}
                                        className="max-w-full max-h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
                                    />
                                    {selectedProduct.badge && (
                                        <div className="absolute top-8 left-8">
                                            <span className="bg-[#fb923c] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                                                {selectedProduct.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Content */}
                                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col overflow-y-auto">
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Détails du Produit</span>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] uppercase tracking-tighter leading-none mb-4">
                                            {selectedProduct.name}
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                                                <span className="text-2xl font-black text-emerald-600">
                                                    {selectedProduct.price} 
                                                    {!selectedProduct.price.toString().toUpperCase().includes('FCFA') && (
                                                        <span className="text-xs opacity-50 ml-1">FCFA</span>
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">En Stock</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6 mb-10 flex-grow">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Description</h4>
                                            <p className="text-gray-500 font-medium leading-relaxed bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                                {selectedProduct.description || "Ce produit a été sélectionné pour sa qualité exceptionnelle et sa fraîcheur garantie. Idéal pour une alimentation saine et équilibrée."}
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                                                <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Catégorie</div>
                                                <div className="text-gray-900 font-bold text-sm">Produit Frais</div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50">
                                                <div className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1">Livraison</div>
                                                <div className="text-gray-900 font-bold text-sm">Disponible</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                        <a 
                                            href={`https://wa.me/${data.settings.whatsapp}?text=Bonjour, je souhaite commander : ${selectedProduct.name}`}
                                            target="_blank"
                                            className="flex-grow flex items-center justify-center gap-3 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                                        >
                                            <WhatsApp size={20} /> Commander sur WhatsApp
                                        </a>
                                        <a 
                                            href={`tel:${data.settings.call}`} 
                                            className="px-8 flex items-center justify-center gap-3 py-5 bg-white border-2 border-neutral-100 text-gray-600 hover:border-emerald-200 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                                        >
                                            <Phone size={20} /> Appeler
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
