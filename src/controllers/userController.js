import mongoose from "mongoose";
import User from "../models/User.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import Class from "../models/Class.js";

/*
 * CRUD User: createUser, getAllUsers, updateUser, deleteUser
 * Get one : getUserById
 * Add class for user: addClassForUser
 * Remove class for user: removeClassForUser
 */

const userController = {
  createUser: async (req, res) => {
    try {
      //check email is unique
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return handleError(res, 400, "Email Already Exists");
      }
      //create user in database
      const createdUser = await User.create(req.body);
      //return response with created user
      return handleSuccess(res, createdUser, 201, "Created User");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      //read all users in database
      const users = await User.find();
      //return response with all users
      return handleSuccess(res, users, 200, "Get All Users Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  updateUser: async (req, res) => {
    try {
      //get user id
      const userId = req.params.userId;
      //validate user id
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(res, 400, "Bad Request");
      }
      //update user in database
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      //return response with updated user
      return handleSuccess(res, updatedUser, 200, "Updated User");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  deleteUser: async (req, res) => {
    try {
      //get user id
      const userId = req.params.userId;
      //validate user id
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(res, 400, "Bad Request");
      }
      //delete user in database
      const deletedUser = await User.findByIdAndDelete(userId);
      //return response with deleted user
      return handleSuccess(res, deletedUser, 200, "Deleted User");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getUserById: async (req, res) => {
    try {
      //get user id
      const userId = req.params.userId;
      //validate user id
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(res, 400, "Bad Request");
      }
      //find user in database
      const user = await User.findById(userId);
      //return response with user
      return handleSuccess(res, user, 200, "Get One User Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  addClassForUser: async (req, res) => {
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
      let existingUser = await User.findById(userId);
      if (!existingUser) {
        return handleError(res, 404, "User Not Found");
      }
      //check if user already has this class
      existingUser = await User.findById(userId);
      if (existingUser.classIds.includes(classId)) {
        return handleError(res, 400, "User Already Has This Class");
      }
      //don't allow to add class for admin
      if (existingUser.role === "admin") {
        return handleError(res, 400, "Admin Can't Have Class");
      }
      //add class to user and update class in database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: { classIds: classId },
        },
        { new: true }
      );
      if (updatedUser.role === "student") {
        await Class.findByIdAndUpdate(classId, {
          $push: { studentIds: userId },
        });
      } else if (updatedUser.role === "teachingAssistant") {
        await Class.findByIdAndUpdate(classId, {
          $push: { teachingAssistantIds: userId },
        });
      } else {
        return handleError(res, 400, "Role Not Found To Add Class");
      }
      //return response with updated user
      return handleSuccess(res, updatedUser, 200, "Added Class For User");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  removeClassForUser: async (req, res) => {
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
      let existingUser = await User.findById(userId);
      if (!existingUser) {
        return handleError(res, 404, "User Not Found");
      }
      //check if user doesn't have this class
      existingUser = await User.findById(userId);
      if (!existingUser.classIds.includes(classId)) {
        return handleError(res, 400, "User Doesn't Have This Class");
      }
      //don't allow to remove class for admin
      if (existingUser.role === "admin") {
        return handleError(res, 400, "Admin Can't Remove Class");
      }
      //remove class from user and update class in database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { classIds: classId },
        },
        { new: true }
      );
      if (updatedUser.role === "student") {
        await Class.findByIdAndUpdate(classId, {
          $pull: { studentIds: userId },
        });
      } else if (updatedUser.role === "teachingAssistant") {
        await Class.findByIdAndUpdate(classId, {
          $pull: { teachingAssistantIds: userId },
        });
      } else {
        return handleError(res, 400, "Role Not Found To Remove Class");
      }
      //return response with updated user
      return handleSuccess(res, updatedUser, 200, "Removed Class For User");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
};

export default userController;
