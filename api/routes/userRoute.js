const express = require("express");
const authController = require("../controller/authController.js");
const awsController = require("../controller/awsController.js");
const { authenticate } = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);

//? file uploading at diskstorage
router.put("/profile", authenticate, upload.single("profilePic"), authController.updateProfile);

//? file uploading at AWS-S3
router.put("/upload-aws", authenticate, upload.single("file"), awsController.uploadFileToAWS);

//? Send msg to SQS
router.post("/send-message", awsController.sendMessageToSQS);

router.post("/change-password", authenticate, authController.changePassword);
router.post("/forgot-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);

router.get("/user-activity", authenticate, authController.getUserActivity);

module.exports = router;
