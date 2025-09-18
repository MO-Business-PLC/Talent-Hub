import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// Get job trends over time
export const getJobTrends = async (req, res) => {
  try {
    const { period = '30d', groupBy = 'day' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Group by day, week, or month
    let groupFormat;
    switch (groupBy) {
      case 'day':
        groupFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupFormat = '%Y-%U';
        break;
      case 'month':
        groupFormat = '%Y-%m';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    const jobTrends = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          total: { $sum: '$count' },
          open: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'OPEN'] }, '$count', 0]
            }
          },
          closed: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'CLOSED'] }, '$count', 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get job type trends
    const jobTypeTrends = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            jobType: '$jobType'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          jobTypes: {
            $push: {
              type: '$_id.jobType',
              count: '$count'
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get sector trends
    const sectorTrends = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          sector: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            sector: '$sector'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          sectors: {
            $push: {
              sector: '$_id.sector',
              count: '$count'
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      period,
      groupBy,
      dateRange: {
        start: startDate,
        end: now
      },
      trends: {
        jobCounts: jobTrends,
        jobTypes: jobTypeTrends,
        sectors: sectorTrends
      }
    });
  } catch (error) {
    console.error('Job trends error:', error);
    res.status(500).json({ error: 'Failed to fetch job trends' });
  }
};

// Get application trends over time
export const getApplicationTrends = async (req, res) => {
  try {
    const { period = '30d', groupBy = 'day' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Group by day, week, or month
    let groupFormat;
    switch (groupBy) {
      case 'day':
        groupFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupFormat = '%Y-%U';
        break;
      case 'month':
        groupFormat = '%Y-%m';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    // Application status trends
    const applicationTrends = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          total: { $sum: '$count' },
          applied: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'applied'] }, '$count', 0]
            }
          },
          shortlisted: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'shortlisted'] }, '$count', 0]
            }
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'rejected'] }, '$count', 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Application success rate trends
    const successRateTrends = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: '$createdAt' } }
          },
          total: { $sum: 1 },
          successful: {
            $sum: {
              $cond: [
                { $in: ['$status', ['shortlisted']] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $addFields: {
          successRate: {
            $multiply: [
              { $divide: ['$successful', '$total'] },
              100
            ]
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Applications per job trends
    const applicationsPerJob = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      {
        $unwind: '$job'
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            jobId: '$jobId'
          },
          jobTitle: { $first: '$job.title' },
          applicationCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          avgApplicationsPerJob: { $avg: '$applicationCount' },
          maxApplications: { $max: '$applicationCount' },
          jobs: {
            $push: {
              title: '$jobTitle',
              applications: '$applicationCount'
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      period,
      groupBy,
      dateRange: {
        start: startDate,
        end: now
      },
      trends: {
        applicationCounts: applicationTrends,
        successRates: successRateTrends,
        applicationsPerJob: applicationsPerJob
      }
    });
  } catch (error) {
    console.error('Application trends error:', error);
    res.status(500).json({ error: 'Failed to fetch application trends' });
  }
};

// Get user registration trends
export const getUserTrends = async (req, res) => {
  try {
    const { period = '30d', groupBy = 'day' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Group by day, week, or month
    let groupFormat;
    switch (groupBy) {
      case 'day':
        groupFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupFormat = '%Y-%U';
        break;
      case 'month':
        groupFormat = '%Y-%m';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            role: '$role'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          total: { $sum: '$count' },
          employees: {
            $sum: {
              $cond: [{ $eq: ['$_id.role', 'employee'] }, '$count', 0]
            }
          },
          employers: {
            $sum: {
              $cond: [{ $eq: ['$_id.role', 'employer'] }, '$count', 0]
            }
          },
          admins: {
            $sum: {
              $cond: [{ $eq: ['$_id.role', 'admin'] }, '$count', 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      period,
      groupBy,
      dateRange: {
        start: startDate,
        end: now
      },
      trends: {
        userCounts: userTrends
      }
    });
  } catch (error) {
    console.error('User trends error:', error);
    res.status(500).json({ error: 'Failed to fetch user trends' });
  }
};

// Get comprehensive analytics for dashboard
export const getAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get top performing jobs
    const topJobs = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      {
        $unwind: '$job'
      },
      {
        $group: {
          _id: '$jobId',
          title: { $first: '$job.title' },
          totalApplications: { $sum: 1 },
          shortlisted: {
            $sum: {
              $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          successRate: {
            $multiply: [
              { $divide: ['$shortlisted', '$totalApplications'] },
              100
            ]
          }
        }
      },
      {
        $sort: { totalApplications: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get most active employers
    const topEmployers = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'employer'
        }
      },
      {
        $unwind: '$employer'
      },
      {
        $group: {
          _id: '$createdBy',
          name: { $first: '$employer.name' },
          email: { $first: '$employer.email' },
          jobsPosted: { $sum: 1 },
          openJobs: {
            $sum: {
              $cond: [{ $eq: ['$status', 'OPEN'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { jobsPosted: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get application conversion funnel
    const conversionFunnel = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = conversionFunnel.reduce((sum, item) => sum + item.count, 0);
    const funnel = conversionFunnel.map(item => ({
      stage: item._id,
      count: item.count,
      percentage: Math.round((item.count / totalApplications) * 100)
    }));

    res.status(200).json({
      period,
      dateRange: {
        start: startDate,
        end: now
      },
      analytics: {
        topJobs,
        topEmployers,
        conversionFunnel: funnel
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
