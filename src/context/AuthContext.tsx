import React, { createContext, useContext, useState, useEffect } from "react";
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    User as FirebaseUser 
} from "firebase/auth";
import { auth } from "../lib/firebase";

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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                });

                // Fetch profile
                try {
                    const { doc, getDoc } = await import("firebase/firestore");
                    const { db } = await import("../lib/firebase");
                    const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (docSnap.exists()) {
                        setProfile(docSnap.data() as UserProfile);
                    } else {
                        setProfile(null);
                    }
                } catch (err) {
                    console.error("Error fetching profile:", err);
                }
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            if (error?.code !== 'auth/popup-closed-by-user') {
                console.error("Login Error:", error);
            }
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error: any) {
            console.error("Email Login Error:", error);
            throw error;
        }
    };

    const signupWithEmail = async (email: string, pass: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
        } catch (error: any) {
            console.error("Email Signup Error:", error);
            throw error;
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
            const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
            const { db } = await import("../lib/firebase");
            const newProfile = {
                ...profileData,
                uid: user.uid,
                completedAt: serverTimestamp()
            };
            await setDoc(doc(db, "users", user.uid), newProfile);
            setProfile(newProfile as any);
        } catch (err) {
            console.error("Complete Profile error:", err);
            throw err;
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
        <AuthContext.Provider value={{ user, profile, login, loginWithEmail, signupWithEmail, logout, completeProfile, loading, isAdmin }}>
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
