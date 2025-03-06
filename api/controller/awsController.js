const { STATUS_CODES } = require("../config/constant");
const { uploadFileToS3 } = require("../utils/s3");
const { sendMessageToQueue } = require("../utils/sqs");

const uploadFileToAWS = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "No file uploaded" });
    }

    // Upload to S3
    const fileUrl = await uploadFileToS3(req.file);

    res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: "File uploaded successfully", fileUrl });
  } catch (error) {
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Failed to upload file", details: error.message });
  }
};

const sendMessageToSQS = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Message body is required" });
    }

    const messageId = await sendMessageToQueue({
      text: message,
      timestamp: Date.now(),
    });

    res.status(STATUS_CODES.SUCCESS).json({ message: "Message sent successfully", messageId });
  } catch (error) {
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Failed to send message", details: error.message });
  }
};

module.exports = { uploadFileToAWS,sendMessageToSQS };
