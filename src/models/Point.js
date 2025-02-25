import mongoose from "mongoose";

const PointSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendancePoint: {
    type: Number,
    default: 0,
  },
  homeworkPoint: {
    type: Number,
    default: 0,
  },
  midTestPoint: {
    type: Number,
    default: 0,
  },
  finalProjectPoint: {
    type: Number,
    default: 0,
  },
  homeworkCompletionTime: {
    type: Date,
  },
});

const Point = mongoose.model("Point", PointSchema);

export default Point;
