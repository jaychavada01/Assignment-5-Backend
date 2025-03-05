const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");

const NotificationToken = sequelize.define("NotificationToken", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  fcmtoken: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, // Prevent duplicate tokens
  },
  devicetype: {
    type: DataTypes.ENUM("android", "ios", "web"),
    allowNull: true,
  },
});

// Define relationships
NotificationToken.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(NotificationToken, { foreignKey: "userId" });

module.exports = NotificationToken;
