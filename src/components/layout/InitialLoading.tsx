import { motion } from "motion/react";
import { Sprout, Truck, Utensils, Carrot, ShoppingBasket, Home } from "lucide-react";

export default function InitialLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
            <div className="relative flex flex-col items-center">
                
                {/* Animation Container */}
                <div className="relative h-48 w-[400px] flex items-center justify-between px-16 mb-16">
                    
                    {/* Path Line - Dotted / Dashed */}
                    <div className="absolute top-1/2 left-16 right-16 h-px border-t-2 border-dashed border-[#a3e635]/20 -translate-y-1/2" />

                    {/* Step 1: Farmer / Production */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 flex flex-col items-center gap-3"
                    >
                        <div className="w-16 h-16 bg-[#a3e635]/10 rounded-[28px] flex items-center justify-center border border-[#a3e635]/20 shadow-inner">
                            <Sprout className="text-[#a3e635]" size={32} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#a3e635]">Producteur</span>
                    </motion.div>

                    {/* The "Pass Quickly" Animation - Delivery Loop */}
                    <motion.div 
                        className="absolute z-20 left-16"
                        animate={{ 
                            x: [-20, 240],
                            opacity: [0, 1, 1, 0],
                            scale: [0.8, 1.2, 1.2, 0.8]
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            times: [0, 0.2, 0.8, 1]
                        }}
                    >
                        <motion.div 
                            className="flex flex-col items-center gap-1"
                            animate={{ rotate: [-2, 2, -2] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-16 h-16 bg-white border-2 border-[#a3e635] rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#a3e635]/20">
                                <motion.div
                                    animate={{ 
                                        opacity: [1, 0, 0, 1],
                                        display: ["block", "none", "block", "block"]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 0.6, 1] }}
                                >
                                    <ShoppingBasket className="text-[#a3e635]" size={32} />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, display: "none" }}
                                    animate={{ 
                                        opacity: [0, 1, 1, 0],
                                        display: ["none", "block", "block", "none"]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 0.6, 1] }}
                                >
                                    <Truck className="text-[#a3e635]" size={32} />
                                </motion.div>
                            </div>
                            <div className="flex gap-1 mt-1">
                                {[0, 1, 2].map((k) => (
                                    <motion.div 
                                        key={k}
                                        animate={{ height: [4, 8, 4], opacity: [0.3, 1, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: k * 0.1 }}
                                        className="w-1 rounded-full bg-[#bef264]" 
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Step 2: Consumer */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 flex flex-col items-center gap-3"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center border border-slate-100 shadow-sm">
                            <Utensils className="text-slate-400" size={32} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Client</span>
                    </motion.div>

                </div>

                {/* Text and Branding */}
                <div className="space-y-6 text-center">
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-3 mb-2"
                        >
                            <div className="w-8 h-8 bg-[#a3e635] rounded-lg flex items-center justify-center rotate-12">
                                <span className="text-white font-black text-xl">D</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                                Djapero <span className="text-[#a3e635]">Group</span>
                            </h1>
                        </motion.div>
                        
                        <div className="flex justify-center gap-1.5">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div 
                                    key={i}
                                    className="w-2 h-0.5 rounded-full bg-[#a3e635]"
                                    animate={{ 
                                        scaleX: [1, 2, 1], 
                                        opacity: [0.2, 1, 0.2],
                                        backgroundColor: i % 2 === 0 ? "#a3e635" : "#bef264"
                                    }}
                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mx-auto">
                            Initialisation du dashboard
                        </p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">
                            Connexion sécurisée en cours...
                        </p>
                    </div>
                </div>

                {/* Status Footer */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-[-100px] text-center"
                >
                    <p className="text-[8px] font-black text-slate-200 uppercase tracking-widest mb-4">
                        Sécurisation du flux de données
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 rounded-xl border border-slate-100 text-slate-300 hover:text-[#a3e635] hover:border-[#a3e635]/20 transition-all text-[9px] font-black uppercase tracking-widest active:scale-95 bg-white shadow-sm"
                    >
                        Redémarrer si bloqué
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
