module.exports = {
  //? HTTP Status Codes
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
  },

  // ? Days
  DAYS: {
    CONSECUTIVE_DAY: 1,
  },

  //? Reward Points for Activities
  REWARD_POINTS: {
    DAILY_LOGIN: 10,
    REFERRAL_BONUS: 50,
    PROFILE_COMPLETION: 30,
    EARLY_BIRD: 10, // 3 consecutive logins
    NETWORKER: 50, // 5 successful referrals
  },

  //? Activities
  ACTIVITIES:{
    REFERRAL: "referral",
    ACHIEVEMENT: "achievement",
    NETWORKER: "networker",
    DAILY_LOGIN:"daily_login",
    PROFILE_COMPLETION: "profile_update"
  },

  //? Validation Rules
  VALIDATION_RULES: {
    SIGNUP: {
      firstName: "required|string|min:2",
      lastName: "required|string|min:2",
      email: "required|email",
      password:
        "required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/",
      referralCode: "string|min:6|max:12",
    },
    LOGIN: {
      email: "required|email",
      password: "required|string|min:8",
    },
    CHANGE_PASSWORD: {
      oldPassword: "required|string|min:8",
      newPassword:
        "required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/",
    },
    FORGET_PASSWORD: {
      email: "required|email",
    },
    RESET_PASSWORD: {
      token: "required|string",
      newPassword:
        "required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/",
    },
  },
};
