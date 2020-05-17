const express = require("express");
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");

const app = express();

const db = monk("localhost/twekkie");
const tweets = db.get("tweets");
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 30 * 1000, //30 seconds
    max: 1, //limit each IP to 1 requests per windowMs
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.get("/tweets", (req, res) => {
  tweets.find().then((tweets) => {
    res.json(tweets);
  });
  then;
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
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
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
