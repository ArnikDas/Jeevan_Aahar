import User from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";

export const attachUser = async (req, res, next) => {
  const { uid, email, name, picture } = req.firebaseUser;

  let user = await User.findOne({ uid });

  if (!user) {
    user = await User.create({
      uid,
      email,
      name,
      avatar: picture,
      role: "user"
    });
  }else{
    throw new ApiError(401, "user already exists");
  }

  req.user = user; // MongoDB user
  next();
};
