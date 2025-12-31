import admin from "../config/firebaseAdmin.js";
import Profile from "../models/user.models.js";

/**
 * Firebase Authentication + Auto-Create Profile Middleware
 * 
 * This middleware:
 * 1. Verifies Firebase ID token
 * 2. Extracts uid, name, email from Firebase
 * 3. Finds or creates Profile in MongoDB
 * 4. Attaches profile to req.profile
 */
export const authenticateAndLoadProfile = async (req, res, next) => {
  try {
    // 1. Verify Firebase token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided"
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 2. Extract Firebase user data
    const { uid, name, email } = decodedToken;

    // 3. Find existing profile
    let profile = await Profile.findOne({ uid });

    // 4. Auto-create profile on first login
    if (!profile) {
      // Role can come from query param (GET) or body (PATCH)
      const role = req.query.role || req.body.role;

      if (!role || !["donor", "recipient"].includes(role)) {
        // Return 404 if profile doesn't exist and no role provided
        // This allows frontend to handle first login appropriately
        return res.status(404).json({
          success: false,
          message: "Profile not found. Please provide role parameter on first login.",
          requiresRole: true,
        });
      }

      profile = await Profile.create({
        uid,
        name: name || decodedToken.displayName || "User",
        email: email || decodedToken.email,
        role,
        isCompleted: false,
      });

      console.log(`✅ New profile created for ${email} as ${role}`);
    }

    // 5. Attach profile to request
    req.profile = profile;
    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    console.error("❌ Authentication failed:", error.message);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        success: false,
        message: "Authentication token expired. Please sign in again.",
      });
    }

    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

/**
 * Profile Completion Guard Middleware
 * 
 * Blocks access to donation routes if profile is not completed
 */
export const requireCompletedProfile = (req, res, next) => {
  if (!req.profile) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.profile.isCompleted) {
    return res.status(403).json({
      success: false,
      message: "Profile completion required to access this resource",
      isCompleted: false,
    });
  }

  next();
};
