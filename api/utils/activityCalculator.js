const Activity = require("../models/activity");

const calculateUserActivity = async (userId) => {
  try {
    // Get total coins earned by the user
    const totalCoins = await Activity.sum("coinsEarned", {
      where: { userId },
    });

    // Get all activities for the user
    const activities = await Activity.findAll({
      where: { userId },
      attributes: ["type", "description", "coinsEarned", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    // Count achievements unlocked
    const achievementCount = await Activity.count({
      where: {
        userId,
        type: "achievement",
      },
    });

    return {
      totalCoins: totalCoins || 0,
      achievementCount,
      activities,
    };
  } catch (error) {
    console.error("Error calculating user activity:", error);
    throw new Error("Activity calculation failed");
  }
};

module.exports = { calculateUserActivity };
