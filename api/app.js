const express = require("express");
const path = require("path");

const app = express();

const userRoute = require("./routes/userRoute.js");
const paymentRoute = require("./routes/paymentRoute.js");

const { STATUS_CODES } = require("./config/constant");
const { sequelize } = require("./config/database.js");

require("dotenv").config({ path: `${process.cwd()}/api/.env` });
;

const PORT = process.env.PORT || 3000;

//? Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//? Serve Uploaded Files Correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//? Routes
app.use("/users", userRoute);
app.use("/user/pay", paymentRoute);

app.use("*", (req, res) => {
  res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Invalid route!" });
});

//? Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced!");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});