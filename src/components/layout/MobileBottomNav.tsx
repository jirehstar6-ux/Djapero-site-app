import { Link, useLocation } from "react-router-dom";
import { House, ShoppingBag, Bell, User, Plus } from "lucide-react";

export default function MobileBottomNav() {
    const location = useLocation();

    return (
        <div className="fixed bottom-6 left-6 right-6 h-16 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-md z-[999] flex justify-between items-center px-6 shadow-2xl shadow-black/10 rounded-full border border-slate-200 dark:border-white/10">
            <Link to="/accueil" className={`flex flex-col items-center gap-0.5 transition-colors ${location.pathname === '/accueil' ? 'text-[#a3e635]' : 'text-slate-400'}`}>
                <House size={20} />
            </Link>

            <Link to="/produits" className={`flex flex-col items-center gap-0.5 transition-colors ${location.pathname === '/produits' ? 'text-[#a3e635]' : 'text-slate-400'}`}>
                <ShoppingBag size={20} />
            </Link>
            
            {/* Central Action Button */}
            <div className="-mt-10">
                <button className="bg-[#a3e635] text-[#0f172a] p-3 rounded-full shadow-lg shadow-[#a3e635]/40 hover:scale-105 transition-transform active:scale-95">
                    <Plus size={24} strokeWidth={3} />
                </button>
            </div>

            <Link to="/contact" className={`flex flex-col items-center gap-0.5 transition-colors ${location.pathname === '/contact' ? 'text-[#a3e635]' : 'text-slate-400'}`}>
                <Bell size={20} />
            </Link>
            
            <Link to="/auth" className={`flex flex-col items-center gap-0.5 transition-colors ${location.pathname === '/auth' ? 'text-[#a3e635]' : 'text-slate-400'}`}>
                <User size={20} />
            </Link>
        </div>
    );
}
