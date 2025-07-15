import { Router } from "express";
import {
  register,
  login,
  updateProfile,
  getUsers,
  updateStatus,
  googleRegister,
  getCreditData,
  addPaymentCredits,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const userRouter = Router();
userRouter.post("/register", register);
userRouter.post("/google-register", googleRegister);
userRouter.post("/login", login);
userRouter.patch("/updateProfile", auth, updateProfile);
userRouter.get("/", auth, getUsers);
userRouter.patch("/updateStatus/:userId", auth, updateStatus);
userRouter.get("/credit", auth, getCreditData);
userRouter.patch("/payment", auth, addPaymentCredits);

export default userRouter;
