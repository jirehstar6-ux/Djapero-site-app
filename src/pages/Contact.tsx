import { Phone, Mail, MapPin, Phone as WhatsApp, MessageSquare, Check } from "lucide-react";
import { useState } from "react";
import { useData } from "../hooks/useData";
import React from "react";

export default function Contact() {
    const { data } = useData();
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setTimeout(() => setStatus("success"), 1500);
    };

    const waNumber = data?.settings.whatsapp || "22892052664";
    const callNumber = data?.settings.call || "+228 92 05 26 64";

    return (
        <div className="pt-24 pb-20 min-h-screen bg-neutral-50 px-6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-neutral-100">
                        <h2 className="text-4xl font-extrabold mb-4 uppercase tracking-tighter decoration-emerald-500 underline decoration-4 underline-offset-8">Prêt à passer <span className="text-emerald-600">commande ?</span></h2>
                        <p className="text-gray-500 text-lg mb-10 font-medium">Contactez-nous directement ou remplissez le formulaire pour toute demande spécifique.</p>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                                    <WhatsApp size={28} />
                                </div>
                                <div className="flex flex-col">
                                    <strong className="text-lg font-black uppercase">WhatsApp & Appels</strong>
                                    <span className="text-gray-400 font-medium">{callNumber}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                    <Mail size={28} />
                                </div>
                                <div className="flex flex-col">
                                    <strong className="text-lg font-black uppercase">Email</strong>
                                    <span className="text-gray-400 font-medium">contact@djapero.tg</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">
                                    <MapPin size={28} />
                                </div>
                                <div className="flex flex-col">
                                    <strong className="text-lg font-black uppercase">Localisation</strong>
                                    <span className="text-gray-400 font-medium">Lomé, Togo</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <a 
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                className="bg-[#25D366] text-white py-5 rounded-2xl font-black text-center uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg"
                            >
                                <WhatsApp size={24} /> Commander via WhatsApp
                            </a>
                            <a 
                                href={`tel:${callNumber}`}
                                className="bg-neutral-900 text-white py-5 rounded-2xl font-black text-center uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg"
                            >
                                <Phone size={24} /> Appeler maintenant
                            </a>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-neutral-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#10b981] ml-2">Nom complet</label>
                                <input required type="text" placeholder="Votre nom" className="w-full bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-300 font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#10b981] ml-2">Numéro de téléphone</label>
                                <input required type="tel" placeholder="+228 9X XX XX XX" className="w-full bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-300 font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#10b981] ml-2">Service désiré</label>
                                <select className="w-full bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 focus:border-emerald-500 outline-none transition-all font-medium">
                                    <option>Livraison de produits frais</option>
                                    <option>Service de communication</option>
                                    <option>Les deux</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#10b981] ml-2">Message</label>
                                <textarea rows={4} placeholder="Que souhaitez-vous ?" className="w-full bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-300 font-medium resize-none"></textarea>
                            </div>
                            
                            <button 
                                disabled={status !== "idle"}
                                type="submit" 
                                className={`w-full py-5 rounded-2xl font-black text-center uppercase tracking-tighter text-lg transition-all shadow-lg flex items-center justify-center gap-3 ${status === "success" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white"}`}
                            >
                                {status === "idle" && <>👉 Commander maintenant</>}
                                {status === "loading" && <span className="animate-spin"><MessageSquare size={24} /></span>}
                                {status === "success" && <><Check size={24} /> Demande envoyée !</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
