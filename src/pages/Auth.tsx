import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Leaf, ArrowRight, User, Phone, Mail, Briefcase, ChevronRight, MapPin, Globe, Award, CloudUpload, Trash2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../hooks/useData";
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

export default function Auth() {
    const { login, user, profile, completeProfile } = useAuth();
    const { data } = useData();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [bgIndex, setBgIndex] = useState(0);
    
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

    // Redirect if already has profile
    useEffect(() => {
        if (user && profile) {
            navigate("/admin");
        }
    }, [user, profile, navigate]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await login();
        } catch (error) {
            console.error("Login failed:", error);
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
            navigate("/admin");
        } catch (error) {
            console.error("Onboarding failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isStepOnboarding = user && !profile;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617] overflow-hidden relative">
            {/* Background Image Carousel - High Visibility */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={bgIndex}
                        initial={{ opacity: 0, scale: 1.15 }}
                        animate={{ opacity: 0.85, scale: 1.02 }}
                        exit={{ opacity: 0, scale: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <img 
                            src={backImages[bgIndex].url} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/20 via-transparent to-[#020617]/40" />
                        <div className="absolute inset-0 bg-[#020617]/5" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Label for Background Context */}
            <motion.div 
                key={`label-${bgIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-12 right-12 z-20 hidden md:flex items-center gap-4"
            >
                <span className="text-white/20 text-[10px] font-mono tracking-[0.5em] uppercase">SYSTEM_STATE // {backImages[bgIndex].label}</span>
                <div className="w-12 h-[1px] bg-white/10" />
            </motion.div>

            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl delay-1000"></div>

            <motion.div 
                className={`w-full ${isStepOnboarding ? 'max-w-xl' : 'max-w-md'} bg-white/95 px-8 py-10 md:px-12 md:py-14 rounded-[3.5rem] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-md overflow-hidden`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[2.2rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-emerald-100 rotate-6 group-hover:rotate-0 transition-transform duration-700">
                        <Leaf size={40} className="text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Djapero<span className="text-emerald-500 text-5xl">.</span></h1>
                    <p className="text-emerald-600/80 text-[9px] font-black uppercase tracking-[0.3em]">Excellence Tropicale</p>
                </div>

                <AnimatePresence mode="wait">
                    {!isStepOnboarding ? (
                        <motion.div 
                            key="login-step"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-none mb-2">Accès Partenaire</h2>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Connectez-vous pour rejoindre l'aventure Djapero.</p>
                            </div>

                            <button 
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full bg-white border-2 border-gray-100 hover:border-emerald-500 text-gray-900 py-4 rounded-[1.5rem] font-black text-base uppercase tracking-tighter flex items-center justify-center gap-4 shadow-xl transform active:scale-95 transition-all group disabled:opacity-50"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                {loading ? "Connexion..." : "Continuer avec Google"}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="onboarding-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-none mb-2">Inscription</h2>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Finalisons votre profil pour accéder à la plateforme.</p>
                            </div>

                            <form onSubmit={handleOnboarding} className="space-y-8 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                                {/* Profile Image Upload */}
                                <div className="flex flex-col items-center gap-4 mb-8">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-gray-100 border-4 border-white shadow-2xl relative">
                                            {formData.profileImageUrl ? (
                                                <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <User size={48} />
                                                </div>
                                            )}
                                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                                                <Camera className="text-white" size={24} />
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = await handleFileUpload(file);
                                                            if (url) setFormData({ ...formData, profileImageUrl: url });
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-[2.5rem] backdrop-blur-sm">
                                                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">Photo de Profil</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Nom Complet *</label>
                                        <div className="relative group">
                                            <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <input 
                                                type="text"
                                                required
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white px-12 py-3.5 rounded-2xl outline-none font-bold text-sm tracking-tight transition-all"
                                                placeholder="Jean Kouadio"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Email *</label>
                                        <div className="relative group">
                                            <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <input 
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white px-12 py-3.5 rounded-2xl outline-none font-bold text-sm tracking-tight transition-all"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Téléphone *</label>
                                        <div className="relative group">
                                            <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <input 
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white px-12 py-3.5 rounded-2xl outline-none font-bold text-sm tracking-tight transition-all"
                                                placeholder="+225 ..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Localisation (Ville) *</label>
                                        <div className="relative group">
                                            <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <input 
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white px-12 py-3.5 rounded-2xl outline-none font-bold text-sm tracking-tight transition-all"
                                                placeholder="Abidjan, Cocody..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Sexe</label>
                                        <div className="flex gap-2">
                                            {['M', 'F', 'NB'].map(s => (
                                                <button 
                                                    key={s} 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gender: s })}
                                                    className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all border-2 ${formData.gender === s ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-gray-50 text-gray-400 border-transparent hover:border-emerald-100'}`}
                                                >
                                                    {s === 'M' ? 'Homme' : s === 'F' ? 'Femme' : 'Autre'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Expérience</label>
                                        <div className="relative group">
                                            <Award size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                            <select 
                                                value={formData.experience}
                                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white px-12 py-3.5 rounded-2xl outline-none font-bold text-sm tracking-tight transition-all appearance-none"
                                            >
                                                <option>Moins d'un an</option>
                                                <option>1-3 ans</option>
                                                <option>3-7 ans</option>
                                                <option>10 ans +</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Votre Rôle Principal</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {['Agriculteur', 'Transporteur', 'Client', 'Investisseur'].map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role })}
                                                className={`py-3 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all border-2 ${
                                                    formData.role === role 
                                                    ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30" 
                                                    : "bg-gray-50 text-gray-400 border-transparent hover:border-emerald-100"
                                                }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Activité / Profession Spécifique</label>
                                    <div className="relative group">
                                        <Briefcase size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <input 
                                            type="text"
                                            required
                                            value={formData.occupation}
                                            onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white px-12 py-3.5 rounded-2xl outline-none font-bold text-sm tracking-tight transition-all"
                                            placeholder="Ex: Producteur de Banane"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Lien Portfolio / Site (Optionnel)</label>
                                    <div className="relative group">
                                        <Globe size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <input 
                                            type="url"
                                            value={formData.portfolioUrl}
                                            onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white px-12 py-3.5 rounded-2xl outline-none font-bold text-sm tracking-tight transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Parlez-nous de vos projets Djapero</label>
                                    <textarea 
                                        value={formData.about}
                                        onChange={e => setFormData({ ...formData, about: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white px-6 py-4 rounded-3xl outline-none font-bold text-sm tracking-tight transition-all min-h-[120px] resize-none"
                                        placeholder="Dites-nous en plus sur vos attentes, vos besoins ou ce que vous apportez à l'écosystème..."
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transform active:scale-95 transition-all hover:bg-emerald-600 disabled:opacity-50 group"
                                >
                                    {loading ? "Création..." : "Finaliser l'Inscription"}
                                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-gray-300 text-[9px] mt-10 uppercase tracking-widest font-bold">
                    Zéro Déchet • 100% Frais • Djapero Group
                </p>
            </motion.div>
        </div>
    );
}

