import tryCatch from "./utils/tryCatch.js";
import OpenAI from "openai";

import dontenv from "dotenv";
import User from "../models/User.js";

dontenv.config();

async function extractImage(imageBase64, code, lang, age) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    // max_retries: 3,
  });
  var systemTextAdd = "";
  var userTextAdd = "";

  // console.log("age", age);
  // console.log("lang", lang);

  if (lang != "english") {
    systemTextAdd =
      `""" Please provide texts in """` + lang + `""" language. """`;
    userTextAdd =
      `""" Please provide texts in """` + lang + `""" language. """`;
  }
  // console.log("system", systemTextAdd);
  // console.log("User", userTextAdd);

  const contentReading =
    ` """ You are a helpful assistant. When an image is provided, read the words and sentences in the image and write that exactly along with punctuation marks appears in the image.
    """ ` +
    systemTextAdd +
    `"""
    If the image does not have texts, respond with 'This image does not appear to contain texts.
  Please provide an image with texts'
  Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
   """ `;
  const textReading =
    ` """ I need exact texts with sentences and punctuations as it appears in the image. 
    """ ` + userTextAdd;

  const contentFact =
    ` """ You are a helpful assistant. When an image is provided, identify object in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., provide the exact name and type of that animal, plant, car, etc,. Also, provide few facts about the exact type or model in simple sentences which are suitable for a """` +
    age +
    `""" year old kid. If the image is a toy, don't provide facts on the toy but provide the facts on the thing that toy represents. 
    """ ` +
    systemTextAdd +
    `"""
    If you can't identify object in the image, respond with 'I can't identify the object.
    Please provide another object.'
  
    Here's an example for a elephant toy for a kid:
    The object in the image is a toy elephant. Here are a few facts about elephants: 1. Elephants are the largest land animals in the world. 2. They have long trunks that they use for smelling, breathing, trumpeting, drinking, and grabbing things. 3. Elephants have big ears that help them stay cool by flapping them to create a breeze. 4. They are very social animals and live in groups called herds. 5. Elephants are known for their excellent memory and intelligence.  
    
    Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
    """ `;
  const textFact =
    ` """ I need few facts about the main object in the image. 
      """ ` + userTextAdd;

  const contentDetail =
    ` """ You are a helpful assistant. When an image is provided, identify object in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., provide the exact name and type of that animal, plant, car, etc,. Also, provide few facts about where does that animal live and what do they do whole day. """` +
    age +
    `""" year old kid. If the image is a toy, don't provide facts on the toy but provide the facts about place of living and day in life on the thing that toy represents. 
    
    Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
    """ `;

  // +
  //   systemTextAdd +
  //   `"""
  // If you can't identify object in the image, respond with 'I can't identify the object.
  // Please provide another object. """ `;
  const textDetail =
    ` """ I need few facts about living place and day in life about the main object in the image. 
      """ ` + userTextAdd;

  const contentDraw = ` """ You are a helpful assistant. When an image is provided, identify the drawing made by a kid. Use your imagination to guess the drawing and related it to a plant, animal, natural object or household object. . The drawing could be something drawn by a kid. After that, provide few facts about the object, animal or plant represented in the drawing. 
  Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
  """`;
  // +
  //   systemTextAdd +
  //   `"""
  // If you can't identify object in the image, respond with 'I can't identify the object.
  // Please provide another object. """ `;
  const textDraw =
    ` """ Guess the drawing made by a kid and provide few facts about the animal or object represented in the drawing.  
      """ ` + userTextAdd;

  const contentGame =
    ` """ You are a helpful assistant. When an image is provided, identify object in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., Use the exact name and type of that animal, plant, car, etc to develop a role play game suitable for a """` +
    age +
    `""" year old kid. If the image is a toy, don't develop game on the toy but on the thing that toy represents. The game should not include any printable game board or cards.
    Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
  
    """ ` +
    systemTextAdd +
    `"""
      If you can't identify object in the image, respond with 'I can't identify the object.
      Please provide another object.'

      Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
    
      Here's an example for a game based on an elephant toy:
      Game Title: Ellie’s Jungle Adventure
      Objective:
       Ellie the Elephant is about to go on a grand adventure through the jungle! She will encounter exciting places and fun challenges along the way. Do you want to play along? 
      Scene 1: Jungle Exploration
      "Ellie starts her adventure by exploring the dense jungle. She hears birds singing and sees colorful flowers." Can you pretend to walk through the jungle with Ellie, describing what you see and hear. 
      Scene 2: Crossing the River
      "Ellie comes across a sparkling river. She needs to find a way to get to the other side." Can you tell how Ellie will cross the river, perhaps by pretending to swim or jump from rock to rock?
      Scene 3: Meeting New Friends
      “Ellie meets a friendly monkey in the trees. The monkey says hello and offers Ellie a banana."
      Can you pretend to eat the banana? Can you make monkey sounds? 
      Scene 4: Finding a Hidden Path
      "Ellie finds a hidden path covered in leaves. She wonders where it leads."
      Can you clear the leaves away and walk down the hidden path, describing the plants and animals they might see along the way?
      Scene 5: Climbing the Hill
      "Ellie comes to a big hill. She needs to climb to the top to see the view." Can you pretend to climb the hill, taking big steps and encouraging Ellie. "We’re almost there, Ellie! Just a few more steps!" ?
      Scene 6: Discovering a Waterfall
      "At the top of the hill, Ellie finds a beautiful waterfall. She decides to take a rest and enjoy the view." Can you pretend to sit with Ellie by the waterfall, maybe splashing in the water a little bit ?
    """ `;
  const textGame =
    ` """ Develop a role play game suitable for a """` +
    age +
    `""" year old kid kid based on the main object in the image. 
        """ ` +
    userTextAdd;

  const contentStory =
    ` """ You are a helpful assistant. When an image is provided, identify object in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., Use the exact name and type of that animal, plant, car, etc to develop a story suitable for a """` +
    age +
    `""" year old kid. If the image is a toy, don't develop story on the toy but on the thing that toy represents. The story should ignite imagination of the """` +
    age +
    `""" year old kid and should be in hero's journey format. 
    """ ` +
    systemTextAdd +
    ` """. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent." """`;
  const textStory =
    ` """ Develop a story suitable for a """` +
    age +
    `""" year old kid based on the main object in the image. 
        """ ` +
    userTextAdd;
  const contentSong =
    ` """ You are a helpful assistant. When an image is provided, identify object in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., Use the exact name and type of that animal, plant, car, etc to develop a rhyming song suitable for a """` +
    age +
    `""" year old kid. If the image is a toy, don't develop song on the toy but on the thing that toy represents. The song should be simple to follow and understand by a """` +
    age +
    `""" year old kid.
    Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."

        """ ` +
    systemTextAdd +
    ` """. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent." """`;
  const textSong =
    ` """ Develop a song suitable for a """` +
    age +
    `""" year old kid based on the main object in the image. 
            """ ` +
    userTextAdd;

  const contentBoard =
    ` """ You are a helpful assistant. When an image is provided, identify the board game in the image. If the object matches any board game, provide instructions on how to play that board game in a simple sentences that can be understood by a 5 year old kid.
    """ ` +
    systemTextAdd +
    `"""
    If the image does not have texts, respond with 'This image does not appear to contain a board game.
  Please provide an image with texts'        
    """ `;
  const textBoard =
    ` """ Provide instructions for a board game based on the identified board game in the image. 
                """ ` + userTextAdd;
  const contentBoardGame =
    ` """ You are a helpful assistant who is going to help a kid by providing suggestions on next move in a board game. When an image is provided, identify the board game in the image. If the object matches a board game, understand the status of the current play and assume that a kid has to play next move. Provide instructions or suggestions on the next move in the board game.
                """ ` +
    systemTextAdd +
    `"""
                If the image does not have texts, respond with 'This image does not appear to contain a board game.
              Please provide an image with texts'        
                """ `;
  const textBoardGame =
    ` """ Provide suggestion on the next move for a board game. """ ` +
    userTextAdd;
  var systemText = "";
  var userText = "";
  if (code === "reading") {
    systemText = contentReading;
    userText = textReading;
  } else if (code === "identify") {
    systemText = contentFact;
    userText = textFact;
  } else if (code === "story") {
    systemText = contentStory;
    userText = textStory;
  } else if (code === "song") {
    systemText = contentSong;
    userText = textSong;
  } else if (code === "board") {
    systemText = contentBoard;
    userText = textBoard;
  } else if (code === "boardgame") {
    systemText = contentBoardGame;
    userText = textBoardGame;
  } else if (code === "detail") {
    systemText = contentDetail;
    userText = textDetail;
  } else if (code === "draw") {
    systemText = contentDraw;
    userText = textDraw;
  } else {
    systemText = contentGame;
    userText = textGame;
  }
  // console.log(systemText);
  console.log("API sent");
  // console.log(imageDataBase64);
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemText },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userText,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      model: "gpt-4o",
      temperature: 0,
      max_tokens: 4096,
    });
    // console.log(completion.choices[0].message);
    const textBody = completion.choices[0].message.content;
    console.log("image API received");
    // console.log(textBody);
    // const speechFile = path.resolve("./speech.mp3");
    const speechItems = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
    var speechVoice =
      speechItems[Math.floor(Math.random() * speechItems.length)];
    console.log("voice api call");
    try {
      // if (lang === "english") {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: speechVoice,
        input: textBody,
        language: lang,
      });
      // console.log(mp3);
      const buffer = Buffer.from(await mp3.arrayBuffer());
      // await fs.promises.writeFile(speechFile, buffer);
      console.log("voice api received");
      // const soundDataBase64 = Buffer.concat(buffer).toString("base64");
      const base64 = buffer.toString("base64");
      // console.log("sounddata", base64);
      return { textBody: textBody, soundBody: base64 };
    } catch (error) {
      console.log("error", error);
      return { textBody: "", soundBody: "" };
    }

    // return completion.choices[0].message.content;
  } catch (error) {
    console.log("error", error);
    return { textBody: "", soundBody: "" };
  }
}

export const takeShortPhoto = tryCatch(async (req, res) => {
  // console.log("body", req.body)
  const { id: uid } = req.user;
  const { code, lang, age, imageBase64 } = req.body;
  const currentUser = await User.findById(uid);
  // console.log("base64Got: ", imageBase64);
  // console.log("lang", lang);
  // console.log("code", code);
  // console.log("age", age);

  try {
    if (currentUser.ktBalance <= 0) {
      return res.status(500).json({
        success: false,
        message: "Insufficient credit, Buy credits in Settings page",
      });
    } else {
      extractImage(imageBase64, code, lang, age).then(async (value) => {
        // console.log("new", {
        //   content: value["textBody"],
        //   soundBlob: value["soundBody"],
        // });
        currentUser.ktBalance = currentUser.ktBalance - 1;
        currentUser.ktTotalActual = currentUser.ktTotalActual + 1;
        const creditBalance = currentUser.ktBalance;
        // console.log(
        //   "Balance",
        //   currentUser.ktBalance,
        //   currentUser.ktTotalActual
        // );
        await currentUser.save();
        return res.status(201).json({
          success: true,
          result: {
            content: value["textBody"],
            soundBlob: value["soundBody"],
            creditBalance: creditBalance,
          },
        });
      });
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("Error retrieving object");
  }
});

async function extractGameImage(imageBase64, text) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    // max_retries: 3,
  });

  const contentPictionary =
    ` """ You are a helpful assistant and you are playing a game of Pictionary with a young kid. You have to help with two tasks. First task: when an image is provided, identify the hand drawn image. Then, evaluate what does drawing in the image represent? Guess the name of the object that hand drawing represents. 
  If the image does not have hand drawing, respond with 'There is no drawing in the picture". If you can't understand or guess the hand drawing, respond with "I can't understand the drawing."  Here's an example if a drawing is matching with a duck :
  The drawing is of a duck. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't identify the drawing".
Second task: Please check if guessed object from the image matches the provided word: """` +
    text +
    `""". Please provide your answer only in Yes or No """ `;
  const textPictionary =
    ` """ Guess the object represented by the hand drawing in the image and check if it matches with the provided word: """` +
    text;

  var systemText = contentPictionary;
  var userText = textPictionary;

  const schema = {
    type: "object",
    properties: {
      pictureObject: {
        type: "string",
        description:
          "Guess the object represented by the hand drawing in the image.",
      },
      matchOrNot: {
        type: "string",
        description:
          "Please check if guessed object from the image matches the provided word: " +
          text +
          ". Please provide your answer only in Yes or No",
      },
    },
  };
  // console.log(systemText);
  console.log("Game API sent");
  // console.log(imageDataBase64);
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemText },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userText,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      functions: [{ name: "set_option", parameters: schema }],
      function_call: { name: "set_option" },
      model: "gpt-4o",
      temperature: 0,
      max_tokens: 4096,
    });
    // const textBody = completion.choices[0].message.content;
    const text = completion.choices[0].message.function_call.arguments;
    const text2 = JSON.parse(text);
    const textBody = text2["pictureObject"];
    const matchAnswer = text2["matchOrNot"];
    // console.log("textBody:", textBody);
    // console.log("matchAnswer:", matchAnswer);
    // console.log(textBody);
    // const speechFile = path.resolve("./speech.mp3");
    // const speechItems = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
    // var speechVoice =
    //   speechItems[Math.floor(Math.random() * speechItems.length)];
    // console.log("Game voice api call");
    // try {
    //   // if (lang === "english") {
    //   const mp3 = await openai.audio.speech.create({
    //     model: "tts-1",
    //     voice: speechVoice,
    //     input: textBody,
    //     language: "english",
    //   });
    //   // console.log(mp3);
    //   const buffer = Buffer.from(await mp3.arrayBuffer());
    //   // await fs.promises.writeFile(speechFile, buffer);
    //   console.log("Game voice api received");
    //   // const soundDataBase64 = Buffer.concat(buffer).toString("base64");
    //   const base64 = buffer.toString("base64");
    // console.log("sounddata", base64);
    return {
      textBody: textBody,
      matchAnswer: matchAnswer,
      // soundBody: base64,
    };
    // } catch (error) {
    //   console.log("error", error);
    //   return { textBody: "", soundBody: "" };
    // }

    // return completion.choices[0].message.content;
  } catch (error) {
    console.log("error", error);
    return { textBody: "", matchAnswer: "" };
  }
}

export const getGamePhoto = tryCatch(async (req, res) => {
  // console.log("body", req.body)
  const { id: uid } = req.user;

  const { imageBase64, text } = req.body;
  // console.log("base64Got: ", imageBase64);
  // console.log("lang", lang);
  // console.log("code", code);
  // console.log("her");

  const currentUser = await User.findById(uid);

  try {
    if (currentUser.ktBalance <= 0) {
      return res.status(500).json({
        success: false,
        message: "Insufficient credit, Buy credits in Settings page",
      });
    } else {
      extractGameImage(imageBase64, text).then(async (value) => {
        // console.log("new", value);
        // return res.status(200).json({
        //   content: value["textBody"],
        //   matchAnswer: value["matchAnswer"],
        // });
        currentUser.ktBalance = currentUser.ktBalance - 1;
        currentUser.ktTotalActual = currentUser.ktTotalActual + 1;
        const creditBalance = currentUser.ktBalance;
        // console.log(
        //   "Balance",
        //   currentUser.ktBalance,
        //   currentUser.ktTotalActual
        // );
        await currentUser.save();
        return res.status(201).json({
          success: true,
          result: {
            content: value["textBody"],
            matchAnswer: value["matchAnswer"],
            creditBalance: creditBalance,
          },
        });
      });
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("Error retrieving object");
  }
});

async function extractChessImage(imageBase64, side) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    // max_retries: 3,
  });

  const contentChess =
    ` """ You are a helpful assistant and you are helping a young kid in playing a game of chess. You are playing with """` +
    side +
    `"""side. You have following task. When an image is provided, study the chess board in the image and identify positions of all pieces on the chess board. Then, using a chess game strategy with a goal to checkmate opposition side, provide your best next move for the """` +
    side +
    `"""side. Please reply either in this format: "Move white queen from B4 to F5" or in this format: "Move white rook from H2 to D2 and capture black pawn"
  If the image does not have a chess board image, respond with "There is no chess board in the picture". If you can't understand the chess board or can't identify position of pieces, respond with "I can't understand the chess board. Please provide a better view of the board. " """ `;
  const textChess =
    ` """provide your best next move for the """` +
    side +
    `"""side. Please reply either in this format: "Move white queen from B4 to F5" or in this format: "Move white rook from H2 to D2 and capture black pawn" """`;

  var systemText = contentChess;
  var userText = textChess;

  // console.log(systemText);
  console.log("Game API sent");
  // console.log(imageDataBase64);
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemText },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userText,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      model: "gpt-4o",
      temperature: 0,
      max_tokens: 4096,
    });
    // console.log(completion.choices[0].message);
    const textBody = completion.choices[0].message.content;
    console.log("image API received");
    // console.log(textBody);
    // const speechFile = path.resolve("./speech.mp3");

    // console.log("sounddata", base64);
    return {
      textBody: textBody,
    };
    // return completion.choices[0].message.content;
  } catch (error) {
    console.log("error", error);
    return { textBody: "" };
  }
}

export const getChessPhoto = tryCatch(async (req, res) => {
  // console.log("body", req.body)

  const { side, imageBase64 } = req.body;
  // console.log("base64Got: ", imageBase64);
  // console.log("lang", lang);
  // console.log("code", code);
  // console.log("age", age);

  try {
    extractChessImage(imageBase64, side).then((value) => {
      // console.log("new", value);
      return res.status(200).json({
        content: value["textBody"],
      });
    });
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("Error retrieving object");
  }
});

async function extractShowImage(imageBase64, text) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    // max_retries: 3,
  });

  const contentPictionary =
    ` """ You are a helpful assistant and you are playing a game of showing and telling name of the toy with a young kid. You have to help with two tasks. First task: when a image of toy or an object is provided, identify the object in the image. Then, evaluate what does object in the image represent? Guess the name of the object that image represents. 
  If the image does not have a toy or a object, respond with 'There is no toy in the picture". If you can't understand the image, respond with "I can't understand the image."  Here's an example if a image matches with a duck toy:
  The object is a duck. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't identify the object". 
Second task: Please check if guessed object from the image matches the provided word: """` +
    text +
    `""". Please provide your answer only in Yes or No """ `;
  const textPictionary =
    ` """ Guess the object represented in the image and check if it matches with the provided word: """` +
    text;

  var systemText = contentPictionary;
  var userText = textPictionary;

  const schema = {
    type: "object",
    properties: {
      pictureObject: {
        type: "string",
        description: "Guess the object represented in the image.",
      },
      matchOrNot: {
        type: "string",
        description:
          "Please check if guessed object from the image matches the provided word: " +
          text +
          ". Please provide your answer only in Yes or No",
      },
    },
  };
  // console.log(systemText);
  console.log("Show API sent");
  // console.log(imageDataBase64);
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemText },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userText,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      functions: [{ name: "set_option", parameters: schema }],
      function_call: { name: "set_option" },
      model: "gpt-4o",
      temperature: 0,
      max_tokens: 4096,
    });
    // const textBody = completion.choices[0].message.content;
    const text = completion.choices[0].message.function_call.arguments;
    const text2 = JSON.parse(text);
    const textBody = text2["pictureObject"];
    const matchAnswer = text2["matchOrNot"];
    // console.log("textBody:", textBody);
    // console.log("matchAnswer:", matchAnswer);
    // console.log(textBody);
    // const speechFile = path.resolve("./speech.mp3");
    // const speechItems = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
    // var speechVoice =
    //   speechItems[Math.floor(Math.random() * speechItems.length)];
    // console.log("Game voice api call");
    // try {
    //   // if (lang === "english") {
    //   const mp3 = await openai.audio.speech.create({
    //     model: "tts-1",
    //     voice: speechVoice,
    //     input: textBody,
    //     language: "english",
    //   });
    //   // console.log(mp3);
    //   const buffer = Buffer.from(await mp3.arrayBuffer());
    //   // await fs.promises.writeFile(speechFile, buffer);
    //   console.log("Game voice api received");
    //   // const soundDataBase64 = Buffer.concat(buffer).toString("base64");
    //   const base64 = buffer.toString("base64");
    // console.log("sounddata", base64);
    return {
      textBody: textBody,
      matchAnswer: matchAnswer,
      // soundBody: base64,
    };
    // } catch (error) {
    //   console.log("error", error);
    //   return { textBody: "", soundBody: "" };
    // }

    // return completion.choices[0].message.content;
  } catch (error) {
    console.log("error", error);
    return { textBody: "", matchAnswer: "" };
  }
}

export const getShowPhoto = tryCatch(async (req, res) => {
  // console.log("body", req.body)
  const { id: uid } = req.user;
  const { text, imageBase64 } = req.body;
  // console.log("base64Got: ", imageBase64);
  // console.log("lang", lang);
  // console.log("code", code);
  // console.log("age", age);
  const currentUser = await User.findById(uid);

  try {
    if (currentUser.ktBalance <= 0) {
      return res.status(500).json({
        success: false,
        message: "Insufficient credit, Buy credits in Settings page",
      });
    } else {
      extractShowImage(imageBase64, text).then(async (value) => {
        currentUser.ktBalance = currentUser.ktBalance - 1;
        currentUser.ktTotalActual = currentUser.ktTotalActual + 1;
        const creditBalance = currentUser.ktBalance;
        // console.log(
        //   "Balance",
        //   currentUser.ktBalance,
        //   currentUser.ktTotalActual
        // );
        await currentUser.save();
        // console.log("new", value);
        return res.status(201).json({
          success: true,
          result: {
            content: value["textBody"],
            matchAnswer: value["matchAnswer"],
            creditBalance: creditBalance,
          },
        });
      });
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("Error retrieving object");
  }
});

async function extractVoiceImageOld(image, messages, sequence, skill) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    // max_retries: 3,
  });
  let contentSystem = "";
  // if (skill == "story-interactive") {
  //   contentSystem = ` """ You are a helpful mom which tells story in very interactive way to a kid. You are given an image and user prompt. First, understand the keywords in the latest user prompt and then tell or adjust your story based on the provided keywords. Build upon the story from your previous replies and only tell the new part of the story.  Tell you story using words and sentences which a small kid can understand. Also, in order to keep the story going, finish your response with an open question with two options related to what may make the future part of story more interesting. In case the input from user is not meaningful or if story is getting too long, end your story with an interesting ending."""`;
  // } else {
  //   contentSystem = ` """ You are a helpful mom which engages in interactive discussion with a kid. You are given an image and question related to the image asked by a kid. First, understand the question in the latest user prompt and then provide your answer to the question using the provided image. Tell you answer like a small kid can understand. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion"""`;
  // }
  var firstMessage = [];
  let contentUser = "";
  if (sequence == "first") {
    if (skill == "story-interactive") {
      contentSystem = ` """ You are a helpful mom which tells story in very interactive way to a kid. You are given an image. Please understand the main object in the image. If it's toy, identify the main object represented in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., Use the exact name and type of that animal, plant, car, etc. Start one interesting story for a kid based on main object in the image and in the format of a hero journey. Don't tell the whole story yet. End your response with a question to get the user input and to keep the story going."""`;
      contentUser = ` """Please understand the main object in the image. Start one interesting story suitable for a kid based on main object image and in the format of a hero journey. End your response with a question to get the user input and to keep the story going."""`;
    } else if (skill == "facts-interactive") {
      contentSystem = ` """ You are a helpful assistant. When an image is provided, identify object in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., provide the exact name and type of that animal, plant, car, etc,. Also, provide few facts about the exact type or model in simple sentences which are suitable for a 5 year old kid. If the image is a toy, don't provide facts on the toy but provide the facts on the thing that toy represents. Also, end your response with a question to get the user input and to keep the conversation going. 
      If you can't identify object in the image, respond with 'I can't identify the object.
      Please provide another object.'
    
      Here's an example for a elephant toy for a kid:
      The image has a toy elephant. Here are a few facts about elephants: 1. Elephants are the largest land animals in the world. 2. They have long trunks that they use for smelling, breathing, trumpeting, drinking, and grabbing things. 3. Elephants have big ears that help them stay cool by flapping them to create a breeze. Do you like to know what does elephant eat or Is elephant an intelligent animal?""" `;

      contentUser = ` """ Please understand the main object in the image. Tell three interesting facts suitable for a kid based on main object image. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion"""`;
    } else if (skill == "reading") {
      contentSystem = ` """ You are a helpful assistant. When an image is provided, read the words and sentences in the image and write that exactly along with punctuation marks appears in the image. End your response with an interesting question about topic in the texts to get user input and keep conversation going. 
      If the image does not have texts, respond with 'This image does not appear to contain texts.
    Please provide an image with texts'
     """ `;
      contentUser = `""" I need exact texts with sentences and punctuations as it appears in the image. Ignore page number or something not related to the main content. End your response with a question about topic in the text"""`;
    } else if (skill == "religious") {
      contentSystem = ` """ You are a helpful assistant. When an image is provided, identify the religious or mythological topic or character in the image. Tell something interesting suitable for a kid about that religious or mythological topic or character. End your response with an interesting question about topic or character in the texts to get user input and keep conversation going. 
      If the image does not have religious or mythological topic or character, respond with 'This image does not appear to contain religious topic .
     """ `;
      contentUser = `""" I need something interesting for a 5 year kid about the religious or mythological character. Don't tell anything related to violence or sad. End your response with a question about topic in the text"""`;
    }
    firstMessage = [{ role: "user", content: contentUser }];
  } else {
    if (skill == "story-interactive") {
      contentSystem = ` """ You are a helpful mom which tells story in very interactive way to a kid. You are given an image and user prompt. First, understand the keywords in the latest user prompt and then tell or adjust your story based on the provided keywords. Build upon the story from your previous replies and only tell the new part of the story.  Tell you story using words and sentences which a small kid can understand. Also, in order to keep the story going, finish your response with an open question with two options related to what may make the future part of story more interesting. In case the input from user is not meaningful or if story is getting too long, end your story with an interesting ending."""`;
    } else if (skill == "facts-interactive") {
      contentSystem = ` """ You are a helpful mom which engages in interactive discussion with a kid. You are given an image and question related to the image asked by a kid. First, understand the question in the latest user prompt, read your last replies and then provide your answer to the question using the provided image. Tell you answer like a small kid can understand. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion"""`;
    } else if (skill == "reading") {
      contentSystem = ` """ You are a helpful mom which engages in interactive discussion with a kid. You are given an image and question related to the image asked by a kid. First, understand the question in the latest user prompt, read your last replies and then provide your answer to the question using the provided image. Tell you answer like a small kid can understand. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion"""`;
    } else {
      contentSystem = ` """ You are a helpful mom which engages in interactive discussion with a kid. You are given an image and question related to the image asked by a kid. First, understand the question in the latest user prompt, read your last replies and then provide your answer to the question using the provided image. Tell you answer like a small kid can understand. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion"""`;
    }
  }

  var systemText = contentSystem;

  var messagesText = [
    { role: "system", content: systemText },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Here is the provided image:",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${image}`,
          },
        },
      ],
    },
  ];
  messagesText = messagesText.concat(firstMessage);

  var newMessagesText = messagesText.concat(messages);

  // console.log(newMessagesText);
  try {
    const completion = await openai.chat.completions.create({
      messages: newMessagesText,
      model: "gpt-4o",
      temperature: 0,
      // max_tokens: 4096,
    });
    // console.log(completion.choices[0].message);
    const textBody = completion.choices[0].message.content;
    // console.log(textBody);
    // const speechFile = path.resolve("./speech.mp3");
    // const speechItems = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
    // var speechVoice =
    //   speechItems[Math.floor(Math.random() * speechItems.length)];
    // console.log("Game voice api call");
    // try {
    //   // if (lang === "english") {
    //   const mp3 = await openai.audio.speech.create({
    //     model: "tts-1",
    //     voice: speechVoice,
    //     input: textBody,
    //     language: "english",
    //   });
    //   // console.log(mp3);
    //   const buffer = Buffer.from(await mp3.arrayBuffer());
    //   // await fs.promises.writeFile(speechFile, buffer);
    //   console.log("Game voice api received");
    //   // const soundDataBase64 = Buffer.concat(buffer).toString("base64");
    //   const base64 = buffer.toString("base64");
    // console.log("sounddata", base64);
    return {
      textBody: textBody,
      // matchAnswer: matchAnswer,
      // soundBody: base64,
    };
    // } catch (error) {
    //   console.log("error", error);
    //   return { textBody: "", soundBody: "" };
    // }

    // return completion.choices[0].message.content;
  } catch (error) {
    console.log("error", error);
    return { textBody: "", matchAnswer: "" };
  }
}

export const getVoicePhotoOld = tryCatch(async (req, res) => {
  // console.log("body", req.body)
  const { id: uid } = req.user;
  const { image, messages, sequence, skill } = req.body;
  // console.log("base64Got: ", imageBase64);
  // console.log("lang", lang);
  // console.log("code", code);
  // console.log("messages", messages);
  const currentUser = await User.findById(uid);

  try {
    if (currentUser.ktBalance <= -3) {
      return res.status(500).json({
        success: false,
        message: "Insufficient credit, Buy credits in Settings page",
      });
    } else {
      extractVoiceImageOld(image, messages, sequence, skill).then(
        async (value) => {
          currentUser.ktBalance = currentUser.ktBalance - 1;
          currentUser.ktTotalActual = currentUser.ktTotalActual + 1;
          const creditBalance = currentUser.ktBalance;
          // console.log(
          //   "Balance",
          //   currentUser.ktBalance,
          //   currentUser.ktTotalActual
          // );
          await currentUser.save();
          // console.log("new", value);
          return res.status(201).json({
            success: true,
            result: {
              content: value["textBody"],
              creditBalance: creditBalance,
            },
          });
        }
      );
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("Error retrieving object");
  }
});

async function extractVoiceImage(image, messages, sequence, skill) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    // max_retries: 3,
  });
  let contentSystem = "";
  // if (skill == "story-interactive") {
  //   contentSystem = ` """ You are a helpful mom which tells story in very interactive way to a kid. You are given an image and user prompt. First, understand the keywords in the latest user prompt and then tell or adjust your story based on the provided keywords. Build upon the story from your previous replies and only tell the new part of the story.  Tell you story using words and sentences which a small kid can understand. Also, in order to keep the story going, finish your response with an open question with two options related to what may make the future part of story more interesting. In case the input from user is not meaningful or if story is getting too long, end your story with an interesting ending."""`;
  // } else {
  //   contentSystem = ` """ You are a helpful mom which engages in interactive discussion with a kid. You are given an image and question related to the image asked by a kid. First, understand the question in the latest user prompt and then provide your answer to the question using the provided image. Tell you answer like a small kid can understand. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion"""`;
  // }
  var firstMessage = [];
  let contentUser = "";
  if (sequence == "first") {
    if (skill == "story-interactive") {
      contentSystem = ` """ You are a helpful mom which tells story in very interactive way to a kid. You are given an image. Please understand the main object in the image. If it's toy, identify the main object represented in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., Use the exact name and type of that animal, plant, car, etc. Start one interesting story for a kid based on main object in the image and in the format of a hero journey. Don't tell the whole story yet. End your response with a question to get the user input and to keep the story going. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent." """`;
      contentUser = ` """Please understand the main object in the image. Start one interesting story suitable for a kid based on main object image and in the format of a hero journey. End your response with a question to get the user input and to keep the story going."""`;
    } else if (skill == "facts-interactive") {
      contentSystem = ` """ You are a helpful assistant. When an image is provided, identify object in the image. If the object is a toy and if it matches any kind of animal, plant, cars, etc., provide the exact name and type of that animal, plant, car, etc,. Also, provide few facts about the exact type or model in simple sentences which are suitable for a 5 year old kid. If the image is a toy, don't provide facts on the toy but provide the facts on the thing that toy represents. Also, end your response with a question to get the user input and to keep the conversation going. 
      If you can't identify object in the image, respond with 'I can't identify the object.
      Please provide another object.'
      Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
    
      Here's an example for a elephant toy for a kid:
      The image has a toy elephant. Here are a few facts about elephants: 1. Elephants are the largest land animals in the world. 2. They have long trunks that they use for smelling, breathing, trumpeting, drinking, and grabbing things. 3. Elephants have big ears that help them stay cool by flapping them to create a breeze. Do you like to know what does elephant eat or Is elephant an intelligent animal?""" `;

      contentUser = ` """ Please understand the main object in the image. Tell three interesting facts suitable for a kid based on main object image. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion"""`;
    } else if (skill == "reading") {
      contentSystem = ` """ You are a helpful assistant. When an image is provided, read the words and sentences in the image and write that exactly along with punctuation marks appears in the image. End your response with an interesting question about topic in the texts to get user input and keep conversation going. 
      If the image does not have texts, respond with 'This image does not appear to contain texts.
    Please provide an image with texts'. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
     """ `;
      contentUser = `""" I need exact texts with sentences and punctuations as it appears in the image. Ignore page number or something not related to the main content. End your response with a question about topic in the text"""`;
    } else if (skill == "religious") {
      contentSystem = ` """ You are a helpful assistant. When an image is provided, identify the religious or mythological topic or character in the image. Tell something interesting suitable for a kid about that religious or mythological topic or character. End your response with an interesting question about topic or character in the texts to get user input and keep conversation going. 
      If the image does not have religious or mythological topic or character, respond with 'This image does not appear to contain religious topic'.
     """ `;
      contentUser = `""" I need something interesting for a 5 year kid about the religious or mythological character. Don't tell anything related to violence or sad. End your response with a question about topic in the text"""`;
    }
    firstMessage = [{ role: "user", content: contentUser }];
  } else {
    if (skill == "story-interactive") {
      contentSystem = ` """ You are a helpful mom which tells story in very interactive way to a kid. You are given an image and user prompt. First, understand the keywords in the latest user prompt and then tell or adjust your story based on the provided keywords. Build upon the story from your previous replies and only tell the new part of the story.  Tell you story using words and sentences which a small kid can understand. Also, in order to keep the story going, finish your response with an open question with two options related to what may make the future part of story more interesting. In case the input from user is not meaningful or if story is getting too long, end your story with an interesting ending. 
      Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent." """`;
    } else if (skill == "facts-interactive") {
      contentSystem = ` """ You are a helpful mom which engages in interactive discussion with a kid. You are given an image and question related to the image asked by a kid. First, understand the question in the latest user prompt, read your last replies and then provide your answer to the question using the provided image. Tell you answer like a small kid can understand. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent.""""`;
    } else if (skill == "reading") {
      contentSystem = ` """ You are a helpful mom which engages in interactive discussion with a kid. You are given an image and question related to the image asked by a kid. First, understand the question in the latest user prompt, read your last replies and then provide your answer to the question using the provided image. Tell you answer like a small kid can understand. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent." """`;
    } else {
      contentSystem = ` """ You are a helpful mom which engages in interactive discussion with a kid. You are given an image and question related to the image asked by a kid. First, understand the question in the latest user prompt, read your last replies and then provide your answer to the question using the provided image. Tell you answer like a small kid can understand. Also, in order to keep conversation going, finish your response with an open question with two options related to what kids may like to know more about the image and also so that kid can select one option and can engage in interactive discussion. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent." """`;
    }
  }

  var systemText = contentSystem;

  var messagesText = [
    { role: "system", content: systemText },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Here is the provided image:",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${image}`,
          },
        },
      ],
    },
  ];
  messagesText = messagesText.concat(firstMessage);

  var newMessagesText = messagesText.concat(messages);

  // console.log(newMessagesText);
  try {
    const completion = await openai.chat.completions.create({
      messages: newMessagesText,
      model: "gpt-4o",
      temperature: 0,
      // max_tokens: 4096,
    });
    // console.log(completion.choices[0].message);
    const textBody = completion.choices[0].message.content;
    console.log("image API received");
    try {
      // if (lang === "english") {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: textBody,
        language: "english",
      });
      // console.log(mp3);
      const buffer = Buffer.from(await mp3.arrayBuffer());
      console.log("voice api received");
      const base64 = buffer.toString("base64");

      return { textBody: textBody, soundBody: base64 };
    } catch (error) {
      console.log("error", error);
      return { textBody: "", soundBody: "" };
    }
  } catch (error) {
    console.log("error", error);
    return { textBody: "", soundBody: "" };
  }
}

export const getVoicePhoto = tryCatch(async (req, res) => {
  // console.log("body", req.body)
  const { id: uid } = req.user;
  const { image, messages, sequence, skill } = req.body;
  // console.log("base64Got: ", imageBase64);
  // console.log("lang", lang);
  // console.log("code", code);
  // console.log("messages", messages);
  const currentUser = await User.findById(uid);

  try {
    if (currentUser.ktBalance <= -3) {
      return res.status(500).json({
        success: false,
        message: "Insufficient credit, Buy credits in Settings page",
      });
    } else {
      extractVoiceImage(image, messages, sequence, skill).then(
        async (value) => {
          currentUser.ktBalance = currentUser.ktBalance - 1;
          currentUser.ktTotalActual = currentUser.ktTotalActual + 1;
          const creditBalance = currentUser.ktBalance;
          // console.log(
          //   "Balance",
          //   currentUser.ktBalance,
          //   currentUser.ktTotalActual
          // );
          await currentUser.save();
          // console.log("new", value);
          return res.status(201).json({
            success: true,
            result: {
              content: value["textBody"],
              soundBlob: value["soundBody"],
              creditBalance: creditBalance,
            },
          });
        }
      );
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("Error retrieving object");
  }
});

async function extractToyVoiceImage(image, messages, sequence, skill, tone) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    // max_retries: 3,
  });
  let contentSystem = "";
  var firstMessage = [];
  let contentUser = "";
  if (sequence == "first") {
    contentSystem = ` """ You are a voice of a toy or voice of the main object shown in image. When an image is provided, identify object in the image. If the object is a toy and if it matches any kind of animal, fruit, vegetable, plant, cars, etc., consider the exact name and type of that animal, fruit, vegetable, plant, car, etc, and get into a character similar to that name. Always reply in first person sentence representing the object and using I or we. Start with your introduction in first person sentence. And, provide one facts about yourself (as an animal etc) in simple sentences which are suitable for a kid. If the image is a toy, don't provide facts on the toy but provide the facts on the thing that toy represents. Also, end your response with a question to get the user input and to keep the conversation going. 
      If you can't identify main object in the image, respond with 'I can't identify the object. Please help me identify the object. Can you tell me what is it? '. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
    
      Here's an example for a teddy bear toy for a kid:
      Hi, I am Baloo, the bear. I live in a forest. Do you know...? I sleep for a long time in winter. I am very strong and funny. How are you and what do you want to know about me?
      
      Here's an example for a pumpkin toy for a kid:
      Hi, I am pumpkin. Orange is my favorite color. I like fall season and halloween. How are you and what do you want to know about me?""" `;

    contentUser = ` """ Please understand the main object in the image. Get into a character representing the main character. Reply in first person sentences. Introduce yourself and ask suitable kids friendly questions to keep conversation going."""`;

    firstMessage = [{ role: "user", content: contentUser }];
  } else {
    contentSystem = ` """ You are a voice of a toy or voice of the main object shown in image and you are having an interesting engaging conversation with a kid. You always reply in first person sentence using I or We. You are given an user prompt. First, understand the context of the latest user prompt and then tell or adjust your reply based on the provided input and image. Build upon the conversation from your previous replies and only reply the new part of the conversation. Give your reply using words and sentences which a small kid can understand. Provide your reply in at least 2 sentences. Also, in order to keep the conversation going, finish your response with an open question which can make the future part of conversation more interesting. In case the input from user is not meaningful, reply with an interesting fact about yourself. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent.""""`;
  }

  var systemText = contentSystem;

  var messagesText = [
    { role: "system", content: systemText },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Here is the provided image:",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${image}`,
          },
        },
      ],
    },
  ];
  messagesText = messagesText.concat(firstMessage);

  var newMessagesText = messagesText.concat(messages);

  // console.log(newMessagesText);
  try {
    const completion = await openai.chat.completions.create({
      messages: newMessagesText,
      model: "gpt-4o",
      temperature: 0,
      // max_tokens: 4096,
    });
    // console.log(completion.choices[0].message);
    const textBody = completion.choices[0].message.content;
    console.log("toy image API received");
    try {
      // if (lang === "english") {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: textBody,
        language: "english",
      });
      // console.log(mp3);
      const buffer = Buffer.from(await mp3.arrayBuffer());
      console.log("toy voice api received");
      const base64 = buffer.toString("base64");

      return { textBody: textBody, soundBody: base64 };
    } catch (error) {
      console.log("error", error);
      return { textBody: "", soundBody: "" };
    }
  } catch (error) {
    console.log("error", error);
    return { textBody: "", soundBody: "" };
  }
}

export const getToyVoicePhoto = tryCatch(async (req, res) => {
  // console.log("body", req.body)
  const { id: uid } = req.user;
  const { image, messages, sequence, skill } = req.body;
  // console.log("base64Got: ", imageBase64);
  // console.log("lang", lang);
  // console.log("code", code);
  // console.log("messages", messages);
  const currentUser = await User.findById(uid);

  try {
    if (currentUser.ktBalance <= -3) {
      return res.status(500).json({
        success: false,
        message: "Insufficient credit, Buy credits in Settings page",
      });
    } else {
      extractToyVoiceImage(image, messages, sequence, skill).then(
        async (value) => {
          currentUser.ktBalance = currentUser.ktBalance - 1;
          currentUser.ktTotalActual = currentUser.ktTotalActual + 1;
          const creditBalance = currentUser.ktBalance;
          // console.log(
          //   "Balance",
          //   currentUser.ktBalance,
          //   currentUser.ktTotalActual
          // );
          await currentUser.save();
          // console.log("new", value);
          return res.status(201).json({
            success: true,
            result: {
              content: value["textBody"],
              soundBlob: value["soundBody"],
              creditBalance: creditBalance,
            },
          });
        }
      );
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("Error retrieving object");
  }
});

async function extractVoice(messages, sequence, skill, tone) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    // max_retries: 3,
  });
  let contentSystem = "";
  var firstMessage = [];
  let contentUser = "";
  if (sequence == "first") {
    if (skill == "santa-talk") {
      contentSystem = ` """ You are Santa. You are having an interesting engaging and funny conversation with a kid. You can adjust sentences and word based on age of the kid. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
      
      Here is how to introduce yourself:
      Ho ho ho! Hi there, little one! 🎅 Guess who I am? I'm Santa Claus, the guy with the big belly that jiggles like jelly and the fluffiest beard you've ever seen! I live way up in the North Pole, where it’s always super snowy. I bring joy and cheer to children (and grown-ups too!) all around the world every Christmas Eve 🎄🎁✨. So tell me, what brings you to Santa today?""" `;

      contentUser = ` """ Please introduce yourself as Santa. Reply in first person sentences using "I". Introduce yourself and ask suitable kids friendly questions to keep conversation going."""`;
    } else {
      contentSystem = ` """ You are an AI assistant which has been named Lampi - AI for Kids. You are having an interesting engaging conversation with a kid. You can adjust sentences and word based on age of the kid. Strictly check for child-unsuitable content, harmful content for minors and any NSFW elements that could be inappropriate for kids. If you find any child-unsuitable, harmful or NSFW content, reply "I can't help you with content unsuitable for a kid, Please contact your parent."
      
      Here is how to introduce yourself:
      Hi, I am Lampi-AI for Kids. I love telling stories and facts. Kids love me because I can talk to them in polite fun way. You can ask me anything. What do you want to know today?""" `;

      contentUser = ` """ Please introduce yourself as "Lampi-AI for kids". Reply in first person sentences using "I". Introduce yourself and ask suitable kids friendly questions to keep conversation going."""`;
    }
    firstMessage = [{ role: "user", content: contentUser }];
  } else {
    if (skill == "santa-talk") {
      contentSystem = ` """ You are Santa. You are having an interesting engaging conversation with a kid. You are given an user prompt. First, understand the context of the latest user prompt and then tell or adjust your reply based on the provided input. Build upon the conversation from your previous replies and only reply the new part of the conversation. Give your reply using words and sentences which a small kid can understand. Also, in order to keep the conversation going, finish your response with an open question which can make the future part of conversation more interesting. In case the input from user is not meaningful, reply with an interesting thing about Santa."""`;
    } else {
      contentSystem = ` """ You are an AI assistant named Lampi - AI for Kids. You are having an interesting engaging conversation with a kid. You are given an user prompt. First, understand the context of the latest user prompt and then tell or adjust your reply based on the provided input. Build upon the conversation from your previous replies and only reply the new part of the conversation. Give your reply using words and sentences which a small kid can understand. Also, in order to keep the conversation going, finish your response with an open question which can make the future part of conversation more interesting. In case the input from user is not meaningful, reply with an interesting fact about an animal suitable for kid."""`;
    }
  }

  var systemText = contentSystem;

  var messagesText = [{ role: "system", content: systemText }];
  messagesText = messagesText.concat(firstMessage);

  var newMessagesText = messagesText.concat(messages);

  // console.log(newMessagesText);
  try {
    const completion = await openai.chat.completions.create({
      messages: newMessagesText,
      model: "gpt-4o",
      temperature: 0,
      // max_tokens: 4096,
    });
    // console.log(completion.choices[0].message);
    const textBody = completion.choices[0].message.content;
    console.log("voice API received");

    let voiceSound = "nova";
    if (skill == "santa-talk") {
      voiceSound = "onyx";
    }

    try {
      // if (lang === "english") {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: voiceSound,
        input: textBody,
        language: "english",
      });
      // console.log(mp3);
      const buffer = Buffer.from(await mp3.arrayBuffer());
      console.log("toy voice api received");
      const base64 = buffer.toString("base64");

      return { textBody: textBody, soundBody: base64 };
    } catch (error) {
      console.log("error", error);
      return { textBody: "", soundBody: "" };
    }
  } catch (error) {
    console.log("error", error);
    return { textBody: "", soundBody: "" };
  }
}

export const getVoice = tryCatch(async (req, res) => {
  // console.log("body", req.body)
  const { id: uid } = req.user;
  const { messages, sequence, skill } = req.body;
  // console.log("base64Got: ", imageBase64);
  // console.log("lang", lang);
  // console.log("code", code);
  // console.log("messages", messages);
  const currentUser = await User.findById(uid);

  try {
    if (currentUser.ktBalance <= -3) {
      return res.status(500).json({
        success: false,
        message: "Insufficient credit, Buy credits in Settings page",
      });
    } else {
      extractVoice(messages, sequence, skill).then(async (value) => {
        currentUser.ktBalance = currentUser.ktBalance - 1;
        currentUser.ktTotalActual = currentUser.ktTotalActual + 1;
        const creditBalance = currentUser.ktBalance;
        // console.log(
        //   "Balance",
        //   currentUser.ktBalance,
        //   currentUser.ktTotalActual
        // );
        await currentUser.save();
        // console.log("new", value);
        return res.status(201).json({
          success: true,
          result: {
            content: value["textBody"],
            soundBlob: value["soundBody"],
            creditBalance: creditBalance,
          },
        });
      });
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send("Error retrieving object");
  }
});
