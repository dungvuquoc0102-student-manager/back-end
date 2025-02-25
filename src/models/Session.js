import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  sessionIndex: { type: Number, required: true, unique: true },
  name: { type: String },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  sessionDate: { type: Date, required: true, unique: true },
  shift: {
    type: String,
    enums: ["morning", "afternoon", "evening"],
    required: true,
  },
  points: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Point",
    },
  ],
  title: { type: String },
  content: { type: String },
  note: { type: String },
});

// Middleware run before saving (pre-save hook)
SessionSchema.pre("save", function (next) {
  if (!this.name) {
    this.name = "Day " + this.sessionIndex;
  }
  next();
});

const Session = mongoose.model("Session", SessionSchema);

export default Session;
