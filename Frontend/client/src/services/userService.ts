import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    role: "donor" | "recipient";
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Create a new user profile in Firestore
 */
export async function createUserProfile(
    userId: string,
    profileData: {
        name: string;
        email: string;
        role: "donor" | "recipient";
    }
): Promise<void> {
    const userRef = doc(db, "users", userId);
    const timestamp = new Date();

    await setDoc(userRef, {
        uid: userId,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        createdAt: timestamp,
        updatedAt: timestamp,
    });
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        return {
            uid: data.uid,
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    return null;
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, "uid" | "createdAt">>
): Promise<void> {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
    });
}
