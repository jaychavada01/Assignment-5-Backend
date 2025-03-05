const admin = require("../config/firebase");
const NotificationToken = require("../models/notificationToken");

const sendPushNotification = async (userId, title, body) => {
  try {
    const tokens = await NotificationToken.findAll({ where: { userId } });

    if (!tokens.length) {
      console.log(`No FCM tokens found for user ${userId}`);
      return;
    }

    const registrationTokens = tokens.map((token) => token.fcmtoken);

    const message = {
      notification: { title, body },
      tokens: registrationTokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log("Push Notification Sent:", response);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

module.exports = sendPushNotification;