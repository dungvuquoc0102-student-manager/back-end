import mongoose from "mongoose";
import Point from "../models/Point.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";

/*
 * CRUD point: createPoint, getAllPoints, updatePoint, deletePoint
 */

const pointController = {
  createPoint: async (req, res) => {
    try {
      //get, validate, check exist session id
      const sessionId = req.body.sessionId;
      if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
        return handleError(res, 400, "Session Id Invalid");
      }
      const existingSession = await Session.findById(sessionId);
      if (!existingSession) {
        return handleError(res, 404, "Session Not Found");
      }
      //get, validate, check exist student id
      const studentId = req.body.studentId;
      if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        return handleError(res, 400, "Student Id Invalid");
      }
      const existingStudent = await User.findById(studentId);
      if (!existingStudent) {
        return handleError(res, 404, "Student Not Found");
      }
      //check if student already have point
      const existingPoint = await Point.findOne({
        sessionId: sessionId,
        studentId: studentId,
      });
      if (existingPoint) {
        return handleError(res, 400, "Student Already Have Point");
      }
      //get, validate attendancePoint, homeworkPoint, midTestPoint, finalProjectPoint
      const {
        attendancePoint,
        homeworkPoint,
        midTestPoint,
        finalProjectPoint,
      } = req.body;
      if (attendancePoint && isNaN(attendancePoint)) {
        return handleError(res, 400, "Attendance Point Must Be Number");
      }
      if (homeworkPoint && isNaN(homeworkPoint)) {
        return handleError(res, 400, "Homework Point Must Be Number");
      }
      if (midTestPoint && isNaN(midTestPoint)) {
        return handleError(res, 400, "Mid Test Point Must Be Number");
      }
      if (finalProjectPoint && isNaN(finalProjectPoint)) {
        return handleError(res, 400, "Final Project Point Must Be Number");
      }
      if (
        attendancePoint < 0 ||
        attendancePoint > 10 ||
        homeworkPoint < 0 ||
        homeworkPoint > 10 ||
        midTestPoint < 0 ||
        midTestPoint > 10 ||
        finalProjectPoint < 0 ||
        finalProjectPoint > 10
      ) {
        return handleError(res, 400, "Point Must Be Between 0 And 10");
      }
      //create new point and update session
      const newPoint = await Point.create(req.body);
      await Session.findByIdAndUpdate(sessionId, {
        $push: { points: newPoint._id },
      });
      return handleSuccess(res, newPoint, 201, "Create Point Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  getAllPoints: async (req, res) => {
    try {
      const points = await Point.find();
      return handleSuccess(res, points, 200, "Get All Points Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  updatePoint: async (req, res) => {
    try {
      //get, validate, check exist point id
      const pointId = req.params.pointId;
      if (!pointId || !mongoose.Types.ObjectId.isValid(pointId)) {
        return handleError(res, 400, "Point Id Invalid");
      }
      const existingPoint = await Point.findById(pointId);
      if (!existingPoint) {
        return handleError(res, 404, "Point Not Found");
      }
      //get, validate, check exist session id if have in body
      const sessionId = req.body.sessionId;
      if (sessionId) {
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
          return handleError(res, 400, "Session Id Invalid");
        }
        const existingSession = await Session.findById(sessionId);
        if (!existingSession) {
          return handleError(res, 404, "Session Not Found");
        }
      }
      //get, validate, check exist student id if have in body
      const studentId = req.body.studentId;
      if (studentId) {
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
          return handleError(res, 400, "Student Id Invalid");
        }
        const existingStudent = await User.findById(studentId);
        if (!existingStudent) {
          return handleError(res, 404, "Student Not Found");
        }
      }
      //get, validate attendancePoint, homeworkPoint, midTestPoint, finalProjectPoint if have in body
      const {
        attendancePoint,
        homeworkPoint,
        midTestPoint,
        finalProjectPoint,
      } = req.body;
      if (attendancePoint && isNaN(attendancePoint)) {
        return handleError(res, 400, "Attendance Point Must Be Number");
      }
      if (homeworkPoint && isNaN(homeworkPoint)) {
        return handleError(res, 400, "Homework Point Must Be Number");
      }
      if (midTestPoint && isNaN(midTestPoint)) {
        return handleError(res, 400, "Mid Test Point Must Be Number");
      }
      if (finalProjectPoint && isNaN(finalProjectPoint)) {
        return handleError(res, 400, "Final Project Point Must Be Number");
      }
      if (
        attendancePoint < 0 ||
        attendancePoint > 10 ||
        homeworkPoint < 0 ||
        homeworkPoint > 10 ||
        midTestPoint < 0 ||
        midTestPoint > 10 ||
        finalProjectPoint < 0 ||
        finalProjectPoint > 10
      ) {
        return handleError(res, 400, "Point Must Be Between 0 And 10");
      }
      //update point
      const updatedPoint = await Point.findByIdAndUpdate(pointId, req.body, {
        new: true,
      });
      return handleSuccess(res, updatedPoint, 200, "Update Point Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
  deletePoint: async (req, res) => {
    try {
      //get, validate, check exist point id
      const pointId = req.params.pointId;
      if (!pointId || !mongoose.Types.ObjectId.isValid(pointId)) {
        return handleError(res, 400, "Point Id Invalid");
      }
      const existingPoint = await Point.findById(pointId);
      if (!existingPoint) {
        return handleError(res, 404, "Point Not Found");
      }
      //delete point and update session
      await Point.findByIdAndDelete(pointId);
      await Session.findByIdAndUpdate(existingPoint.sessionId, {
        $pull: { points: pointId },
      });
      return handleSuccess(res, null, 200, "Delete Point Success");
    } catch (error) {
      return handleError(res, 500, error?.message);
    }
  },
};

export default pointController;
