import User from "../models/User.js";
import Job from "../models/Job.js";

// Public stats for homepage: totals and today's new jobs
export const getPublicStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [totalJobs, userByRole, jobsToday] = await Promise.all([
      Job.countDocuments({}),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Job.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),
    ]);

    const employees = userByRole.find((r) => r._id === "employee")?.count || 0;
    const employers = userByRole.find((r) => r._id === "employer")?.count || 0;

    return res.status(200).json({
      jobs: {
        total: totalJobs,
        today: jobsToday,
      },
      users: {
        employees,
        employers,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch public stats" });
  }
};


