const fs = require('fs');

const file = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const regex = /return \(\s*<div\s+className=\{`min-h-screen[\s\S]*?\);\n}/;

const newContent = `return (
        <div 
            className="min-h-screen flex items-center justify-center p-6 md:p-12 overflow-hidden relative font-sans transition-colors duration-1000 bg-gradient-to-br from-[#96D833] to-[#84cc16]"
            style={{ backgroundImage: 'linear-gradient(to right bottom, #a3e635, #65a30d)' }}
        >
            {/* Main Wrapper */}
            <div className="relative z-10 w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
                
                {/* Left Side: Video Card */}
                <div className="hidden md:flex w-full md:w-[60%] flex-col items-center">
                    <div className="w-full relative bg-black rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] aspect-[16/10]">
                        <div className="absolute inset-0">
                            <HeroVideoPlayer heroVid={heroVid} isPlaying={isPlaying} isMuted={isMuted} />
                        </div>
                        {/* Overlay Gradient at Bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        
                        <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start z-20">
                            <div className="bg-[#bced47] text-black text-[10px] uppercase font-black px-3 py-1 mb-3 rounded-sm tracking-widest">
                                CULTURE CONNECTÉE
                            </div>
                            <h2 className="text-white text-5xl font-black mb-6 uppercase tracking-tight drop-shadow-md">
                                {heroVid?.title || 'VOLAILLER'}
                            </h2>
                            <div className="w-full flex items-center gap-4">
                                <button onClick={togglePlay} className="w-12 h-12 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg">
                                    {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
                                </button>
                                {/* Progress bar mockup */}
                                <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/80 w-[40%] rounded-full transition-all duration-1000" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Carousel Indicators under the card */}
                    <div className="flex gap-2 mt-6">
                        {featuredVideos.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={\`w-8 h-1.5 rounded-full transition-all \${idx === currentVidIndex ? 'bg-[#1e293b]' : 'bg-[#1e293b]/20'}\`} 
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Auth Form Card */}
                <div className="w-full md:w-[40%] max-w-[420px]">
                    <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative">
                        <AnimatePresence mode="wait">
                            {!isStepOnboarding ? (
                                <motion.div 
                                    key="login"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="w-full flex flex-col"
                                >
                                    <div className="mb-8 text-center flex flex-col items-center">
                                        <h2 className="text-3xl font-black text-[#0f172a] uppercase leading-[0.9] tracking-tighter mb-4 text-center">
                                            {authMode === 'login' ? (
                                                <>ACCÈS<br/>PARTENAIRE</>
                                            ) : (
                                                <>NOUVEL<br/>ACCÈS</>
                                            )}
                                        </h2>
                                        <p className="text-[#a1a1aa] text-[9px] uppercase tracking-[0.2em] font-bold">
                                            {authMode === 'login' ? "REJOIGNEZ L'ÉLITE AGRICOLE." : "CRÉEZ VOTRE COMPTE."}
                                        </p>
                                    </div>

                                    <form onSubmit={handleEmailAuth} className="space-y-4">
                                        {authMode === 'signup' && (
                                            <div>
                                                <input 
                                                    className="w-full border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm bg-white text-slate-800 font-medium placeholder:text-slate-400"
                                                    type="text"
                                                    placeholder="Nom complet"
                                                    required
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <input 
                                                className="w-full border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm bg-white text-slate-800 font-medium placeholder:text-slate-400"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Adresse e-mail"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                className="w-full border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm bg-white text-slate-800 font-medium placeholder:text-slate-400"
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
                                            className="w-full py-4 mt-2 rounded-2xl font-black text-xs tracking-widest uppercase text-white bg-[#0f172a] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {loading ? "Vérification..." : (authMode === 'login' ? "Se connecter" : "S'inscrire")}
                                        </button>
                                    </form>

                                    <div className="relative py-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-100"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-3 text-[10px] font-bold text-slate-300 uppercase bg-white">ou</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleGoogleLogin}
                                        type="button"
                                        disabled={loading}
                                        className="w-full border border-slate-200 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wide text-slate-600 transition-all hover:bg-slate-50 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-[18px] h-[18px]" />
                                        Accéder via Google
                                    </button>

                                    <div className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {authMode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
                                        <button 
                                            type="button"
                                            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                            className="text-slate-800 hover:text-black hover:underline"
                                        >
                                            {authMode === 'login' ? "Inscrivez-vous" : 'Connectez-vous'}
                                        </button>
                                    </div>

                                    <div className="mt-10 text-center flex flex-col items-center">
                                        <div className="text-[8px] font-black uppercase text-slate-300 tracking-widest mb-1">TECHNIQUE D'ASSISTANCE</div>
                                        <div className="text-[9px] font-bold text-slate-400">support@djapero-group.com</div>
                                    </div>

                                    {loginError && (
                                        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-center">
                                            <p className="text-xs text-red-500 font-bold mb-2">{loginError}</p>
                                            <button 
                                                onClick={() => window.open(window.location.href, '_blank')}
                                                className="w-full py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                                            >
                                                Ouvrir hors de l'iframe
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="onboarding"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="w-full"
                                >
                                    <div className="mb-8 text-center flex flex-col items-center">
                                        <h2 className="text-2xl font-black text-[#0f172a] uppercase leading-[1] tracking-tighter mb-4 text-center">
                                            INFORMATIONS<br/>COMPLÉMENTAIRES
                                        </h2>
                                        <p className="text-[#a1a1aa] text-[9px] uppercase tracking-[0.2em] font-bold">
                                            POUR FINALISER VOTRE PROFIL.
                                        </p>
                                        
                                        {formData.profileImageUrl ? (
                                            <div className="relative w-20 h-20 mx-auto mt-6 mb-2">
                                                <img 
                                                    src={formData.profileImageUrl} 
                                                    alt="Profile" 
                                                    className="w-full h-full object-cover rounded-full border-[3px] border-[#a3e635] shadow-md"
                                                />
                                                <div className="absolute bottom-0 right-0 bg-slate-900 text-white p-1 rounded-full shadow-md">
                                                    <ShieldCheck size={12} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mt-6 mb-2 border border-slate-200">
                                                <User size={24} className="text-slate-400" />
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleOnboarding} className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="relative flex items-center">
                                                <User size={16} className="absolute left-4 text-slate-400" />
                                                <input 
                                                    type="text"
                                                    required
                                                    value={formData.fullName}
                                                    onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                                                    className="w-full border border-slate-200 pl-11 pr-5 py-4 rounded-xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm bg-white text-slate-800 font-medium placeholder:text-slate-400"
                                                    placeholder="Nom complet"
                                                />
                                            </div>
                                            
                                            <div className="relative flex items-center">
                                                <Briefcase size={16} className="absolute left-4 text-slate-400" />
                                                <input 
                                                    type="text"
                                                    required
                                                    value={formData.occupation}
                                                    onChange={e => setFormData(prev => ({...prev, occupation: e.target.value}))}
                                                    className="w-full border border-slate-200 pl-11 pr-5 py-4 rounded-xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm bg-white text-slate-800 font-medium placeholder:text-slate-400"
                                                    placeholder="Profession"
                                                />
                                            </div>

                                            <div className="relative flex items-center">
                                                <Phone size={16} className="absolute left-4 text-slate-400" />
                                                <input 
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                                                    className="w-full border border-slate-200 pl-11 pr-5 py-4 rounded-xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm bg-white text-slate-800 font-medium placeholder:text-slate-400"
                                                    placeholder="Téléphone"
                                                />
                                            </div>
                                            <div className="relative flex items-center">
                                                <MapPin size={16} className="absolute left-4 text-slate-400" />
                                                <input 
                                                    type="text"
                                                    required
                                                    value={formData.city}
                                                    onChange={e => setFormData(prev => ({...prev, city: e.target.value}))}
                                                    className="w-full border border-slate-200 pl-11 pr-5 py-4 rounded-xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm bg-white text-slate-800 font-medium placeholder:text-slate-400"
                                                    placeholder="Ville"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 mt-4 rounded-xl font-black text-xs tracking-widest uppercase text-white bg-[#0f172a] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                                        >
                                            {loading ? "Vérification..." : "Débloquer"} <ArrowRight size={16} />
                                        </button>

                                        {onboardingError && (
                                            <p className="text-xs text-red-500 font-bold text-center mt-2">{onboardingError}</p>
                                        )}
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}`;

if (regex.test(file)) {
  fs.writeFileSync('src/pages/Auth.tsx', file.replace(regex, newContent));
  console.log("SUCCESS");
} else {
  console.log("REGEX FAILED TO MATCH");
}
