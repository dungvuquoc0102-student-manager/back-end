import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teachingAssistant", "admin"],
      required: true,
    },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    note: { type: String },
    classIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
