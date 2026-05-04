import { Star, Smartphone, Palette, Video, Headset, HardHat } from "lucide-react";
import { motion } from "motion/react";

export default function Team() {
    const team = [
        { name: "Fondateur / Manager", role: "Supervise toute la stratégie", img: "https://randomuser.me/api/portraits/men/32.jpg", icon: HardHat },
        { name: "Responsable Logistique", role: "Gère la flotte et les livraisons", img: "https://randomuser.me/api/portraits/men/45.jpg", icon: Smartphone },
        { name: "Partenaires Producteurs", role: "Fournissent le meilleur du local", img: "https://randomuser.me/api/portraits/women/44.jpg", icon: Star },
        { name: "Graphiste Creative", role: "Créatrice de génie (print & web)", img: "https://randomuser.me/api/portraits/women/68.jpg", icon: Palette },
        { name: "Monteur Vidéo", role: "Réalise des ads captivantes", img: "https://randomuser.me/api/portraits/men/22.jpg", icon: Video },
        { name: "Service Client", role: "À votre écoute H24", img: "https://randomuser.me/api/portraits/women/20.jpg", icon: Headset },
    ];

    return (
        <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold mb-4 uppercase tracking-tighter">Notre Équipe <span className="text-emerald-600">Passionnée</span></h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">Les talents qui se cachent derrière chaque livraison et chaque création visuelle de Djapero Group.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member, i) => (
                        <motion.div 
                            key={i}
                            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 hover:shadow-xl transition-shadow text-center group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <img src={member.img} alt={member.name} className="w-full h-full object-cover rounded-full border-4 border-emerald-50 group-hover:border-emerald-500 transition-colors duration-500" />
                                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                                    <member.icon size={18} />
                                </div>
                            </div>
                            <h3 className="text-xl font-black mb-1">{member.name}</h3>
                            <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">{member.role}</p>
                            <p className="text-gray-400 text-xs leading-relaxed underline decoration-emerald-100 underline-offset-4 decoration-2">"Notre priorité est votre satisfaction et la qualité premium de nos produits."</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-white rounded-[3rem] shadow-sm border border-neutral-100 text-center max-w-4xl mx-auto">
                    <div className="flex justify-center gap-1 mb-6 text-yellow-400">
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 tracking-tight uppercase underline decoration-[#10b981] decoration-4 underline-offset-8">Ils nous font confiance</h3>
                    <div className="relative">
                        <p className="text-xl text-gray-700 leading-loose max-w-2xl mx-auto drop-shadow-sm font-medium">"Des produits d'une fraîcheur incroyable et un service client très réactif. Djapero a aussi refait l'affiche de mon restaurant, magnifique ! Une équipe polyvalente."</p>
                        <div className="mt-8">
                            <strong className="text-lg font-black uppercase text-emerald-700">- Aminata, Gérante de restaurant</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
