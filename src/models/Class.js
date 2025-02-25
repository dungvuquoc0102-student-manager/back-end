import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    //name of class. Ex: " Unique Class 1"
    name: {
      type: String,
      required: true,
      unique: true,
    },
    //list id of sessions in class. Ex: ["ssId1", "ssId2", "ssId3"]
    sessionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
    //list id of students in class. Ex: ["stId1", "stId2", "stId3"]
    studentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    //list id of teaching assistants in class. Ex: ["tAId1", "tAId2", "tAId3"]
    teachingAssistantIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  //add createdAt and updatedAt fields and remove _v field
  {
    timestamps: true,
    versionKey: false,
  }
);

const Class = mongoose.model("Class", ClassSchema);

export default Class;
