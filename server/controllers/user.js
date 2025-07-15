import bcrypt from "bcrypt";
import User from "../models/User.js";
import paymentCredit from "../models/PaymentCredit.js";
import jwt from "jsonwebtoken";
import tryCatch from "./utils/tryCatch.js";
// import FAQ from "../models/FAQ.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = tryCatch(async (req, res) => {
  // console.log("got hit");
  const { name, email, password, ageChild } = req.body;
  // console.log(req.body);
  if (password.length < 2)
    return res.status(400).json({
      success: false,
      message: "Name must be 2 characters or more",
    });
  // console.log("password");
  const emailLowerCase = email.toLowerCase();
  const existedUser = await User.findOne({ email: emailLowerCase });
  if (existedUser)
    return res.status(400).json({
      success: false,
      message: "User already exists! Please use login screen",
    });
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: emailLowerCase,
    password: hashedPassword,
    ageChild: ageChild,
  });
  // console.log("created");
  const {
    _id: id,
    photoURL,
    role,
    active,
    hasParentalConsent,
    ktBalance,
  } = user;
  const token = jwt.sign({ id, name, photoURL }, process.env.JWT_SECRET, {
    expiresIn: "1500h",
  });
  // console.log("signed");
  res.status(201).json({
    success: true,
    result: {
      id,
      name,
      email: user.email,
      photoURL,
      token,
      role,
      active,
      hasParentalConsent,
      ktBalance,
    },
  });
});

export const googleRegister = tryCatch(async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const googleToken = token.length > 1000;
    if (googleToken) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const email = payload.email;
      const emailLowerCase = email.toLowerCase();
      const existedUser = await User.findOne({ email: emailLowerCase });
      if (existedUser) {
        const { _id: id, name, photoURL, role, active } = existedUser;
        return res.status(201).json({
          success: true,
          result: {
            id,
            name,
            email: existedUser.email,
            photoURL,
            role,
            active,
          },
        });
      }
      var randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      const user = await User.create({
        name: payload.name,
        email: payload.email,
        photoURL: payload.picture,
        password: hashedPassword,
      });
      const { _id: id, name, photoURL, role, active } = user;
      res.status(201).json({
        success: true,
        result: { id, name, email: user.email, photoURL, role, active },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Something is wrong with your authorization",
    });
  }
});

export const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  // console.log("login started");
  const emailLowerCase = email.toLowerCase();
  const existedUser = await User.findOne({ email: emailLowerCase });
  if (!existedUser)
    return res.status(404).json({
      success: false,
      message: "User does not exist! Please use new user screen",
    });
  const correctPassword = await bcrypt.compare(password, existedUser.password);
  if (!correctPassword)
    return res.status(400).json({ success: false, message: "Wrong Password" });

  const {
    _id: id,
    name,
    photoURL,
    active,
    ageChild,
    hasParentalConsent,
    ktBalance,
  } = existedUser;
  if (!active)
    return res.status(400).json({
      success: false,
      message: "This account has been suspended! Try to contact the admin",
    });
  const token = jwt.sign({ id, name, photoURL }, process.env.JWT_SECRET, {
    expiresIn: "1500h",
  });
  delete ageChild._index;
  res.status(200).json({
    success: true,
    result: {
      id,
      name,
      email: emailLowerCase,
      token,
      active,
      ageChild,
      hasParentalConsent,
      ktBalance,
    },
  });
});

export const updateProfile = tryCatch(async (req, res) => {
  // const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
  //   new: true,
  // });
  // console.log("body", req.body);
  const { hasParentalConsent } = req.body;
  const { id: uid } = req.user;
  await User.findByIdAndUpdate(uid, { hasParentalConsent });
  // console.log("Updated");

  // await FAQ.updateMany({ uid: id }, { uName: name, uPhoto: photoURL });

  // const token = jwt.sign({ id, name, photoURL }, process.env.JWT_SECRET, {
  //   expiresIn: "1h",
  // });
  res.status(200).json({ success: true, result: { hasParentalConsent } });
});

export const getUsers = tryCatch(async (req, res) => {
  const users = await User.find().sort({ _id: -1 });
  res.status(200).json({ success: true, result: users });
});

export const updateStatus = tryCatch(async (req, res) => {
  const { role, active } = req.body;
  await User.findByIdAndUpdate(req.params.userId, { role, active });
  res.status(200).json({ success: true, result: { _id: req.params.userId } });
});

export const getCreditData = tryCatch(async (req, res) => {
  const { id: uid, name: uName, photoURL: uPhoto } = req.user;
  const getCredit = await User.findById(req.user.id).select({
    email: 0,
    password: 0,
    photoURL: 0,
    role: 0,
    subscription: 0,
    keywords: 0,
    quizAnswer: 0,
    updatedAt: 0,
    __v: 0,
  });
  res.status(200).json({ success: true, result: getCredit });
});

export const addPaymentCredits = tryCatch(async (req, res) => {
  const { id: uid } = req.user;
  // console.log("Started");
  const { appCreditType } = req.body;
  // await User.findByIdAndUpdate(uid, { role, active });
  const currentUser = await User.findById(uid);
  const currentCredit = currentUser.ktBalance;
  console.log("Purchased", appCreditType);

  if (appCreditType === "weekly_1.99") {
    currentUser.ktBalance = currentCredit + 10;
  } else if (appCreditType === "monthly_5.99") {
    currentUser.ktBalance = currentCredit + 50;
  } else if (appCreditType === "yearly_49.99") {
    currentUser.ktBalance = currentCredit + 1000;
  } else {
    currentUser.ktBalance = currentCredit + 0;
  }
  if (currentUser.ktBalance > 1200) {
    currentUser.ktBalance = 1200;
  }
  // console.log("New Balance", currentUser.ktBalance);
  await currentUser.save();
  const newCredit = currentUser.ktBalance;
  const uEmail = currentUser.email;
  const updatedCredit = new paymentCredit({
    ...req.body,
    currentCredit,
    newCredit,
    uid,
    uEmail,
  });
  // console.log("content", updatedCredit);
  await updatedCredit.save();
  res.status(201).json({
    success: true,
    result: newCredit,
  });
});
