import { useData } from "../hooks/useData";
import { motion } from "motion/react";
import { useState } from "react";
import { X, ExternalLink, Briefcase, Phone as WhatsApp, Star, ArrowRight } from "lucide-react";

export default function Services() {
    const { data, loading } = useData();
    const [selectedReal, setSelectedReal] = useState<number | null>(null);

    const defaultReals = [
        { title: "Identité Visuelle & Logo", imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600" },
        { title: "Impression Grand Format", imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=600" },
        { title: "Maquette UI/UX Design", imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600" },
        { title: "Production Audiovisuelle", imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600" },
        { title: "Stratégie Social Media", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" },
    ];

    if (loading || !data) return <div className="p-20 text-center">Chargement...</div>;

    const reals = (data.reals || []).length > 0 ? data.reals : defaultReals;
    const expertises = data.services || [];

    return (
        <div className="pt-20">
            <section className="services-hero py-20 bg-emerald-900 text-white text-center rounded-b-[3rem]">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-black mb-6">Expertise & <span className="text-yellow-400">Créativité</span></h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">Nous transformons vos idées en visuels percutants et innovants. De la conception au print, Djapero vous accompagne.</p>
                </div>
            </section>

            {/* Nos Expertises Section */}
            <section className="py-20 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="section-header text-center mb-16">
                        <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
                            <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                            Nos Expertises
                            <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4">Des solutions sur-mesure pour votre business</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {expertises.map((s, i) => (
                            <motion.div 
                                key={s.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-gray-100 group hover:border-[#10b981]/30 transition-all cursor-pointer flex flex-col h-full"
                            >
                                <div className="h-40 md:h-52 rounded-[2rem] overflow-hidden mb-8 bg-gray-50 flex items-center justify-center relative transition-colors">
                                    <img 
                                        src={s.imageUrl || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400"} 
                                        alt={s.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400";
                                        }}
                                    />
                                </div>
                                <div className="flex-grow flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981] mb-3 block opacity-70">{s.category}</span>
                                    <h3 className="text-2xl font-black tracking-tighter text-[#10b981] mb-4 uppercase leading-none group-hover:text-emerald-700 transition-colors">{s.name}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8">{s.description || "Un service d’excellence pour propulser votre image de marque au sommet avec Djapero Group."}</p>
                                    
                                    <div className="mt-auto pt-8 border-t border-gray-50 flex justify-between items-center">
                                        <div className="flex gap-1">
                                            {[1,2,3,4,5].map(star => <Star key={star} size={12} className="text-yellow-400 fill-yellow-400" />)}
                                        </div>
                                        <button className="text-[#10b981] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-3 transition-all">
                                            Commander <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Nos Réalisations</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0f172a] uppercase leading-none">
                                Studio <br/><span className="text-emerald-500">Portfolio.</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] max-w-xs text-right">Découvrez l'excellence visuelle de Djapero Group à travers nos derniers projets.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                        {reals.map((r, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="group relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-white shadow-xl cursor-pointer border border-gray-100 flex items-center justify-center p-4 md:p-6"
                                onClick={() => setSelectedReal(i)}
                            >
                                <div className="absolute inset-0">
                                    <img 
                                        src={r.imageUrl} 
                                        alt={r.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end pointer-events-none">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 mb-1">Studio Creation</span>
                                    <h3 className="text-white text-xs md:text-lg font-black uppercase tracking-tighter leading-none">{r.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section py-24 text-center text-white">
                <div className="container mx-auto px-6 bg-black/70 py-16 rounded-[3rem] border border-white/10 text-center relative z-10">
                    <h2 className="text-4xl font-black mb-6">Prêt à lancer votre prochain projet ?</h2>
                    <p className="text-lg max-w-xl mx-auto mb-10 opacity-80">Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé sous 24h.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="/contact" className="btn-banner yellow px-10 py-4 rounded-full bg-yellow-400 text-black font-bold uppercase text-lg hover:scale-105 transition-transform">Démarrer un projet</a>
                        <a href={`https://wa.me/${data.settings.whatsapp}`} target="_blank" className="btn-banner green px-10 py-4 rounded-full bg-[#25D366] text-white font-bold uppercase text-lg flex items-center gap-3 hover:scale-105 transition-transform">
                            <WhatsApp size={24} /> Discuter sur WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedReal !== null && (
                <div id="pinterest-lightbox" className="tiktok-player-overlay p-4" onClick={() => setSelectedReal(null)}>
                    <motion.div 
                        className="bg-white rounded-[2rem] overflow-hidden max-w-5xl w-full flex flex-col md:flex-row h-[90vh] md:h-auto"
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="md:w-3/5 bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={reals[selectedReal].imageUrl} className="max-w-full max-h-full object-contain" alt="Preview"/>
                        </div>
                        <div className="md:w-2/5 p-8 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-emerald-600 font-bold tracking-tighter uppercase text-sm">Djapero Studio.</span>
                                <button className="text-gray-400 hover:text-black transition-colors" onClick={() => setSelectedReal(null)}><X size={32} /></button>
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-3xl font-black mb-6">{reals[selectedReal].title}</h2>
                                <p className="text-gray-500 leading-relaxed mb-8">Une création originale signée Djapero Group. Nous vous garantissons un travail de haute qualité, moderne et sur-mesure pour sublimer votre image de marque.</p>
                            </div>
                            <div className="flex flex-col gap-4 mt-auto">
                                <a 
                                    href={`https://wa.me/${data.settings.whatsapp}?text=Je suis intéressé par une prestation comme : ${reals[selectedReal].title}`}
                                    target="_blank"
                                    className="bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1da851] transition-colors"
                                >
                                    <WhatsApp size={20} /> Commander le même
                                </a>
                                <button className="bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors" onClick={() => setSelectedReal(null)}>Retour</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
