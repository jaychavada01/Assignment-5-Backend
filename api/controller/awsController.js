const { STATUS_CODES } = require("../config/constant");
const { uploadFileToS3 } = require("../utils/s3");
const { sendMessageToQueue } = require("../utils/sqs");

const uploadFileToAWS = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: res.t("aws.no_fileupload") });
    }

    // Upload to S3
    const fileUrl = await uploadFileToS3(req.file);

    res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: res.t("aws.upload_success"), fileUrl });
  } catch (error) {
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: res.t("aws.upload_failed"), details: error.message });
  }
};

const sendMessageToSQS = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error:  res.t("aws.message_body")});
    }

    const messageId = await sendMessageToQueue({
      text: message,
      timestamp: Date.now(),
    });

    res.status(STATUS_CODES.SUCCESS).json({ message: res.t("aws.sqs_message_sent"), messageId });
  } catch (error) {
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: res.t("aws.sqs_message_failed"), details: error.message });
  }
};

module.exports = { uploadFileToAWS,sendMessageToSQS };
