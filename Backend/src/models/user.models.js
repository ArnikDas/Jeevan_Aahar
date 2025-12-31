import mongoose, { Schema } from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Read-only fields (set on first login, never updated)
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["donor", "recipient"],
      required: true,
    },
    // Editable profile completion fields
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    landmark: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    avatar: {
      type: String,
    },
    // Profile completion status
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", ProfileSchema);

