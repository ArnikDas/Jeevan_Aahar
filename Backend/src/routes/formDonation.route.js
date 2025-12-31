import { Router } from "express";
import {
  createDonationForm,
  getAllDonations,
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


export default router;
