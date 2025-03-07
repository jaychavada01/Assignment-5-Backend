const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { STATUS_CODES } = require("../config/constant");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: res.t("auth.unauthorized") });
    }

    const token = authHeader.split(" ")[1];

    // Verify token (automatically throws an error if expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: res.t("auth.unauthorized") });
    }

    // Ensure blacklistedTokens is an array before checking
    if (
      Array.isArray(user.blacklistedTokens) &&
      user.blacklistedTokens.includes(token)
    ) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: res.t("auth.blacklisted_token") });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      message: res.t("auth.invalid_token"),
    });
  }
};

module.exports = { authenticate };
