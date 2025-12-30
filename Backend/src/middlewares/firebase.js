import admin from "firebase-admin";
import {ApiError} from "../utils/api-error.js";

export const firebaseAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return new ApiError(401, "Unauthorized");
    }

    const token = header.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token, true);

    req.firebaseUser = decoded; // VERIFIED
    next();
  } catch {
    return new ApiError(401, "Unauthorized");
  }
};
