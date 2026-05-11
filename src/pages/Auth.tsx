import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Leaf, ArrowRight, User, Phone, Mail, Briefcase, ChevronRight, MapPin, Globe, Award, CloudUpload, Trash2, Camera, Zap, Play, Pause, Volume2, VolumeX, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../hooks/useData";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import React from "react";

const FALLBACK_IMAGES = [
    {
        url: "https://images.unsplash.com/photo-1595855759920-86582396706e?auto=format&fit=crop&q=80&w=1800",
        label: "RÉCOLTE // AGRICULTEUR"
    },
    {
        url: "https://images.unsplash.com/photo-1594435532305-64903328e820?auto=format&fit=crop&q=80&w=1800",
        label: "SÉLECTION // ÉQUIPE FEMMES"
    },
    {
        url: "https://images.unsplash.com/photo-1592911963073-95889608c028?auto=format&fit=crop&q=80&w=1800",
        label: "USINE // TRANSFORMATION"
    },
    {
        url: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=1800",
        label: "COMMUNAUTÉ // DJAPERO"
    },
    {
        url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1800",
        label: "QUALITÉ // MAINS LOCALES"
    }
];

function HeroVideoPlayer({ heroVid, isPlaying, isMuted }: { heroVid: any, isPlaying: boolean, isMuted: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.play().catch(() => {});
            else videoRef.current.pause();
        }
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: "command", func: isPlaying ? "playVideo" : "pauseVideo", args: [] }), "*");
        }
    }, [isPlaying]);

    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: "command", func: isMuted ? "mute" : "unMute", args: [] }), "*");
        }
    }, [isMuted]);

    const getYouTubeId = (url: string) => {
        if (!url) return "";
        if (url.length === 11 && !url.includes("/") && !url.includes(".")) return url;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    if (!heroVid) return null;

    const isImage = heroVid.srcType === 'image' || (!heroVid.srcType && heroVid.src?.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    const isFile = heroVid.srcType === 'file' || (!heroVid.srcType && heroVid.src?.includes('/api/upload'));

    if (isImage) {
        return (
            <img 
                src={heroVid.src || undefined} 
                className={`w-full h-full object-cover transition-transform duration-[20s] ${isPlaying ? 'scale-110' : 'scale-100'}`}
                alt={heroVid.title}
            />
        );
    }

    if (isFile) {
        return (
            <video 
                ref={videoRef}
                src={heroVid.src || undefined} 
                poster={heroVid.thumbnail || undefined}
                autoPlay={isPlaying}
                loop 
                muted={isMuted}
                playsInline 
                className="w-full h-full object-cover"
                onCanPlay={(e) => {
                    const el = e.target as HTMLVideoElement;
                    if (isPlaying) el.play().catch(() => {});
                }}
            />
        );
    }

    return (
        <div className="absolute inset-0">
            <iframe 
                ref={iframeRef}
                key={heroVid.id}
                className="absolute inset-0 w-full h-full pointer-events-none"
                src={`https://www.youtube.com/embed/${getYouTubeId(heroVid.src)}?autoplay=${isPlaying ? 1 : 0}&controls=0&loop=1&playlist=${getYouTubeId(heroVid.src)}&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1&mute=${isMuted ? 1 : 0}&vq=hd1080&playsinline=1`}
                title={heroVid.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
            />
        </div>
    );
}

export default function Auth() {
    const { login, loginWithEmail, signupWithEmail, user, profile, completeProfile, isAdmin } = useAuth();
    const { data } = useData();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const navigate = useNavigate();
    
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [bgIndex, setBgIndex] = useState(0);
    const [currentVidIndex, setCurrentVidIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const toggleMute = () => setIsMuted(!isMuted);
    const togglePlay = () => setIsPlaying(!isPlaying);

    const allVideos = data?.videos && data.videos.length > 0 ? data.videos : FALLBACK_IMAGES.map((img, i) => ({ id: `fb-${i}`, title: img.label, src: img.url, srcType: 'image' as const }));
    const featuredVideos = allVideos.slice(-5);
    const heroVid = featuredVideos[currentVidIndex] || null;

    const nextVid = () => setCurrentVidIndex((prev) => (prev + 1) % featuredVideos.length);
    const prevVid = () => setCurrentVidIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length);

    const isImageMode = data?.settings?.heroMode === 'image';
    
    const [formData, setFormData] = useState({
        fullName: "",
        occupation: "",
        email: "",
        phone: "",
        city: "",
        role: "Client",
        about: "",
        experience: "1-3 ans",
        gender: "M",
        portfolioUrl: "",
        profileImageUrl: "",
        specialties: [] as string[]
    });

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (file: File): Promise<string | null> => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const text = await response.text();
                console.error("Upload failed with status:", response.status, text);
                return null;
            }

            const data = await response.json();
            return data.url;
        } catch (err) {
            console.error("Upload error:", err);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const backImages = data?.settings?.authBackgrounds?.length 
        ? data.settings.authBackgrounds 
        : FALLBACK_IMAGES;

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [backImages.length]);

    useEffect(() => {
        if (user && !formData.email) {
            setFormData(prev => ({ 
                ...prev, 
                email: user.email || "", 
                fullName: user.displayName || "" 
            }));
        }
    }, [user]);

    // Redirect if already has profile OR is admin
    useEffect(() => {
        if (user && (profile || isAdmin)) {
            if (isAdmin) {
                navigate("/admin");
            } else {
                navigate("/accueil");
            }
        }
    }, [user, profile, navigate, isAdmin]);

    const [loginError, setLoginError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setLoginError(null);
        try {
            await login();
        } catch (error: any) {
            if (error.code === 'auth/popup-closed-by-user') {
                console.log("User closed login popup");
            } else if (error.code === 'auth/popup-blocked') {
                setLoginError("Le navigateur a bloqué la fenêtre de connexion. Veuillez autoriser les popups pour ce site.");
            } else {
                setLoginError("La connexion a échoué. Veuillez réessayer.");
                console.error("Login failed:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoginError(null);
        try {
            if (authMode === 'login') {
                await loginWithEmail(email, password);
            } else {
                await signupWithEmail(email, password);
            }
        } catch (error: any) {
            setLoginError("La connexion a échoué. Veuillez vérifier vos identifiants ou créer un compte.");
            console.error("Email auth failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.phone) return;

        setLoading(true);
        try {
            await completeProfile(formData);
            if (isAdmin) {
                navigate("/admin");
            } else {
                navigate("/accueil");
            }
        } catch (error) {
            console.error("Onboarding failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isStepOnboarding = user && !profile && !isAdmin;

    return (
        <div 
            className={`min-h-screen flex items-center justify-center p-4 md:p-12 overflow-hidden relative font-sans transition-colors duration-1000 ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#0f172a] text-white'}`}
        >
            {/* Immersive Background Effects */}
            <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-white/20 rounded-full blur-[140px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-15%] w-[600px] h-[600px] bg-black/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[1400px] 2xl:max-w-screen-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="w-20 h-20 bg-white shadow-2xl rounded-[2rem] flex items-center justify-center mb-10 mx-auto lg:mx-0 border border-white/50">
                                <Leaf size={40} className="text-[#55b308]" />
                            </div>
                            
                            <h1 className={`text-7xl md:text-8xl font-[1000] -tracking-tighter leading-none uppercase mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                Djapero<br/>
                                <span className={isLight ? 'text-slate-900/20' : 'text-white/20'}>Group.</span>
                            </h1>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 justify-center lg:justify-start">
                                    <div className={`h-[2px] w-12 opacity-20 ${isLight ? 'bg-black' : 'bg-white'}`} />
                                    <p className={`text-[11px] font-black uppercase tracking-[0.6em] opacity-90 ${isLight ? 'text-[#0f172a]' : 'text-slate-300'}`}>Excellence Tropicale</p>
                                </div>
                                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed max-w-xs ${isLight ? 'text-[#0f172a]/60' : 'text-slate-400'}`}>
                                    Zéro déchet – 100% frais<br/>L'agriculture d'élite en Afrique.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Central Showcase - Professional Portrait Video */}
                    <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-10 scale-100 lg:scale-110 xl:scale-110 z-20">
                        <div className="relative w-full max-w-[420px] aspect-[9/16] max-h-[80vh] min-h-[500px]">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={currentVidIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="absolute inset-0 bg-black rounded-[3rem] sm:rounded-[3.5rem] border-[6px] sm:border-[8px] border-white/10 overflow-hidden shadow-[0_50px_120px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/20"
                                >
                                    <HeroVideoPlayer heroVid={heroVid} isPlaying={isPlaying} isMuted={isMuted} />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                                    
                                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-8">
                                        <div className="flex justify-between items-start">
                                            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full">
                                                <span className="text-white text-[7px] font-black uppercase tracking-[0.3em]">
                                                    {currentVidIndex + 1} / {featuredVideos.length}
                                                </span>
                                            </div>
                                            <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-2xl border border-white/10 text-white flex items-center justify-center hover:bg-[#55b308] hover:border-[#55b308] transition-all">
                                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <span className="text-[#42e60b] text-[8px] font-black uppercase tracking-[0.4em]">
                                                    {heroVid?.caption || "Culture Connectée"}
                                                </span>
                                                <h3 className="text-white text-2xl font-[1000] uppercase tracking-[-0.02em] leading-[0.9]">
                                                    {heroVid?.title || "Innovation"}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={togglePlay} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                                                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                                                </button>
                                                <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="h-full bg-[#42e60b]"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: isPlaying ? "100%" : "30%" }}
                                                        transition={{ duration: isPlaying ? 15 : 0.5, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Controls */}
                        <div className="mt-10 flex flex-col items-center gap-6">
                            <div className="flex gap-2.5">
                                {featuredVideos.map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setCurrentVidIndex(i)}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentVidIndex ? 'w-10 bg-black' : 'w-2 bg-black/10 hover:bg-black/20'}`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-6">
                                <button onClick={prevVid} className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-black hover:bg-emerald-500 hover:text-white transition-all active:scale-90">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={nextVid} className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-black hover:bg-emerald-500 hover:text-white transition-all active:scale-90">
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action / Auth Section */}
                    <div className="lg:col-span-3 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="bg-[#080202] p-10 md:p-12 rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10 relative"
                        >
                            <AnimatePresence mode="wait">
                                {!isStepOnboarding ? (
                                    <motion.div 
                                        key="login"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-12"
                                    >
                                        <div className="text-center">
                                            <h2 className="text-[2.5rem] font-[1000] -tracking-[0.05em] leading-[0.9] uppercase mb-4 text-[#f4f5f4]">Accès<br/>Partenaire</h2>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-[180px] mx-auto ${isLight ? 'text-gray-400' : 'text-slate-400'}`}>
                                                Rejoignez l'élite agricole africaine.
                                            </p>
                                        </div>

                                        <form onSubmit={handleEmailAuth} className="space-y-4">
                                            <div className="space-y-3">
                                                <input 
                                                    className={`w-full border px-6 py-4 rounded-2xl outline-none focus:border-[#a3e635] transition-all font-bold text-sm ${isLight ? 'bg-[#f8fafc] border-[#e2e8f0] text-[#0f172a] focus:bg-white placeholder:text-gray-400' : 'bg-white/5 border-white/10 text-white focus:bg-white/10 placeholder:text-gray-500'}`}
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Adresse email"
                                                    required
                                                />
                                                <input 
                                                    className={`w-full border px-6 py-4 rounded-2xl outline-none focus:border-[#a3e635] transition-all font-bold text-sm ${isLight ? 'bg-[#f8fafc] border-[#e2e8f0] text-[#0f172a] focus:bg-white placeholder:text-gray-400' : 'bg-white/5 border-white/10 text-white focus:bg-white/10 placeholder:text-gray-500'}`}
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Mot de passe"
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className={`w-full py-4 rounded-2xl font-[1000] text-[10px] uppercase tracking-widest shadow-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 ${isLight ? 'bg-[#0f172a] text-white shadow-black/10 hover:bg-[#a3e635] hover:text-[#0f172a] hover:shadow-[#a3e635]/30' : 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-[#a3e635] hover:shadow-[#a3e635]/40'}`}
                                            >
                                                {loading ? "Vérification..." : (authMode === 'login' ? "Se connecter" : "Créer un compte")}
                                            </button>
                                        </form>

                                        <div className="relative py-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className={`w-full border-t ${isLight ? 'border-gray-100' : 'border-white/10'}`}></div>
                                            </div>
                                            <div className="relative flex justify-center">
                                                <span className={`px-4 text-[9px] font-black uppercase tracking-widest ${isLight ? 'bg-white text-gray-300' : 'bg-[#060b19] text-gray-600'}`}>Ou</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleGoogleLogin}
                                            type="button"
                                            disabled={loading}
                                            className={`w-full border py-4 rounded-2xl font-[1000] text-[10px] uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 ${isLight ? 'bg-white border-gray-200 text-[#0f172a] shadow-sm hover:bg-gray-50 hover:border-gray-300' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
                                        >
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                                            Accéder via Google
                                        </button>

                                        <p className={`text-center text-[10px] font-bold ${isLight ? 'text-gray-400' : 'text-slate-400'}`}>
                                            {authMode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
                                            <button 
                                                type="button"
                                                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                                className={`hover:underline ${isLight ? 'text-[#0f172a]' : 'text-white'}`}
                                            >
                                                {authMode === 'login' ? 'Inscrivez-vous' : 'Connectez-vous'}
                                            </button>
                                        </p>

                                        {loginError && (
                                            <p className={`text-[10px] text-red-500 font-bold text-center mt-4 uppercase tracking-widest p-3 rounded-xl border ${isLight ? 'bg-red-50 border-red-100' : 'bg-red-500/10 border-red-500/20'}`}>{loginError}</p>
                                        )}

                                        <div className={`h-[1px] w-full ${isLight ? 'bg-gray-100' : 'bg-white/10'}`} />
                                        
                                        <div className="text-center">
                                            <p className={`text-[8px] font-black uppercase tracking-[0.3em] mb-2 ${isLight ? 'text-gray-300' : 'text-slate-600'}`}>Assistance Technique</p>
                                            <p className={`text-[9px] font-bold ${isLight ? 'text-gray-400' : 'text-slate-400'}`}>support@djapero-group.com</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="onboarding"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-[#42e60b]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#42e60b]/20">
                                                <Zap size={20} className="text-[#55b308]" />
                                            </div>
                                            <h2 className="text-2xl font-[1000] uppercase tracking-tight mb-1 text-[#f4f5f4]">Finalisation</h2>
                                            <p className={`text-[8px] font-black uppercase tracking-[0.2em] leading-relaxed ${isLight ? 'text-gray-400' : 'text-slate-400'}`}>Dernière étape avant l'accès.</p>
                                        </div>

                                        <form onSubmit={handleOnboarding} className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="space-y-3">
                                                <div className="relative group">
                                                    <User size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#55b308] transition-colors" />
                                                    <input 
                                                        type="text"
                                                        required
                                                        value={formData.fullName}
                                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                        placeholder="Vrai Nom & Prénom"
                                                        className={`w-full border rounded-xl py-3.5 pl-12 pr-4 font-bold text-xs outline-none focus:border-[#42e60b] transition-all shadow-sm ${isLight ? 'bg-gray-50 border-gray-100 focus:bg-white text-slate-800' : 'bg-white/5 border-white/10 focus:bg-white/10 text-white'}`}
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#55b308] transition-colors" />
                                                    <input 
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="Email de contact"
                                                        className={`w-full border rounded-xl py-3.5 pl-12 pr-4 font-bold text-xs outline-none focus:border-[#42e60b] transition-all shadow-sm ${isLight ? 'bg-gray-50 border-gray-100 focus:bg-white text-slate-800' : 'bg-white/5 border-white/10 focus:bg-white/10 text-white'}`}
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#55b308] transition-colors" />
                                                    <input 
                                                        type="tel"
                                                        required
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="Numéro WhatsApp (+225...)"
                                                        className={`w-full border rounded-xl py-3.5 pl-12 pr-4 font-bold text-xs outline-none focus:border-[#42e60b] transition-all shadow-sm ${isLight ? 'bg-gray-50 border-gray-100 focus:bg-white text-slate-800' : 'bg-white/5 border-white/10 focus:bg-white/10 text-white'}`}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="relative group">
                                                        <Briefcase size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input 
                                                            type="text"
                                                            required
                                                            value={formData.occupation}
                                                            onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                                            placeholder="Secteur"
                                                            className={`w-full border rounded-xl py-3.5 pl-12 pr-4 font-bold text-[11px] outline-none focus:border-[#42e60b] transition-all ${isLight ? 'bg-gray-50 border-gray-100 text-slate-800' : 'bg-white/5 border-white/10 text-white'}`}
                                                        />
                                                    </div>
                                                    <div className="relative group">
                                                        <MapPin size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input 
                                                            type="text"
                                                            required
                                                            value={formData.city}
                                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                            placeholder="Ville"
                                                            className={`w-full border rounded-xl py-3.5 pl-12 pr-4 font-bold text-[11px] outline-none focus:border-[#42e60b] transition-all ${isLight ? 'bg-gray-50 border-gray-100 text-slate-800' : 'bg-white/5 border-white/10 text-white'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de Compte</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Producteur', 'Client'].map(r => (
                                                        <button
                                                            key={r}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, role: r })}
                                                            className={`py-3 rounded-xl font-black text-[8px] uppercase tracking-[0.2em] transition-all ${formData.role === r ? (isLight ? 'bg-[#0f172a] text-white shadow-xl' : 'bg-emerald-500 text-black shadow-xl') : (isLight ? 'bg-gray-50 text-gray-400 border border-gray-100' : 'bg-white/5 text-gray-400 border border-white/10')} hover:border-[#42e60b]/30`}
                                                        >
                                                            {r}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-[#55b308] text-white py-4 rounded-[1.5rem] font-black text-[9px] uppercase tracking-[0.25em] shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all group disabled:opacity-50 mt-2"
                                            >
                                                {loading ? "Traitement..." : "Accéder à l'interface"}
                                            </button>

                                            <p className="text-[7px] text-center text-gray-400 font-bold uppercase tracking-widest mt-4">
                                                En continuant, vous acceptez nos conditions d'élite.
                                            </p>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Global Credits Footer */}
            <div className="absolute bottom-12 inset-x-0 text-center pointer-events-none md:flex md:justify-between md:px-20">
                <span className="text-white/30 text-[8px] font-black uppercase tracking-[0.6em] block md:inline mb-4 md:mb-0">
                    Propulsé par Djapero Group © 2026
                </span>
                <div className="hidden md:flex gap-10">
                    <span className="text-white/30 text-[8px] font-black uppercase tracking-[0.4em]">Développement Durable</span>
                    <span className="text-white/30 text-[8px] font-black uppercase tracking-[0.4em]">Innovation Sociale</span>
                </div>
            </div>
        </div>
    );
}

