const fs = require('fs');
const file = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const regex = /return \(\s*<div\s+className="min-h-screen[\s\S]*?\);\n}/;

const newContent = `return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans transition-colors duration-1000 bg-[#eef2ff]"
            style={{ backgroundImage: 'linear-gradient(to right bottom, #1e1b4b, #312e81)' }}
        >
            <div className="relative z-10 w-full max-w-[1100px] bg-white rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] min-h-[600px] max-h-[90vh]">
                
                {/* Left Side: Video/Image */}
                <div className="hidden md:flex w-full md:w-[55%] relative bg-black overflow-hidden flex-col items-center justify-center">
                    <div className="absolute inset-0">
                        <HeroVideoPlayer heroVid={heroVid} isPlaying={isPlaying} isMuted={isMuted} />
                    </div>
                    {/* Overlay Gradient at Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Brand / Logo */}
                    <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#a3e635] rounded-[10px] flex items-center justify-center shadow-lg">
                            <Leaf size={18} className="text-black" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">Djapero<span className="text-[#a3e635]">Group</span></span>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start z-20">
                        <h2 className="text-[#a3e635] text-3xl font-black mb-2 leading-tight drop-shadow-md">
                            {heroVid?.title || "Culture Connectée"}
                        </h2>
                        <p className="text-white text-sm opacity-90 drop-shadow-md font-medium">
                            {heroVid?.caption || "Rejoignez l'élite agricole. Zéro déchet – 100% frais."}
                        </p>
                        
                        <div className="w-full flex items-center gap-4 mt-6">
                            <button onClick={togglePlay} className="w-10 h-10 flex-shrink-0 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                                {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-1" />}
                            </button>
                            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full bg-[#a3e635] w-[40%] rounded-full transition-all duration-1000" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {!isStepOnboarding ? (
                            <motion.div 
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full max-w-sm mx-auto"
                            >
                                <div className="mb-8">
                                    <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">
                                        {authMode === 'login' ? 'Bienvenue !' : "Let's join with us"}
                                    </h2>
                                    <p className="text-slate-500 text-sm font-medium">
                                        {authMode === 'login' ? 'Bon retour. Renseignez vos identifiants.' : 'Create an account to join the community.'}
                                    </p>
                                </div>

                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    {authMode === 'signup' && (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700">Name*</label>
                                            <input 
                                                className="w-full border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                                type="text"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Email*</label>
                                        <input 
                                            className="w-full border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Password*</label>
                                        <input 
                                            className="w-full border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>

                                    {authMode === 'signup' && (
                                        <div className="flex items-center gap-2 mt-4 mb-2">
                                            <input type="checkbox" id="terms" className="rounded border-slate-300 text-slate-900 focus:ring-slate-900" required />
                                            <label htmlFor="terms" className="text-[11px] font-medium text-slate-500">
                                                I agree to all Terms, Privacy Policy and fees.
                                            </label>
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 mt-2 rounded-full font-bold text-sm text-white bg-[#0f172a] shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? "Vérification..." : (authMode === 'login' ? "Sign In" : "Sign Up")}
                                    </button>
                                </form>

                                <div className="relative py-6 pb-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white">or</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    disabled={loading}
                                    className="w-full border border-slate-200 py-3.5 rounded-full font-bold text-sm text-slate-700 transition-all hover:bg-slate-50 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                    Sign up with Google
                                </button>

                                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                                    {authMode === 'login' ? 'Pas encore de compte ?' : 'Already have an account?'}{' '}
                                    <button 
                                        type="button"
                                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                        className="text-[#3b82f6] hover:underline font-bold"
                                    >
                                        {authMode === 'login' ? "S'inscrire" : 'Sign In'}
                                    </button>
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
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full max-w-sm mx-auto"
                            >
                                <div className="text-center mb-8">
                                    {formData.profileImageUrl ? (
                                        <div className="relative w-24 h-24 mx-auto mb-4">
                                            <img 
                                                src={formData.profileImageUrl} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover rounded-full border-4 border-[#a3e635] shadow-md"
                                            />
                                            <div className="absolute bottom-0 right-0 bg-slate-900 text-white p-1.5 rounded-full shadow-md">
                                                <ShieldCheck size={14} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                            <User size={30} className="text-slate-400" />
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Finalisation</h2>
                                    <p className="text-sm text-slate-500 font-medium">Dernière étape avant l'accès, finalisons ça.</p>
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
                                                className="w-full border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
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
                                                className="w-full border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                                placeholder="Profession / Occupation"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative flex items-center">
                                                <Phone size={16} className="absolute left-4 text-slate-400" />
                                                <input 
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                                                    className="w-full border border-slate-200 pl-11 pr-3 py-3.5 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
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
                                                    className="w-full border border-slate-200 pl-11 pr-3 py-3.5 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                                    placeholder="Ville"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 mt-4 rounded-full font-bold text-sm text-white bg-slate-900 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {loading ? "Vérification..." : "Débloquer et ouvrir"} 🚀
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
    );
}`;

if (regex.test(file)) {
    fs.writeFileSync('src/pages/Auth.tsx', file.replace(regex, newContent));
    console.log("SUCCESS");
} else {
    console.log("REGEX FAILED TO MATCH");
}
