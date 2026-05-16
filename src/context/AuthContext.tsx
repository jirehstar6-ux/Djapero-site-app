import React, { createContext, useContext, useState, useEffect } from "react";
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getRedirectResult,
    User as FirebaseUser,
    setPersistence,
    browserLocalPersistence,
    inMemoryPersistence,
    browserPopupRedirectResolver
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface UserProfile {
    uid: string;
    email: string;
    fullName: string;
    occupation: string;
    phone: string;
    city: string;
    role: string;
    about?: string;
    completedAt: any;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    login: () => Promise<void>;
    loginWithRedirect: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    completeProfile: (data: { 
        fullName: string; 
        occupation: string; 
        email: string;
        phone: string;
        city: string;
        role: string;
        about?: string;
    }) => Promise<void>;
    loading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isFirstAuthCheck = true;
        
        const initAuth = async () => {
            try {
                // Wait for the SDK to settle
                await new Promise(r => setTimeout(r, 1000));
                
                // Consume any pending redirect result that might cause assertion errors
                await getRedirectResult(auth).catch((err) => {
                    console.warn("Cleaned pending redirect:", err.code);
                });

                // Set persistence explicitly to local for better cross-tab behavior
                await setPersistence(auth, browserLocalPersistence).catch((err) => {
                    console.warn("browserLocalPersistence blocked by iframe, falling back to inMemory:", err);
                    return setPersistence(auth, inMemoryPersistence);
                });

            } catch (err) {
                console.error("Auth init error:", err);
            }
        };
        initAuth();

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("Auth State Changed: ", firebaseUser ? `User: ${firebaseUser.uid} (${firebaseUser.email})` : "No user authenticated");
            const handleAuthState = async () => {
                try {
                    if (firebaseUser) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL
                        });

                        // Fetch profile
                        try {
                            const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
                            if (docSnap.exists()) {
                                setProfile(docSnap.data() as UserProfile);
                            } else {
                                setProfile(null);
                            }
                        } catch (err: any) {
                            // If we fail to get profile because we are offline, don't crash the app
                            if (err.message?.includes("offline") || err.message?.includes("client is offline")) {
                                console.warn("Firestore is offline, continuing with limited profile: ", err.message);
                                setProfile(null);
                            } else {
                                handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
                            }
                        }
                    } else {
                        setUser(null);
                        setProfile(null);
                    }
                } catch (err) {
                    console.error("Auth state change error:", err);
                } finally {
                    if (isFirstAuthCheck) {
                        console.log("Auth state change first check - loading set to false");
                        setLoading(false);
                        isFirstAuthCheck = false;
                    }
                }
            };

            handleAuthState();
        }, (error) => {
            console.error("onAuthStateChanged error:", error);
            setLoading(false);
        });

        // Fallback for environments where auth state takes too long to initialize
        const timeout = setTimeout(() => {
            if (isFirstAuthCheck) {
                console.log("Auth loading fallback triggered");
                setLoading(false);
                isFirstAuthCheck = false;
            }
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const [isActionInProgress, setIsActionInProgress] = useState(false);

    const login = async () => {
        if (isActionInProgress) {
            console.warn("Login action already in progress - skipping.");
            return;
        }
        
        console.log("Starting Google Login Flow (Popup)...");
        setIsActionInProgress(true);
        
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ 
                prompt: 'select_account'
            });
            
            const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);

            if (result?.user) {
                setUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                });
            }
        } catch (error: any) {
            console.error("Popup Login Error:", error.code || error.message);
            if (error.code === 'auth/popup-blocked') {
                throw new Error("POPUP_BLOCKED: Votre navigateur bloque la fenêtre de connexion. Utilisez le bouton 'Ouvrir en plein écran'.");
            }
            if (error.message === "AUTH_TIMEOUT") {
                throw new Error("AUTH_TIMEOUT: Délai dépassé. L'environnement bloque peut-être la connexion.");
            }
            throw error;
        } finally {
            setTimeout(() => setIsActionInProgress(false), 1500);
        }
    };

    const loginWithRedirect = async () => {
        console.log("Starting Google Login Flow (Redirect)...");
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            await import("firebase/auth").then(m => m.signInWithRedirect(auth, provider));
        } catch (error) {
            console.error("Redirect Login Error:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        if (isActionInProgress) return;
        setIsActionInProgress(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, pass);

            if (result?.user) {
                setUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                });
            }
        } catch (error: any) {
            console.error("Email Login Error:", error.code || error.message);
            if (error.message === "AUTH_TIMEOUT") {
                throw new Error("La connexion a pris trop de temps. Veuillez ouvrir l'app hors de l'iframe.");
            }
            throw error;
        } finally {
            setTimeout(() => setIsActionInProgress(false), 1000);
        }
    };

    const signupWithEmail = async (email: string, pass: string) => {
        if (isActionInProgress) return;
        setIsActionInProgress(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, pass);

            if (result?.user) {
                setUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                });
            }
        } catch (error: any) {
            console.error("Email Signup Error:", error.code || error.message);
            if (error.message === "AUTH_TIMEOUT") {
                throw new Error("L'inscription a pris trop de temps. Veuillez ouvrir l'app en plein écran.");
            }
            throw error;
        } finally {
            setTimeout(() => setIsActionInProgress(false), 1000);
        }
    };

    const completeProfile = async (profileData: { 
        fullName: string; 
        occupation: string; 
        email: string;
        phone: string;
        city: string;
        role: string;
        about?: string;
    }) => {
        if (!user) return;
        try {
            const newProfile = {
                ...profileData,
                uid: user.uid,
                completedAt: serverTimestamp()
            };

            // Timeout for Firestore write
            const writePromise = setDoc(doc(db, "users", user.uid), newProfile);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("FIRESTORE_TIMEOUT")), 15000)
            );

            await Promise.race([writePromise, timeoutPromise]);
            setProfile(newProfile as any);
        } catch (err: any) {
            console.error("Complete Profile error:", err);
            if (err.message === "FIRESTORE_TIMEOUT") {
                throw new Error("Le serveur ne répond pas. Veuillez ouvrir l'application dans un nouvel onglet.");
            }
            handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const isAdmin = user?.email?.toLowerCase() === 'jirehstar6@gmail.com';

    return (
        <AuthContext.Provider value={{ user, profile, login, loginWithRedirect, loginWithEmail, signupWithEmail, logout, completeProfile, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
