const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100, // Default starting coins
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: true, // Store active token for better security handling
    },
    forgetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true, // Store
    },
    forgetPasswordTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referralCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    referredBy: {
      type: DataTypes.UUID, // Store UUID of referring user
      allowNull: true,
    },
    referredCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Track how many users they referred
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    loginCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true, // Profile picture URL
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true, // User bio
    },
    isProfileComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // If all fields are set, mark as true
    },
    blacklistedTokens: {
      type: DataTypes.JSON, // Store blacklisted tokens as an array of strings
      allowNull: true,
      defaultValue: [],
    },
    // stripe implementation
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null initially, but will be set after Stripe customer creation
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before creating a user
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);

  // Generate unique referral code
  if (!user.referralCode) {
    let referralCode;
    let isUnique = false;

    while (!isUnique) {
      const cleanFirstName = user.firstName.replace(/\s+/g, "").toLowerCase();
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      referralCode = `${cleanFirstName}${randomNumber}`;

      const existingUser = await User.findOne({ where: { referralCode } });
      if (!existingUser) {
        isUnique = true;
      }
    }
    user.referralCode = referralCode;
  }
});

// Before updating user, check if profile is complete
User.beforeUpdate(async (user) => {
  if (user.profilePic && user.bio) {
    if (!user.isProfileComplete) {
      user.isProfileComplete = true;
      user.coins += 30; // Reward user for profile completion
    }
  }
});

module.exports = User;
