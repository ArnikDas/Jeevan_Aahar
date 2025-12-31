import { auth } from "@/config/firebase";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

export interface UserProfile {
    _id: string;
    uid: string;
    name: string; // Read-only
    email: string; // Read-only
    role: "donor" | "recipient"; // Read-only
    phone?: string;
    address?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    avatar?: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateUserProfileData {
    phone?: string;
    address?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    avatar?: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

/**
 * Get current user profile
 * 
 * On first login, include role as query parameter to auto-create profile
 */
export async function getUserProfile(role?: "donor" | "recipient", name?: string): Promise<UserProfile | null> {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        if (!token) {
            throw new Error("User not authenticated");
        }

        // Build URL with optional role query parameter for first login
        let url = `${API_BASE_URL}/api/v1/profile`;
        if (role) {
            url += `?role=${role}`;
            if (name) {
                url += `&name=${encodeURIComponent(name)}`;
            }
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch user profile: ${response.statusText}`);
        }

        const data: ApiResponse<UserProfile> = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

/**
 * Update user profile (profile completion)
 * 
 * Only updates: phone, address, latitude, longitude, avatar, landmark
 * Auto-sets isCompleted when all required fields are filled
 */
export async function updateUserProfile(
    updates: UpdateUserProfileData
): Promise<ApiResponse<UserProfile>> {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        if (!token) {
            throw new Error("User not authenticated");
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to update user profile: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}
