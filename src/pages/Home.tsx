import { useState, useRef, useEffect } from "react";
import { Play, Pause, Heart, MessageCircle, Bookmark, Share2, X, Store, Zap, Truck, Star, Camera as CameraIcon, Monitor, ArrowRight } from "lucide-react";
import { useData } from "../hooks/useData";
import { motion } from "motion/react";
import "../css/dashboard.css";
import React from "react";

export default function Home() {
    const { data, loading } = useData();
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
    const [isHeroPlaying, setIsHeroPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    // Prioritize videos: 1. Intro Video, 2. Hero Video, 3. The very first video in the list
    const videos = data?.videos || [];
    const heroVid = data ? (videos.find(v => v.id === data.settings.introVideoId) || 
                    videos.find(v => v.id === data.settings.heroVideoId) || 
                    (videos.length > 0 ? videos[videos.length - 1] : null)) : null;

    const isImageMode = data?.settings?.heroMode === 'image';

    useEffect(() => {
        if (heroVid?.srcType === 'file' && videoRef.current) {
            if (isHeroPlaying) {
                videoRef.current.play().catch(e => console.error("AutoPlay blocked", e));
            } else {
                videoRef.current.pause();
            }
        } else if (heroVid && heroVid.srcType !== 'file' && iframeRef.current) {
            const command = isHeroPlaying ? 'playVideo' : 'pauseVideo';
            iframeRef.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*');
        }
    }, [isHeroPlaying, heroVid]);

    useEffect(() => {
        if (heroVid?.srcType === 'file' && videoRef.current) {
            videoRef.current.muted = isMuted;
        } else if (heroVid && heroVid.srcType !== 'file' && iframeRef.current) {
            const command = isMuted ? 'mute' : 'unMute';
            iframeRef.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*');
        }
    }, [isMuted, heroVid]);

    if (loading || !data) return <div className="p-20 text-center font-black tracking-tighter text-emerald-600 animate-pulse">Chargement Djapero...</div>;

    return (
        <div className="main-content">
            {/* 1. Hero Video Section - High-Performance Stylish Dashboard */}
            <motion.section 
                className="relative h-screen min-h-[700px] overflow-hidden bg-[#020617] group flex items-end pb-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
            >
                {/* Background Media Engine - Optimized for Impact */}
                {isImageMode && data.settings.heroImage ? (
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 z-10 bg-[#020617]/40" />
                        <div className="absolute inset-0 z-20 bg-gradient-to-tr from-[#020617] via-transparent to-[#020617]/30" />
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-90" />
                        <img 
                            src={data.settings.heroImage} 
                            className="w-full h-full object-cover animate-slow-zoom opacity-90" 
                            alt="Immersive Hero"
                        />
                    </div>
                ) : heroVid && (
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        {/* Dynamic Gradients for Depth */}
                        <div className="absolute inset-0 z-10 bg-[#020617]/30" />
                        <div className="absolute inset-0 z-20 bg-gradient-to-tr from-[#020617] via-transparent to-[#020617]/20" />
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-90" />
                        
                        {heroVid.srcType === 'file' ? (
                            <video 
                                ref={videoRef}
                                src={heroVid.src || undefined} 
                                autoPlay 
                                loop 
                                playsInline 
                                className="w-full h-full object-cover opacity-85 transition-opacity duration-1000"
                            />
                        ) : (
                            <div className="absolute inset-0">
                                <iframe 
                                    ref={iframeRef}
                                    className="absolute top-1/2 left-1/2 w-[110%] h-[110%] -translate-x-1/2 -translate-y-1/2 opacity-85 transition-opacity duration-1000"
                                    src={`https://www.youtube.com/embed/${getYouTubeId(heroVid.src)}?autoplay=1&controls=0&loop=1&playlist=${getYouTubeId(heroVid.src)}&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                                    title="Hero Background"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                />
                            </div>
                        )}

                        {/* Scanline Overlay */}
                        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden opacity-[0.03]">
                            <div className="w-full h-[30%] bg-gradient-to-b from-transparent via-white/40 to-transparent animate-scanline" />
                        </div>
                    </div>
                )}

                {/* Control Hub - Play/Pause & Media Actions */}
                <div className="absolute bottom-16 right-6 md:right-20 z-50 flex items-center gap-4">
                    {!isImageMode && heroVid && (
                        <button 
                            onClick={() => setIsHeroPlaying(!isHeroPlaying)}
                            className="w-14 h-14 md:w-20 md:h-20 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#00df82] hover:text-black hover:scale-110 transition-all duration-300 shadow-2xl group/play"
                        >
                            {isHeroPlaying ? <Pause size={24} className="group-hover/play:scale-90 transition-transform" /> : <Play size={24} fill="currentColor" className="group-hover/play:scale-110 transition-transform" />}
                        </button>
                    )}
                </div>

                <div className="container mx-auto px-6 md:px-20 relative z-40">
                    <div className="max-w-6xl">
                        {/* Stylish Multi-layered Typography */}
                        <motion.div 
                            className="relative"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 className="text-4xl md:text-6xl font-[1000] mb-6 tracking-[-0.07em] uppercase leading-[0.8] text-white">
                                {data.settings.heroTitle ? data.settings.heroTitle.split(' ').map((word: string, i: number, arr: string[]) => (
                                    <span key={i} className="block overflow-hidden relative">
                                        <motion.span 
                                            initial={{ y: "110%" }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.8 + (i * 0.12), duration: 0.8, ease: "circOut" }}
                                            className="block"
                                        >
                                            {i === arr.length - 1 ? (
                                                <span className="relative">
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00df82] to-emerald-400">
                                                        {word}
                                                    </span>
                                                    <motion.span 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ delay: 1.8, duration: 1.2, ease: "expoOut" }}
                                                        className="absolute bottom-2 md:bottom-3 left-0 h-[8px] md:h-[12px] bg-[#00df82]/20 -z-10"
                                                    />
                                                </span>
                                            ) : (word + (i < arr.length - 1 ? ' ' : ''))}
                                        </motion.span>
                                    </span>
                                )) : (
                                    <>
                                        <span className="block">Djapero</span>
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00df82] to-emerald-400">Factory</span>
                                    </>
                                )}
                            </h2>
                            
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.8, duration: 1 }}
                                className="mt-8 md:mt-12"
                            >
                                <div className="max-w-md">
                                    <div className="flex items-center gap-3 mb-6 text-[#00df82] font-mono text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-black">
                                        <span className="w-10 h-[2px] bg-current" />
                                        Manifeste Djapero
                                    </div>
                                    <p className="text-white font-black uppercase tracking-[0.3em] text-[10px] md:text-xs leading-relaxed mb-10 max-w-sm drop-shadow-lg">
                                        {data.settings.heroSubtitle || "Innovation • Durabilité • Marché Local"}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <a 
                                            href={`https://wa.me/${data.settings.whatsapp}?text=Bonjour Djapero, j'aimerais en savoir plus.`}
                                            target="_blank"
                                            className="group/btn relative px-10 py-5 bg-[#00df82] overflow-hidden rounded-[12px] font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:pr-14 shadow-[0_20px_40px_-15px_rgba(0,223,130,0.5)] active:scale-95"
                                        >
                                            <span className="relative z-10 text-black flex items-center gap-3">
                                                <Share2 size={16} strokeWidth={3} /> Nous Rejoindre
                                            </span>
                                            <div className="absolute top-1/2 -translate-y-1/2 right-6 opacity-0 group-hover/btn:opacity-100 transition-all duration-300">
                                                <ArrowRight size={18} className="text-black" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Stylish Data Metrics - Pinned to Bottom */}
                <div className="absolute bottom-16 left-6 md:left-1/2 md:-translate-x-1/2 z-40">
                    <div className="flex items-center gap-10 md:gap-20">
                        <div className="flex items-center gap-3">
                            <span className="h-10 w-[1px] bg-white/10 hidden md:block" />
                            <div>
                                <p className="text-[9px] font-mono font-black text-[#00df82] uppercase tracking-[0.3em] mb-1.5 drop-shadow-md">Production</p>
                                <p className="text-3xl md:text-4xl font-[1000] text-white tracking-tighter tabular-nums flex items-end">
                                    100%
                                    <span className="text-[#00df82] text-[8px] font-mono ml-2 tracking-widest font-black mb-1">LOCAL</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-10 w-[1px] bg-white/10 hidden md:block" />
                            <div>
                                <p className="text-[9px] font-mono font-black text-[#00df82] uppercase tracking-[0.3em] mb-1.5 drop-shadow-md">Interface</p>
                                <p className="text-3xl md:text-4xl font-[1000] text-white tracking-tighter tabular-nums flex items-end">
                                    V4.0
                                    <span className="text-[#00df82] text-[8px] font-mono ml-2 tracking-widest font-black mb-1">SMART</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Overlays */}
                <div className="absolute top-0 right-0 p-12 z-40 hidden md:block">
                    <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-white/30 tracking-[0.4em] uppercase">
                        <span>Terminal: {new Date().getHours()}:{new Date().getMinutes()}</span>
                        <div className="flex gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`h-1 w-6 ${i === 2 ? 'bg-[#00df82]' : 'bg-white/5'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Decorations */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 pr-6 md:pr-12 opacity-40">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`w-1 h-${i === 1 ? '12' : '4'} bg-white/20 rounded-full transition-all duration-500 hover:bg-[#00df82] hover:h-12 cursor-pointer`} />
                    ))}
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:40px_40px]" />
                </div>
            </motion.section>

            {/* 1.5 Simplified Info Section */}
            <section className="py-20 md:py-32 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#0f172a] uppercase mb-8">
                        Le Design au <br/><span className="text-[#00df82]">Cœur de l'Afrique.</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
                        Djapero n'est pas seulement une marque, c'est un mouvement. Nous allions l'innovation technologique à l'artisanat local pour créer des produits qui durent.
                    </p>
                    <div className="flex justify-center gap-12">
                        <div className="text-center">
                            <p className="text-4xl font-black text-[#0f172a]">100%</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#00df82]">Local</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black text-[#0f172a]">24/7</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#00df82]">Support</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black text-[#0f172a]">FAST</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#00df82]">Livraison</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Studio Banner Modern */}
            <section className="studio-banner group p-8 md:p-16">
                <div className="banner-content">
                    <h1 className="text-3xl md:text-6xl group-hover:translate-x-2 transition-transform duration-500 font-black tracking-tighter leading-[0.9]">{data.settings.bannerTitle || <>Façonner l'avenir de la<br />consommation & du design. <div className="inline-block w-4 h-4 bg-emerald-400 rounded-full ml-2" /></> }</h1>
                    {data.settings.bannerDesc && <p className="text-white/60 mt-4 text-xs md:text-sm font-medium max-w-xl">{data.settings.bannerDesc}</p>}
                    <div className="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-8">
                        <button className="bg-yellow-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-black uppercase tracking-tighter text-xs md:text-sm hover:bg-yellow-300 transition-colors shadow-lg">
                            Nos Services
                        </button>
                        <button className="bg-white/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-black uppercase tracking-tighter text-xs md:text-sm border border-white/20 hover:bg-white/20 transition-colors">
                            Portfolio
                        </button>
                    </div>
                </div>
                <div className="hidden lg:block relative">
                    <div className="w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
                    <Star className="text-yellow-400 absolute top-0 right-0 animate-bounce" size={40} />
                </div>
            </section>

            {/* 3. Les 3 Incontournables - Bento Style like screenshot */}
            <section className="p-4 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="relative h-[240px] md:h-[400px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl bg-[#f8fafc] flex items-center justify-center">
                        <img 
                            src={data.settings.feature1Img || "https://images.unsplash.com/photo-1579311822484-912f9909247f?auto=format&fit=crop&q=80&w=800"} 
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800";
                            }}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 md:p-10 flex flex-col justify-end pointer-events-none">
                             <div className="w-10 h-10 md:w-12 md:h-12 bg-[#10b981] rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                                <Store size={20} className="text-white md:w-6 md:h-6" />
                             </div>
                             <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-2 leading-none">{data.settings.feature1Title || "Création Visuelle"}</h3>
                             <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{data.settings.feature1Desc || "Identité & Design graphique"}</p>
                        </div>
                    </div>
                    
                    <div className="relative h-[240px] md:h-[400px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl bg-[#f8fafc] flex items-center justify-center">
                        <img 
                            src={data.settings.feature2Img || "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800"} 
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800";
                            }}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 md:p-10 flex flex-col justify-end pointer-events-none">
                             <div className="w-10 h-10 md:w-12 md:h-12 bg-[#10b981] rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                                <Zap size={20} className="text-white md:w-6 md:h-6" />
                             </div>
                             <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-2 leading-none">{data.settings.feature2Title || "Imprimerie"}</h3>
                             <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{data.settings.feature2Desc || "Supports de communication"}</p>
                        </div>
                    </div>

                    <div className="relative h-[240px] md:h-[400px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl bg-[#f8fafc] flex items-center justify-center">
                        <img 
                            src={data.settings.feature3Img || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"} 
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800";
                            }}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 md:p-10 flex flex-col justify-end pointer-events-none">
                             <div className="w-10 h-10 md:w-12 md:h-12 bg-[#10b981] rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                                <Truck size={20} className="text-white md:w-6 md:h-6" />
                             </div>
                             <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-2 leading-none">{data.settings.feature3Title || "Distribution"}</h3>
                             <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{data.settings.feature3Desc || "Logistique Afrique Sub-saharienne"}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Secondary Content Grid - Publicity & Stats */}
            <div className="p-4 md:p-12 mb-10 md:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
                 <section className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[40px] shadow-2xl border border-gray-100 flex flex-col min-h-[350px] md:min-h-[500px]">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <div>
                            <h2 className="text-xl md:text-3xl font-black tracking-tighter text-[#0f172a] uppercase">{data.settings.publicityTitle || "Publicité"}</h2>
                            {data.settings.publicitySubtitle && (
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#10b981] mt-1">{data.settings.publicitySubtitle}</p>
                            )}
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                    
                    <div className="flex-1 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative group bg-black border border-gray-100 shadow-2xl flex items-center justify-center">
                        {data.settings.publicityVideoId && (data.videos || []).find(v => v.id === data.settings.publicityVideoId) ? (
                            <div className="w-full h-full relative aspect-video">
                                {(data.videos || []).find(v => v.id === data.settings.publicityVideoId)?.srcType === 'file' ? (
                                    ((data.videos || []).find(v => v.id === data.settings.publicityVideoId)?.src) ? (
                                        <video 
                                            src={(data.videos || []).find(v => v.id === data.settings.publicityVideoId)?.src || undefined} 
                                            controls 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : null
                                ) : (
                                    ((data.videos || []).find(v => v.id === data.settings.publicityVideoId)?.src) ? (
                                        <iframe 
                                            className="w-full h-full"
                                            src={`https://www.youtube.com/embed/${(data.videos || []).find(v => v.id === data.settings.publicityVideoId)?.src}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                                            title="Ads Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : null
                                )}
                            </div>
                        ) : (
                            <div className="text-center p-8 md:p-12">
                                <Play size={48} className="mx-auto text-gray-100 mb-6" />
                                <p className="text-gray-300 font-black uppercase tracking-[0.2em] text-[10px]">Vidéo Publicitaire non configurée</p>
                            </div>
                        )}
                    </div>
                 </section>

                 <section className="bg-[#052e16] p-8 md:p-12 rounded-[2.5rem] md:rounded-[40px] text-white overflow-hidden relative flex flex-col justify-between shadow-2xl min-h-[350px] md:min-h-[500px]">
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 text-white uppercase leading-none">{data.settings.statsTitle || "Statistiques 2024"}</h2>
                        <p className="text-[#10b981] font-bold text-sm md:text-lg mb-8 md:mb-12">Djapero Factory & Boutique</p>
                        
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-[#0f172a]/80 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 group hover:bg-[#10b981]/20 transition-all flex flex-col items-center text-center justify-center">
                                <p className="text-2xl md:text-5xl font-black mb-2 md:mb-4 tracking-tighter text-white break-words w-full">{data.settings.statsValue1 || "10k"}</p>
                                <p className="text-[8px] md:text-xs font-black uppercase text-[#10b981] tracking-[0.2em]">{data.settings.statsLabel1 || "Clients"}</p>
                            </div>
                            <div className="bg-[#0f172a]/80 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 group hover:bg-[#10b981]/20 transition-all flex flex-col items-center text-center justify-center">
                                <p className="text-2xl md:text-5xl font-black mb-2 md:mb-4 tracking-tighter text-white break-words w-full">{data.settings.statsValue2 || "500"}</p>
                                <p className="text-[8px] md:text-xs font-black uppercase text-[#10b981] tracking-[0.2em]">{data.settings.statsLabel2 || "Staff"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 md:mt-16 relative z-10 border-t border-white/10 pt-6 md:pt-10">
                        <p className="text-xs md:text-lg text-white/50 leading-relaxed font-light font-display break-words">
                            "{data.settings.statsQuote || "Chaque produit est conçu avec soin pour offrir une qualité authentique."}"
                        </p>
                    </div>
                    
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                 </section>
            </div>

            {/* 5. Djapero Portfolio - Grid of Visuals/Reals */}
            <section className="p-4 md:p-12 mb-10 md:mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6">
                    <div>
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Notre Vision</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#0f172a] uppercase leading-none">
                            Ariste & <br/><span className="text-emerald-500">Portfolio.</span>
                        </h2>
                    </div>
                    <div className="flex gap-4 md:gap-8 pb-2 overflow-x-auto scrollbar-hide">
                        {["Tous", "Portraits", "Dynamique", "Nature"].map(cat => (
                            <button key={cat} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-colors whitespace-nowrap">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                {(data.reals || []).length === 0 ? (
                    <div className="columns-2 md:columns-4 lg:columns-5 gap-6 space-y-6">
                        {[
                            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800",
                            "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?auto=format&fit=crop&q=80&w=800",
                            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
                            "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800",
                            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800"
                        ].map((url, i) => (
                            <div key={i} className="break-inside-avoid rounded-3xl overflow-hidden bg-gray-100 shadow-sm opacity-20">
                                <img src={url} className="w-full h-auto grayscale" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6">
                        {data.reals.map((real, i) => (
                            <motion.div 
                                key={real.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05, duration: 0.6 }}
                                className="group relative break-inside-avoid rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_rgba(16,185,129,0.15)] cursor-pointer border border-gray-50 mb-6 transition-all duration-700 hover:-translate-y-2"
                            >
                                {/* Media Section */}
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img 
                                        src={real.imageUrl || undefined} 
                                        alt={real.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600";
                                        }}
                                    />
                                    
                                    {/* Badges/Overlays */}
                                    {real.badge && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="bg-[#10b981] text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest ring-4 ring-white/20">
                                                {real.badge}
                                            </div>
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center gap-4">
                                        <button className="p-4 bg-white rounded-full text-gray-900 hover:scale-110 active:scale-95 transition-all shadow-2xl">
                                            <Heart size={20} className="text-gray-900" />
                                        </button>
                                        <button className="p-4 bg-[#10b981] rounded-full text-white hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20">
                                            <Zap size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em] mb-1">{real.category}</p>
                                            <h4 className="text-gray-900 text-lg font-black uppercase tracking-tighter leading-none group-hover:text-[#10b981] transition-colors">{real.title}</h4>
                                        </div>
                                        {real.rating && (
                                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                                <span className="text-[10px] font-black text-yellow-700">{real.rating}</span>
                                            </div>
                                        )}
                                    </div>

                                    {real.price && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-[#0f172a] text-xl font-black tracking-tighter">{real.price}</span>
                                            {real.oldPrice && (
                                                <span className="text-gray-300 text-sm font-bold line-through tracking-tighter">{real.oldPrice}</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-emerald-50 flex items-center justify-center">
                                                <span className="text-[8px] font-black text-emerald-600">+1k</span>
                                            </div>
                                        </div>
                                        <button className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-colors flex items-center gap-2">
                                            Détails <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

