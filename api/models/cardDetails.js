const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");

const CardDetails = sequelize.define(
  "CardDetails",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    stripeCardId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last4Digit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Transaction Details
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    client_secret:{
        type: DataTypes.STRING,
        allowNull: true
    }
  },
  {
    timestamps: true,
  }
);

User.hasMany(CardDetails, { foreignKey: "userId", onDelete: "CASCADE" });
CardDetails.belongsTo(User, { foreignKey: "userId" });

module.exports = CardDetails;
