const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/mailer");
const Validator = require("validatorjs");
const { Op } = require("sequelize");

const User = require("../models/user");
const Activity = require("../models/activity");
const NotificationToken = require("../models/notificationToken");

const {
  STATUS_CODES,
  REWARD_POINTS,
  VALIDATION_RULES,
  ACTIVITIES,
} = require("../config/constant");

const { calculateUserActivity } = require("../utils/activityCalculator");
const sendPushNotification = require("../utils/notification");

const generateToken = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  user.accessToken = token;
  await user.save();
  return token;
};

const validateRequest = (data, rules, res) => {
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: validation.errors.all() });
    return false;
  }
  return true;
};

const createActivity = async (userId, type, description, coinsEarned) => {
  const activity = await Activity.create({
    userId,
    type,
    description,
    coinsEarned,
  });

  await sendPushNotification(userId, "New Activity", description);

  return activity;
};

const signUp = async (req, res) => {
  try {
    if (!validateRequest(req.body, VALIDATION_RULES.SIGNUP, res)) return;

    const {
      firstName,
      lastName,
      email,
      password,
      referralCode,
      fcmtoken,
      devicetype,
    } = req.body;

    if (await User.findOne({ where: { email } })) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "User already registered!" });
    }

    let referringUser = referralCode
      ? await User.findOne({ where: { referralCode } })
      : null;
    if (referralCode && !referringUser) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Invalid referral code!" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      referredBy: referringUser?.id,
    });

    if (fcmtoken && devicetype) {
      await NotificationToken.create({ userId: user.id, fcmtoken, devicetype });
    }

    if (referringUser) {
      user.coins += REWARD_POINTS.REFERRAL_BONUS;
      referringUser.coins += REWARD_POINTS.REFERRAL_BONUS;
      referringUser.referredCount += 1;
      await user.save();
      await referringUser.save();

      await createActivity(
        referringUser.id,
        ACTIVITIES.REFERRAL,
        `Referred new user: ${user.email}`,
        REWARD_POINTS.REFERRAL_BONUS
      );

      if (referringUser.referredCount === 5) {
        referringUser.coins += REWARD_POINTS.NETWORKER;
        await referringUser.save();
        await createActivity(
          referringUser.id,
          ACTIVITIES.ACHIEVEMENT,
          "Successfully referred 5 friends!",
          REWARD_POINTS.NETWORKER
        );
      }
    }

    const token = await generateToken(user);

    const htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333;">Hey...</h2>
    <p>Hello <strong>${user.firstName}</strong>,</p>
    <p>We received details of you. we are welcoming you to onboard!</p>
  </div>`;

    // Send reset email with token
    await sendEmail(email, "Welcomt to Our platform!", htmlContent);

    res
      .status(STATUS_CODES.CREATED)
      .json({ message: "User registered successfully", accessToken: token });
  } catch (error) {
    console.error("SignUp Error:", error);
    res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, fcmtoken, devicetype } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const today = new Date().toISOString().split("T")[0];
    const lastLogin = user.lastLoginDate
      ? new Date(user.lastLoginDate).toISOString().split("T")[0]
      : null;
    user.loginCount += 1;

    if (lastLogin !== today) {
      user.coins += REWARD_POINTS.DAILY_LOGIN;
      user.lastLoginDate = new Date();
      user.consecutiveLogins += 1;
      await createActivity(
        user.id,
        ACTIVITIES.DAILY_LOGIN,
        "Daily login reward",
        REWARD_POINTS.DAILY_LOGIN
      );

      if (user.consecutiveLogins === 3) {
        user.coins += REWARD_POINTS.EARLY_BIRD;
        await createActivity(
          user.id,
          ACTIVITIES.ACHIEVEMENT,
          "Unlocked 'Early Bird' achievement - 3 consecutive logins",
          REWARD_POINTS.EARLY_BIRD
        );
        user.consecutiveLogins = 0;
      }
    } else {
      user.consecutiveLogins = 1;
    }

    await user.save();
    const token = await generateToken(user);

    if (fcmtoken && devicetype) {
      await NotificationToken.upsert({ userId: user.id, fcmtoken, devicetype });
    }

    res.json({
      message: "Login successful",
      accessToken: token,
      coins: user.coins,
      loginCount: user.loginCount,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const user = req.user;
    const token = req.headers.authorization.split(" ")[1];

    // Add token to blacklist array
    user.blacklistedTokens = [...(user.blacklistedTokens || []), token];
    user.accessToken = null; // Clear active token
    await user.save();

    res.status(STATUS_CODES.SUCCESS).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Error logging out" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio } = req.body;
    let profilePic = req.file ? `/api/uploads/${req.file.filename}` : null;

    // Fetch user details
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile fields
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;

    // Check if the profile is complete
    const wasProfileIncomplete = !user.isProfileComplete;
    if (user.bio && user.profilePic) {
      if (wasProfileIncomplete) {
        user.isProfileComplete = true; // Mark profile as complete
        user.coins += REWARD_POINTS.PROFILE_COMPLETION; // Reward user

        // Log profile completion activity
        await Activity.create({
          userId: user.id,
          type: ACTIVITIES.PROFILE_COMPLETION,
          description:
            "Unlocked 'Verified Profile' achievement - Profile 100% complete",
          coinsEarned: REWARD_POINTS.PROFILE_COMPLETION,
        });
      }
    }

    await user.save();

    res.json({
      message: "Profile updated successfully!",
      isProfileComplete: user.isProfileComplete,
      coins: user.coins,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    if (!validateRequest(req.body, VALIDATION_RULES.FORGET_PASSWORD, res))
      return;

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "User not found." });
    }

    // Generate unique token and expiry time (10 min)
    const forgetPasswordToken = uuidv4();
    const forgetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with reset token and expiry
    user.forgetPasswordToken = forgetPasswordToken;
    user.forgetPasswordTokenExpiry = forgetPasswordTokenExpiry;

    // Ensure changes are saved in the DB
    await user.save();

    const htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello <strong>${user.firstName}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env.FRONTEND_URL}/reset-password?token=${forgetPasswordToken}" 
        style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
        Reset Password
      </a>
    </div>
    <p>If you didn't request this, you can ignore this email. Your password will remain unchanged.</p>
  </div>`;

    // Send reset email with token
    await sendEmail(email, "Password Reset Request", htmlContent);

    res.status(STATUS_CODES.SUCCESS).json({
      message: "Password reset email sent successfully!",
      forgetPasswordToken, // Include in response for debugging (will Remove in production)
    });
  } catch (error) {
    console.error("Forget Password Error:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Server error. Please try again later." });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (!validateRequest(req.body, VALIDATION_RULES.RESET_PASSWORD, res))
      return;

    const { email, token, newPassword } = req.body;

    // Find user with matching email, valid token, and non-expired token
    const user = await User.findOne({
      where: {
        email, // Ensures token belongs to the correct user
        forgetPasswordToken: token,
        forgetPasswordTokenExpiry: { [Op.gt]: new Date() }, // Ensures token is still valid
      },
    });

    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Invalid or expired token." });
    }

    // Hash and update the new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear the token fields after successful reset
    user.forgetPasswordToken = null;
    user.forgetPasswordTokenExpiry = null;
    await user.save();

    res.status(STATUS_CODES.SUCCESS).json({
      message:
        "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Server error. Please try again later." });
  }
};

const changePassword = async (req, res) => {
  try {
    if (!validateRequest(req.body, VALIDATION_RULES.CHANGE_PASSWORD, res))
      return;

    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Extracted from authenticated token

    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "User not found." });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Incorrect old password!" });
    }

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Optionally: Blacklist previous tokens (forcing re-login)
    user.accessToken = null;
    user.blacklistedTokens.push(req.headers.authorization); // Blacklist current token
    await user.save();

    res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: "Password changed successfully! Please log in again." });
  } catch (error) {
    console.error("Change Password Error:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Server error. Please try again later." });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const activityData = await calculateUserActivity(userId);

    res.status(STATUS_CODES.SUCCESS).json({
      message: "User activity retrieved successfully",
      data: activityData,
    });
  } catch (error) {
    console.error("Get User Activity Error:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Failed to retrieve user activity" });
  }
};

module.exports = {
  generateToken,
  signUp,
  login,
  logout,
  updateProfile,
  forgetPassword,
  resetPassword,
  changePassword,
  getUserActivity
};
