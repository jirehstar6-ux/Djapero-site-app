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
        <div className="w-full pt-20 px-4 md:px-10">
            <main className="w-full pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-16 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-[12px] font-black uppercase tracking-[0.5em] text-emerald-600">Catalogue Intégral</span>
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-[#0f172a] uppercase leading-none">
                            La <span className="text-emerald-500">Boutique</span>
                        </h2>
                    </div>
                    <div className="w-full md:max-w-2xl relative group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={24} />
                        <input 
                            type="text" 
                            placeholder="RECHERCHER UN PRODUIT DANS TOUTE LA BOUTIQUE..." 
                            className="w-full pl-20 pr-10 py-7 rounded-[3rem] border-2 border-transparent bg-white shadow-2xl shadow-emerald-900/5 focus:border-emerald-500 outline-none transition-all font-black text-sm placeholder:text-gray-200 tracking-widest uppercase"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-emerald-50 shadow-inner">
                        <ShoppingBag size={80} className="mx-auto mb-6 text-emerald-50" />
                        <p className="text-3xl font-black text-gray-200 uppercase tracking-tighter">Aucun produit dans cette sélection</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 4xl:grid-cols-10 gap-4 md:gap-8">
                        {filteredProducts.map((p, idx) => (
                            <motion.div 
                                key={p.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                onClick={() => setSelectedProduct(p)}
                                className="group relative bg-[#0f172a] rounded-[3rem] p-6 border border-white/5 hover:border-[#a3e635]/30 shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all flex flex-col h-full cursor-pointer hover:-translate-y-3 duration-500"
                            >
                                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8">
                                    <motion.img 
                                        src={p.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} 
                                        alt={p.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4 bg-[#a3e635] text-black px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg z-10">
                                        NOUVEAU
                                    </div>
                                </div>

                                <div className="px-2 pb-2 flex-grow">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter truncate max-w-[70%]">{p.name}</h3>
                                        <span className="text-xl md:text-2xl font-black text-[#a3e635] tracking-tighter">
                                            {p.price} 
                                            {!p.price.toString().toUpperCase().includes('FCFA') && (
                                                <span className="text-[10px] opacity-40 uppercase tracking-widest ml-1 font-black">FCFA</span>
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-8">
                                        Qualité Djapero • Stock Disponible
                                    </p>
                                    
                                    <button className="w-full pt-[27px] pb-[18px] pl-0 ml-[-4px] mr-[25px] rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#a3e635] transition-all shadow-xl">
                                        Détails du Produit
                                    </button>
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
                                <div className="w-full md:w-1/2 bg-[#f8fafc] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-transparent" />
                                    <motion.img 
                                        layoutId={`img-${selectedProduct.id}`}
                                        src={selectedProduct.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} 
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", damping: 15 }}
                                    />
                                    {selectedProduct.badge && (
                                        <div className="absolute top-8 left-8 z-10">
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

                                    <div className="group bg-[#f8fafc] p-8 rounded-[2.5rem] mb-10 border border-[#e2e8f0]/40 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/40 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            Fiche Technique & Description
                                        </h4>
                                        <p className="text-gray-500 font-medium leading-relaxed text-base relative z-10">
                                            {selectedProduct.description || "Ce produit d'exception a été sélectionné pour sa qualité exceptionnelle et sa fraîcheur garantie. Idéal pour une alimentation saine et équilibrée, il représente le meilleur de notre terroir."}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-10 border-t border-gray-100">
                                        <a 
                                            href={`https://wa.me/${data.settings.whatsapp}?text=Bonjour, je souhaite commander : ${selectedProduct.name}`}
                                            target="_blank"
                                            className="flex-grow flex items-center justify-center gap-4 py-5 px-6 bg-[#25D366] hover:bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] md:text-[13px] shadow-[0_20px_50px_rgba(37,211,102,0.3)] transition-all hover:scale-[1.03] active:scale-[0.97] group relative overflow-hidden text-center leading-tight"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                                            <WhatsApp size={24} className="group-hover:rotate-12 transition-transform shrink-0" />
                                            <span>Commander via WhatsApp</span>
                                        </a>
                                        <a 
                                            href={`tel:${data.settings.call}`} 
                                            className="px-8 flex items-center justify-center gap-4 py-5 bg-white border-2 border-[#0f172a]/5 text-[#0f172a] hover:bg-gray-50 rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] md:text-[13px] transition-all hover:border-emerald-500 shadow-xl group text-center"
                                        >
                                            <Phone size={20} className="text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
                                            <span>Appeler</span>
                                        </a>
                                    </div>
                                    <p className="text-center mt-6 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
                                        Livraison Express • 100% Naturel • Djapero Group
                                    </p>
                                </div>

                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
