import { ApiError } from "../utils/api-error.js";

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return new ApiError(403, "Forbidden", {
        message: "You are not authorized to perform this action,`Access allowed only for ${role}`",
      });
    }
    next();
  };
};
