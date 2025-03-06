require("dotenv").config();

const {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const { sqsClient } = require("../config/aws");

const QUEUE_URL = process.env.SQS_QUEUE_URL;

// Send message to SQS
const sendMessageToQueue = async (messageBody) => {
  try {
    const params = {
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(messageBody),
    };

    const messageData = new SendMessageCommand(params);

    const data = await sqsClient.send(messageData);
    console.log("Message sent to SQS:", data.MessageId);
    return data.MessageId;
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    throw error;
  }
};

// Receive and process messages from SQS
const receiveMessagesFromQueue = async () => {
  try {
    const params = {
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 5,
      WaitTimeSeconds: 10, // Long polling
    };

    const receivedmessage = new ReceiveMessageCommand(params);

    const data = await sqsClient.send(receivedmessage);

    if (data.Messages) {
      for (const message of data.Messages) {
        console.log("Processing message:", message.Body);

        // Delete processed message
        await deleteMessageFromQueue(message.ReceiptHandle);
      }
    }
  } catch (error) {
    console.error("Error receiving messages from SQS:", error);
  }
};

// Delete message from SQS after processing
const deleteMessageFromQueue = async (receiptHandle) => {
  try {
    const params = {
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle,
    };
    const deleteMessage = new DeleteMessageCommand(params);
    await sqsClient.send(deleteMessage);
    console.log("Message deleted from SQS");
  } catch (error) {
    console.error("Error deleting message from SQS:", error);
  }
};

module.exports = {sendMessageToQueue, receiveMessagesFromQueue}