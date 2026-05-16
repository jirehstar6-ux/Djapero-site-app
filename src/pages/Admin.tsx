import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ShoppingBag, StoreIcon, VideoIcon, Bell, Settings, Save, Upload, Trash2, Plus, Image as ImageIcon, Users, Mail, Eye, Calendar, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { db, auth, storage } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy, limit, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useData } from '../hooks/useData';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Admin() {
    const { data: appData, addProduct, deleteProduct, addVideo, deleteVideo, updateSettings, addMarketItem, deleteMarketItem, addTeamMember, deleteTeamMember, updateTeamMember, addAd, deleteAd } = useData();
    const [activeTab, setActiveTab] = useState("accueil");
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Visitor and Messages data
    const [visits, setVisits] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalVisits: 0,
        uniqueVisitors: 0,
        unreadMessages: 0
    });
    const [latestAlert, setLatestAlert] = useState<string | null>(null);

    useEffect(() => {
        const visitsQuery = query(collection(db, "visits"), orderBy("createdAt", "desc"), limit(50));
        const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));

        let firstLoad = true;

        const unsubscribeVisits = onSnapshot(visitsQuery, (snapshot) => {
            const visitData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVisits(visitData);
            
            // Basic stats calculation
            const unique = new Set(visitData.map((v: any) => v.email || v.userId || v.userAgent)).size;
            setStats(prev => ({ ...prev, totalVisits: snapshot.size, uniqueVisitors: unique }));

            if (!firstLoad && !snapshot.metadata.hasPendingWrites) {
                const newVisit = visitData[0] as any;
                setLatestAlert(`Nouveau visiteur: ${newVisit.email || 'Anonyme'} sur ${newVisit.path}`);
                setTimeout(() => setLatestAlert(null), 5000);
            }
        }, (error) => {
            handleFirestoreError(auth, error, OperationType.GET, "visits");
        });

        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
            const messageData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
            setMessages(messageData);
            const unread = messageData.filter((m: any) => !m.isRead).length;
            
            setStats(prev => {
                if (!firstLoad && unread > prev.unreadMessages) {
                    setLatestAlert(`Nouveau message reçu de ${messageData[0].name}`);
                    setTimeout(() => setLatestAlert(null), 5000);
                }
                return { ...prev, unreadMessages: unread };
            });
        }, (error) => {
            handleFirestoreError(auth, error, OperationType.GET, "messages");
        });

        firstLoad = false;
        return () => {
            unsubscribeVisits();
            unsubscribeMessages();
        };
    }, []);

    const markAsRead = async (messageId: string) => {
        const path = `messages/${messageId}`;
        try {
            await updateDoc(doc(db, "messages", messageId), { isRead: true });
        } catch (e) {
            handleFirestoreError(auth, e, OperationType.UPDATE, path);
        }
    };

    const deleteMessage = async (messageId: string) => {
        if (!window.confirm("Supprimer ce message ?")) return;
        const path = `messages/${messageId}`;
        try {
            await deleteDoc(doc(db, "messages", messageId));
        } catch (e) {
            handleFirestoreError(auth, e, OperationType.DELETE, path);
        }
    };

    // Form states
    const [adForm, setAdForm] = useState({ title: "", subtitle: "", price: "", imageUrl: "", link: "", active: true });
    const [productForm, setProductForm] = useState({ name: "", price: "", category: "", imageUrl: "", description: "", badge: "" });
    const [videoForm, setVideoForm] = useState({ title: "", src: "", caption: "", category: "", thumbnail: "", srcType: 'youtube' as 'youtube' | 'file' | 'facebook' });
    const [marketForm, setMarketForm] = useState({ name: "", price: "", category: "", imageUrl: "", description: "", location: "", shopName: "" });
    const [teamForm, setTeamForm] = useState({ name: "", role: "", img: "", phone: "", description: "", prestations: [] as string[] });
    const [showSuccess, setShowSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [prestationInput, setPrestationInput] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const filename = `video_${Date.now()}_${file.name}`;
            const fileRef = ref(storage, `uploads/${filename}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            setVideoForm({ ...videoForm, src: url, srcType: 'file' });
        } catch (err) {
            console.error("Upload error:", err);
            alert("Erreur lors de l'upload de la vidéo.");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'marche' | 'team' | 'welcome' | 'ad' | 'animCat' | 'animMarche' | 'animLiv' | 'animServ' | 'animEquipe') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Max dimensions - larger for welcome banners to preserve quality
                const MAX_SIZE = type === 'welcome' ? 1200 : 600;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/webp', type === 'welcome' ? 0.8 : 0.7);
                
                if (type === 'team') {
                    setTeamForm(prev => ({ ...prev, img: dataUrl }));
                    setPreviewImage(dataUrl);
                } else if (type === 'product') {
                    setProductForm(prev => ({ ...prev, imageUrl: dataUrl }));
                } else if (type === 'marche') {
                    setMarketForm(prev => ({ ...prev, imageUrl: dataUrl }));
                } else if (type === 'welcome') {
                    setAccueilSettings(prev => ({ ...prev, welcomeImage: dataUrl }));
                } else if (type === 'ad') {
                    setAdForm(prev => ({ ...prev, imageUrl: dataUrl }));
                } else if (type === 'animCat') {
                    setAccueilSettings(prev => ({ ...prev, animCatalogImage: dataUrl }));
                } else if (type === 'animMarche') {
                    setAccueilSettings(prev => ({ ...prev, animMarketImage: dataUrl }));
                } else if (type === 'animLiv') {
                    setAccueilSettings(prev => ({ ...prev, animDeliveryImage: dataUrl }));
                } else if (type === 'animServ') {
                    setAccueilSettings(prev => ({ ...prev, animServicesImage: dataUrl }));
                } else if (type === 'animEquipe') {
                    setAccueilSettings(prev => ({ ...prev, animTeamImage: dataUrl }));
                }
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    };

    const [accueilSettings, setAccueilSettings] = useState({ 
        heroTitle: "", 
        heroSubtitle: "", 
        bannerTitle: "", 
        bannerDesc: "",
        welcomeTitle: "",
        welcomeSubtitle: "",
        welcomeBtnText: "",
        welcomeBtnLink: "",
        welcomeBadgeText: "",
        welcomeBgColor: "",
        welcomeImage: "",
        animCatalogImage: "",
        animMarketImage: "",
        animDeliveryImage: "",
        animServicesImage: "",
        animTeamImage: ""
    });

    useEffect(() => {
        if (appData.settings) {
            setAccueilSettings({
                heroTitle: appData.settings.heroTitle || "",
                heroSubtitle: appData.settings.heroSubtitle || "",
                bannerTitle: appData.settings.bannerTitle || "",
                bannerDesc: appData.settings.bannerDesc || "",
                welcomeTitle: appData.settings.welcomeTitle || "Bienvenue sur\nDjapéro !",
                welcomeSubtitle: appData.settings.welcomeSubtitle || "Votre panier frais.",
                welcomeBtnText: appData.settings.welcomeBtnText || "Explorer",
                welcomeBtnLink: appData.settings.welcomeBtnLink || "/produits",
                welcomeBadgeText: appData.settings.welcomeBadgeText || "LADY",
                welcomeBgColor: appData.settings.welcomeBgColor || "#1b4332",
                welcomeImage: appData.settings.welcomeImage || "",
                animCatalogImage: appData.settings.animCatalogImage || "",
                animMarketImage: appData.settings.animMarketImage || "",
                animDeliveryImage: appData.settings.animDeliveryImage || "",
                animServicesImage: appData.settings.animServicesImage || "",
                animTeamImage: appData.settings.animTeamImage || ""
            });
        }
    }, [appData.settings]);

    const updateAccueilField = (field: keyof typeof accueilSettings, value: string) => {
        setAccueilSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleAccueilSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);
        try {
            const success = await updateSettings(accueilSettings);
            setIsSaving(false);
            if (success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                setSaveError("Désolé, vous n'avez pas les permissions admin.");
            }
        } catch (error: any) {
            setIsSaving(false);
            setSaveError(error.message || "Erreur de sauvegarde");
            console.error("Save failed:", error);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            let success = false;
            if (activeTab === "produits") {
                success = await addProduct({ ...productForm, createdAt: Date.now() });
                if (success) setProductForm({ name: "", price: "", category: "", imageUrl: "", description: "", badge: "" });
            } else if (activeTab === "videos") {
                success = await addVideo({ ...videoForm, createdAt: Date.now() });
                if (success) setVideoForm({ title: "", src: "", caption: "", category: "", thumbnail: "", srcType: 'youtube' });
            } else if (activeTab === "marche") {
                success = await addMarketItem({ ...marketForm, createdAt: Date.now() });
                if (success) setMarketForm({ name: "", price: "", category: "", imageUrl: "", description: "", location: "", shopName: "" });
            } else if (activeTab === "team") {
                const finalTeamForm = { ...teamForm };
                if (prestationInput.trim() && !finalTeamForm.prestations.includes(prestationInput.trim())) {
                    finalTeamForm.prestations.push(prestationInput.trim());
                }
                
                if (editingId) {
                    const { img, ...rest } = finalTeamForm;
                    const updateData: any = { ...rest };
                    if (img) updateData.img = img;
                    success = await updateTeamMember(editingId, updateData);
                } else {
                    success = await addTeamMember({ ...finalTeamForm, createdAt: Date.now() });
                }

                if (success) {
                    setTeamForm({ name: "", role: "", img: "", phone: "", description: "", prestations: [] });
                    setPrestationInput("");
                    setEditingId(null);
                }
            } else if (activeTab === "affiches") {
                success = await addAd({ ...adForm, createdAt: Date.now() });
                if (success) setAdForm({ title: "", subtitle: "", price: "", imageUrl: "", link: "", active: true });
            }

            if (success) {
                setShowAddModal(false);
                setPreviewImage(null);
            }
        } catch (error) {
            console.error("Error during submittion:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditTeam = (member: any) => {
        setTeamForm({
            name: member.name,
            role: member.role,
            img: member.img,
            phone: member.phone || "",
            description: member.description || "",
            prestations: member.prestations || []
        });
        setEditingId(member.id);
        setShowAddModal(true);
    };

    const getYoutubeId = (url: string) => {
        if (!url) return '';
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) return url;
        let videoId = '';
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        if (match && match[1]) {
            videoId = match[1];
        }
        return videoId || url;
    };

    return (
        <div className="min-h-screen bg-[#6366f1] bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#ec4899] p-4 md:p-8 flex items-center justify-center font-sans">
            <AnimatePresence>
                {latestAlert && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] bg-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border-b-4 border-indigo-600"
                    >
                        <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Bell size={20} className="animate-bounce" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Flash Info</p>
                            <p className="text-sm font-bold text-slate-800">{latestAlert}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-7xl bg-[#f8fafc]/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20 h-[90vh]">
                
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white/40 p-6 flex flex-col border-r border-white/40">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <StoreIcon size={22} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">Djapero</span>
                    </div>

                    <nav className="flex-grow space-y-2">
                        {[
                            { id: "accueil", label: "Dashboard", icon: LayoutDashboard },
                            { id: "produits", label: "Catalogue", icon: ShoppingBag },
                            { id: "marche", label: "Marché", icon: StoreIcon },
                            { id: "videos", label: "Médias", icon: VideoIcon },
                            { id: "visiteurs", label: "Visiteurs", icon: Users },
                            { id: "messages", label: "Messagerie", icon: Mail },
                            { id: "affiches", label: "Affiches", icon: ImageIcon },
                            { id: "team", label: "Équipe", icon: Plus },
                            { id: "notifications", label: "Alertes", icon: Bell },
                            { id: "parametres", label: "Settings", icon: Settings },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                    activeTab === item.id 
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                    : 'text-slate-500 hover:bg-white/60 hover:text-indigo-600'
                                }`}
                            >
                                <item.icon size={20} className={activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
                                <span className={`font-semibold text-sm ${activeTab === item.id ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto p-4 bg-white/40 rounded-3xl border border-white/60 hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white" />
                            <div>
                                <p className="text-sm font-bold text-slate-800">Admin</p>
                                <p className="text-[10px] text-slate-500 font-medium">Gestionnaire</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="h-20 px-8 flex items-center justify-between border-b border-white/40">
                        <div className="flex-1 max-w-md relative hidden md:block">
                            <input 
                                type="text" 
                                placeholder="Rechercher..." 
                                className="w-full bg-white/60 border-none rounded-2xl py-2.5 px-5 outline-none focus:ring-2 focus:ring-indigo-400/50 text-sm font-medium transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            {["produits", "marche", "videos", "team", "notifications"].includes(activeTab) && (
                                <button 
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                                >
                                    <Plus size={18} /> <span>Ajouter</span>
                                </button>
                            )}
                            <div className="w-10 h-10 rounded-2xl bg-white/60 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-white transition-all">
                                <Bell size={20} />
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "affiches" && (
                                    <div className="max-w-3xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Gestion des Affiches</h2>
                                                <p className="text-slate-500 font-bold mt-0 uppercase tracking-widest text-[8px]">Personnalisez le bandeau d'accueil principal</p>
                                            </div>
                                        </div>

                                        <form className="space-y-4" onSubmit={handleAccueilSubmit}>
                                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Gros titre (Affiche)</label>
                                                            <textarea 
                                                                rows={2}
                                                                value={accueilSettings.welcomeTitle} 
                                                                onChange={e => updateAccueilField('welcomeTitle', e.target.value)}
                                                                className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:border-indigo-400 outline-none font-black text-base transition-all" 
                                                                placeholder="Bienvenue sur\nDjapéro !"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Petit texte / Slogan</label>
                                                            <input 
                                                                value={accueilSettings.welcomeSubtitle} 
                                                                onChange={e => updateAccueilField('welcomeSubtitle', e.target.value)}
                                                                className="w-full bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 focus:border-indigo-400 outline-none font-bold text-[10px] uppercase tracking-widest text-slate-500" 
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Couleur de fond (Hex)</label>
                                                            <div className="flex gap-2">
                                                                <input 
                                                                    type="color"
                                                                    value={accueilSettings.welcomeBgColor} 
                                                                    onChange={e => updateAccueilField('welcomeBgColor', e.target.value)}
                                                                    className="w-10 h-10 rounded-lg border-none p-0 cursor-pointer overflow-hidden shrink-0" 
                                                                />
                                                                <input 
                                                                    value={accueilSettings.welcomeBgColor} 
                                                                    onChange={e => updateAccueilField('welcomeBgColor', e.target.value)}
                                                                    className="flex-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 focus:border-indigo-400 outline-none font-mono text-xs" 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Image de fond (Affiche)</label>
                                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                                <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden shadow-inner flex items-center justify-center border border-dashed border-slate-200 group cursor-pointer shrink-0">
                                                                    {accueilSettings.welcomeImage ? (
                                                                        <img src={accueilSettings.welcomeImage || undefined} className="w-full h-full object-cover" alt="Banner" />
                                                                    ) : (
                                                                        <ImageIcon className="text-slate-300" size={18} />
                                                                    )}
                                                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'welcome')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                                </div>
                                                                <div className="flex-1 text-[8px] font-bold text-slate-400 uppercase leading-tight">
                                                                    Télécharger<br/>l'affiche
                                                                </div>
                                                                {accueilSettings.welcomeImage && (
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => setAccueilSettings(prev => ({ ...prev, welcomeImage: "" }))}
                                                                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1.5">
                                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Texte Bouton</label>
                                                                <input 
                                                                    value={accueilSettings.welcomeBtnText} 
                                                                    onChange={e => updateAccueilField('welcomeBtnText', e.target.value)}
                                                                    className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 focus:border-indigo-400 outline-none font-bold text-[10px]" 
                                                                />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Badge (ex: LADY)</label>
                                                                <input 
                                                                    value={accueilSettings.welcomeBadgeText} 
                                                                    onChange={e => updateAccueilField('welcomeBadgeText', e.target.value)}
                                                                    className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 focus:border-indigo-400 outline-none font-black text-[10px] uppercase" 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Lien du bouton</label>
                                                            <input 
                                                                value={accueilSettings.welcomeBtnLink} 
                                                                onChange={e => updateAccueilField('welcomeBtnLink', e.target.value)}
                                                                className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 focus:border-indigo-400 outline-none font-bold text-[10px] text-slate-400" 
                                                                placeholder="/produits or URL"
                                                            />
                                                        </div>
                                                        
                                                        {/* Preview */}
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-1.5 block">Aperçu direct</label>
                                                                <div 
                                                                    className="p-5 rounded-2xl shadow-lg relative overflow-hidden h-[160px] flex items-center"
                                                                    style={{ 
                                                                        background: accueilSettings.welcomeBgColor 
                                                                            ? `linear-gradient(120deg, ${accueilSettings.welcomeBgColor} 0%, ${accueilSettings.welcomeBgColor}CC 100%)` 
                                                                            : 'linear-gradient(120deg, #f0fdf4 0%, #dcfce7 100%)',
                                                                    }}
                                                                >
                                                                    {accueilSettings.welcomeImage && (
                                                                        <div 
                                                                            className="absolute inset-y-0 right-0 z-0 opacity-100 w-2/3" 
                                                                            style={{
                                                                                backgroundImage: `url(${accueilSettings.welcomeImage})`,
                                                                                backgroundSize: 'contain',
                                                                                backgroundPosition: 'right bottom',
                                                                                backgroundRepeat: 'no-repeat'
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {accueilSettings.welcomeImage && (
                                                                        <div 
                                                                            className="absolute inset-0 z-0 pointer-events-none"
                                                                            style={{
                                                                                background: `linear-gradient(to right, ${accueilSettings.welcomeBgColor || '#f0fdf4'} 45%, ${accueilSettings.welcomeBgColor ? accueilSettings.welcomeBgColor + '88' : 'transparent'} 75%, transparent 100%)`
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <div className="relative z-10 w-full flex justify-between items-center">
                                                                        <div className="max-w-[70%]">
                                                                            <h4 className="text-white !text-white font-black text-[12px] whitespace-pre-line leading-tight mb-1 drop-shadow-sm">{accueilSettings.welcomeTitle}</h4>
                                                                            <p className="text-white/80 !text-white/80 font-bold text-[8px] uppercase tracking-widest mb-3 drop-shadow-sm">{accueilSettings.welcomeSubtitle}</p>
                                                                            <span className="bg-emerald-500 text-white text-[8px] font-black py-1.5 px-4 rounded-full shadow-lg shadow-emerald-500/30 uppercase">{accueilSettings.welcomeBtnText}</span>
                                                                        </div>
                                                                        <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md shrink-0 ml-4">
                                                                            <span className="text-[9px] text-white !text-white font-black drop-shadow-sm">{accueilSettings.welcomeBadgeText}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Animation Images Uploads */}
                                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 space-y-6 mt-8">
                                                <div className="border-b border-slate-100 pb-4 mb-4">
                                                    <h3 className="text-lg font-black text-indigo-600 uppercase tracking-wider">Images Animation D'Inscription</h3>
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Personnalisez les 5 cartes de l'animation</p>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    {/* Card 1: Catalogue */}
                                                    <div className="space-y-1.5 flex flex-col items-center">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Catalogue</label>
                                                        <div className="w-full aspect-[4/5] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden group cursor-pointer flex items-center justify-center">
                                                            {accueilSettings.animCatalogImage ? (
                                                                <img src={accueilSettings.animCatalogImage} className="w-full h-full object-cover" alt="Catalog Anim" />
                                                            ) : (
                                                                <ImageIcon className="text-slate-300" size={24} />
                                                            )}
                                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'animCat')} className="absolute inset-0 opacity-0 cursor-pointer object-cover" />
                                                        </div>
                                                        {accueilSettings.animCatalogImage && (
                                                            <button type="button" onClick={() => setAccueilSettings(prev => ({ ...prev, animCatalogImage: "" }))} className="text-red-400 text-[10px] font-bold mt-1 uppercase hover:text-red-500">Effacer</button>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Card 2: Marche */}
                                                    <div className="space-y-1.5 flex flex-col items-center">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Marché</label>
                                                        <div className="w-full aspect-[4/5] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden group cursor-pointer flex items-center justify-center">
                                                            {accueilSettings.animMarketImage ? (
                                                                <img src={accueilSettings.animMarketImage} className="w-full h-full object-cover" alt="Market Anim" />
                                                            ) : (
                                                                <ImageIcon className="text-slate-300" size={24} />
                                                            )}
                                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'animMarche')} className="absolute inset-0 opacity-0 cursor-pointer object-cover" />
                                                        </div>
                                                        {accueilSettings.animMarketImage && (
                                                            <button type="button" onClick={() => setAccueilSettings(prev => ({ ...prev, animMarketImage: "" }))} className="text-red-400 text-[10px] font-bold mt-1 uppercase hover:text-red-500">Effacer</button>
                                                        )}
                                                    </div>

                                                    {/* Card 3: Livraison */}
                                                    <div className="space-y-1.5 flex flex-col items-center">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Livraison</label>
                                                        <div className="w-full aspect-[4/5] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden group cursor-pointer flex items-center justify-center">
                                                            {accueilSettings.animDeliveryImage ? (
                                                                <img src={accueilSettings.animDeliveryImage} className="w-full h-full object-cover" alt="Delivery Anim" />
                                                            ) : (
                                                                <ImageIcon className="text-slate-300" size={24} />
                                                            )}
                                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'animLiv')} className="absolute inset-0 opacity-0 cursor-pointer object-cover" />
                                                        </div>
                                                        {accueilSettings.animDeliveryImage && (
                                                            <button type="button" onClick={() => setAccueilSettings(prev => ({ ...prev, animDeliveryImage: "" }))} className="text-red-400 text-[10px] font-bold mt-1 uppercase hover:text-red-500">Effacer</button>
                                                        )}
                                                    </div>

                                                    {/* Card 4: Services */}
                                                    <div className="space-y-1.5 flex flex-col items-center">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Services</label>
                                                        <div className="w-full aspect-[4/5] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden group cursor-pointer flex items-center justify-center">
                                                            {accueilSettings.animServicesImage ? (
                                                                <img src={accueilSettings.animServicesImage} className="w-full h-full object-cover" alt="Services Anim" />
                                                            ) : (
                                                                <ImageIcon className="text-slate-300" size={24} />
                                                            )}
                                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'animServ')} className="absolute inset-0 opacity-0 cursor-pointer object-cover" />
                                                        </div>
                                                        {accueilSettings.animServicesImage && (
                                                            <button type="button" onClick={() => setAccueilSettings(prev => ({ ...prev, animServicesImage: "" }))} className="text-red-400 text-[10px] font-bold mt-1 uppercase hover:text-red-500">Effacer</button>
                                                        )}
                                                    </div>

                                                    {/* Card 5: Equipe */}
                                                    <div className="space-y-1.5 flex flex-col items-center">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Équipe</label>
                                                        <div className="w-full aspect-[4/5] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden group cursor-pointer flex items-center justify-center">
                                                            {accueilSettings.animTeamImage ? (
                                                                <img src={accueilSettings.animTeamImage} className="w-full h-full object-cover" alt="Team Anim" />
                                                            ) : (
                                                                <ImageIcon className="text-slate-300" size={24} />
                                                            )}
                                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'animEquipe')} className="absolute inset-0 opacity-0 cursor-pointer object-cover" />
                                                        </div>
                                                        {accueilSettings.animTeamImage && (
                                                            <button type="button" onClick={() => setAccueilSettings(prev => ({ ...prev, animTeamImage: "" }))} className="text-red-400 text-[10px] font-bold mt-1 uppercase hover:text-red-500">Effacer</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                                <div className="flex flex-col items-center pt-2 relative">
                                                    <button type="submit" disabled={isSaving} className="w-fit px-8 bg-indigo-600 text-white h-8 rounded-full font-black uppercase tracking-widest text-[8px] shadow-lg shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                                        {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={12} />}
                                                        <span>PUBLIER</span>
                                                    </button>
                                                    
                                                    <AnimatePresence>
                                                        {showSuccess && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="mt-1.5 text-emerald-500 text-[8px] font-black uppercase tracking-widest"
                                                            >
                                                                ✓ Mise à jour réussie
                                                            </motion.div>
                                                        )}
                                                        {saveError && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="mt-1.5 text-red-500 text-[8px] font-black uppercase tracking-widest"
                                                            >
                                                                ⚠️ {saveError}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                        </form>

                                        {/* Affiches Latérales (Ads) */}
                                        <div className="mt-12">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Affiches Latérales</h3>
                                                    <p className="text-slate-500 font-bold mt-1 text-[10px] uppercase tracking-widest">Affichez des promos sur le côté (2 max. visibles sur l'accueil)</p>
                                                </div>
                                                <button 
                                                    onClick={() => { setAdForm({ title: "", subtitle: "", price: "", imageUrl: "", link: "", active: true }); setEditingId(null); setShowAddModal(true); }}
                                                    className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {appData.ads?.map(ad => (
                                                    <div key={ad.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 relative group">
                                                        <div className="flex gap-4">
                                                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner bg-slate-50 shrink-0 relative">
                                                                <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1 py-1 pr-6">
                                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-tight mb-0.5">{ad.subtitle}</p>
                                                                <h4 className="font-black text-slate-800 leading-tight">{ad.title}</h4>
                                                                {ad.price && <p className="text-sm font-bold text-slate-500 mt-1">{ad.price}</p>}
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => deleteAd(ad.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!appData.ads || appData.ads.length === 0) && (
                                                    <div className="col-span-1 sm:col-span-2 p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                                        Aucune affiche latérale n'a été ajoutée
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "accueil" && (
                                    <div className="space-y-8">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Documents</h1>
                                                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Statistiques Globales</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                                <span>Nom</span>
                                                <div className="flex flex-col -space-y-1">
                                                    <Plus className="rotate-45" size={12} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { label: "Ventes", value: "1,200 €", bgColor: "bg-indigo-50", textColor: "text-indigo-600", icon: ShoppingBag },
                                                { label: "Visites", value: stats.totalVisits.toString(), bgColor: "bg-purple-50", textColor: "text-purple-600", icon: Eye },
                                                { label: "Produits", value: appData.products.length.toString(), bgColor: "bg-pink-50", textColor: "text-pink-600", icon: StoreIcon },
                                                { label: "Messages", value: stats.unreadMessages.toString(), bgColor: "bg-rose-50", textColor: "text-rose-600", icon: Mail },
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                                                    <div className={`w-8 h-8 rounded-xl ${stat.bgColor} ${stat.textColor} flex items-center justify-center mb-3 transition-colors`}>
                                                        <stat.icon size={16} />
                                                    </div>
                                                    <p className="text-lg font-black text-slate-800">{stat.value}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "produits" && (
                                    <div className="space-y-8">
                                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Catalogue</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {appData.products.map((product) => (
                                                <div key={product.id} className="bg-white p-6 rounded-[2.8rem] shadow-sm border border-slate-50 group hover:-translate-y-2 transition-all flex flex-col hover:shadow-xl hover:shadow-indigo-500/5">
                                                    <div className="aspect-square bg-white rounded-[2.2rem] mb-6 overflow-hidden relative border border-slate-100/50">
                                                        <img src={product.imageUrl || "https://picsum.photos/seed/400/400"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute top-4 right-4">
                                                            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-black text-indigo-600 shadow-sm border border-white/40">{product.price}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 px-2">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="font-black text-slate-800 truncate text-sm uppercase tracking-tight">{product.name}</h3>
                                                            <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-600 transition-all p-1.5 bg-red-50 rounded-xl hover:scale-110">
                                                                 <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{product.category}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "parametres" && (
                                    <div className="max-w-4xl">
                                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-8">Configuration</h2>
                                        <form className="space-y-6" onSubmit={handleAccueilSubmit}>
                                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-8">
                                                <div className="border-b border-slate-100 pb-4">
                                                    <h3 className="text-lg font-black text-indigo-600 uppercase tracking-wider">A & Titres</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Titre Hero Principal</label>
                                                            <input 
                                                                value={accueilSettings.heroTitle} 
                                                                onChange={e => updateAccueilField('heroTitle', e.target.value)}
                                                                className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 focus:border-indigo-400 outline-none font-black uppercase tracking-tighter transition-all" 
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Sous-titre Hero</label>
                                                            <input 
                                                                value={accueilSettings.heroSubtitle} 
                                                                onChange={e => updateAccueilField('heroSubtitle', e.target.value)}
                                                                className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 focus:border-indigo-400 outline-none font-bold text-xs uppercase tracking-widest text-slate-500" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Studio</label>
                                                            <input 
                                                                value={accueilSettings.bannerTitle} 
                                                                onChange={e => updateAccueilField('bannerTitle', e.target.value)}
                                                                className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 focus:border-indigo-400 outline-none font-black uppercase tracking-tighter" 
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Description</label>
                                                            <textarea 
                                                                value={accueilSettings.bannerDesc} 
                                                                onChange={e => updateAccueilField('bannerDesc', e.target.value)}
                                                                rows={3} 
                                                                className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 focus:border-indigo-400 outline-none font-bold text-xs text-slate-400" 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center pt-2 relative">
                                                <button type="submit" disabled={isSaving} className="w-fit min-w-[200px] px-6 bg-indigo-600 text-white h-9 rounded-full font-black uppercase tracking-widest text-[8px] shadow-lg shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                                    {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={12} />}
                                                    <span>SAUVEGARDER CONFIG</span>
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {showSuccess && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="mt-2 text-emerald-500 text-[8px] font-black uppercase tracking-widest"
                                                        >
                                                            ✓ Configuration enregistrée
                                                        </motion.div>
                                                    )}
                                                    {saveError && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="mt-2 text-red-500 text-[8px] font-black uppercase tracking-widest"
                                                        >
                                                            ⚠️ {saveError}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === "marche" && (
                                    <div className="space-y-8">
                                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Marché Local</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {appData.marketItems.map(item => (
                                                <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 group transition-all hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col">
                                                    <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6 overflow-hidden relative border border-slate-100">
                                                        <img src={item.imageUrl || "https://picsum.photos/seed/market/400/225"} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute top-4 right-4">
                                                            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-black text-emerald-600 shadow-sm border border-white/40">{item.price}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-start flex-1 px-2">
                                                        <div className="max-w-[80%]">
                                                            <h3 className="text-lg font-black text-slate-800 mb-1 truncate uppercase tracking-tight">{item.name}</h3>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.shopName} • {item.location}</p>
                                                        </div>
                                                        <button onClick={() => deleteMarketItem(item.id)} className="text-red-400 hover:text-red-600 p-2.5 bg-red-50 rounded-xl transition-all hover:scale-110">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "videos" && (
                                    <div className="space-y-8">
                                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Médiathèque</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {appData.videos.map(video => (
                                                <div key={video.id} className="bg-white p-4 lg:p-6 rounded-[2rem] shadow-sm border border-slate-50 relative group">
                                                    <div className="aspect-video bg-black rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative shadow-inner">
                                                        {video.thumbnail ? (
                                                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-50" />
                                                        ) : (
                                                            <VideoIcon className="text-white/20" size={48} />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end z-20">
                                                            <h3 className="text-white font-black text-lg uppercase tracking-tighter leading-tight drop-shadow-md truncate">
                                                                {video.title}
                                                            </h3>
                                                            {video.caption && <p className="text-white/80 text-[10px] font-bold mt-1 line-clamp-2 leading-tight">{video.caption}</p>}
                                                        </div>
                                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
                                                                <VideoIcon size={24} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center px-1">
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <h3 className="text-sm font-bold text-slate-800 truncate">{video.title}</h3>
                                                            {video.srcType && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{video.srcType}</p>}
                                                        </div>
                                                        <button onClick={() => deleteVideo(video.id)} className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "notifications" && (
                                    <div className="space-y-8">
                                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Alertes & Notifications</h2>
                                        <div className="space-y-4">
                                            {appData.notifications.length > 0 ? appData.notifications.map(notif => (
                                                <div key={notif.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-4">
                                                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                                        <Bell size={20} />
                                                     </div>
                                                     <div className="flex-1">
                                                         <h3 className="font-bold text-slate-800">{notif.title}</h3>
                                                         <p className="text-sm text-slate-400">{notif.message}</p>
                                                     </div>
                                                </div>
                                            )) : (
                                                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">Aucune notification</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "team" && (
                                    <div className="space-y-8">
                                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Gestion de l'Équipe</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {appData.team.map(member => (
                                                <div key={member.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 group hover:shadow-md transition-all text-center">
                                                    <div className="relative w-24 h-24 mx-auto mb-4">
                                                        <img src={member.img || "https://randomuser.me/api/portraits/lego/1.jpg"} alt={member.name} className="w-full h-full object-cover rounded-full border-4 border-slate-50" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-800">{member.name}</h3>
                                                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">{member.role}</p>
                                                    {member.prestations && member.prestations.length > 0 && (
                                                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                                                            {member.prestations.map((p, idx) => (
                                                                <span key={idx} className="text-[8px] font-black bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full uppercase truncate max-w-[80px]">
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="mt-4 flex items-center justify-center gap-3">
                                                        <button 
                                                            onClick={() => handleEditTeam(member)}
                                                            className="text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-bold text-[10px] uppercase tracking-widest"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteTeamMember(member.id)} 
                                                            className="text-red-400 hover:text-red-500 flex items-center gap-1 font-bold text-[10px] uppercase tracking-widest"
                                                        >
                                                            <Trash2 size={14} /> Supprimer
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "visiteurs" && (
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Historique des Visites</h2>
                                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Les 50 dernières activités</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                                                    <p className="text-xs font-bold text-slate-400 uppercase">Unique</p>
                                                    <p className="text-xl font-black text-indigo-600">{stats.uniqueVisitors}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Utilisateur / Browser</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Page</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date & Heure</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {visits.map((visit) => (
                                                        <tr key={visit.id} className="hover:bg-slate-50/30 transition-colors">
                                                            <td className="px-8 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                        <Users size={14} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{visit.email || "Visiteur Anonyme"}</p>
                                                                        <p className="text-[10px] text-slate-400 truncate max-w-[200px] text-wrap">{visit.userAgent}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-4">
                                                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest">{visit.path}</span>
                                                            </td>
                                                            <td className="px-8 py-4">
                                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                                                    <Calendar size={12} />
                                                                    {new Date(visit.createdAt).toLocaleString('fr-FR')}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "messages" && (
                                    <div className="space-y-8 text-slate-800">
                                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Messagerie Directe</h2>
                                        
                                        <div className="grid grid-cols-1 gap-6">
                                            {messages.length > 0 ? messages.map((m) => (
                                                <div key={m.id} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border ${m.isRead ? 'border-slate-50' : 'border-indigo-200 ring-2 ring-indigo-500/5'} transition-all`}>
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.isRead ? 'bg-slate-50 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'}`}>
                                                                <Mail size={20} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-black tracking-tight">{m.name}</h3>
                                                                <p className="text-xs font-bold text-indigo-600">{m.phone || m.email}</p>
                                                                <p className="text-[10px] text-slate-400">{m.service && `Service: ${m.service}`}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {!m.isRead && (
                                                                <button 
                                                                   onClick={() => markAsRead(m.id)}
                                                                   className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
                                                               >
                                                                   <CheckCircle size={14} /> Lu
                                                               </button>
                                                            )}
                                                            <button 
                                                               onClick={() => deleteMessage(m.id)}
                                                               className="p-2.5 text-slate-300 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="pl-16">
                                                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 mb-4">
                                                            <p className="text-slate-600 font-medium leading-relaxed">{m.message}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                                <Clock size={12} />
                                                                Reçu le {new Date(m.createdAt).toLocaleString('fr-FR')}
                                                            </div>
                                                            {(m.phone || m.email) && (
                                                                <a 
                                                                    href={`https://wa.me/${m.phone?.replace(/[^0-9]/g, '') || ''}?text=Bonjour ${m.name}, je reviens vers vous concernant votre message sur Djapero.`}
                                                                    target="_blank"
                                                                    className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#25D366]/20"
                                                                >
                                                                    <MessageSquare size={14} /> Répondre
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-20 text-center">
                                                    <MessageSquare className="mx-auto text-slate-100 mb-4" size={64} />
                                                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Votre boîte de réception est vide</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Add Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAddModal(false)}
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="relative w-[95%] max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            >
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/20">
                                    <div className="leading-tight">
                                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">{editingId ? "Modifier" : "Publier"}</h2>
                                        <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Section: {activeTab}</p>
                                    </div>
                                    <button onClick={() => { setShowAddModal(false); setPreviewImage(null); setEditingId(null); setTeamForm({ name: "", role: "", img: "", phone: "", description: "", prestations: [] }); }} className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                                        <Plus className="rotate-45" size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddSubmit} className="p-5 space-y-2.5 overflow-y-auto no-scrollbar">
                                    {activeTab === "produits" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Nom du produit</label>
                                                    <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Prix (€/XAF)</label>
                                                    <input required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Catégorie</label>
                                                <input value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" placeholder="Général, Électronique, ..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Photo réelle</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-dashed border-slate-200 flex items-center justify-center group cursor-pointer hover:border-indigo-400 transition-colors">
                                                        {productForm.imageUrl ? (
                                                            <img src={productForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Upload className="text-slate-300" size={16} />
                                                        )}
                                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'product')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                    </div>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase">Importer</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">URL Image (Alt)</label>
                                                <input value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-xs" placeholder="https://..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Description</label>
                                                <textarea rows={2} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-xs" />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === "videos" && (
                                        <div className="space-y-4">
                                            {videoForm.src && (
                                                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-inner border border-slate-100 flex items-center justify-center">
                                                    {(videoForm.srcType === 'youtube' || videoForm.src.includes('youtube') || videoForm.src.includes('youtu.be')) ? (
                                                        <iframe 
                                                            src={`https://www.youtube.com/embed/${getYoutubeId(videoForm.src)}`} 
                                                            className="w-full h-full pointer-events-auto"
                                                            allow="autoplay; encrypted-media"
                                                        />
                                                    ) : (
                                                        <video 
                                                            src={videoForm.src}
                                                            className="w-full h-full object-cover"
                                                            controls
                                                            poster={videoForm.thumbnail}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Titre de la vidéo</label>
                                                <input required value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Description / Légende</label>
                                                <textarea rows={2} value={videoForm.caption} onChange={e => setVideoForm({...videoForm, caption: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" placeholder="Ex: Voici comment commander..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Source de la vidéo</label>
                                                <div className="flex gap-2">
                                                    <input required value={videoForm.src} onChange={e => setVideoForm({...videoForm, src: e.target.value})} className="flex-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-xs" placeholder="URL ou uploadez un fichier..." />
                                                    <div className="relative">
                                                        <button type="button" disabled={uploading} className="h-full px-4 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-indigo-100 transition-colors disabled:opacity-50">
                                                            {uploading ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
                                                            {uploading ? "Patientez..." : "Upload"}
                                                        </button>
                                                        <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Type</label>
                                                    <select value={videoForm.srcType} onChange={e => setVideoForm({...videoForm, srcType: e.target.value as any})} className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-xs">
                                                        <option value="youtube">YouTube</option>
                                                        <option value="facebook">Facebook</option>
                                                        <option value="file">Fichier direct URL / Autre</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Thumbnail URL</label>
                                                    <input value={videoForm.thumbnail} onChange={e => setVideoForm({...videoForm, thumbnail: e.target.value})} className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-xs" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "marche" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Nom de l'article</label>
                                                    <input required value={marketForm.name} onChange={e => setMarketForm({...marketForm, name: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Prix XAF</label>
                                                    <input required value={marketForm.price} onChange={e => setMarketForm({...marketForm, price: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Boutique</label>
                                                    <input value={marketForm.shopName} onChange={e => setMarketForm({...marketForm, shopName: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Localisation</label>
                                                    <input value={marketForm.location} onChange={e => setMarketForm({...marketForm, location: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Photo réelle</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-dashed border-slate-200 flex items-center justify-center group cursor-pointer hover:border-indigo-400 transition-colors">
                                                        {marketForm.imageUrl ? (
                                                            <img src={marketForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Upload className="text-slate-300" size={16} />
                                                        )}
                                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'marche')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                    </div>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase">Importer</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">URL Image (Alt)</label>
                                                <input value={marketForm.imageUrl} onChange={e => setMarketForm({...marketForm, imageUrl: e.target.value})} className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-xs" />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === "team" && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Nom complet</label>
                                                <input required value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Rôle / Travail</label>
                                                <input required value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" placeholder="Gérant, Livreur..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Numéro WhatsApp (ex: 228...)</label>
                                                <input value={teamForm.phone} onChange={e => setTeamForm({...teamForm, phone: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm" placeholder="2289205..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Description / Présentation</label>
                                                <textarea rows={3} value={teamForm.description} onChange={e => setTeamForm({...teamForm, description: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-xs" placeholder="Une passion transformée en savoir-faire..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Photo réelle</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-14 h-14 bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center group cursor-pointer hover:border-indigo-400 transition-colors">
                                                        {previewImage || teamForm.img ? (
                                                            <img src={previewImage || teamForm.img || undefined} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Upload className="text-slate-300" size={18} />
                                                        )}
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            onChange={(e) => handleFileChange(e, 'team')}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase leading-tight">Cliquer pour<br/>importer</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">URL Photo (Alt)</label>
                                                <input value={teamForm.img} onChange={e => setTeamForm({...teamForm, img: e.target.value})} className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-[10px]" placeholder="... ou photo uploadée" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Prestations (Appuyer sur Entrée)</label>
                                                <div className="flex flex-wrap gap-1 mb-1">
                                                    {teamForm.prestations.map((p, i) => (
                                                        <span key={i} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1">
                                                            {p}
                                                            <button type="button" onClick={() => setTeamForm({...teamForm, prestations: teamForm.prestations.filter((_, idx) => idx !== i)})} className="hover:text-red-500">
                                                                <Plus className="rotate-45" size={10} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <input 
                                                    value={prestationInput} 
                                                    onChange={e => setPrestationInput(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter' && prestationInput.trim()) {
                                                            e.preventDefault();
                                                            if (!teamForm.prestations.includes(prestationInput.trim())) {
                                                                setTeamForm({...teamForm, prestations: [...teamForm.prestations, prestationInput.trim()]});
                                                            }
                                                            setPrestationInput("");
                                                        }
                                                    }}
                                                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-[10px]" 
                                                    placeholder="Service..." 
                                                />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === "affiches" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Titre (Nom)</label>
                                                    <input required value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-black text-sm" placeholder="ex: Tomate" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Sous-titre (Catégorie)</label>
                                                    <input required value={adForm.subtitle} onChange={e => setAdForm({...adForm, subtitle: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-[10px] uppercase tracking-widest text-emerald-500" placeholder="ex: GÉNÉRAL" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Prix (Optionnel)</label>
                                                    <input value={adForm.price} onChange={e => setAdForm({...adForm, price: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-sm text-emerald-600" placeholder="ex: 1000 FCFA" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Lien Bouton</label>
                                                    <input value={adForm.link} onChange={e => setAdForm({...adForm, link: e.target.value})} className="w-full bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-400/50 font-bold text-[10px]" placeholder="/produits" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Image de l'affiche</label>
                                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="relative w-24 h-16 bg-white rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-dashed border-slate-200 group cursor-pointer">
                                                        {adForm.imageUrl ? (
                                                            <img src={adForm.imageUrl} className="w-full h-full object-cover" alt="preview" />
                                                        ) : (
                                                            <ImageIcon className="text-slate-300" size={24} />
                                                        )}
                                                        <input type="file" required={!adForm.imageUrl && !editingId} accept="image/*" onChange={(e) => handleFileChange(e, 'ad')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[9px] font-black text-slate-600 uppercase">Télécharger une image</p>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Cliquez sur le cadre gauche</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-100 mt-2 hover:bg-black transition-all disabled:opacity-50"
                                    >
                                        {isSaving ? "Sauvegarde..." : (editingId ? "Modifier" : "Publier maintenant")}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Floating "In Progress" type widget for status updates */}
                {isSaving && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="fixed bottom-12 right-12 w-80 bg-white rounded-[2rem] shadow-2xl p-6 border border-slate-100 z-[100]"
                    >
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-4">En cours</h4>
                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                            <div className="w-10 h-10 bg-indigo-100 flex items-center justify-center text-indigo-600 rounded-xl">
                                <Save size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700">Sauvegarde...</p>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <motion.div 
                                        className="bg-indigo-600 h-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
