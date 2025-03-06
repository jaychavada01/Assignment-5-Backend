const { receiveMessagesFromQueue } = require("../utils/sqs");

const processQueue = async () => {
  console.log("SQS Worker started...");
  while (true) {
    await receiveMessagesFromQueue();
  }
};

processQueue();