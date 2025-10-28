import express from "express";
import artServices from "./models/art-services.js";
import userServices from "./models/user-services.js";
import User from "./models/user.js";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/art", (req, res) => {
  const artToAdd = req.body;
  if (!artToAdd["title"] || artToAdd["title"] === "") {
    console.log("Missing title");
    return res.status(400).send("Missing title");
  }
  if (!artToAdd["owner"] || artToAdd["owner"] === "") {
    console.log("Missing owner field");
    return res.status(400).send("Missing owner field");
  }
  const owner = artToAdd["owner"];
  if (!artToAdd["picture"] || artToAdd["picture"] === "") {
    console.log("Missing picture");
    return res.status(400).send("Missing picture");
  }
  if (
    !artToAdd["measurements"] ||
    !artToAdd["measurements"]["height"] ||
    !artToAdd["measurements"]["width"]
  ) {
    console.log("Missing measurements");
    return res.status(400).send("Missing measurements");
  }
  artServices
    .addArt(artToAdd)
    .then((result) => {
      const newArtId = result._id;
      console.log(newArtId);
      return User.findByIdAndUpdate(
        owner,
        { $push: { postedArt: newArtId } },
        { new: true }
      );
    })
    .then((updatedUser) => res.status(201).send(updatedUser))
    .catch((err) => res.status(500).send(err));
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  if (!userToAdd["name"] || userToAdd["name"] === "") {
    console.log("Invalid or missing name");
    return res.status(400).send("Invalid or missing name");
  }
  if (
    !userToAdd["email"] ||
    userToAdd["email"] === "" ||
    !isValidEmail(userToAdd["email"])
  ) {
    console.log("Invalid or missing email");
    return res.status(400).send("Invalid or missing email");
  }
  if (!userToAdd["phone"]) {
    console.log("Missing phone number");
    return res.status(400).send("Missing phone number");
  }
  userServices
    .addUser(userToAdd)
    .then((result) => res.status(201).send(result))
    .catch((error) => {
      res.status(500).end();
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
