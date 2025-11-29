import express from "express";
import bcrypt from "bcrypt";
import artServices from "./models/art-services.js";
import userServices from "./models/user-services.js";
import User from "./models/user.js";
import { authenticateUser, loginUser } from "./auth.js";
import cors from "cors";
import { connectDB } from "./db.js";
import cloudinary from "./cloudinary.js";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

await connectDB();

const app = express();

// const corsOptions = {
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// // Use CORS middleware
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/art", authenticateUser, (req, res) => {
  let owner;
  if (req.query.userSpecific === "true") {
    owner = req.user.id;
  }
  const artType = req.query["artType"];

  artServices
    .getArt(owner, artType)
    .then((result) => {
      res.status(200).send({ art_list: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Art not found");
    });
});

app.get("/api/art/:id", authenticateUser, (req, res) => {
  const artId = req.params.id;
  if (!artId) return res.status(400).send("Missing art ID");
  artServices
    .findArtById(artId)
    .then((result) => {
      if (!result) return res.status(404).send("Art not found");
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/art", upload.single("picture"), async (req, res) => {
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

  if (!artToAdd["measurements"]) {
    console.log("Missing measurements");
    return res.status(400).send("Missing measurements");
  }
  artToAdd["measurements"] = JSON.parse(artToAdd["measurements"]);
  if (
    !artToAdd["measurements"]["height"] ||
    !artToAdd["measurements"]["width"]
  ) {
    console.log("Missing height and/or width");
    return res.status(400).send("Missing height and/or width");
  }

  function uploadImage(buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "images" },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
      stream.end(buffer);
    });
  }

  if (!req.file) {
    console.log("Missing picture file");
    return res.status(400).send("Missing picture file");
  }
  const uploaded = await uploadImage(req.file.buffer);
  artToAdd.picture = uploaded.secure_url;
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

app.delete("/api/art/:id", authenticateUser, (req, res) => {
  const artId = req.params.id;
  if (!artId) {
    console.log("Missing art ID");
    return res.status(400).send("Missing art ID");
  }
  artServices
    .deleteArt(artId)
    .then((result) => {
      if (!result) {
        return res.status(404).send("Art not found");
      }
      console.log(`Deleted art with ID: ${artId}`);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error("Error deleting art:", err);
      res.status(500).send(err);
    });
});

app.get("/api/users/email/:email", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send(user);
  } catch (err) {
    console.error("Error fetching user by email:", err);
    return res.status(500).send({ error: "Server error occurred" });
  }
});

app.delete("/api/users/:id", authenticateUser, (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    console.log("Missing user ID");
    return res.status(400).send("Missing user ID");
  }
  userServices
    .deleteUser(userId)
    .then((result) => {
      if (!result) {
        return res.status(404).send("User not found");
      }
      console.log(`Deleted user with ID: ${userId}`);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      res.status(500).send(err);
    });
});

app.get("/api/users", authenticateUser, (req, res) => {
  userServices
    .getUsers()
    .then((result) => {
      if (!result) {
        return res.status(404).send("User not found");
      }
      console.log(`Found users`);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).send(err);
    });
});

app.get("/api/users/:id", authenticateUser, (req, res) => {
  const id = req.params["id"];
  userServices
    .findUserById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).send("User not found");
      }
      console.log(`Found users`);
      res.status(200).send(result[0]);
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).send(err);
    });
});

// transfer ownership of an art piece to another user
app.patch("/api/art/:id/transfer", authenticateUser, async (req, res) => {
  const artId = req.params.id;
  const { newOwner } = req.body;

  if (!artId) return res.status(400).send("Missing art ID");
  if (!newOwner) return res.status(400).send("Missing newOwner in body");

  try {
    const art = await artServices.findArtById(artId);
    if (!art) return res.status(404).send("Art not found");

    // ensure only current owner can transfer
    const currentOwnerId = art.owner && art.owner.toString();
    if (currentOwnerId !== req.user.id) {
      return res
        .status(403)
        .send("Only the current owner can transfer ownership");
    }

    // resolve newOwner: accept ObjectId string, email, or display name
    let newOwnerId = newOwner;
    // if not a 24-hex ObjectId, try to resolve by email, then by name
    if (!/^[0-9a-fA-F]{24}$/.test(String(newOwner))) {
      let userDoc = await User.findOne({ email: String(newOwner) });
      if (!userDoc) {
        userDoc = await User.findOne({ name: String(newOwner) });
      }
      if (!userDoc) {
        return res
          .status(404)
          .send("New owner not found by id, email, or name");
      }
      newOwnerId = userDoc._id.toString();
    }

    // update art owner
    const updatedArt = await artServices.updateOwner(artId, newOwnerId);

    // remove art from previous owner's postedArt and add to new owner's postedArt
    await User.findByIdAndUpdate(currentOwnerId, {
      $pull: { postedArt: artId },
    });
    await User.findByIdAndUpdate(newOwnerId, { $push: { postedArt: artId } });

    res.status(200).send(updatedArt);
  } catch (err) {
    console.error("Error transferring ownership:", err);
    res.status(500).send(err);
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// for log in
app.post("/api/signup", (req, res) => {
  const userToAdd = req.body;
  let newUser = {};
  if (!userToAdd["name"] || userToAdd["name"] === "") {
    console.log("Invalid or missing name");
    return res.status(400).send("Invalid or missing name");
  }
  newUser["name"] = userToAdd["name"];
  if (
    !userToAdd["email"] ||
    userToAdd["email"] === "" ||
    !isValidEmail(userToAdd["email"])
  ) {
    console.log("Invalid or missing email");
    return res.status(400).send("Invalid or missing email");
  }
  newUser["email"] = userToAdd["email"];
  if (!userToAdd["phone"]) {
    console.log("Missing phone number");
    return res.status(400).send("Missing phone number");
  }
  newUser["phone"] = userToAdd["phone"];
  if (!userToAdd["password"] || userToAdd["password"].length < 8) {
    console.log("Missing password");
    return res.status(400).send("Password should be at least 8 characters");
  }
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(userToAdd["password"], salt))
    .then((hashedPassword) => {
      newUser["passwordHash"] = hashedPassword;
      console.log(newUser);
      return userServices.addUser(newUser);
    })
    .then((result) => res.status(201).send(result))
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
});

app.post("/api/login", loginUser);

app.post("/api/logout", (req, res) => {
  return res.sendStatus(200);
});

//for saved art!!
app.post("/api/art/:id/save", authenticateUser, async (req, res) => {
  const artId = req.params.id;
  const userId = req.user.id; 

  if (!artId) {
    return res.status(400).send("Missing art ID");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedArt: artId } }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send({ savedArt: updatedUser.savedArt });
  } catch (err) {
    console.error("Error saving art:", err);
    return res.status(500).send("Failed to save art");
  }
});

if (process.env.VERCEL_ENV === undefined) {
  const port = 8000;
  app.listen(port, () => {
    console.log(`Local API server running on http://localhost:${port}`);
  });
}

export default app;
