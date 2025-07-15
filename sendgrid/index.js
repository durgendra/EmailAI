const express = require("express");
const multer = require("multer");

const upload = multer();
const app = express();

app.post("/email", upload.none(), (req, res) => {
  const body = req.body;

  console.log(`From: ${body.from}`);
  console.log(`To: ${body.to}`);
  console.log(`Subject: ${body.subject}`);
  console.log(`Text: ${body.text}`);

  return res.status(200).send();
});

app.listen(3000, console.log("Express app listening on port 3000."));
