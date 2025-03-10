const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

const userRoute = require("./routes/userRoute.js");
const paymentRoute = require("./routes/paymentRoute.js");

const { STATUS_CODES } = require("./config/constant");
const { sequelize } = require("./config/database.js");
const i18n = require("./middleware/i18n.js");
const swaggerDocs = require("./config/swagger.js");

require("dotenv").config({ path: `${process.cwd()}/api/.env` });
const PORT = process.env.PORT || 3000;

//? Middleware
app.use(cookieParser());
app.use(i18n.init);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//? Serve Swagger API Documentation
swaggerDocs(app);

//? Middleware to set language dynamically
app.use((req, res, next) => {
  let lang = req.query.lang || req.cookies.lang || "en"; //? Check query, then cookie, then default
  req.setLocale(lang);
  next();
});

//? Serve Uploaded Files Correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//? Routes
app.use("/api", userRoute);
app.use("/user/pay", paymentRoute);

//? Handle invalid routes
app.use("*", (req, res) => {
  res
    .status(STATUS_CODES.BAD_REQUEST)
    .json({ message: res.t("auth.Invalid_Route") });
});

//? Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced!");
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(
      `📄 Swagger docs available at http://localhost:${PORT}/api-docs`
    );
  });
});
