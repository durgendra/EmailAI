import { Router } from "express";
import {
  takeShortPhoto,
  getGamePhoto,
  getChessPhoto,
  getShowPhoto,
  getVoicePhoto,
  getToyVoicePhoto,
  getVoice,
} from "../controllers/lampikids.js";

// import {
//   getFAQs,
//   createFAQ,
//   createQuiz,
//   createSum,
//   getUploadedDoc,
//   updateFAQStatus,
//   getFAQSingle,
// } from "../controllers/faq.js";
import auth from "../middleware/auth.js";

// const faqRouter = Router();
const lampikidsRouter = Router();

lampikidsRouter.post("/facts", auth, takeShortPhoto);
lampikidsRouter.post("/game", auth, getGamePhoto);
lampikidsRouter.post("/chess", auth, getChessPhoto);
lampikidsRouter.post("/show", auth, getShowPhoto);
lampikidsRouter.post("/voice", auth, getVoicePhoto);
lampikidsRouter.post("/toy-voice", auth, getToyVoicePhoto);
lampikidsRouter.post("/lampi-voice", auth, getVoice);

// faqRouter.post("/", auth, createFAQ);
// faqRouter.post("/quiz", auth, createQuiz);
// faqRouter.post("/summary", auth, createSum);
// faqRouter.get("/", auth, getFAQs);
// faqRouter.get("/uploadedDoc", auth, getUploadedDoc);
// faqRouter.patch("/updateFAQStatus/:objectId", auth, updateFAQStatus);
// faqRouter.get("/:faqId", auth, getFAQSingle);

// export default faqRouter;

export default lampikidsRouter;
