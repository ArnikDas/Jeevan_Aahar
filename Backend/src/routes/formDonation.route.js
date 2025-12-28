import { Router } from "express";
import { createDonationForm } from "../controllers/donationcontrollers.js";

const router = Router();

router.route("/").post(createDonationForm);

export default router;

