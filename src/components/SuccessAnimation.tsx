import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, Truck, Users, Briefcase, X, ArrowRight, Play } from 'lucide-react';
import { useData } from '../hooks/useData';

interface SuccessAnimationProps {
    isAdmin: boolean;
}

export default function SuccessAnimation({ isAdmin }: SuccessAnimationProps) {
    const navigate = useNavigate();
    const { data } = useData();
    const [selectedCard, setSelectedCard] = useState<any>(null);

    const getYoutubeId = (url: string) => {
        if (!url) return '';
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) return url;
        let videoId = '';
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        if (match && match[1]) {
            videoId = match[1];
        }
        return videoId || url;
    };

    const settings = data?.settings;

    const [showVideo, setShowVideo] = useState(false);

    const introVideo = data?.videos?.find(v => v.id === settings?.introVideoId) || data?.videos?.[0];

    const cards = [
        { 
            title: "Catalogue", 
            icon: ShoppingBag, 
            color: "from-blue-400 to-blue-600", 
            angle: -5, 
            yOffset: 10, 
            image: settings?.animCatalogImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
            desc: "Explorez notre inventaire complet de produits frais et transformés."
        },
        { 
            title: "Marché", 
            icon: Store, 
            color: "from-green-400 to-green-600", 
            angle: 2, 
            yOffset: 25, 
            image: settings?.animMarketImage || "https://images.unsplash.com/photo-1488459711635-0c001897e8cb?auto=format&fit=crop&q=80&w=800",
            desc: "Accédez au meilleur des producteurs locaux sélectionnés par nos soins."
        },
        { 
            title: "Livraison", 
            icon: Truck, 
            color: "from-orange-400 to-orange-600", 
            angle: -3, 
            yOffset: 30, 
            image: settings?.animDeliveryImage || "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800",
            desc: "Suivi en temps réel et logistique optimisée pour vos commandes."
        },
        { 
            title: "Services", 
            icon: Briefcase, 
            color: "from-purple-400 to-purple-600", 
            angle: 4, 
            yOffset: 25, 
            image: settings?.animServicesImage || "https://images.unsplash.com/photo-1454165833767-02755157f827?auto=format&fit=crop&q=80&w=800",
            desc: "Accompagnement et expertise technique pour vos projets agricoles."
        },
        { 
            title: "Équipe", 
            icon: Users, 
            color: "from-indigo-400 to-indigo-600", 
            angle: -2, 
            yOffset: 10, 
            image: settings?.animTeamImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
            desc: "Des passionnés à votre service pour assurer votre succès."
        },
    ];

    return (
        <div className="fixed inset-0 z-50 bg-[#f7f8fa] flex flex-col items-center overflow-y-auto overflow-x-hidden font-sans pt-24 pb-48">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center z-10 mb-24"
            >
                <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200">
                    <span className="text-[12px] font-bold text-slate-800 uppercase tracking-widest">🎉 Expérience Djapero</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">
                    BIENVENUE SUR <span className="text-[#a3e635]">DJAPERO</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-lg max-w-xl mx-auto px-6">
                    Votre univers de produits frais et services innovants est prêt. 
                    Préparez-vous pour l'excellence.
                </p>
            </motion.div>

            <div className="relative w-full max-w-7xl flex justify-center mb-16 md:mb-24 px-4 md:px-12 mt-12 md:mt-24">
                {/* The curved string */}
                <svg className="absolute top-0 left-0 w-full h-[80px] overflow-visible pointer-events-none opacity-60" preserveAspectRatio="none" viewBox="0 0 1000 100">
                    <motion.path 
                        d="M 0 0 Q 500 100 1000 0" 
                        fill="transparent" 
                        stroke="#1e293b" 
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />                
                </svg>

                {/* Cards */}
                <div className="relative w-full flex justify-between z-20" style={{ perspective: '1200px' }}>
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            className="relative flex flex-col items-center"
                            initial={{ y: -250, opacity: 0, rotate: 20 }}
                            animate={{ y: card.yOffset, opacity: 1, rotate: card.angle }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 50, 
                                damping: 12, 
                                delay: 0.6 + index * 0.2 
                            }}
                            style={{ width: '19.5%' }}
                        >
                            {/* Pin */}
                            <div className="absolute -top-3 z-20 w-5 h-8 bg-[#22c55e] rounded-sm transform origin-top shadow-sm flex items-start justify-center pt-1.5">
                                <div className="w-2 h-2 rounded-full bg-white/80" />
                            </div>

                            {/* Card Body */}
                            <motion.div 
                                onClick={() => setSelectedCard(card)}
                                whileHover={{ scale: 1.1, y: -15, rotate: 0 }}
                                className="bg-white p-2.5 md:p-3.5 rounded-[36px] shadow-2xl border border-white/50 w-full aspect-[4/5] flex flex-col cursor-pointer transition-all active:scale-95 group relative overflow-hidden"
                            >
                                <div className={`w-full h-full rounded-[28px] bg-gradient-to-br ${!card.image ? card.color : 'bg-slate-50'} flex items-center justify-center shadow-inner overflow-hidden relative`}>
                                    <AnimatePresence mode="wait">
                                        {card.image ? (
                                            <motion.img 
                                                initial={{ opacity: 0, scale: 1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                src={card.image} 
                                                alt={card.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <card.icon className="text-white w-8 h-8 md:w-16 md:h-16 drop-shadow-lg relative z-10" />
                                        )}
                                    </AnimatePresence>
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 pb-10">
                                        <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-tighter block text-center drop-shadow-sm">{card.title}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            <AnimatePresence>
                {selectedCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6"
                        onClick={() => setSelectedCard(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            className="bg-white rounded-[40px] overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl border border-white/20"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden">
                                <img src={selectedCard.image} alt={selectedCard.title} className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8`}>
                                    <div className={`p-4 rounded-3xl bg-white/20 backdrop-blur-md text-white border border-white/30`}>
                                        <selectedCard.icon size={32} />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#a3e635] flex items-center justify-center text-[#0f172a]">
                                                <ArrowRight size={16} strokeWidth={3} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#a3e635]">Djapero Detail</span>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedCard(null)}
                                            className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">
                                        {selectedCard.title}
                                    </h2>
                                    <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                                        {selectedCard.desc}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedCard(null)}
                                    className="w-full py-5 bg-[#0f172a] text-white rounded-2xl font-black uppercase tracking-[0.1em] text-xs hover:bg-[#a3e635] hover:text-[#0f172a] transition-all flex items-center justify-center gap-3 active:scale-95 group shadow-xl"
                                >
                                    Fermer le détail
                                    <X size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.2, duration: 0.8 }}
                className="z-10 mt-12 md:mt-16 mb-12 flex flex-col items-center gap-12 lg:gap-16 w-full"
            >
                <button 
                    onClick={() => navigate("/accueil")}
                    className="bg-[#0f172a] text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-300 hover:bg-[#a3e635] hover:text-[#0f172a] transition-all flex items-center gap-4 active:scale-95 group"
                >
                    Continuer vers Djapero
                    <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        →
                    </motion.div>
                </button>

                {introVideo && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3.8, duration: 0.8 }}
                        className="w-full max-w-2xl px-6"
                    >
                        <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] group border-4 border-white bg-slate-200">
                            <img 
                                src={introVideo.thumbnail || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200"} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                alt="Video Thumbnail" 
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileActive={{ scale: 0.9 }}
                                    onClick={() => setShowVideo(true)}
                                    className="w-20 h-20 bg-[#a3e635] rounded-full flex items-center justify-center text-[#0f172a] shadow-2xl shadow-[#a3e635]/40 transition-transform"
                                >
                                    <Play size={32} fill="currentColor" className="ml-1" />
                                </motion.button>
                            </div>
                            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white drop-shadow-lg">
                                <div className="max-w-[70%]">
                                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#a3e635] mb-2">Vidéo de présentation</p>
                                    <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">{introVideo.title || "L'univers Djapero Group"}</h4>
                                </div>
                                <span className="bg-white/10 backdrop-blur-2xl px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">HD 4K</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {showVideo && introVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 md:p-10"
                    >
                        <button 
                            onClick={() => setShowVideo(false)}
                            className="absolute top-6 right-6 z-[110] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="w-full h-full max-w-6xl aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
                            {introVideo.srcType === 'youtube' ? (
                                <iframe 
                                    src={`https://www.youtube.com/embed/${getYoutubeId(introVideo.src)}?autoplay=1`} 
                                    className="w-full h-full"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            ) : introVideo.srcType === 'facebook' ? (
                                <iframe 
                                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(introVideo.src)}&show_text=0&width=560`} 
                                    className="w-full h-full"
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <video 
                                    src={introVideo.src} 
                                    autoPlay 
                                    controls 
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8"
            >
                <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full bg-[#a3e635]"
                    />
                </div>
            </motion.div>
        </div>
    );
}
