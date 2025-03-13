import express from "express";
import connectDB from "./src/config/connectDB.js";
import router from "./src/routes/index.js";
import { handleError } from "./src/utils/handleResponse.js";
import cors from "cors";
const app = express();

//use before middleware
//use middleware to parse request (application/json) to req.body as an object
app.use(express.json());
//use middleware to parse request (application/x-www-form-urlencoded) to req.body as an object
app.use(express.urlencoded({ extended: true }));
//use middleware to allow request from other domain
app.use(cors());

//user router to route for app
app.use(router);

//use after middleware
//use middleware to handle error 404 when path not found
app.use((req, res) => {
  return handleError(res, 404, "Page Not Found");
});

//connect db
await connectDB();

//run server then server serve on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
