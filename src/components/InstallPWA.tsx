import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      if (!sessionStorage.getItem("pwaPromptDismissed")) {
          setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
    }

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = async (evt: any) => {
    evt.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
        setShowPrompt(false);
    }
  };

  if (!supportsPWA || isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 bg-slate-900 border border-slate-700 text-white p-4 rounded-2xl shadow-2xl z-50 flex items-start gap-4">
      <div className="bg-[#42e60b]/20 p-2 rounded-xl border border-[#42e60b]/30">
        <Download className="text-[#42e60b]" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-sm tracking-tight mb-1">Installer l'application</h3>
        <p className="text-xs text-slate-400 mb-3">Installez Culture Connectée pour un accès rapide et hors ligne.</p>
        <div className="flex gap-2">
            <button 
                onClick={onClick} 
                className="flex-1 bg-white text-black text-xs font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
                Installer
            </button>
            <button 
                onClick={() => {
                    setShowPrompt(false);
                    sessionStorage.setItem("pwaPromptDismissed", "true");
                }} 
                className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
            >
                <X size={16} />
            </button>
        </div>
      </div>
    </div>
  );
}
