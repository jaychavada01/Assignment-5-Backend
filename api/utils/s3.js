require("dotenv").config();

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Upload File to S3
const uploadFileToS3 = async (file) => {
  const fileKey = `uploads/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};

// Generate Signed URL for Direct Access
const generatePresignedUrl = async (fileKey) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  });

  try {
    return await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hr
    });
  } catch (error) {
    console.error("Presigned URL Error:", error);
    throw error;
  }
};

module.exports = { uploadFileToS3, generatePresignedUrl };
