import { Star, Smartphone, Palette, Video, Headset, HardHat, User, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../hooks/useData";
import { useState } from "react";

import { useTheme } from "../context/ThemeContext";

export default function Team() {
    const { data: appData } = useData();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [showBio, setShowBio] = useState(false);
    
    const defaultTeam = [
        { name: "Fondateur / Manager", role: "Supervise toute la stratégie", img: "https://randomuser.me/api/portraits/men/32.jpg", icon: HardHat },
        { name: "Responsable Logistique", role: "Gère la flotte et les livraisons", img: "https://randomuser.me/api/portraits/men/45.jpg", icon: Smartphone },
        { name: "Partenaires Producteurs", role: "Fournissent le meilleur du local", img: "https://randomuser.me/api/portraits/women/44.jpg", icon: Star },
        { name: "Graphiste Creative", role: "Créatrice de génie (print & web)", img: "https://randomuser.me/api/portraits/women/68.jpg", icon: Palette },
        { name: "Monteur Vidéo", role: "Réalise des ads captivantes", img: "https://randomuser.me/api/portraits/men/22.jpg", icon: Video },
        { name: "Service Client", role: "À votre écoute H24", img: "https://randomuser.me/api/portraits/women/20.jpg", icon: Headset },
    ];

    const displayTeam = (appData?.team && appData.team.length > 0) ? appData.team : defaultTeam;
    const [displayCount, setDisplayCount] = useState(3);
    const hasMore = displayTeam.length > displayCount;

    return (
        <div className={`pt-24 pb-20 min-h-screen transition-colors duration-500 ${isLight ? 'bg-gray-50 text-gray-900' : 'text-white'}`}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl font-extrabold mb-4 uppercase tracking-tighter ${isLight ? 'text-gray-900' : 'text-white'}`}>Notre Équipe <span className="text-emerald-600">Passionnée</span></h2>
                    <p className={`text-lg max-w-xl mx-auto ${isLight ? 'text-gray-500' : 'text-white/60'}`}>Les talents qui se cachent derrière chaque livraison et chaque création visuelle de Djapero Group.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayTeam.slice(0, displayCount).map((member, i) => (
                        <motion.div 
                            key={i}
                            className={`rounded-3xl p-8 shadow-sm border transition-all text-center group cursor-pointer hover:-translate-y-1 ${isLight ? 'bg-white border-neutral-100 hover:shadow-xl' : 'bg-[#0f172a] border-white/5 hover:bg-[#131d33]'}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => {
                                setSelectedMember(member);
                                setShowBio(false);
                            }}
                        >
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <img src={member.img || "https://randomuser.me/api/portraits/lego/1.jpg"} alt={member.name} className="w-full h-full object-cover rounded-full border-4 border-emerald-50 group-hover:border-emerald-500 transition-colors duration-500" />
                                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                                    {('icon' in member) ? <member.icon size={18} /> : <User size={18} />}
                                </div>
                            </div>
                            <h3 className={`text-xl font-black mb-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{member.name}</h3>
                            <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">{member.role}</p>

                            {member.prestations && member.prestations.length > 0 ? (
                                <div className={`flex flex-wrap justify-center gap-2 mt-4 pt-4 border-t ${isLight ? 'border-slate-50' : 'border-white/5'}`}>
                                    {member.prestations.map((p, idx) => (
                                        <span key={idx} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl tracking-wider border shadow-sm ${isLight ? 'bg-slate-50 text-slate-500 border-slate-100' : 'bg-white/5 text-white/50 border-white/5'}`}>
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className={`text-xs leading-relaxed underline decoration-emerald-100 underline-offset-4 decoration-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>"Notre priorité est votre satisfaction et la qualité premium de nos produits."</p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {hasMore && (
                    <div className="mt-12 flex justify-center">
                        <button 
                            onClick={() => setDisplayCount(prev => prev + 3)}
                            className="bg-emerald-600 text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-95"
                        >
                            Voir Plus d'Équipe
                        </button>
                    </div>
                )}

                <div className={`mt-24 p-12 rounded-3xl shadow-sm border text-center max-w-4xl mx-auto ${isLight ? 'bg-white border-neutral-100' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex justify-center gap-1 mb-6 text-yellow-400">
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-6 tracking-tight uppercase underline decoration-emerald-600 decoration-4 underline-offset-8 ${isLight ? 'text-gray-900' : 'text-white'}`}>Ils nous font confiance</h3>
                    <div className="relative">
                        <p className={`text-xl leading-loose max-w-2xl mx-auto drop-shadow-sm font-medium ${isLight ? 'text-gray-700' : 'text-white/80'}`}>"Des produits d'une fraîcheur incroyable et un service client très réactif. Djapero a aussi refait l'affiche de mon restaurant, magnifique ! Une équipe polyvalente."</p>
                        <div className="mt-8">
                            <strong className="text-lg font-black uppercase text-emerald-700">- Aminata, Gérante de restaurant</strong>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMember(null)}
                            className={`absolute inset-0 backdrop-blur-md ${isLight ? 'bg-white/60' : 'bg-black/80'}`}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border ${isLight ? 'bg-white border-white' : 'bg-[#0f172a] border-white/10'}`}
                        >
                            <button 
                                onClick={() => setSelectedMember(null)}
                                className={`absolute top-6 right-6 z-10 w-10 h-10 rounded-full backdrop-blur shadow-md flex items-center justify-center transition-colors ${isLight ? 'bg-white/80 text-gray-500 hover:text-black' : 'bg-black/50 text-white/50 hover:text-white'}`}
                            >
                                <X size={24} />
                            </button>

                            <div className={`w-full md:w-1/2 flex items-center justify-center p-8 ${isLight ? 'bg-white' : 'bg-black/20'}`}>
                                <div className="relative w-48 h-48 md:w-64 md:h-64">
                                    <img 
                                        src={selectedMember.img || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                                        alt={selectedMember.name} 
                                        className="w-full h-full object-cover rounded-full border-8 border-emerald-50 shadow-2xl"
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                        {('icon' in selectedMember) ? <selectedMember.icon size={28} /> : <User size={28} />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center overflow-y-auto max-h-[80vh] no-scrollbar">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                        {selectedMember.role}
                                    </span>
                                    <h3 className={`text-3xl font-black mb-2 uppercase tracking-tighter leading-none ${isLight ? 'text-gray-900' : 'text-white'}`}>
                                        {selectedMember.name}
                                    </h3>
                                </motion.div>
                                
                                <div className="mt-8 space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-gray-100/50' : 'border-white/5'}`}>
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">À propos & Expertise</h4>
                                            {selectedMember.description && (
                                                <button 
                                                    onClick={() => setShowBio(!showBio)}
                                                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors flex items-center gap-1"
                                                >
                                                    {showBio ? "Réduire" : "Voir les services"}
                                                    <motion.div animate={{ rotate: showBio ? 180 : 0 }}>
                                                        <ArrowRight size={10} className="rotate-90" />
                                                    </motion.div>
                                                </button>
                                            )}
                                        </div>
                                        
                                        <AnimatePresence>
                                            {showBio && selectedMember.description && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className={`p-6 rounded-3xl border italic text-sm leading-relaxed shadow-sm ${isLight ? 'bg-emerald-50/50 border-emerald-100/50 text-gray-700' : 'bg-emerald-500/10 border-emerald-500/20 text-white/80'}`}>
                                                        "{selectedMember.description}"
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="flex flex-wrap gap-2">
                                            {selectedMember.prestations && selectedMember.prestations.length > 0 ? (
                                                selectedMember.prestations.map((p: string, idx: number) => (
                                                    <motion.div 
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.3 + (idx * 0.05) }}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold border shadow-sm ${isLight ? 'bg-gray-50 text-gray-700 border-gray-100' : 'bg-white/5 text-white/50 border-white/5'}`}
                                                    >
                                                        {p}
                                                    </motion.div>
                                                ))
                                            ) : (
                                                !selectedMember.description && <p className={`text-sm italic ${isLight ? 'text-gray-500' : 'text-white/40'}`}>"Expert polyvalent dédié à la réussite de vos projets."</p>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Status Section from Screenshot */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className={`flex items-center gap-4 p-4 rounded-3xl border ${isLight ? 'bg-gray-50/50 border-gray-100' : 'bg-white/5 border-white/5'}`}
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Statut</p>
                                            <p className={`text-sm font-black uppercase ${isLight ? 'text-gray-900' : 'text-white'}`}>Disponible Immédiatement</p>
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="pt-4 flex flex-col gap-4"
                                    >
                                        <div className="space-y-4">
                                            <button 
                                                onClick={() => {
                                                    const msgArea = document.getElementById('message-area');
                                                    if (msgArea) {
                                                        msgArea.classList.toggle('hidden');
                                                        msgArea.classList.contains('hidden') ? null : msgArea.focus();
                                                    }
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                                            >
                                                <Smartphone size={14} />
                                                Lui écrire un message
                                            </button>
                                            
                                            <div id="message-area" className="hidden space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <textarea 
                                                    id="member-message"
                                                    placeholder={`Bonjour ${selectedMember.name}, j'aimerais...`}
                                                    className={`w-full p-4 border rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/50 transition-all min-h-[100px] resize-none shadow-inner ${isLight ? 'bg-gray-50 border-gray-100 text-gray-900' : 'bg-black/20 border-white/5 text-white'}`}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const msgElement = document.getElementById('member-message') as HTMLTextAreaElement;
                                                        const message = msgElement?.value || '';
                                                        const phone = selectedMember.phone || appData.settings?.whatsapp || '22892052664';
                                                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${selectedMember.name}, ${message}`)}`, '_blank');
                                                    }}
                                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-emerald-500/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <Smartphone size={16} /> Envoyer via WhatsApp
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
