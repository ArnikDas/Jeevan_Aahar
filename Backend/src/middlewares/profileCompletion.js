import User from "../models/user.models.js";

/**
 * Middleware to check if user has completed their profile
 * Must be used after firebaseAuth middleware
 */
export const requireProfileCompletion = async (req, res, next) => {
    try {
        const uid = req.firebaseUser.uid;

        const user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found",
            });
        }

        if (!user.profileCompleted) {
            return res.status(403).json({
                success: false,
                message: "Profile completion required",
                profileCompleted: false,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Profile completion check failed:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
