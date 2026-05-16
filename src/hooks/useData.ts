import { useState, useEffect } from "react";
import { 
    collection, 
    onSnapshot, 
    doc, 
    setDoc, 
    updateDoc, 
    query, 
    orderBy,
    getDoc,
    addDoc,
    deleteDoc,
    getDocFromServer
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errCode = (error as any)?.code || "unknown";
  
  // If the error is 'offline', do not throw or alarm, it's normal in some previews.
  if (errMessage.includes("offline") || errCode === 'unavailable') {
    console.warn("Firebase client is operating offline. Some data may be unavailable.");
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: `${errCode}: ${errMessage}`,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('[Firestore Error Details]:', JSON.stringify(errInfo, null, 2));
  
  // Throw a descriptive error that Admin.tsx can parse
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot with more info after a short delay
async function testConnection() {
  console.log("🔄 Testing Firestore connection in 2 seconds...");
  setTimeout(async () => {
    try {
      const start = Date.now();
      await getDocFromServer(doc(db, 'settings', 'main')).catch(() => null);
      console.log(`✅ Firestore connection successful (${Date.now() - start}ms)`);
    } catch (error: any) {
      if(error?.message?.includes('the client is offline')) {
        console.warn("Firebase client is operating offline. This is expected in certain browser environments.");
      }
    }
  }, 2000);
}
testConnection();

export interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    description: string;
    imageUrl: string;
    badge: string;
    createdAt: number;
}

export interface Video {
    id: string;
    title: string;
    caption: string;
    src: string;
    srcType: 'file' | 'youtube' | 'facebook';
    thumbnail: string;
    createdAt: number;
}

export interface Service {
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    createdAt: number;
}

export interface Real {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    price?: string;
    oldPrice?: string;
    rating?: number;
    badge?: string;
    createdAt: number;
}

export interface Settings {
    whatsapp: string;
    call: string;
    heroVideoId?: string;
    introVideoId?: string;
    publicityVideoId?: string;
    publicityTitle?: string;
    publicitySubtitle?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    bannerTitle?: string;
    bannerDesc?: string;
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    welcomeBtnText?: string;
    welcomeBtnLink?: string;
    welcomeBadgeText?: string;
    welcomeBgColor?: string;
    welcomeImage?: string;
    animCatalogImage?: string;
    animMarketImage?: string;
    animDeliveryImage?: string;
    animServicesImage?: string;
    animTeamImage?: string;
    statsTitle?: string;
    statsValue1?: string;
    statsLabel1?: string;
    statsValue2?: string;
    statsLabel2?: string;
    statsQuote?: string;
    feature1Title?: string;
    feature1Desc?: string;
    feature1Img?: string;
    feature2Title?: string;
    feature2Desc?: string;
    feature2Img?: string;
    feature3Title?: string;
    feature3Desc?: string;
    feature3Img?: string;
    authBackgrounds?: { url: string; label: string; }[];
    heroImage?: string;
    heroMode?: 'video' | 'image';
    adminCustomCode?: string;
    logoUrl?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error';
    createdAt: number;
    active: boolean;
}

export interface MarketItem {
    id: string;
    name: string;
    category: string;
    price: string;
    description: string;
    imageUrl: string;
    location: string;
    shopName: string;
    phone?: string;
    creatorId?: string;
    createdAt: number;
}

export interface UserProfile {
    uid: string;
    email: string;
    fullName: string;
    occupation: string;
    phone: string;
    city: string;
    role: string;
    about?: string;
    experience?: string;
    gender?: string;
    portfolioUrl?: string;
    profileImageUrl?: string;
    specialties?: string[];
    completedAt: number;
}

export interface Ad {
    id: string;
    title: string;
    subtitle: string;
    price?: string;
    imageUrl: string;
    link?: string;
    active: boolean;
    createdAt: number;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    img: string;
    phone?: string;
    description?: string;
    prestations: string[];
    createdAt: number;
}

export interface AppData {
    products: Product[];
    videos: Video[];
    services: Service[];
    reals: Real[];
    notifications: Notification[];
    marketItems: MarketItem[];
    ads: Ad[];
    heroBanners: HeroBanner[];
    settings: Settings;
    users: UserProfile[];
    team: TeamMember[];
}

export interface HeroBanner {
    id: string;
    title: string;
    subtitle: string;
    heading: string;
    imageUrl: string;
    videoUrl?: string;
    active: boolean;
    createdAt: number;
}

export function useData() {
    const [data, setData] = useState<AppData>({
        products: [],
        videos: [],
        services: [],
        reals: [],
        notifications: [],
        marketItems: [],
        ads: [],
        heroBanners: [],
        settings: { whatsapp: "22892052664", call: "22892052664" },
        users: [],
        team: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const dataTimeout = setTimeout(() => {
            console.log("Data loading fallback triggered");
            setLoading(false);
        }, 5000);

        const unsubSettings = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
            if (docSnap.exists()) {
                setData(prev => ({
                    ...prev,
                    settings: docSnap.data() as Settings
                }));
            }
        }, (error) => {
            handleFirestoreError(error, OperationType.GET, "settings/main");
        });

        const unsubProducts = onSnapshot(query(collection(db, "products"), orderBy("createdAt", "desc")), (snap) => {
            const products = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
            setData(prev => ({ ...prev, products }));
            setLoading(false); // Initial load complete when we have some core data
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "products");
            setLoading(false); // Avoid blocking forever on error
        });

        const unsubServices = onSnapshot(query(collection(db, "services"), orderBy("createdAt", "desc")), (snap) => {
            const services = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
            setData(prev => ({ ...prev, services }));
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "services");
        });

        const unsubVideos = onSnapshot(query(collection(db, "videos"), orderBy("createdAt", "desc")), (snap) => {
            const videos = snap.docs.map(d => ({ id: d.id, ...d.data() } as Video));
            setData(prev => ({ ...prev, videos }));
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "videos");
        });

        const unsubMarket = onSnapshot(query(collection(db, "market_items"), orderBy("createdAt", "desc")), (snap) => {
            const marketItems = snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketItem));
            setData(prev => ({ ...prev, marketItems }));
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "market_items");
        });

        const unsubReals = onSnapshot(query(collection(db, "reals"), orderBy("createdAt", "desc")), (snap) => {
            const reals = snap.docs.map(d => ({ id: d.id, ...d.data() } as Real));
            setData(prev => ({ ...prev, reals }));
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "reals");
        });

        const unsubNotifications = onSnapshot(query(collection(db, "notifications"), orderBy("createdAt", "desc")), (snap) => {
            const notifications = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
            setData(prev => ({ ...prev, notifications }));
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "notifications");
        });

        const unsubAds = onSnapshot(query(collection(db, "ads"), orderBy("createdAt", "desc")), (snap) => {
            const ads = snap.docs.map(d => ({ id: d.id, ...d.data() } as Ad));
            setData(prev => ({ ...prev, ads }));
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "ads");
        });

        const unsubHero = onSnapshot(query(collection(db, "heroBanners"), orderBy("createdAt", "desc")), (snap) => {
            const heroBanners = snap.docs.map(d => ({ id: d.id, ...d.data() } as HeroBanner));
            setData(prev => ({ ...prev, heroBanners }));
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "heroBanners");
        });

        const unsubUsers = onSnapshot(query(collection(db, "users"), orderBy("completedAt", "desc")), (snap) => {
            const users = snap.docs.map(d => ({ ...d.data() } as UserProfile));
            setData(prev => ({ ...prev, users }));
        }, (error: any) => {
            // Silence silent errors for non-admins
            const errCode = error?.code || "";
            const errMsg = error?.message || "";
            if (errCode === "permission-denied" || errMsg.includes("permission-denied")) {
                console.warn("User list access restricted to admins.");
                return;
            }
            handleFirestoreError(error, OperationType.LIST, "users");
        });

        const unsubTeam = onSnapshot(query(collection(db, "team"), orderBy("createdAt", "desc")), (snap) => {
            const team = snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
            setData(prev => ({ ...prev, team }));
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "team");
        });

        return () => {
            clearTimeout(dataTimeout);
            unsubSettings();
            unsubProducts();
            unsubServices();
            unsubVideos();
            unsubMarket();
            unsubReals();
            unsubNotifications();
            unsubAds();
            unsubHero();
            unsubUsers();
            unsubTeam();
        };
    }, []);

    const updateSettings = async (newSettings: Partial<Settings>) => {
        try {
            await setDoc(doc(db, "settings", "main"), newSettings, { merge: true });
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, "settings/main");
            return false;
        }
    };

    const addProduct = async (product: Omit<Product, 'id'>) => {
        try {
            await addDoc(collection(db, "products"), product);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "products");
            return false;
        }
    };

    const updateProduct = async (id: string, product: Partial<Product>) => {
        try {
            await updateDoc(doc(db, "products", id), product);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
            return false;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await deleteDoc(doc(db, "products", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
            return false;
        }
    };

    const addVideo = async (video: Omit<Video, 'id'>) => {
        try {
            await addDoc(collection(db, "videos"), video);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "videos");
            return false;
        }
    };

    const updateVideo = async (id: string, video: Partial<Video>) => {
        try {
            await updateDoc(doc(db, "videos", id), video);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `videos/${id}`);
            return false;
        }
    };

    const deleteVideo = async (id: string) => {
        try {
            await deleteDoc(doc(db, "videos", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `videos/${id}`);
            return false;
        }
    };

    const addService = async (service: Omit<Service, 'id'>) => {
        try {
            await addDoc(collection(db, "services"), service);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "services");
            return false;
        }
    };

    const updateService = async (id: string, service: Partial<Service>) => {
        try {
            await updateDoc(doc(db, "services", id), service);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `services/${id}`);
            return false;
        }
    };

    const deleteService = async (id: string) => {
        try {
            await deleteDoc(doc(db, "services", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
            return false;
        }
    };

    const addMarketItem = async (item: Omit<MarketItem, 'id'>) => {
        try {
            await addDoc(collection(db, "market_items"), item);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "market_items");
            return false;
        }
    };

    const updateMarketItem = async (id: string, item: Partial<MarketItem>) => {
        try {
            await updateDoc(doc(db, "market_items", id), item);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `market_items/${id}`);
            return false;
        }
    };

    const deleteMarketItem = async (id: string) => {
        try {
            await deleteDoc(doc(db, "market_items", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `market_items/${id}`);
            return false;
        }
    };

    const addNotification = async (notification: Omit<Notification, 'id'>) => {
        try {
            await addDoc(collection(db, "notifications"), notification);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "notifications");
            return false;
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await deleteDoc(doc(db, "notifications", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `notifications/${id}`);
            return false;
        }
    };

    const addReal = async (real: Omit<Real, 'id'>) => {
        try {
            await addDoc(collection(db, "reals"), real);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "reals");
            return false;
        }
    };

    const updateReal = async (id: string, real: Partial<Real>) => {
        try {
            await updateDoc(doc(db, "reals", id), real);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `reals/${id}`);
            return false;
        }
    };

    const deleteReal = async (id: string) => {
        try {
            await deleteDoc(doc(db, "reals", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `reals/${id}`);
            return false;
        }
    };

    const addAd = async (ad: Omit<Ad, 'id'>) => {
        try {
            await addDoc(collection(db, "ads"), ad);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "ads");
            return false;
        }
    };

    const updateAd = async (id: string, ad: Partial<Ad>) => {
        try {
            await updateDoc(doc(db, "ads", id), ad);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `ads/${id}`);
            return false;
        }
    };

    const deleteAd = async (id: string) => {
        try {
            await deleteDoc(doc(db, "ads", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `ads/${id}`);
            return false;
        }
    };

    const addHeroBanner = async (banner: Omit<HeroBanner, 'id'>) => {
        try {
            await addDoc(collection(db, "heroBanners"), banner);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "heroBanners");
            return false;
        }
    };

    const updateHeroBanner = async (id: string, banner: Partial<HeroBanner>) => {
        try {
            await updateDoc(doc(db, "heroBanners", id), banner);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `heroBanners/${id}`);
            return false;
        }
    };

    const deleteHeroBanner = async (id: string) => {
        try {
            await deleteDoc(doc(db, "heroBanners", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `heroBanners/${id}`);
            return false;
        }
    };

    const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
        try {
            await addDoc(collection(db, "team"), member);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, "team");
            return false;
        }
    };

    const updateTeamMember = async (id: string, member: Partial<TeamMember>) => {
        try {
            await updateDoc(doc(db, "team", id), member);
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `team/${id}`);
            return false;
        }
    };

    const deleteTeamMember = async (id: string) => {
        try {
            await deleteDoc(doc(db, "team", id));
            return true;
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `team/${id}`);
            return false;
        }
    };

    return { 
        data, 
        loading, 
        updateSettings, 
        addProduct, 
        updateProduct, 
        deleteProduct,
        addVideo,
        updateVideo,
        deleteVideo,
        addService,
        updateService,
        deleteService,
        addMarketItem,
        updateMarketItem,
        deleteMarketItem,
        addNotification,
        deleteNotification,
        addReal,
        updateReal,
        deleteReal,
        addAd,
        updateAd,
        deleteAd,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember
    };
}
