import express from "express";
import artServices from "./models/art-services.js";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/art", (req, res) => {
  const artToAdd = req.body;
  console.log(artToAdd)
  if (!artToAdd["title"] || artToAdd["title"] === "" ){
    console.log("Missing title");
    res.status(400).send("Missing title")
  }
  if (!artToAdd["picture"] || artToAdd["picture"] === ""){
    console.log("Missing picture");
    res.status(400).send("Missing picture")
  }
  if (!artToAdd["measurements"]["height"]|| !artToAdd["measurements"]["width"]){
    console.log("Missing measurements");
    res.status(400).send("Missing measurements")
  }
  artServices.addArt(artToAdd).then(
      (result) => res.status(201).send(result)
  ).catch((error)=>{
      console.log(error);
      res.status(500).end();
  })
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
