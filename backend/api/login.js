import serverless from "serverless-http";
import app from "../backend.js";
import { loginUser } from "../auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  await loginUser(req, res);
}
