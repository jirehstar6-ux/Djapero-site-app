import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ChevronRight, ShoppingBag, Plus, Play, ArrowRight, X, Star, ShieldCheck, Sparkles, Zap, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../hooks/useData";

import Logo from "./layout/Logo";

export default function Landing() {
    const { data } = useData();
    const { login, loginWithEmail, signupWithEmail, user, profile, completeProfile } = useAuth();
    const [showAuth, setShowAuth] = React.useState(false);
    const [authMode, setAuthMode] = React.useState<'login' | 'signup' | 'onboarding'>('login');
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    
    // Video Carousel State
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const videos = [
        {
            tag: "Culture Connectée",
            title: "Volailler",
            url: "https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-with-a-group-of-chickens-around-him-4279-small.mp4",
            poster: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1200"
        },
        {
            tag: "Excellence Agricole",
            title: "Récolte",
            url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-farmer-collecting-fresh-vegetables-4277-small.mp4",
            poster: "https://images.unsplash.com/photo-1592688081600-b6f125a07530?auto=format&fit=crop&q=80&w=1200"
        },
        {
            tag: "Logistique Locale",
            title: "Livraison",
            url: "https://assets.mixkit.co/videos/preview/mixkit-man-driving-a-tractor-in-a-crop-field-4274-small.mp4",
            poster: "https://images.unsplash.com/photo-1614716035255-a080c98f8221?auto=format&fit=crop&q=80&w=1200"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
        setIsPlaying(true);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
        setIsPlaying(true);
    };

    const [isPlaying, setIsPlaying] = React.useState(true);
    const [progress, setProgress] = React.useState(0);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        
        const updateProgress = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };
        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ended', nextSlide);
        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('ended', nextSlide);
        };
    }, [currentSlide]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.log("Play interrupted:", error);
                    setIsPlaying(false);
                });
            } else {
                setIsPlaying(true);
            }
        }
    };
    
    const [onboardingData, setOnboardingData] = React.useState({
        fullName: "",
        phone: "",
        role: "Client" as "Client" | "Producteur",
        city: "Lomé",
        occupation: "Gastronomie"
    });
    const navigate = useNavigate();

    const getErrorMessage = (error: any) => {
        if (error.code === 'auth/operation-not-allowed') {
            return "La connexion par email n'est pas encore activée. Veuillez utiliser Google ou contacter l'administrateur.";
        }
        if (error.code === 'auth/invalid-email') {
            return "L'adresse email est mal formatée.";
        }
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            return "Email ou mot de passe incorrect.";
        }
        if (error.code === 'auth/email-already-in-use') {
            return "Cet email est déjà utilisé par un autre compte.";
        }
        if (error.code === 'auth/weak-password') {
            return "Le mot de passe est trop faible (6 caractères minimum).";
        }
        if (error.code === 'auth/too-many-requests') {
            return "Trop de tentatives infructueuses. Veuillez réessayer plus tard.";
        }
        return "Erreur d'authentification. Vérifiez vos identifiants.";
    };

    const handleAuthAction = async () => {
        setError(null);
        try {
            if (authMode === 'login') {
                await loginWithEmail(email, password);
            } else if (authMode === 'signup') {
                await signupWithEmail(email, password);
                setAuthMode('onboarding');
                return;
            }
            
            if (user && !profile) {
                setAuthMode('onboarding');
            } else if (user) {
                navigate("/accueil");
            }
        } catch (error: any) {
            console.error("Auth action failed:", error);
            setError(getErrorMessage(error));
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await login();
            if (user && !profile) {
                setAuthMode('onboarding');
            } else {
                navigate("/accueil");
            }
        } catch (error: any) {
            if (error?.code !== 'auth/popup-closed-by-user') {
                console.error("Google Login failed:", error);
            }
        }
    };

    const handleOnboardingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await completeProfile({
                fullName: onboardingData.fullName,
                phone: onboardingData.phone,
                role: onboardingData.role,
                city: onboardingData.city,
                occupation: onboardingData.occupation,
                email: user?.email || email
            });
            navigate("/accueil");
        } catch (error) {
            console.error("Onboarding failed:", error);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#a3e635] selection:bg-black selection:text-white font-display text-black overflow-hidden flex items-center justify-center p-6 md:p-12">
            
            {/* DYNAMIC BACKGROUND (MESH GRADIENT) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[150px] animate-mesh" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600 rounded-full blur-[180px] animate-mesh" style={{ animationDelay: '-5s' }} />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-400 rounded-full blur-[140px] animate-mesh" style={{ animationDelay: '-10s' }} />
            </div>

            <div className="relative z-10 w-full max-w-[1600px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                
                {/* CENTER: DEVICE CAROUSEL */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-[2] lg:flex-[2.5] w-full flex justify-center relative"
                >
                    <div className="relative w-full max-w-[1000px] xl:max-w-[1200px] aspect-video bg-[#0f172a] rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden group mx-auto border border-white/10 ring-1 ring-black/5">
                        <div 
                            onClick={(e) => { e.stopPropagation(); if (videoRef.current) { videoRef.current.muted = !videoRef.current.muted; } }}
                            className="absolute top-6 right-6 z-20 p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white/90 border border-white/10 shadow-xl cursor-pointer hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                        >
                             <VolumeX size={14} />
                        </div>

                        <div className="h-full w-full overflow-hidden relative cursor-pointer" onClick={togglePlay}>
                             <video 
                                key={videos[currentSlide].url}
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                poster={videos[currentSlide].poster}
                                className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'opacity-100 grayscale-0 scale-100' : 'opacity-80 grayscale scale-[1.02]'}`}
                             >
                                <source src={videos[currentSlide].url} type="video/mp4" />
                             </video>
                             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none transition-opacity duration-500" />
                             
                             <div className="absolute bottom-6 left-8 right-8 lg:bottom-8 lg:left-10 lg:right-10 text-left pointer-events-none">
                                <span className="text-[10px] bg-[#a3e635] text-[#0f172a] px-3 py-1 rounded-sm font-black uppercase tracking-widest inline-block mb-3 shadow-lg">{videos[currentSlide].tag}</span>
                                <h3 className="text-3xl lg:text-4xl xl:text-5xl font-[1000] text-white uppercase tracking-tight mb-5 drop-shadow-lg">{videos[currentSlide].title}</h3>
                                <div className="flex items-center gap-4 pointer-events-auto">
                                    <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center text-black cursor-pointer hover:bg-[#a3e635] hover:scale-105 transition-all shadow-xl shrink-0 group-hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                                        {isPlaying ? <Pause size={16} className="ml-0" /> : <Play size={16} fill="currentColor" className="ml-1" />}
                                    </button>
                                    <div className="flex-grow h-1.5 bg-white/20 relative rounded-sm overflow-hidden cursor-pointer" onClick={(e) => {
                                        e.stopPropagation();
                                        if (videoRef.current) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const pos = (e.clientX - rect.left) / rect.width;
                                            videoRef.current.currentTime = pos * videoRef.current.duration;
                                        }
                                    }}>
                                        <div className="absolute inset-y-0 left-0 bg-[#a3e635] rounded-sm shadow-[0_0_10px_#a3e635] transition-all duration-150" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="absolute -bottom-8 flex gap-2 justify-center w-full">
                        {videos.map((_, index) => (
                            <div 
                                key={index} 
                                onClick={() => { setCurrentSlide(index); setIsPlaying(true); }}
                                className={`h-1 cursor-pointer transition-all duration-500 rounded-none ${index === currentSlide ? 'w-8 bg-[#0f172a]' : 'w-4 bg-[#0f172a]/20 hover:bg-[#0f172a]/50'}`} 
                            />
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT: AUTH CARD */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 w-full max-w-[400px] flex justify-end"
                >
                    <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 md:p-12 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.2)] border border-white relative overflow-hidden w-full">
                        <div className="text-center mb-12">
                            <h2 className="text-[2.2rem] font-[1000] uppercase tracking-tighter leading-[0.9] mb-4 text-[#0f172a]">Accès<br/>Partenaire</h2>
                            <p className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em]">Rejoignez l'élite agricole.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={authMode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-5"
                            >
                                {error && (
                                    <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center shadow-sm">
                                        {error}
                                    </div>
                                )}

                                {authMode === 'onboarding' ? (
                                    <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                                        <div className="space-y-3">
                                            <input required name="fullName" type="text" value={onboardingData.fullName} onChange={e => setOnboardingData({...onboardingData, fullName: e.target.value})} className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-6 py-4 rounded-2xl text-[#0f172a] outline-none focus:border-[#a3e635] focus:bg-white transition-all font-bold placeholder:text-gray-400 text-sm" placeholder="Nom Complet" />
                                            <input required name="phone" type="tel" value={onboardingData.phone} onChange={e => setOnboardingData({...onboardingData, phone: e.target.value})} className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-6 py-4 rounded-2xl text-[#0f172a] outline-none focus:border-[#a3e635] focus:bg-white transition-all font-bold placeholder:text-gray-400 text-sm" placeholder="Téléphone / WhatsApp" />
                                        </div>
                                        <button type="submit" className="w-full bg-[#0f172a] text-white py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest shadow-xl shadow-black/10 hover:bg-[#a3e635] hover:text-[#0f172a] hover:shadow-[#a3e635]/30 transition-all duration-300 transform active:scale-[0.98] mt-4">Terminer l'inscription</button>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <form onSubmit={(e) => { e.preventDefault(); handleAuthAction(); }} className="space-y-4">
                                            <div className="space-y-3">
                                                <input 
                                                    required 
                                                    type="email" 
                                                    value={email} 
                                                    onChange={e => setEmail(e.target.value)} 
                                                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3.5 rounded-2xl text-[#0f172a] outline-none focus:border-[#a3e635] focus:bg-white transition-all font-bold placeholder:text-gray-400 text-sm" 
                                                    placeholder="Adresse email" 
                                                />
                                                <input 
                                                    required 
                                                    type="password" 
                                                    value={password} 
                                                    onChange={e => setPassword(e.target.value)} 
                                                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3.5 rounded-2xl text-[#0f172a] outline-none focus:border-[#a3e635] focus:bg-white transition-all font-bold placeholder:text-gray-400 text-sm" 
                                                    placeholder="Mot de passe" 
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest shadow-xl shadow-black/10 hover:bg-[#a3e635] hover:text-[#0f172a] hover:shadow-[#a3e635]/30 transition-all duration-300 transform active:scale-[0.98]"
                                            >
                                                {authMode === 'login' ? 'Se connecter' : 'Créer un compte'}
                                            </button>
                                        </form>

                                        <div className="relative py-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-100"></div>
                                            </div>
                                            <div className="relative flex justify-center">
                                                <span className="bg-white px-4 text-[9px] font-black uppercase tracking-widest text-gray-300">Ou</span>
                                            </div>
                                        </div>

                                        <button onClick={handleGoogleLogin} type="button" className="w-full bg-white border border-gray-200 text-[#0f172a] py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3">
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                                            Accéder via Google
                                        </button>

                                        <p className="text-center text-[10px] font-bold text-gray-400 mt-4">
                                            {authMode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
                                            <button 
                                                type="button"
                                                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                                className="text-[#0f172a] hover:underline"
                                            >
                                                {authMode === 'login' ? 'Inscrivez-vous' : 'Connectez-vous'}
                                            </button>
                                        </p>

                                        <div className="pt-2 text-center space-y-3">
                                            <div className="pt-4 border-t border-gray-100">
                                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">Assistance Technique</p>
                                                <p className="text-[10px] font-bold text-gray-400 lowercase tracking-wider">support@djapero-group.com</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Mobile Carousel Controls */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-4 lg:hidden">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-2xl"><ArrowRight className="rotate-180" size={20} /></div>
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-2xl"><ArrowRight size={20} /></div>
            </div>
        </div>
    );
}

function VolumeX({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>
    );
}

function Pause({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
    );
}

function Leaf({ size, className }: { size: number, className?: string }) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z"/><path d="M11 20c-2.3 2-3.4 2-5.9 2H3c0-2.5 0-3.6 2-5.9L11 20Z"/></svg>
    );
}
