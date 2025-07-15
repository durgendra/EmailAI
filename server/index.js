import express from "express";
import dontenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import lampikidsRouter from "./routes/lampikidsRouter.js";
import flagContentRouter from "./routes/flagContentRouter.js";
import mongoose from "mongoose";
import { MailListener } from "mail-listener5";
import EmailReplyParser from "email-reply-parser";
import { NodeHtmlMarkdown } from "node-html-markdown";

dontenv.config();

const port = process.env.PORT || 8080;

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  next();
});

app.use(express.json({ limit: "10mb" }));

app.use("/user", userRouter);
app.use("/lampi", lampikidsRouter);
app.use("/flag", flagContentRouter);
app.get("/", (req, res) => res.json({ message: "Welcome to our API" }));
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Not Found" })
);
var nhm = new NodeHtmlMarkdown();
var emailParser = new EmailReplyParser();
var mailListener = new MailListener({
  username: "example@gmail.com",
  password: "XX",
  host: "imappro.zoho.in",
  port: 993,
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  debug: null, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`,
  attachments: false, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" },
});

mailListener.on("mail", (mail, seqno, attributes) => {
  console.log("New email received:", mail);
  var htmlCode = "";
  if (mail.html) {
    htmlCode = mail.html;
  } else {
    htmlCode = mail.textAsHtml;
  }
  console.log("HTML data1:", htmlCode);
  const md = nhm.translate(htmlCode);
  // const md = converter.makeMarkdown(htmlCode, dom.window.document);
  console.log("textMarkdown", md);
  const textParser = emailParser.read(md);
  console.log("Parsed text", textParser.getVisibleText());
  console.log("subject", mail.subject);
  console.log("from", mail.from);
  console.log("to", mail.to);
  console.log("cc", mail.cc);
  console.log("messageId", mail.messageId);
  console.log("ReplyId", mail.inReplyTo);
  console.log("references", mail.references);

  // Process email data, potentially store it for API retrieval
});

mailListener.on("error", (err) => {
  console.error("Mail listener error:", err);
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT);

    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
    mailListener.start();
  } catch (error) {
    console.log(error);
  }
};

startServer();
