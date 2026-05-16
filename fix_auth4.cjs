const fs = require('fs');
const file = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const regex = /return \(\s*<div\s+className="min-h-screen[\s\S]*?\);\n}/;

const newContent = `return (
        <div 
            className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans transition-colors duration-1000"
            style={{ backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #172554 100%)' }}
        >
            {/* Background glowing effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

            <div className="relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row bg-[#1e293b] md:bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:h-[600px]">
                
                {/* Left Side: Media Container */}
                <div className="w-full md:w-[50%] p-3 md:p-4 bg-[#1e293b] flex flex-col h-[300px] md:h-full">
                    {/* Inner image container */}
                    <div className="w-full h-full relative rounded-2xl overflow-hidden flex flex-col justify-between">
                        {/* Background Video/Image */}
                        <div className="absolute inset-0">
                            <HeroVideoPlayer heroVid={heroVid} isPlaying={isPlaying} isMuted={isMuted} />
                            <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 pointer-events-none" />
                        </div>
                        
                        {/* Top: Logo */}
                        <div className="relative z-20 p-6 flex items-center gap-2">
                            <Leaf size={20} className="text-[#a3e635]" />
                            <span className="text-white font-bold text-sm tracking-wide">Djapero<span className="text-[#a3e635]">Group</span></span>
                        </div>

                        {/* Bottom: Text */}
                        <div className="relative z-20 p-6 pt-0">
                            <h2 className="text-[#a3e635] text-2xl md:text-[28px] font-bold leading-tight tracking-tight mb-2">
                                {heroVid?.title || "Excellence Tropicale"}
                            </h2>
                            <p className="text-white/80 text-xs md:text-sm font-medium pr-4">
                                {heroVid?.caption || "Zéro déchet – 100% frais. L'agriculture d'élite en Afrique pour toute la communauté."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="w-full md:w-[50%] bg-white p-8 md:p-10 lg:p-12 flex flex-col justify-center h-full overflow-y-auto custom-scrollbar rounded-t-3xl md:rounded-none mt-[-20px] md:mt-0 relative z-20">
                    <AnimatePresence mode="wait">
                        {!isStepOnboarding ? (
                            <motion.div 
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full max-w-[340px] mx-auto"
                            >
                                <div className="mb-8">
                                    <h2 className="text-[26px] font-bold text-slate-900 tracking-tight mb-1.5">
                                        {authMode === 'login' ? 'Welcome back' : "Let's join with us"}
                                    </h2>
                                    <p className="text-slate-500 text-xs font-medium">
                                        {authMode === 'login' ? 'Enter your details to sign in.' : 'Create an account to join the community.'}
                                    </p>
                                </div>

                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    {authMode === 'signup' && (
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-700">Name<span className="text-red-500">*</span></label>
                                            <input 
                                                className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-xs bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                                type="text"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-700">Email<span className="text-red-500">*</span></label>
                                        <input 
                                            className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-xs bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-700">Password<span className="text-red-500">*</span></label>
                                        <input 
                                            className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-xs bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>

                                    {authMode === 'signup' && (
                                        <div className="flex items-center gap-2 mt-3 mb-2">
                                            <input type="checkbox" id="terms" className="rounded-sm w-3.5 h-3.5 border-slate-300 text-slate-900 focus:ring-slate-900" required />
                                            <label htmlFor="terms" className="text-[10px] font-medium text-slate-500">
                                                I agree to all terms, Privacy Policy and fees.
                                            </label>
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 mt-2 rounded-full font-bold text-xs text-[#a3e635] bg-[#0f172a] hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? "Vérification..." : (authMode === 'login' ? "Sign In" : "Sign Up")}
                                    </button>
                                </form>

                                <div className="relative py-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-100"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-3 text-[10px] font-medium text-slate-400 bg-white shadow-[0_0_0_8px_white]">or</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    disabled={loading}
                                    className="w-full border border-slate-200 py-3 rounded-full font-bold text-xs text-slate-600 transition-all hover:bg-slate-50 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-[16px] h-[16px]" />
                                    {authMode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                                </button>

                                <div className="mt-6 text-center text-[11px] font-medium text-slate-500">
                                    {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                                    <button 
                                        type="button"
                                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                        className="text-[#3b82f6] hover:underline font-bold"
                                    >
                                        {authMode === 'login' ? 'Sign up' : 'Sign in'}
                                    </button>
                                </div>

                                {loginError && (
                                    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-center">
                                        <p className="text-[11px] text-red-500 font-bold mb-2">{loginError}</p>
                                        <button 
                                            onClick={() => window.open(window.location.href, '_blank')}
                                            className="w-full py-2 bg-red-500 text-white rounded-md text-[10px] font-bold hover:bg-red-600 transition-colors uppercase tracking-wider"
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
                                className="w-full max-w-[340px] mx-auto"
                            >
                                <div className="text-center mb-8">
                                    {formData.profileImageUrl ? (
                                        <div className="relative w-20 h-20 mx-auto mb-4">
                                            <img 
                                                src={formData.profileImageUrl} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover rounded-full border-4 border-[#a3e635] shadow-sm"
                                            />
                                            <div className="absolute bottom-0 right-0 bg-[#0f172a] text-[#a3e635] p-1.5 rounded-full shadow-md">
                                                <ShieldCheck size={12} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                            <User size={24} className="text-slate-400" />
                                        </div>
                                    )}
                                    <h2 className="text-[22px] font-bold text-slate-900 tracking-tight mb-1">Finalisez votre profil</h2>
                                    <p className="text-xs text-slate-500 font-medium">Quelques détails avant de commencer.</p>
                                </div>

                                <form onSubmit={handleOnboarding} className="space-y-3.5">
                                    <div className="relative flex items-center">
                                        <User size={14} className="absolute left-4 text-slate-400" />
                                        <input 
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                                            className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-xs bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                            placeholder="Nom complet"
                                        />
                                    </div>
                                    
                                    <div className="relative flex items-center">
                                        <Briefcase size={14} className="absolute left-4 text-slate-400" />
                                        <input 
                                            type="text"
                                            required
                                            value={formData.occupation}
                                            onChange={e => setFormData(prev => ({...prev, occupation: e.target.value}))}
                                            className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-xs bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                            placeholder="Profession"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative flex items-center">
                                            <Phone size={14} className="absolute left-4 text-slate-400" />
                                            <input 
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                                                className="w-full border border-slate-200 pl-10 pr-3 py-3 rounded-xl outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-xs bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                                placeholder="Téléphone"
                                            />
                                        </div>
                                        <div className="relative flex items-center">
                                            <MapPin size={14} className="absolute left-4 text-slate-400" />
                                            <input 
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData(prev => ({...prev, city: e.target.value}))}
                                                className="w-full border border-slate-200 pl-10 pr-3 py-3 rounded-xl outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-xs bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                                placeholder="Ville"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 mt-2 rounded-xl font-bold text-xs text-[#a3e635] bg-[#0f172a] hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {loading ? "Vérification..." : "Débloquer l'accès"} 
                                    </button>

                                    {onboardingError && (
                                        <p className="text-[11px] text-red-500 font-bold text-center mt-2">{onboardingError}</p>
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
