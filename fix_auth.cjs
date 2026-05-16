const fs = require('fs');

const file = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const regex = /return \(\s*<div\s+className=\{`min-h-screen[\s\S]*?\);\n}/;

const newContent = `return (
        <div 
            className={\`min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans transition-colors duration-1000 \${isLight ? 'bg-[#eef2ff]' : 'bg-[#1e1b4b]'}\`}
        >
            <div className="relative z-10 w-full max-w-[1100px] h-full max-h-[900px] md:h-[calc(100vh-4rem)] bg-white rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                
                {/* Left Side: Media */}
                <div className="hidden md:block w-1/2 h-full relative bg-slate-900">
                    <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                    <div className="absolute inset-0">
                        <HeroVideoPlayer heroVid={heroVid} isPlaying={isPlaying} isMuted={isMuted} />
                    </div>
                    
                    <div className="absolute top-8 left-8 z-20 flex items-center gap-2 drop-shadow-md">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                            <Leaf size={18} className="text-[#a3e635]" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">Djapero<span className="text-[#a3e635]">Group</span></span>
                    </div>

                    <div className="absolute top-8 right-8 z-20 flex items-center gap-2">
                        <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/40 transition-all">
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start z-20">
                        <div className="mb-4">
                            <h2 className="text-[#a3e635] text-2xl font-bold mb-2 leading-tight drop-shadow-md">
                                {heroVid?.title || "Excellence Tropicale"}
                            </h2>
                            <p className="text-white text-sm opacity-90 drop-shadow-md">
                                {heroVid?.caption || "Zéro déchet – 100% frais. L'agriculture d'élite en Afrique."}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevVid} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-all">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={nextVid} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white text-slate-800 custom-scrollbar relative">
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
                                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                                        {authMode === 'login' ? 'Bienvenue !' : "Let's join with us"}
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        {authMode === 'login' ? 'Bon retour. Renseignez vos identifiants.' : 'Create an account to join the community.'}
                                    </p>
                                </div>

                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    {authMode === 'signup' && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-700">Name*</label>
                                            <input 
                                                className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900"
                                                type="text"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Email*</label>
                                        <input 
                                            className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Password*</label>
                                        <input 
                                            className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900"
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
                                            <label htmlFor="terms" className="text-[11px] text-slate-500">
                                                I agree to all Terms, Privacy Policy and fees.
                                            </label>
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 mt-2 rounded-full font-bold text-sm text-white bg-slate-900 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? "Vérification..." : (authMode === 'login' ? "Sign In" : "Sign Up")}
                                    </button>
                                </form>

                                <div className="relative py-6 pb-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 text-xs font-semibold text-slate-400 bg-white">or</span>
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
                                                className="w-full h-full object-cover rounded-full border-4 border-[#a3e635]/30 shadow-md"
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
                                    <p className="text-sm text-slate-500">Dernière étape avant l'accès, finalisons ça.</p>
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
                                                className="w-full border border-slate-200 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900"
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
                                                className="w-full border border-slate-200 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900"
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
                                                    className="w-full border border-slate-200 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900"
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
                                                    className="w-full border border-slate-200 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm bg-white text-slate-900"
                                                    placeholder="Ville"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 mt-4 rounded-full font-bold text-sm text-white bg-slate-900 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
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
