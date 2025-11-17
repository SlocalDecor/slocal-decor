import serverless from "serverless-http";
import app from "../backend/backend.js";

export const handler = serverless(app);
