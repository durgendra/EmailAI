import tryCatch from "./utils/tryCatch.js";
import FlagContent from "../models/FlagContent.js";

export const createFlagContent = tryCatch(async (req, res) => {
  const { id: uid, name: uName } = req.user;
  const newFlagContent = new FlagContent({ ...req.body, uid, uName });
  console.log("content", newFlagContent);
  await newFlagContent.save();
  res.status(201).json({
    success: true,
    result: {
      posted: "true",
    },
  });
});

// export const getTextBooks = tryCatch(async (req, res) => {
//   const textBooks = await TextBook.find().sort({ _id: 1 });
//   res.status(200).json({ success: true, result: textBooks });
// });
