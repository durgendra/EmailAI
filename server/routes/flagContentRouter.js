import { Router } from "express";

import { createFlagContent } from "../controllers/flagcontent.js";
import auth from "../middleware/auth.js";

const flagContentRouter = Router();

flagContentRouter.post("/post", auth, createFlagContent);
// textBookRouter.get("/", getTextBooks);

export default flagContentRouter;
