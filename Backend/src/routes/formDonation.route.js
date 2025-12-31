import { Router } from "express";
import {
  createDonationForm,
  getAllDonations,
  acceptDonation,
  completeDonation,
} from "../controllers/donationcontrollers.js";

import {
  authenticateAndLoadProfile,
  requireCompletedProfile
} from "../middlewares/firebase.js";

const router = Router();

/**
 * Donation routes with profile completion guard
 * 
 * Both routes require:
 * 1. Firebase authentication (authenticateAndLoadProfile)
 * 2. Completed profile (requireCompletedProfile)
 */

router
  .route("/")
  .post(authenticateAndLoadProfile, requireCompletedProfile, createDonationForm)
  .get(authenticateAndLoadProfile, getAllDonations);

// Accept donation (receiver only)
router.patch("/:id/accept", authenticateAndLoadProfile, requireCompletedProfile, acceptDonation);

// Complete donation (receiver who accepted only)
router.patch("/:id/complete", authenticateAndLoadProfile, requireCompletedProfile, completeDonation);


export default router;
