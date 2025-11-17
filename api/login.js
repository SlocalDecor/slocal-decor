import serverless from "serverless-http";
import app from "../backend/backend.js"; // your Express app with routes

export const handler = serverless(app);
