const fs = require('fs');
const file = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const regex = /return \(\s*<div\s+className="min-h-screen[\s\S]*?\);\n}/;

const newContent = `return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans bg-[#f4f7f6]">
            {/* Centered White Card Container */}
            <div className="relative z-10 w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-[32px] md:h-[680px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 md:p-3">
                
                {/* Left Side: Media Container (Blue-ish in screenshot, but we use Djapero's vibe or a vibrant gradient) */}
                <div className="w-full md:w-[50%] p-6 bg-blue-600 rounded-[28px] flex flex-col justify-between h-[300px] md:h-full relative overflow-hidden shadow-inner">
                    {/* Background Video/Image */}
                    <div className="absolute inset-0">
                        <HeroVideoPlayer heroVid={heroVid} isPlaying={isPlaying} isMuted={isMuted} />
                        {/* A blue tint to match the requested look while keeping Djapero's original video */}
                        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Top: Branding */}
                    <div className="relative z-20 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                            <Leaf size={16} className="text-white" />
                        </div>
                        <span className="text-white font-medium text-sm tracking-wide mix-blend-screen opacity-90">Djapero<span className="font-bold">Group</span></span>
                    </div>

                    {/* Middle/Bottom: Text Content */}
                    <div className="relative z-20 mb-8">
                        <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-3">Culture Connectée</p>
                        <h2 className="text-white text-3xl md:text-[40px] font-bold leading-[1.1] tracking-tight mb-4 drop-shadow-sm">
                            {heroVid?.title ? heroVid.title.split(' ').map((word: string, i: number) => (
                                <span key={i} className="block">{word}</span>
                            )) : (
                                <>
                                    <span className="block">Speed up</span>
                                    <span className="block">your work</span>
                                    <span className="block text-blue-200">with our Web App</span>
                                </>
                            )}
                        </h2>
                        
                        <p className="text-white/80 text-sm font-medium mt-4">
                            {heroVid?.caption || "Zéro déchet – 100% frais. L'agriculture d'élite en Afrique pour toute la communauté."}
                        </p>
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="w-full md:w-[50%] bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center h-full overflow-y-auto custom-scrollbar relative z-20">
                    <AnimatePresence mode="wait">
                        {!isStepOnboarding ? (
                            <motion.div 
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full max-w-[360px] mx-auto"
                            >
                                <div className="mb-8">
                                    <h2 className="text-[28px] font-semibold text-slate-900 tracking-tight mb-1.5">
                                        {authMode === 'login' ? 'Welcome Back' : "Get Started Now"}
                                    </h2>
                                    <p className="text-slate-500 text-sm font-medium">
                                        {authMode === 'login' ? 'Please login to your account to continue' : 'Create an account to join the community'}
                                    </p>
                                </div>

                                <form onSubmit={handleEmailAuth} className="space-y-5">
                                    {authMode === 'signup' && (
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-semibold text-slate-700">Name</label>
                                            <input 
                                                className="w-full border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                                type="text"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-700">Email address</label>
                                        <input 
                                            className="w-full border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[13px] font-semibold text-slate-700">Password</label>
                                            {authMode === 'login' && (
                                                <a href="#" className="text-[12px] font-semibold text-blue-600 hover:text-blue-700">Forgot Password?</a>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input 
                                                className="w-full border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm bg-white text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {authMode === 'signup' && (
                                        <div className="flex items-center gap-2 mt-1 mb-2 max-w-[90%]">
                                            <input type="checkbox" id="terms" className="rounded-sm w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-600 transition-colors cursor-pointer" required />
                                            <label htmlFor="terms" className="text-[12px] font-medium text-slate-600 cursor-pointer">
                                                I agree to the Terms & Privacy Policy
                                            </label>
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 mt-2 rounded-xl font-bold text-sm text-white bg-[#3741d8] hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? "Please wait..." : (authMode === 'login' ? "Login" : "Sign Up")}
                                    </button>
                                </form>

                                <div className="mt-6 text-center text-[13px] font-medium text-slate-500">
                                    {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                                    <button 
                                        type="button"
                                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                        className="text-[#3741d8] hover:text-blue-800 font-semibold transition-colors"
                                    >
                                        {authMode === 'login' ? 'Signup' : 'Login'}
                                    </button>
                                </div>

                                <div className="relative py-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-100"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 text-[12px] font-medium text-slate-400 bg-white">Or</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={handleGoogleLogin}
                                        type="button"
                                        disabled={loading}
                                        className="w-full border border-slate-200 py-3.5 rounded-xl text-[13px] font-semibold text-slate-700 transition-all hover:bg-slate-50 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-[18px] h-[18px]" />
                                        Login with Google
                                    </button>
                                </div>

                                {loginError && (
                                    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-center">
                                        <p className="text-[12px] text-red-500 font-semibold mb-2">{loginError}</p>
                                        <button 
                                            onClick={() => window.open(window.location.href, '_blank')}
                                            className="w-full py-2 bg-red-500 text-white rounded-md text-[11px] font-bold hover:bg-red-600 transition-colors uppercase tracking-wider"
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
                                className="w-full max-w-[360px] mx-auto"
                            >
                                <div className="text-center mb-8">
                                    {formData.profileImageUrl ? (
                                        <div className="relative w-24 h-24 mx-auto mb-4">
                                            <img 
                                                src={formData.profileImageUrl} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                                            />
                                            <div className="absolute bottom-0 right-0 bg-[#3741d8] text-white p-2 rounded-full shadow-md">
                                                <ShieldCheck size={14} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                            <User size={30} className="text-slate-400" />
                                        </div>
                                    )}
                                    <h2 className="text-[26px] font-semibold text-slate-900 tracking-tight mb-2">Complete Profile</h2>
                                    <p className="text-sm text-slate-500 font-medium">Please provide a few details to continue.</p>
                                </div>

                                <form onSubmit={handleOnboarding} className="space-y-4">
                                    <div className="relative flex items-center">
                                        <User size={16} className="absolute left-4 text-slate-400" />
                                        <input 
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                                            className="w-full border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    
                                    <div className="relative flex items-center">
                                        <Briefcase size={16} className="absolute left-4 text-slate-400" />
                                        <input 
                                            type="text"
                                            required
                                            value={formData.occupation}
                                            onChange={e => setFormData(prev => ({...prev, occupation: e.target.value}))}
                                            className="w-full border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                            placeholder="Occupation"
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
                                                className="w-full border border-slate-200 pl-11 pr-3 py-3.5 rounded-xl outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                                placeholder="Phone"
                                            />
                                        </div>
                                        <div className="relative flex items-center">
                                            <MapPin size={16} className="absolute left-4 text-slate-400" />
                                            <input 
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData(prev => ({...prev, city: e.target.value}))}
                                                className="w-full border border-slate-200 pl-11 pr-3 py-3.5 rounded-xl outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                                placeholder="City"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 mt-2 rounded-xl font-bold text-sm text-white bg-[#3741d8] hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {loading ? "Please wait..." : "Continue to App"} 
                                    </button>

                                    {onboardingError && (
                                        <p className="text-[12px] text-red-500 font-semibold text-center mt-2">{onboardingError}</p>
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
