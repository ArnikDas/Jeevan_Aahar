import { auth } from "@/config/firebase";

// Backend API base URL - update this based on your backend configuration
const _RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_BASE_URL = _RAW_API_BASE.replace(/\/+$/, "");

export interface DonationFormData {
    name: string;
    quantity: number;
    foodType: string;
    email: string;
    phone: string;
    address: string;
    preparedAt: Date;
    picture: string;
    additionalNote?: string;
    landmark?: string;
    pickupTime: Date;
    pickupDate: Date;
    latitude?: number;
    longitude?: number;
}

export interface PopulatedDonor {
    _id: string;
    uid: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    avatar?: string;
    role: "donor" | "recipient";
}

export interface PopulatedReceiver {
    _id: string;
    uid: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    avatar?: string;
    role: "donor" | "recipient";
}

export interface DonationResponse {
    donor: string | PopulatedDonor | undefined;
    _id: string;
    name: string;
    quantity: number;
    foodType: string;
    email: string;
    phone: string;
    address: string;
    preparedAt: Date;
    picture: string;
    additionalNote?: string;
    landmark?: string;
    pickupTime: Date;
    pickupDate: Date;
    latitude?: number;
    longitude?: number;
    status: "Pending" | "In Process" | "Completed";
    acceptedBy?: string | PopulatedReceiver;
    acceptedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

/**
 * Create a new donation
 */
export async function createDonation(
    donationData: DonationFormData
): Promise<ApiResponse<DonationResponse>> {
    try {
        // Get the current user's ID token for authentication
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        const url = `${API_BASE_URL}/api/v1/donation`;
        console.debug("createDonation: POST", url, { donationData, hasToken: !!token });

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(donationData),
        });

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            console.warn("createDonation: non-OK response", response.status, text);
            const errorData = (() => {
                try { return JSON.parse(text); } catch { return null; }
            })();
            throw new Error(
                (errorData && errorData.message) || `Failed to create donation: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.debug("createDonation: success", data);
        return data;
    } catch (error) {
        console.error("Error creating donation:", error);
        throw error;
    }
}

/**
 * Get all donations (placeholder - backend endpoint needs to be implemented)
 */
export async function getDonations(): Promise<ApiResponse<DonationResponse[]>> {
    try {
        const user = auth.currentUser;
        console.log("getDonations: auth.currentUser =", user ? `${user.uid} (${user.email})` : "NULL");

        const token = user ? await user.getIdToken() : null;
        console.log("getDonations: token =", token ? `${token.substring(0, 20)}...` : "NULL");

        const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };
        console.log("getDonations: headers =", headers);

        const response = await fetch(`${API_BASE_URL}/api/v1/donation`, {
            method: "GET",
            headers,
        });

        console.log("getDonations: response status =", response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `Failed to fetch donations: ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching donations:", error);
        throw error;
    }
}

/**
 * Convert image file to base64 string
 */
export function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Accept a donation (receiver only)
 * Changes status from Pending to In Process
 */
export async function acceptDonation(donationId: string): Promise<ApiResponse<DonationResponse>> {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        if (!token) {
            throw new Error("User not authenticated");
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/donation/${donationId}/accept`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `Failed to accept donation: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error accepting donation:", error);
        throw error;
    }
}

/**
 * Complete a donation (receiver who accepted only)
 * Changes status from In Process to Completed
 */
export async function completeDonation(donationId: string): Promise<ApiResponse<DonationResponse>> {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        if (!token) {
            throw new Error("User not authenticated");
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/donation/${donationId}/complete`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `Failed to complete donation: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error completing donation:", error);
        throw error;
    }
}
