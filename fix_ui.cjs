const fs = require('fs');
const file = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const regex = /return \(\s*<div\s+className="min-h-screen[\s\S]*?\);\n}/;

const newContent = `return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans bg-[#f7f8fa]">
            {/* Centered White Card Container matching the screenshot */}
            <div className="relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-[24px] md:h-[600px] shadow-[0_4px_40px_rgb(0,0,0,0.06)] p-2">
                
                {/* Left Side: Media Container */}
                <div className="w-full md:w-[45%] p-6 md:p-8 bg-blue-700/90 rounded-[20px] flex flex-col justify-between h-[300px] md:h-full relative overflow-hidden text-white shadow-inner">
                    {/* Background Video/Image (Djapero things) */}
                    <div className="absolute inset-0">
                        <HeroVideoPlayer heroVid={heroVid} isPlaying={isPlaying} isMuted={isMuted} />
                        {/* A strong blue/black multiplying overlay to give it a similar vibe to the blue abstract while showing the DJAPERO video */}
                        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-transparent to-[#1e1b4b]/80 pointer-events-none" />
                    </div>
                    
                    {/* Top: Branding / Small subtitle */}
                    <div className="relative z-20">
                        <p className="text-white/70 text-[11px] font-medium tracking-wide mb-3">You can easily</p>
                        <h2 className="text-white text-[32px] md:text-[36px] font-bold leading-[1.1] tracking-tight mb-4 drop-shadow-sm">
                            <span className="block">Culture</span>
                            <span className="block">Connectée</span>
                            <span className="block text-white/90">avec Djapero</span>
                        </h2>
                    </div>

                    {/* Bottom: DJAPERO Content & Links */}
                    <div className="relative z-20 mt-auto">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 text-[#a3e635]">
                                <Leaf size={12} className="text-[#a3e635]" />
                            </div>
                            <span className="font-semibold text-sm tracking-wide">Djapero<span className="font-bold text-[#a3e635]">Group</span></span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <p className="text-white/60 text-[10px] font-semibold">Our expertise</p>
                            <div className="flex items-center gap-4 text-white/80">
                                <span className="flex items-center gap-1.5 text-[11px]"><CloudUpload size={12}/> Volailler</span>
                                <span className="flex items-center gap-1.5 text-[11px]"><Award size={12}/> Maraîcher</span>
                                <span className="flex items-center gap-1.5 text-[11px]"><Camera size={12}/> Pisciculture</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="w-full md:w-[55%] bg-white p-6 md:p-10 flex flex-col justify-center h-full overflow-y-auto custom-scrollbar relative z-20">
                    <AnimatePresence mode="wait">
                        {!isStepOnboarding ? (
                            <motion.div 
                                key="login"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="w-full max-w-[380px] mx-auto pl-0 md:pl-4"
                            >
                                <div className="mb-8">
                                    <h2 className="text-[26px] font-bold text-slate-800 tracking-tight mb-1">
                                        {authMode === 'login' ? 'Get Started Now' : 'Create Account'}
                                    </h2>
                                    <p className="text-slate-400 text-[11px] font-medium">
                                        {authMode === 'login' ? 'Please login to your account to continue' : 'Sign up to get started'}
                                    </p>
                                </div>

                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    {authMode === 'signup' && (
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700">Name</label>
                                            <input 
                                                className="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                                type="text"
                                                placeholder="Enter your name..."
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700">Email address</label>
                                        <input 
                                            className="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@email.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700">Password</label>
                                        <div className="relative">
                                            <input 
                                                className="w-full border border-slate-200 px-3 py-2.5 pr-20 rounded-lg outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                            {authMode === 'login' && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                                    <a href="#" className="text-[10px] font-semibold text-[#3741d8] hover:underline">Forgot Password?</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {authMode === 'signup' && (
                                        <div className="flex items-center gap-2 mt-1 mb-2">
                                            <input type="checkbox" id="terms" className="rounded-sm w-3.5 h-3.5 border-slate-300 text-[#3741d8] focus:ring-[#3741d8] transition-colors cursor-pointer" required />
                                            <label htmlFor="terms" className="text-[11px] font-medium text-slate-500 cursor-pointer">
                                                I agree to the Terms & Policy
                                            </label>
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 mt-4 rounded-xl font-bold text-[13px] text-white bg-blue-700 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50"
                                        style={{ backgroundColor: '#3741d8' }}
                                    >
                                        {loading ? "Please wait..." : (authMode === 'login' ? "Login" : "Sign Up")}
                                    </button>
                                </form>

                                <div className="mt-5 text-center text-[12px] font-medium text-slate-500">
                                    {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                                    <button 
                                        type="button"
                                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                        className="text-[#3741d8] hover:underline font-bold transition-colors"
                                    >
                                        {authMode === 'login' ? 'Signup' : 'Login'}
                                    </button>
                                </div>

                                <div className="relative py-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-100"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-3 text-[10px] font-medium text-slate-400 bg-white">Or</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={handleGoogleLogin}
                                        type="button"
                                        disabled={loading}
                                        className="flex-1 border border-slate-200 py-2.5 rounded-lg text-[12px] font-semibold text-slate-700 transition-all hover:bg-slate-50 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-sm"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-[14px] h-[14px]" />
                                        Login with Google
                                    </button>
                                    <button 
                                        type="button"
                                        disabled={loading}
                                        className="flex-1 border border-slate-200 py-2.5 rounded-lg text-[12px] font-semibold text-slate-700 transition-all hover:bg-slate-50 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-sm"
                                    >
                                        <div className="w-[14px] h-[14px] bg-slate-900 rounded-full flex items-center justify-center text-white pb-0.5">🍎</div>
                                        Login with Apple
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
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="w-full max-w-[380px] mx-auto pl-0 md:pl-4"
                            >
                                <div className="text-center mb-6">
                                    {formData.profileImageUrl ? (
                                        <div className="relative w-20 h-20 mx-auto mb-3">
                                            <img 
                                                src={formData.profileImageUrl} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                                            <User size={24} className="text-slate-400" />
                                        </div>
                                    )}
                                    <h2 className="text-[22px] font-bold text-slate-800 tracking-tight mb-1">Complete Profile</h2>
                                    <p className="text-[11px] text-slate-400 font-medium">Please provide a few details to continue.</p>
                                </div>

                                <form onSubmit={handleOnboarding} className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700">Full Name</label>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                                            className="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-slate-50 text-slate-900 font-medium"
                                        />
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700">Occupation</label>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.occupation}
                                            onChange={e => setFormData(prev => ({...prev, occupation: e.target.value}))}
                                            className="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-slate-50 text-slate-900 font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700">Phone</label>
                                            <input 
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                                                className="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-slate-50 text-slate-900 font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700">City</label>
                                            <input 
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData(prev => ({...prev, city: e.target.value}))}
                                                className="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-[#3741d8] focus:ring-1 focus:ring-[#3741d8] transition-all text-[13px] bg-slate-50 text-slate-900 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 mt-4 rounded-xl font-bold text-[13px] text-white transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                                        style={{ backgroundColor: '#3741d8' }}
                                    >
                                        {loading ? "Please wait..." : "Continue to App"} 
                                    </button>

                                    {onboardingError && (
                                        <p className="text-[11px] text-red-500 font-semibold text-center mt-2">{onboardingError}</p>
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
