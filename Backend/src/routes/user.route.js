import { Router } from "express";
import { getProfile, updateProfile, getUserByUid } from "../controllers/user.controller.js";
import { authenticateAndLoadProfile } from "../middlewares/firebase.js";

const router = Router();

/**
 * Single unified profile route
 * 
 * GET /profile - Get profile preview (auto-filled + isCompleted)
 * PATCH /profile - Update profile completion fields
 * GET /profile/:uid - Get public profile by UID
 * 
 * Both routes use authenticateAndLoadProfile middleware which:
 * - Verifies Firebase token
 * - Auto-creates profile on first login
 * - Loads profile into req.profile
 */

router.get("/profile", authenticateAndLoadProfile, getProfile);
router.patch("/profile", authenticateAndLoadProfile, updateProfile);
router.get("/profile/:uid", getUserByUid); // Public endpoint, no auth required

export default router;

