import { db } from "@/config/firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export interface FirestoreUser {
    uid: string;
    name: string;
    email: string;
    role: "donor" | "recipient";
    createdAt: any; // Firestore Timestamp
}

/**
 * Create a new user document in Firestore
 * Called during signup to store basic user info
 */
export async function createUserInFirestore(
    uid: string,
    name: string,
    email: string,
    role: "donor" | "recipient"
): Promise<void> {
    try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            uid,
            name,
            email,
            role,
            createdAt: serverTimestamp(),
        });
        console.log(`✅ User created in Firestore: ${email} as ${role}`);
    } catch (error) {
        console.error("Error creating user in Firestore:", error);
        throw error;
    }
}

/**
 * Get user document from Firestore
 * Used during signin to retrieve user role and basic info
 */
export async function getUserFromFirestore(uid: string): Promise<FirestoreUser | null> {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as FirestoreUser;
        } else {
            console.log("No user found in Firestore for uid:", uid);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user from Firestore:", error);
        throw error;
    }
}

/**
 * Update user role in Firestore
 * Optional: Can be used if role needs to be changed later
 */
export async function updateUserRoleInFirestore(
    uid: string,
    role: "donor" | "recipient"
): Promise<void> {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { role });
        console.log(`✅ User role updated in Firestore: ${uid} → ${role}`);
    } catch (error) {
        console.error("Error updating user role in Firestore:", error);
        throw error;
    }
}
