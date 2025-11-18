import serverless from "serverless-http";
import app from "../backend/backend.js";

export default async function handler(req, res) {
  await connectDB(); // ensures DB is ready
  return serverless(app)(req, res);
}
