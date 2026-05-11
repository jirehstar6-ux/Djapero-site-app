import { motion } from "motion/react";
import { ArrowRight, Sun, Moon, Tractor, Wheat, Droplets, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/layout/Logo";
import { useTheme } from "../context/ThemeContext";

export default function Intro() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isWhiteMode = theme === 'light';

    return (
        <div className={`min-h-screen relative overflow-hidden font-sans transition-colors duration-500 ${isWhiteMode ? 'bg-white text-[#0f172a] selection:bg-[#6aa84f] selection:text-white' : 'bg-[#6aa84f] text-white selection:bg-white selection:text-[#6aa84f]'}`}>
            {/* Ambient Lighting Effect */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse ${isWhiteMode ? 'bg-[#6aa84f]/20' : 'bg-white/20'}`} />
                <div className={`absolute bottom-[10%] right-[20%] w-[50%] h-[50%] rounded-full blur-[150px] animate-pulse ${isWhiteMode ? 'bg-[#a3e635]/20' : 'bg-[#a3e635]/30'}`} style={{ animationDelay: '-2s' }} />
            </div>

            {/* Background Image with Overlay */}
            <div 
                className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${isWhiteMode ? 'opacity-20' : 'opacity-40 mix-blend-overlay'}`}
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1595856149866-51f79f8fae5c?auto=format&fit=crop&q=80&w=2000")' }}
            >
                <div className={`absolute inset-0 bg-gradient-to-r transition-colors duration-500 ${isWhiteMode ? 'from-white via-white/90 to-white/60' : 'from-[#274e13]/90 via-[#6aa84f]/80 to-[#274e13]/80'}`} />
            </div>

            {/* Navigation / Header */}
            <header className="relative z-20 w-full p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <Logo size={40} className="scale-110" />
                    </div>
                    <span className={`text-2xl font-[1000] uppercase tracking-tighter drop-shadow-md transition-colors duration-500 ${isWhiteMode ? 'text-[#0f172a]' : 'text-white'}`}>
                        Djapero
                    </span>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 h-[calc(100vh-100px)] flex flex-col justify-center">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full h-full pb-20">
                    
                    {/* Left Column Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-6/12 flex flex-col gap-6"
                    >
                        {/* Icon Row */}
                        <div className="flex gap-4 items-center opacity-90">
                            <button 
                                onClick={toggleTheme}
                                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors cursor-pointer ${isWhiteMode ? 'bg-black/5 border-black/10 hover:bg-black/10' : 'bg-white/20 border-white/30 hover:bg-white/30'} shadow-lg`}
                            >
                                {isWhiteMode ? (
                                    <Moon size={24} className="text-[#6aa84f]" />
                                ) : (
                                    <Sun size={24} className="text-white" />
                                )}
                            </button>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors shadow-lg ${isWhiteMode ? 'bg-black/5 border-black/10' : 'bg-white/20 border-white/30'}`}>
                                <Tractor size={24} className={isWhiteMode ? "text-[#6aa84f]" : "text-white"} />
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors shadow-lg ${isWhiteMode ? 'bg-black/5 border-black/10' : 'bg-white/20 border-white/30'}`}>
                                <Wheat size={24} className={isWhiteMode ? "text-[#6aa84f]" : "text-white"} />
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors shadow-lg ${isWhiteMode ? 'bg-black/5 border-black/10' : 'bg-white/20 border-white/30'}`}>
                                <Droplets size={24} className={isWhiteMode ? "text-[#6aa84f]" : "text-white"} />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-[1000] uppercase tracking-tighter leading-[0.9] drop-shadow-lg transition-colors duration-500">
                            C'est quoi<br/>
                            <span className={isWhiteMode ? "text-[#6aa84f]" : "text-[#a3e635]"}>Djapero</span> ?
                        </h1>

                        {/* Description */}
                        <p className={`text-lg md:text-xl font-bold drop-shadow-md max-w-lg leading-relaxed transition-colors duration-500 ${isWhiteMode ? 'text-gray-700' : 'text-white/95'}`}>
                            Djapero Group est une plateforme révolutionnaire dédiée à l'excellence tropicale. Nous connectons directement les consommateurs et les vendeurs, en offrant des solutions d'achat en gros et en détail pour réinventer l'agriculture en Afrique.
                        </p>

                        {/* Button */}
                        <button 
                            onClick={() => navigate('/accueil')}
                            className={`mt-4 self-start group relative px-10 py-5 rounded-2xl font-[1000] text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-4 ${isWhiteMode ? 'bg-[#6aa84f] text-white shadow-[0_20px_40px_rgba(106,168,79,0.3)]' : 'bg-white text-[#274e13] shadow-[0_20px_40px_rgba(0,0,0,0.2)]'}`}
                        >
                            <span className="relative z-10">DÉCOUVRIR DJAPERO</span>
                            <ArrowRight size={18} className={`relative z-10 transition-transform group-hover:translate-x-1 ${isWhiteMode ? 'text-white' : 'text-[#274e13]'}`} />
                        </button>
                    </motion.div>

                    {/* Right Column Section (Floating Cards) */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-5/12 flex flex-col gap-6 justify-end"
                    >
                        <div className={`backdrop-blur-md border p-8 rounded-[2rem] shadow-2xl relative w-full transition-colors duration-500 ${isWhiteMode ? 'bg-white/60 border-black/5 hover:bg-white/80' : 'bg-[#1f3d15]/80 border-[#4a7c34] hover:bg-[#1f3d15]/90'}`}>
                            <h2 className={`text-xl font-black uppercase tracking-widest mb-3 transition-colors duration-500 ${isWhiteMode ? 'text-[#6aa84f]' : 'text-[#a3e635]'}`}>
                                Achat Flexible
                            </h2>
                            <p className={`font-bold leading-relaxed text-sm transition-colors duration-500 ${isWhiteMode ? 'text-gray-600' : 'text-white/90'}`}>
                                Achetez selon vos besoins. Nous proposons des options d'achat en <span className={isWhiteMode ? 'text-gray-900' : 'text-white'}>gros</span> pour les professionnels et au <span className={isWhiteMode ? 'text-gray-900' : 'text-white'}>détail</span> pour les particuliers.
                            </p>
                        </div>
                        
                        <div className={`backdrop-blur-md border p-8 rounded-[2rem] shadow-2xl relative w-full transition-colors duration-500 ${isWhiteMode ? 'bg-white/60 border-black/5 hover:bg-white/80' : 'bg-[#1f3d15]/80 border-[#4a7c34] hover:bg-[#1f3d15]/90'}`}>
                            <h2 className={`text-xl font-black uppercase tracking-widest mb-3 transition-colors duration-500 ${isWhiteMode ? 'text-[#6aa84f]' : 'text-[#a3e635]'}`}>
                                Écosystème Connecté
                            </h2>
                            <p className={`font-bold leading-relaxed text-sm transition-colors duration-500 ${isWhiteMode ? 'text-gray-600' : 'text-white/90'}`}>
                                Nous créons un lien direct entre les <span className={isWhiteMode ? 'text-gray-900' : 'text-white'}>consommateurs</span> et les <span className={isWhiteMode ? 'text-gray-900' : 'text-white'}>vendeurs</span>, garantissant fraîcheur et traçabilité 100%.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
