import mongoose from "mongoose";
import Session from "../models/Session.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import Class from "../models/Class.js";
import User from "../models/User.js";

/*
 * CRUD session
 * Get one session: getSessionById
 * Get all sessions of a class by class id: getAllSessionsByClassId
 * CUD student id with point to session: addStudentIdWithPointToSession, updatePointOfStudentInSession, deleteStudentIdWithPointFromSession
 */
const sessionController = {
  createSession: async (req, res) => {
    try {
      //get, validate, add to req.body class id
      const classId = req.params.classId;
      if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
        return handleError(res, 400, "Bad Request");
      }
      req.body.classId = classId;
      //check session index is unique
      const existingSession = await Session.findOne({
        classId: req.body.classId,
        $or: [
          { sessionIndex: req.body.sessionIndex },
          { sessionDate: req.body.sessionDate },
        ],
      });
      if (existingSession) {
        return handleError(
          res,
          400,
          "Session Index And Session Date Must Be Unique"
        );
      }
      //create session and update class in database
      const createdSession = await Session.create(req.body);
      await Class.findByIdAndUpdate(classId, {
        $push: { sessionIds: createdSession._id },
      });
      //return response with created session
      return handleSuccess(res, createdSession, 201, "Created Session");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getAllSessions: async (req, res) => {
    try {
      const sessions = await Session.find();
      return handleSuccess(res, sessions, 200, "Get All Sessions Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getSessionById: async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
        return handleError(res, 400, "Bad Request");
      }
      const sessionInfo = await Session.findById(sessionId);
      return handleSuccess(res, sessionInfo, 200, "Get One Session Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  updateSession: async (req, res) => {
    try {
      //get, validate session id
      const sessionId = req.params.sessionId;
      if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
        return handleError(res, 400, "Bad Request");
      }
      //if session not found
      let existingSession = await Session.findById(sessionId);
      if (!existingSession) {
        return handleError(res, 404, "Session Not Found");
      }
      //check session index, session date is unique
      existingSession = await Session.findOne({
        classId: req.body.classId,
        $or: [
          { sessionIndex: req.body.sessionIndex },
          { sessionDate: req.body.sessionDate },
        ],
      });
      if (existingSession) {
        return handleError(
          res,
          400,
          "Session Index And Session Date Must Be Unique"
        );
      }
      //update session
      const updatedSession = await Session.findByIdAndUpdate(
        sessionId,
        req.body,
        {
          new: true,
        }
      );
      return handleSuccess(res, updatedSession, 200, "Updated Session");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  deleteSession: async (req, res) => {
    try {
      //get, validate session id
      const sessionId = req.params.sessionId;
      if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
        return handleError(res, 400, "Bad Request");
      }
      //if session not found
      const existingSession = await Session.findById(sessionId);
      if (!existingSession) {
        return handleError(res, 404, "Session Not Found");
      }
      //delete session and update class in database
      const deletedSession = await Session.findByIdAndDelete(sessionId);
      await Class.findByIdAndUpdate(deletedSession.classId, {
        $pull: { sessionIds: deletedSession._id },
      });
      return handleSuccess(res, deletedSession, 200, "Deleted Session");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getSessionById: async (req, res) => {
    try {
      //get, validate session id
      const sessionId = req.params.sessionId;
      if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
        return handleError(res, 400, "Bad Request");
      }
      const sessionInfo = await Session.findById(sessionId);
      //if session not found
      if (!sessionInfo) {
        return handleError(res, 404, "Session Not Found");
      }
      return handleSuccess(res, sessionInfo, 200, "Get One Session Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getAllSessionsByClassId: async (req, res) => {
    try {
      //get, validate class id
      const classId = req.params.classId;
      if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
        return handleError(res, 400, "Bad Request");
      }
      //if class not found
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        return handleError(res, 404, "Class Not Found");
      }
      const sessions = await Session.find({ classId });
      return handleSuccess(
        res,
        sessions,
        200,
        "Get All Sessions Of A Class By Class Id Success"
      );
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
};

export default sessionController;
