import Profile from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHadler.js";

/**
 * GET /api/v1/profile
 * 
 * Returns profile preview with auto-filled fields
 * Shows isCompleted status
 */
export const getProfile = asyncHandler(async (req, res) => {
    // Profile is already loaded by authenticateAndLoadProfile middleware
    const profile = req.profile;

    return res.status(200).json(
        new ApiResponse(200, profile, "Profile retrieved successfully")
    );
});

/**
 * PATCH /api/v1/profile
 * 
 * Updates ONLY editable fields:
 * - phone, address, latitude, longitude, avatar, landmark
 * 
 * Sets isCompleted = true when all required fields are filled
 * 
 * NEVER allows updating: uid, name, email, role
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const profile = req.profile;
    const { phone, address, latitude, longitude, avatar, landmark } = req.body;

    // Reject if no fields provided
    if (!phone && !address && latitude === undefined && longitude === undefined && !avatar && !landmark) {
        return res.status(400).json({
            success: false,
            message: "No fields to update. Provide at least one of: phone, address, latitude, longitude, avatar, landmark",
        });
    }

    // Reject if trying to update read-only fields
    const readOnlyFields = ["uid", "name", "email", "role"];
    const attemptedReadOnly = readOnlyFields.filter(field => req.body[field] !== undefined);

    if (attemptedReadOnly.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Cannot update read-only fields: ${attemptedReadOnly.join(", ")}`,
        });
    }

    // Update only provided fields
    if (phone !== undefined) profile.phone = phone;
    if (address !== undefined) profile.address = address;
    if (landmark !== undefined) profile.landmark = landmark;
    if (latitude !== undefined) profile.latitude = latitude;
    if (longitude !== undefined) profile.longitude = longitude;
    if (avatar !== undefined) profile.avatar = avatar;

    // Auto-set isCompleted when required fields are filled
    // Location (latitude/longitude) is now optional
    if (profile.phone && profile.address) {
        profile.isCompleted = true;
    }

    await profile.save();

    return res.status(200).json(
        new ApiResponse(200, profile, "Profile updated successfully")
    );
});
