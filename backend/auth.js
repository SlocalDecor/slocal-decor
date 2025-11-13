import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userServices from "./models/user-services.js";
import User from "./models/user.js";

function generateAccessToken(payload) {
  return new Promise((resolve, reject) => {
    console.log(payload);
    jwt.sign(
      { email: payload.email, id: payload.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        console.log(decoded)
        req.user = decoded;
        next();
      } else {
        console.log("JWT error:", error);
        res.status(401).end();
      }
    });
  }
}

export function loginUser(req, res) {
  const user = req.body; // from form
  console.log(user);
  console.log(user["email"]);
  const email = user["email"];
  let id;
  userServices.findUserForLogin(user["email"]).then((users) => {
    console.log(users);
    const retrievedUser = users[0];
    console.log(retrievedUser);
    if (!retrievedUser) {
      // invalid username
      console.log("says it doesnt exist");
      res.status(401).send("Unauthorized");
    } else {
        id = retrievedUser._id.toString()
      bcrypt
        .compare(user["password"], retrievedUser.passwordHash)
        .then((matched) => {
          console.log("matched",matched);
          if (matched) {
            const payload = {
                id: id,
                email: email,
              };
            generateAccessToken(payload).then((token) => {
              res.status(200).send({ token: token });
            });
          } else {
            // invalid password
            res.status(401).send("Unauthorized");
          }
        })
        .catch(() => {
          res.status(401).send("Unauthorized");
        });
    }
  });
}
