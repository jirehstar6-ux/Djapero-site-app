import { Smartphone, Package, Truck } from "lucide-react";
import { motion } from "motion/react";

export default function Delivery() {
    return (
        <div className="dashboard-container pt-24 min-h-screen pb-20">
            <main className="main-content">
                <div className="mb-12">
                    <h2 className="text-4xl font-extrabold mb-2">🚀 Comment ça marche ?</h2>
                    <p className="text-gray-500 text-lg">Commandez en quelques clics, recevez sans stress.</p>
                </div>

                <section className="bg-white rounded-[3rem] p-10 md:p-20 shadow-xl border border-neutral-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative">
                        {/* Step 1 */}
                        <motion.div 
                            className="flex-1 text-center relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-inner">
                                <Smartphone size={40} />
                                <span className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg">1</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Commande</h3>
                            <p className="text-gray-500 leading-relaxed">Choisissez vos produits et passez commande via notre site ou WhatsApp en quelques secondes.</p>
                        </motion.div>

                        <div className="hidden md:block w-px h-24 bg-emerald-100"></div>

                        {/* Step 2 */}
                        <motion.div 
                            className="flex-1 text-center relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-inner">
                                <Package size={40} />
                                <span className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg">2</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Préparation</h3>
                            <p className="text-gray-500 leading-relaxed">Nous sélectionnons et emballons vos produits avec le plus grand soin pour garantir leur fraîcheur.</p>
                        </motion.div>

                        <div className="hidden md:block w-px h-24 bg-emerald-100"></div>

                        {/* Step 3 */}
                        <motion.div 
                            className="flex-1 text-center relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-inner">
                                <Truck size={40} />
                                <span className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg">3</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Livraison</h3>
                            <p className="text-gray-500 leading-relaxed">Notre livreur dépose vos achats directement à votre porte, à l'heure qui vous convient le mieux.</p>
                        </motion.div>
                    </div>
                </section>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-emerald-600 text-white p-12 rounded-[2.5rem] shadow-lg">
                        <h4 className="text-2xl font-bold mb-4">Zéro Déchet, Fraîcheur Maximale 🌿</h4>
                        <p className="opacity-90 leading-relaxed">Chez Djapero, nous privilégions les circuits courts et les emballages responsables. Chaque fruit, chaque légume arrive chez vous comme s'il venait d'être cueilli.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-emerald-100 shadow-lg flex items-center gap-8">
                        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 shrink-0">
                            <Truck size={40} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold mb-2">Suivi en temps réel</h4>
                            <p className="text-gray-500 font-medium">Recevez une notification WhatsApp dès que votre livreur est en route pour votre domicile.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
