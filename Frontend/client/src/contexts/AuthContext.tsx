import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { getUserProfile, UserProfile } from "@/services/userService";

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (firebaseUser: User) => {
        try {
            const profile = await getUserProfile();
            setUserProfile(profile);
        } catch (error: any) {
            // Silently handle 404/403 - profile doesn't exist yet for new users
            const errorMessage = error.message || "";
            if (
                errorMessage.includes("404") ||
                errorMessage.includes("not found") ||
                errorMessage.includes("403") ||
                errorMessage.includes("Access denied")
            ) {
                setUserProfile(null);
            } else {
                console.error("Error fetching user profile:", error);
                setUserProfile(null);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                await fetchUserProfile(firebaseUser);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const refreshUserProfile = async () => {
        if (user) {
            await fetchUserProfile(user);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setUserProfile(null);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, signOut, refreshUserProfile }}>
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
