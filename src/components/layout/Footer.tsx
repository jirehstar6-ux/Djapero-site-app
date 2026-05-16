import { Leaf, Facebook, Instagram, Phone as WhatsApp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white py-32 px-10 md:px-24 border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto text-gray-900">
                <div className="flex flex-col md:flex-row justify-between items-start gap-20">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-[1000] uppercase tracking-tighter flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <Leaf size={24} className="text-white" />
                            </div>
                            Djapero Group
                        </h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-10 text-lg">
                            Production agricole, élevage de volailles et services de communication d'excellence réunis dans un écosystème intelligent.
                        </p>
                        <div className="flex gap-6">
                            {[Facebook, Instagram, WhatsApp].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
                        <div>
                            <h4 className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Navigation</h4>
                            <ul className="space-y-4">
                                {['Tableau de bord', 'Catalogue', 'Marché', 'Services', 'Livraison'].map(item => (
                                    <li key={item}><Link to="#" className="text-gray-400 hover:text-emerald-600 transition-colors uppercase font-black text-[9px] tracking-widest">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Ecosystème</h4>
                            <ul className="space-y-4">
                                {['WhatsApp Direct', 'Lomé, Togo', 'Instagram Feed', 'LinkedIn'].map(item => (
                                    <li key={item}><a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors uppercase font-black text-[9px] tracking-widest">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-40 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-300 font-black uppercase text-[8px] tracking-[0.4em]">
                        &copy; {new Date().getFullYear()} Djapero Group • Excellence Agricole Connectée
                    </p>
                    <div className="flex gap-10 opacity-30">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-900">Confidentialité</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-900">Conditions</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
