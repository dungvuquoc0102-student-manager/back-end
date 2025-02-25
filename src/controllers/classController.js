import mongoose from "mongoose";
import Class from "../models/Class.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import User from "../models/User.js";

/*
 * CRUD Class: createClass, getAllClasses, updateClass, deleteClass
 * Get one : getClassById
 * Add, Remove user to class: addUserToClass, removeUserFromClass
 */

const classController = {
  createClass: async (req, res) => {
    try {
      //check class name is unique
      const existingClass = await Class.findOne({ name: req.body.name });
      if (existingClass) {
        return handleError(res, 400, "Class Name Already Exists");
      }
      const createdClass = await Class.create(req.body);
      return handleSuccess(res, createdClass, 201, "Created Class");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getAllClasses: async (req, res) => {
    try {
      const classes = await Class.find();
      return handleSuccess(res, classes, 200, "Get All Classes Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  updateClass: async (req, res) => {
    try {
      const classId = req.params.classId;
      if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
        return handleError(res, 400, "Bad Request");
      }
      const updatedClass = await Class.findByIdAndUpdate(classId, req.body, {
        new: true,
      });
      //check for class not found
      if (!updatedClass) {
        return handleError(res, 404, "Class Not Found");
      }
      return handleSuccess(res, updatedClass, 200, "Updated Class");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  deleteClass: async (req, res) => {
    try {
      const classId = req.params.classId;
      if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
        return handleError(res, 400, "Bad Request");
      }
      //can't delete class if it has sessions
      const foundClass = await Class.findById(classId).populate("sessionIds");
      //check for class not found
      if (!foundClass) {
        return handleError(res, 404, "Class Not Found");
      }
      if (foundClass?.sessionIds?.length > 0) {
        return handleError(res, 400, "Can't Delete Class If It Has Sessions");
      }
      const deletedClass = await Class.findByIdAndDelete(classId);
      return handleSuccess(res, deletedClass, 200, "Deleted Class");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getClassById: async (req, res) => {
    try {
      const classId = req.params.classId;
      if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
        return handleError(res, 400, "Bad Request");
      }
      const classInfo = await Class.findById(classId);
      return handleSuccess(res, classInfo, 200, "Get One Class Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  addUserToClass: async (req, res) => {
    try {
      //get, validate, check existing class id
      const classId = req.params.classId;
      if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
        return handleError(res, 400, "Class Id Invalid");
      }
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        return handleError(res, 404, "Class Not Found");
      }
      //get, validate, check existing user id
      const userId = req.params.userId;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(res, 400, "User Id Invalid");
      }
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return handleError(res, 404, "User Not Found");
      }
      //don't allow adding user to class if user is admin
      if (existingUser.role === "admin") {
        return handleError(res, 400, "Can't Add Admin To Class");
      }
      //check if user already in class
      let updatedClass;
      if (existingUser.role === "student") {
        //check if student already in class
        if (existingClass.studentIds.includes(userId)) {
          return handleError(res, 400, "Student Already In Class");
        }
        //add user to class
        updatedClass = await Class.findByIdAndUpdate(
          classId,
          { $push: { studentIds: userId } },
          { new: true }
        );
      } else if (existingUser.role === "teachingAssistant") {
        //check if teaching assistant already in class
        if (existingClass.teachingAssistantIds.includes(userId)) {
          return handleError(res, 400, "Teaching Assistant Already In Class");
        }
        //add user to class
        updatedClass = await Class.findByIdAndUpdate(
          classId,
          { $push: { teachingAssistantIds: userId } },
          { new: true }
        );
      } else {
        return handleError(res, 400, "User Role Invalid");
      }
      //update user
      await User.findByIdAndUpdate(userId, { $push: { classIds: classId } });
      //return response with updated class
      return handleSuccess(res, updatedClass, 200, "Added User For Class");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  removeUserFromClass: async (req, res) => {
    try {
      //get, validate, check existing class id
      const classId = req.params.classId;
      if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
        return handleError(res, 400, "Class Id Invalid");
      }
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        return handleError(res, 404, "Class Not Found To Remove User");
      }
      //get, validate, check existing user id
      const userId = req.params.userId;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(res, 400, "User Id Invalid");
      }
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return handleError(res, 404, "User Not Found To Remove From Class");
      }
      //check if user not in class
      if (!existingUser.classIds.includes(classId)) {
        return handleError(res, 400, "User Not In Class To Remove");
      }
      //remove user from class
      let updatedClass;
      if (existingUser.role === "student") {
        updatedClass = await Class.findByIdAndUpdate(
          classId,
          { $pull: { studentIds: userId } },
          { new: true }
        );
      } else if (existingUser.role === "teachingAssistant") {
        updatedClass = await Class.findByIdAndUpdate(
          classId,
          { $pull: { teachingAssistantIds: userId } },
          { new: true }
        );
      } else {
        return handleError(res, 400, "User Role Invalid To Remove From Class");
      }
      //update user
      await User.findByIdAndUpdate(userId, { $pull: { classIds: classId } });
      //return response with updated class
      return handleSuccess(res, updatedClass, 200, "Removed User From Class");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
};

export default classController;
