import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Leaf, ArrowRight, User, Phone, Mail, Briefcase, ChevronRight, MapPin, Globe, Award, CloudUpload, Trash2, Camera, Zap, Play, Pause, Volume2, VolumeX, ChevronLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../hooks/useData";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import React from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    const isFile = heroVid.srcType === 'file' || (!heroVid.srcType && (heroVid.src?.includes('/api/upload') || heroVid.src?.match(/\.(mp4|webm|ogg|mov)$/i) || heroVid.src?.includes('/uploads')));

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
    const isIframe = React.useMemo(() => window.self !== window.top, []);
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
            const filename = `auth_${Date.now()}_${file.name}`;
            const fileRef = ref(storage, `uploads/${filename}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            return url;
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
        if (user) {
            setFormData(prev => ({ 
                ...prev, 
                email: prev.email || user.email || "", 
                fullName: prev.fullName || user.displayName || "",
                profileImageUrl: prev.profileImageUrl || user.photoURL || ""
            }));
        }
    }, [user]);

    // Redirect if already has profile OR is admin
    useEffect(() => {
        if (user && profile) {
            navigate("/accueil");
        }
    }, [user, profile, navigate]);

    const [loginError, setLoginError] = useState<string | null>(null);

    // Safety timeout to unstick loading state
    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                setLoading(false);
                if (!user) {
                    setLoginError("La connexion prend trop de temps. Veuillez vérifier votre connexion et réessayer.");
                }
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [loading, user]);

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);
        setLoginError(null);

        // Safety timeout - aligned with context (25s) + buffer
        const timeoutId = setTimeout(() => setLoading(false), 30000);

        try {
            await login();
            // App.tsx handles missing profile by redirecting to /auth (same page)
            // But if profile exists, we want to show the welcome animation first
            navigate("/bienvenue");
        } catch (error: any) {
            if (error.code === 'auth/popup-closed-by-user') {
                setLoginError("Connexion annulée. Veuillez réessayer si vous le souhaitez.");
            } else if (error.code === 'auth/popup-blocked') {
                setLoginError("Le navigateur a bloqué la fenêtre de connexion. Veuillez autoriser les popups pour ce site.");
            } else if (error.code === 'auth/network-request-failed') {
                setLoginError("ERREUR RÉSEAU : La connexion est bloquée par l'environnement (Iframe/AdBlock).\n\nSOLUTIONS :\n1. Désactivez votre AdBlock.\n2. CLIQUEZ SUR L'ICÔNE D'ONGLET EN HAUT À DROITE DE L'ÉCRAN pour ouvrir l'application hors de l'iframe.\n3. Désactivez votre VPN.");
            } else {
                setLoginError("La connexion a échoué. Veuillez réessayer.");
                console.error("Login failed:", error);
            }
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoginError(null);
        
        // Safety timeout
        const timeoutId = setTimeout(() => setLoading(false), 15000);

        try {
            if (authMode === 'login') {
                await loginWithEmail(email, password);
                navigate("/bienvenue");
            } else {
                await signupWithEmail(email, password);
            }
        } catch (error: any) {
            console.error("Email auth failed:", error);
            if (error.message && error.message.includes("trop de temps")) {
                setLoginError(error.message);
            } else if (error.code === 'auth/email-already-in-use') {
                setLoginError("Cette adresse email est déjà utilisée. Essayez de vous connecter.");
            } else if (error.code === 'auth/invalid-email') {
                setLoginError("L'adresse email n'est pas valide.");
            } else if (error.code === 'auth/weak-password') {
                setLoginError("Le mot de passe est trop court (6 caractères minimum).");
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setLoginError("Email ou mot de passe incorrect.");
            } else if (error.code === 'auth/network-request-failed') {
                setLoginError("Erreur Réseau : Impossible de contacter Firebase. Vérifiez votre connexion.");
            } else if (error.code === 'auth/operation-not-allowed') {
                setLoginError("La création de compte par email n'est pas encore activée sur ce projet.");
            } else {
                setLoginError("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    const [onboardingError, setOnboardingError] = useState<string | null>(null);

    const handleOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();
        setOnboardingError(null);
        if (!formData.fullName || !formData.email || !formData.phone || !formData.city || !formData.occupation) {
            setOnboardingError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setOnboardingError("Le délai d'attente est dépassé. Veuillez ouvrir l'application dans un nouvel onglet.");
        }, 20000);

        try {
            await completeProfile(formData);
            navigate("/bienvenue");
        } catch (error: any) {
            console.error("Onboarding failed:", error);
            let msg = error.message || "Impossible d'enregistrer le profil.";
            try {
                const parsed = JSON.parse(error.message);
                if (parsed.error && parsed.error.includes("permissions")) {
                    msg = "Erreur de permissions. Contactez l'admin.";
                }
            } catch (e) {}
            setOnboardingError(msg);
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    const isStepOnboarding = user && !profile && !isAdmin;

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden relative font-sans bg-white">
            
            {/* Background Image Section - Immersive Left Side */}
            <div className="relative w-full md:w-[55%] h-[40vh] md:h-screen overflow-hidden bg-[#101928]">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c97?auto=format&fit=crop&q=80&w=1800"
                        className="w-full h-full object-cover animate-slow-zoom"
                        alt="Agriculture Connectée Djapero"
                        referrerPolicy="no-referrer"
                    />
                    {/* Immersive Dark Overlay matching Djapero brand - adjusted for better visibility */}
                    <div className="absolute inset-0 bg-[#070b14]/20 mix-blend-multiply pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Left Side Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-16 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-12 h-12 bg-[#a3e635] rounded-2xl flex items-center justify-center text-[#0f172a] shadow-xl shadow-[#a3e635]/20">
                                <Leaf size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tighter uppercase leading-none">Djapero</span>
                                <span className="text-[10px] font-bold text-[#a3e635] tracking-[0.2em] uppercase leading-none mt-1">Dashboard v3</span>
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter mb-6 max-w-sm">
                            CULTURE <br />
                            <span className="text-[#a3e635]">CONNECTÉE</span> <br />
                            PAR DJAPERO
                        </h2>
                        
                        <p className="text-slate-300 text-sm md:text-base font-medium max-w-xs leading-relaxed">
                            Simplifiez la gestion de votre exploitation avec nos solutions digitales innovantes.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-[#a3e635] uppercase tracking-[0.3em] mb-1">Plus de</span>
                                <span className="text-4xl font-black text-white leading-none">500</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Partenaires</span>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-[#a3e635] uppercase tracking-[0.3em] mb-1">Plus de</span>
                                <span className="text-4xl font-black text-white leading-none">12k</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Commandes</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
                                <CloudUpload size={12} className="text-[#a3e635]" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-200">Production</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
                                <Award size={12} className="text-[#a3e635]" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-200">Qualité</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
                                <Zap size={12} className="text-[#a3e635]" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-200">Vitesse</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Form Container */}
            <div className="w-full md:w-[45%] bg-white h-full overflow-y-auto px-8 py-12 md:px-20 flex flex-col justify-center relative">
                
                {/* Mobile floating logo */}
                <div className="md:hidden flex items-center gap-2 absolute top-8 left-8">
                     <div className="w-8 h-8 bg-[#a3e635] rounded-xl flex items-center justify-center text-[#0f172a]">
                        <Leaf size={16} />
                    </div>
                    <span className="font-black text-slate-900 uppercase text-xs tracking-tighter">Djapero</span>
                </div>

                <AnimatePresence mode="wait">
                    {!isStepOnboarding ? (
                        <motion.div 
                            key="login"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            className="w-full max-w-[420px] mx-auto"
                        >
                            <div className="mb-14 text-center">
                                <motion.h2 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-5xl md:text-6xl font-black text-slate-900 tracking-[0.02em] mb-4 uppercase leading-none"
                                >
                                    {authMode === 'login' ? 'Bienvenue' : 'Inscription'}
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-slate-400 text-sm md:text-[15px] font-medium tracking-tight max-w-[340px] mx-auto leading-relaxed"
                                >
                                    {authMode === 'login' ? 'Veuillez vous connecter pour accéder à votre tableau de bord.' : 'Rejoignez l\'aventure Djapero dès aujourd\'hui.'}
                                </motion.p>
                            </div>

                            <form onSubmit={handleEmailAuth} className="space-y-8">
                                {authMode === 'signup' && (
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Nom complet</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#a3e635] transition-all duration-300">
                                                <User size={22} />
                                            </div>
                                            <input 
                                                className="w-full bg-slate-50/50 border border-slate-100 px-16 py-5 rounded-[24px] outline-none focus:bg-white focus:border-[#a3e635] focus:ring-8 focus:ring-[#a3e635]/5 transition-all text-sm font-bold placeholder:text-slate-200 shadow-sm hover:shadow-md"
                                                type="text"
                                                placeholder="VOTRE NOM COMPLET"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Adresse Email</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#a3e635] transition-all duration-300">
                                            <Mail size={22} />
                                        </div>
                                        <input 
                                            className="w-full bg-slate-50/50 border border-slate-100 px-16 py-5 rounded-[24px] outline-none focus:bg-white focus:border-[#a3e635] focus:ring-8 focus:ring-[#a3e635]/5 transition-all text-sm font-bold placeholder:text-slate-200 shadow-sm hover:shadow-md"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="NOM@EXEMPLE.COM"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Mot de passe</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#a3e635] transition-all duration-300">
                                            <ShieldCheck size={22} />
                                        </div>
                                        <input 
                                            className="w-full bg-slate-50/50 border border-slate-100 px-16 py-5 rounded-[24px] outline-none focus:bg-white focus:border-[#a3e635] focus:ring-8 focus:ring-[#a3e635]/5 transition-all text-sm font-bold placeholder:text-slate-200 shadow-sm hover:shadow-md"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                        />
                                        {authMode === 'login' && (
                                            <button type="button" className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 hover:text-[#a3e635] uppercase tracking-tighter transition-colors">Oublié ?</button>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5.5 rounded-[24px] font-black text-sm text-[#0f172a] bg-[#a3e635] hover:bg-[#bef264] transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-[#a3e635]/30 uppercase tracking-[0.3em] mt-6"
                                >
                                    {loading ? "Chargement..." : (authMode === 'login' ? "Se connecter" : "S'inscrire")}
                                </button>
                            </form>

                            <div className="mt-12 text-center text-sm font-bold text-slate-400">
                                {authMode === 'login' ? "Pas encore de compte ? " : 'Déjà un compte ? '}
                                <button 
                                    type="button"
                                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                    className="text-[#a3e635] hover:underline font-black ml-1 uppercase tracking-widest text-[11px]"
                                >
                                    {authMode === 'login' ? "Créer un compte" : "Connexion"}
                                </button>
                            </div>

                            <div className="relative py-12">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-6 text-[10px] font-black text-slate-300 bg-white uppercase tracking-widest">Ou continuer avec</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <button 
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    disabled={loading}
                                    className="bg-slate-50 border border-slate-100 py-5 rounded-[20px] text-[10px] font-black text-slate-800 transition-all hover:bg-slate-100 hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em]"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-[20px] h-[20px]" />
                                    Google
                                </button>
                                <button 
                                    type="button"
                                    disabled={loading}
                                    className="bg-slate-900 py-5 rounded-[20px] text-[10px] font-black text-white transition-all hover:bg-black hover:shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em]"
                                >
                                    <div className="text-xl leading-none"></div>
                                    Apple
                                </button>
                            </div>

                            {loginError && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-10 p-6 rounded-[24px] bg-red-50 border border-red-100"
                                >
                                    <p className="text-sm text-red-500 font-bold mb-4">{loginError}</p>
                                    <button 
                                        onClick={() => window.open(window.location.href, '_blank')}
                                        className="w-full py-3 bg-red-500 text-white rounded-[16px] text-xs font-black hover:bg-red-600 transition-all uppercase tracking-widest shadow-xl shadow-red-200"
                                    >
                                        Sortir de l'iframe
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="onboarding"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            className="w-full max-w-[420px] mx-auto"
                        >
                            <div className="text-center mb-16">
                                {formData.profileImageUrl ? (
                                    <div className="relative w-28 h-28 mx-auto mb-6 group">
                                        <div className="absolute inset-0 bg-[#a3e635] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <img 
                                            src={formData.profileImageUrl} 
                                            alt="Profile" 
                                            className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-2xl"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-[#a3e635]/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-[#a3e635]/20 shadow-inner">
                                        <User size={40} className="text-[#a3e635]" />
                                    </div>
                                )}
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase leading-none">Profil</h2>
                                <p className="text-sm md:text-base text-slate-400 font-medium tracking-tight">Dernière étape avant l'accès complet.</p>
                            </div>

                            <form onSubmit={handleOnboarding} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Nom complet</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#a3e635] transition-all duration-300">
                                            <User size={20} />
                                        </div>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                                            className="w-full bg-slate-50/50 border border-slate-100 px-16 py-5 rounded-[24px] outline-none focus:bg-white focus:border-[#a3e635] focus:ring-8 focus:ring-[#a3e635]/5 transition-all text-sm font-bold shadow-sm"
                                            placeholder="JEAN DUPONT"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Profession / Activité</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#a3e635] transition-all duration-300">
                                            <Briefcase size={20} />
                                        </div>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.occupation}
                                            onChange={e => setFormData(prev => ({...prev, occupation: e.target.value}))}
                                            className="w-full bg-slate-50/50 border border-slate-100 px-16 py-5 rounded-[24px] outline-none focus:bg-white focus:border-[#a3e635] focus:ring-8 focus:ring-[#a3e635]/5 transition-all text-sm font-bold shadow-sm"
                                            placeholder="AGRICULTEUR, VENDEUR..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Tél.</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#a3e635] transition-all duration-300">
                                                <Phone size={18} />
                                            </div>
                                            <input 
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                                                className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-4 py-5 rounded-[24px] outline-none focus:bg-white focus:border-[#a3e635] focus:ring-8 focus:ring-[#a3e635]/5 transition-all text-xs font-bold shadow-sm"
                                                placeholder="+243..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Ville</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#a3e635] transition-all duration-300">
                                                <MapPin size={18} />
                                            </div>
                                            <input 
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData(prev => ({...prev, city: e.target.value}))}
                                                className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-4 py-5 rounded-[24px] outline-none focus:bg-white focus:border-[#a3e635] focus:ring-8 focus:ring-[#a3e635]/5 transition-all text-xs font-bold shadow-sm"
                                                placeholder="KINSHASA"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5.5 mt-6 rounded-[24px] font-black text-sm text-[#0f172a] bg-[#a3e635] hover:bg-[#bef264] transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-[#a3e635]/30 uppercase tracking-[0.3em]"
                                >
                                    {loading ? "Chargement..." : "LANCER L'EXPÉRIENCE"} 
                                </button>

                                {onboardingError && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-[20px] text-center">
                                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">{onboardingError}</p>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Credits */}
                <div className="absolute bottom-8 left-0 right-0 text-center text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] hidden md:block">
                    Digital Agency // Design by Djapero
                </div>
            </div>
        </div>
    );
}

