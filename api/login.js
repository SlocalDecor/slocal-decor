import serverless from "serverless-http";
import app from "../backend/backend.js";

export default serverless(app);
