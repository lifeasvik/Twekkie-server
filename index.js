const express = require("express");
const cors = require("cors");
const monk = require("monk");
const app = express();
const db = monk("localhost/twekkie");

const tweets = db.get("tweets");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

function isValidTweet(validtweet) {
  return (
    validtweet.name &&
    validtweet.name.toString().trim() !== "" &&
    validtweet.content &&
    validtweet.content.toString().trim() !== ""
  );
}

app.post("/tweet", (req, res) => {
  if (isValidTweet(req, res)) {
    //insert into db
    const newtweet = {
      name: req.body.name.toString(),
      content: req.body.content.toString(),
      created: new Date(),
    };
    tweets.insert(newtweet).then((createdTweet) => {
      res.json(createdtweet);
    });
  } else {
    res.status(422);
    res.json({
      message: "Name and Tweet are required",
    });
  }
});

app.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
