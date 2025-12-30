import mongoose, {Schema} from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, index: true },
  email: { type: String, required: true },

  role: {
    type: String,
    enum: ["donor", "recipient"],
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
