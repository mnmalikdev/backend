const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
//const formatMessage = require('./utils/messages');
const app = express();
const server = http.createServer(app);
const bodyfatprediction = require("../BodyfatPrediction/controller/predictionController");
const io = socketio(server);
app.use(express.static(path.join(__dirname, "public")));
console.clear();
//========================================================================================
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
async function dialogflowConnect(message, sessionId) {
  const projectId = "rn-bot-cahu";

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "D:/FYP Version 1/Backend/chat/rn-bot-cahu-40947a85bf4b.json",
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  return responses;
}
const responseFunction = async (socket, response) => {
  const responseArray = response.split(" ");
  if (response === "i am already on dieting can't go lower - no") {
    socket.emit("chatMessage", {
      type: "Recommend",
      text: "If you are feeling tired and fatigued due to , we suggest you take a diet break",
      data: [
        {
          tipKey: "0",
          tip: "Change your goal to maintenance",
        },
        {
          tipKey: "1",
          tip: "Enjoy the extra calories for a week or two",
        },
        {
          tipKey: "2",
          tip: "When you feel mentally relaxed, change your goal back to fat loss and proceed.",
        },
      ],
    });
  } else if (response === "i am already on dieting can't go lower - yes") {
    socket.emit("chatMessage", {
      type: "Recommend",
      text: "We recommend the following training approach for this:-",
      data: [
        {
          tipKey: "0",
          tip:
            "In this case we recommend you proceed on a “REVERSE DIET”. Keep in mind that during this reverse diet phase you will gain some weight but that is necessary to heal your metabolism. Read more at:-\n" +
            "https://www.avatarnutrition.com/blog/reverse-dieting/the-ultimate-guide-to-reverse-dieting",
        },
        {
          tipKey: "1",
          tip: "Simply change your goal to maintenance and stay on it for two weeks",
        },
        {
          tipKey: "2",
          tip: 'Then, change your goal to "muscle gain".',
        },
        {
          tipKey: "3",
          tip: "Stay on it for at-least 12 weeks to let your metabolism heal",
        },
        {
          tipKey: "4",
          tip: "Change your goal back to maintenance for another two weeks",
        },
        {
          tipKey: "5",
          tip: "After that, if you feel there is plenty of room to drop weight, proceed with your fat-loss goal",
        },
      ],
    });
  } else if (response === "Tips after Maintain a decent physique") {
    socket.emit("chatMessage", {
      type: "Recommend",
      text: "We recommend the following training approach for this:-",
      data: [
        {
          tipKey: "0",
          tip: "Choose “maintenance” as your goal and stay on it for 5-6 weeks.",
        },
        {
          tipKey: "1",
          tip: "Allow your body to rest and de-stress . Indulge in activities you enjoy physically and mentally",
        },
        {
          tipKey: "2",
          tip: "Allow your body to rest and de-stress . Indulge in activities you enjoy physically and mentally",
        },
        {
          tipKey: "3",
          tip: "Switch back to maintenance for 2 weeks so your metabolism may adjust",
        },
        {
          tipKey: "4",
          tip: "Maintain a decent activity level by taking regular walks or playing any sports you like",
        },
        {
          tipKey: "5",
          tip: "If you want, you may proceed with a muscle gain goal after completing 5-6 weeks of maintenance phase",
        },
      ],
    });
  } else if (
    responseArray[0] +
      " " +
      responseArray[1] +
      " " +
      responseArray[2] +
      " " +
      responseArray[3] +
      " " +
      responseArray[4] ===
    "my body fat percentage is"
  ) {
    var bodyFatPercentage = parseInt(responseArray[5]);
    if (bodyFatPercentage <= 14) {
      socket.emit("chatMessage", {
        type: "Message",
        Data: "Simply choose “muscle gain” as goal",
      });
    } else if ((bodyFatPercentage) => 14) {
      socket.emit("chatMessage", {
        type: "Message",
        Data: "We recommend you go on a fatloss phase until your bodyfat percentage is around 14 percent. Then proceed with a muscle gain phase",
      });
    }
  } else if (
    responseArray[0] +
      " " +
      responseArray[1] +
      " " +
      responseArray[2] +
      " " +
      responseArray[3] ===
    "my waist size is"
  ) {
    const waist = parseInt(responseArray[4]);
    console.log(waist);
    const bfPercentage = await bodyfatprediction(waist);
    if (bfPercentage <= 14) {
      socket.emit("chatMessage", {
        type: "Message",
        Data: "Simply choose “muscle gain” as goal",
      });
    } else if ((bfPercentage) => 14) {
      socket.emit("chatMessage", {
        type: "Message",
        Data: "We recommend you go on a fatloss phase until your bodyfat percentage is around 14 percent. Then proceed with a muscle gain phase",
      });
    }
  } else if (
    responseArray[0] +
      " " +
      responseArray[1] +
      " " +
      responseArray[2] +
      " " +
      responseArray[3] +
      " " +
      responseArray[4] +
      " " +
      responseArray[5] +
      " " +
      responseArray[6] ===
    "I want to improve overall general health"
  ) {
    const weight = responseArray[9];
    const height = responseArray[11];
    if (
      (weight > 58 && height < 53.5239) ||
      (weight > 59 && height < 55.7919) ||
      (weight > 60 && height < 57.60623) ||
      (weight > 61 && height < 59.4206) ||
      (weight > 62 && height < 61.23497) ||
      (weight > 63 && height < 63.50293) ||
      (weight > 64 && height < 65.3173) ||
      (weight > 65 && height < 67.5853) ||
      (weight > 66 && height < 69.85322) ||
      (weight > 67 && height < 71.66759) ||
      (weight > 68 && height < 73.93556) ||
      (weight > 69 && height < 76.20352) ||
      (weight > 71 && height < 80.73944) ||
      (weight > 72 && height < 83.0074) ||
      (weight > 73 && height < 85.27537) ||
      (weight > 74 && height < 87.54333) ||
      (weight > 75 && height < 90.26488) ||
      (weight > 76 && height < 92.53284)
    ) {
      socket.emit("chatMessage", {
        type: "Recommend",
        text: "We recommend the following training approach for this:-",
        data: [
          {
            tipKey: "0",
            tip: "you weight is ok but you need to maintain",
          },
          {
            tipKey: "1",
            tip: "Choose maintenance as your goal",
          },
          {
            tipKey: "2",
            tip: "Eat a healthy diet",
          },
          {
            tipKey: "3",
            tip: "Do Resistance Training at-least 2-4 days a week",
          },
          {
            tipKey: "4",
            tip: "Try to take 3,000 steps a day",
          },
        ],
      });
    }
    //==================================================================================================================================
    else if (
      (weight > 58 && height < 64.41012) ||
      (weight > 59 && height < 66.67808) ||
      (weight > 60 && height < 68.94604) ||
      (weight > 61 && height < 71.214) ||
      (weight > 62 && height < 73.93556) ||
      (weight > 63 && height < 76.20352) ||
      (weight > 64 && height < 78.47148) ||
      (weight > 65 && height < 81.19303) ||
      (weight > 66 && height < 83.91459) ||
      (weight > 67 && height < 86.18255) ||
      (weight > 68 && height < 88.9041) ||
      (weight > 69 && height < 91.62566) ||
      (weight > 71 && height < 94.34721) ||
      (weight > 72 && height < 97.06877) ||
      (weight > 73 && height < 99.79032) ||
      (weight > 74 && height < 102.5119) ||
      (weight > 75 && height < 105.2334) ||
      (weight > 76 && height < 111.1301)
    ) {
      socket.emit("chatMessage", {
        type: "Recommend",
        text: "We recommend the following training approach for this:-",
        data: [
          {
            tipKey: "0",
            tip: "you are overweight and need to loose your weight",
          },
          {
            tipKey: "1",
            tip: "Choose fat-loss as your goal",
          },
          {
            tipKey: "2",
            tip: "Try to  loose at least 1 KG per week",
          },
          {
            tipKey: "3",
            tip: "Do Resistance Training at-least 3-4 days a week",
          },
          {
            tipKey: "4",
            tip: "Try to take 10,000 steps a day",
          },
        ],
      });
    } else {
      socket.emit("chatMessage", {
        type: "Recommend",
        text: "We recommend the following training approach for this:-",
        data: [
          {
            tipKey: "0",
            tip: "you weight is low and you need to gain weight",
          },
          {
            tipKey: "1",
            tip: "Choose Muscle gain as your goal",
          },
          {
            tipKey: "2",
            tip: "increase your food consumption",
          },
          {
            tipKey: "3",
            tip: "Avoid harmful use of alcohol.",
          },
          {
            tipKey: "4",
            tip: "Try to take 2,000 steps a day",
          },
        ],
      });
    }
    //==================================================================================================================================
  } else if (response === "send photo") {
    socket.emit("chatMessage", {
      type: "Photo",
      text: "Please select how you look like",
      data: [
        {
          title: "example 1",
          image:
            "https://befitkilleen.com/wp-content/uploads/2015/12/BodyType11.jpg",
        },
        {
          title: "example 2",
          image:
            "https://i2.wp.com/bonytobombshell.com/wp-content/uploads/2021/09/skinny-fat-workout-and-diet-guide-for-women.jpg?w=1260&ssl=1",
        },
        // https://bonytobeastly.com/wp-content/uploads/2020/09/how-to-know-if-you-are-skinny-1024x584.jpg
        {
          title: "example 3",
          image:
            "https://bonytobeastly.com/wp-content/uploads/2020/09/how-to-know-if-you-are-skinny-1024x584.jpg",
        },
      ],
    });
  } else if (response === "Tips for skinny fat") {
    socket.emit("chatMessage", {
      type: "Recommend",
      text: "We recommend the following training approach for this:-",
      data: [
        {
          tipKey: "0",
          tip: "Choose “maintenance” as your goal and hit the gym 3-5 days per week",
        },
        {
          tipKey: "1",
          tip: "Do this maintenance phase for 4-6 weeks",
        },
        {
          tipKey: "2",
          tip: "After completion, change goal to “muscle gain” and bulk up for 4-6 weeks",
        },
        {
          tipKey: "3",
          tip: "Switch back to maintenance for 2 weeks so your metabolism may adjust",
        },
        {
          tipKey: "4",
          tip: "After this, change your goal to “fat-loss” and proceed for 4 weeks",
        },
        {
          tipKey: "5",
          tip: "Keep repeating the above mentioned steps until you see improvement in your physique",
        },
      ],
    });
  } else {
    socket.emit("chatMessage", { type: "Message", Data: `${response}` });
  }
};
const sendFunction = async (socket,msg) => {
  console.log("Message:"+msg.message)
  if (msg.message === "Let's start chat") {
    const sessionId = uuid.v4();
    const message = {
      type: "Start",
      sessionId: sessionId,
    };
    socket.emit("chatMessage", message);
  } else {
    const responses = await dialogflowConnect(msg.message, msg.sessionId);
    const result = responses[0].queryResult;
    if (result.intent) {
      console.log(`  Intent: ${result.fulfillmentText}`);
      responseFunction(socket, result.fulfillmentText);
    } else {
      socket.emit("chatMessage", {
        type: "Message",
        Data: `I don't understand`,
      });
    }
  }
};

//========================================================================================
io.on("connection", (socket) => {
  socket.on("connect", () => {
    console.log(socket.id);
  });
  socket.on("chatMessage", async (msg) => {
    sendFunction(socket, msg);
  });
});

// Server start
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
