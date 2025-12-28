import { Router } from "express";
import { healthCheck } from "../controllers/healtcheck.controllers.js";

const router = Router();

router.route("/").get(healthCheck);
router.route("/instagram").get(healthCheck);


export default router;