import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { authenticateAndLoadProfile } from "../middlewares/firebase.js";

const router = Router();

/**
 * Single unified profile route
 * 
 * GET /profile - Get profile preview (auto-filled + isCompleted)
 * PATCH /profile - Update profile completion fields
 * 
 * Both routes use authenticateAndLoadProfile middleware which:
 * - Verifies Firebase token
 * - Auto-creates profile on first login
 * - Loads profile into req.profile
 */

router.get("/profile", authenticateAndLoadProfile, getProfile);
router.patch("/profile", authenticateAndLoadProfile, updateProfile);

export default router;
