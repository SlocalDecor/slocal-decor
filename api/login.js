import serverless from "serverless-http";
import app from "../backend/backend.js";
import { connectDB } from "../backend/db.js";

export default serverless(app);
