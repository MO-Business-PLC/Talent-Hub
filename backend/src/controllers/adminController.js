import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// ===== USER MANAGEMENT =====

// Get all users with pagination and filtering
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: totalUsers,
      employee: userStats.find(s => s._id === 'employee')?.count || 0,
      employer: userStats.find(s => s._id === 'employer')?.count || 0,
      admin: userStats.find(s => s._id === 'admin')?.count || 0,
    };

    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      stats
    });
  } catch (error) {
    console.error('Admin getAllUsers error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's job applications and created jobs
    const [applications, createdJobs] = await Promise.all([
      Application.find({ userId }).populate('jobId', 'title status'),
      Job.find({ createdBy: userId }).select('title status createdAt')
    ]);

    res.status(200).json({
      user,
      applications,
      createdJobs
    });
  } catch (error) {
    console.error('Admin getUserById error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['employee', 'employer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Admin updateUserRole error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete associated data
    await Promise.all([
      Job.deleteMany({ createdBy: userId }),
      Application.deleteMany({ userId })
    ]);

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Admin deleteUser error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// ===== JOB MANAGEMENT =====

// Get all jobs with admin details
export const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('createdBy', 'name email role')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Get job statistics
    const jobStats = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: totalJobs,
      open: jobStats.find(s => s._id === 'OPEN')?.count || 0,
      closed: jobStats.find(s => s._id === 'CLOSED')?.count || 0,
    };

    res.status(200).json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      stats
    });
  } catch (error) {
    console.error('Admin getAllJobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Update job status
export const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    if (!['OPEN', 'CLOSED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({
      message: 'Job status updated successfully',
      job
    });
  } catch (error) {
    console.error('Admin updateJobStatus error:', error);
    res.status(500).json({ error: 'Failed to update job status' });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Delete associated applications
    await Application.deleteMany({ jobId });

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      message: 'Job and associated applications deleted successfully'
    });
  } catch (error) {
    console.error('Admin deleteJob error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

// ===== APPLICATION MANAGEMENT =====

// Get all applications with admin details
export const getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    let applications;
    if (search) {
      // If search is provided, we need to search in populated fields
      applications = await Application.find(query)
        .populate({
          path: 'userId',
          select: 'name email role',
          match: { $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]}
        })
        .populate({
          path: 'jobId',
          select: 'title status createdBy',
          match: { title: { $regex: search, $options: 'i' } }
        })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);

      // Filter out applications where neither user nor job matched
      applications = applications.filter(app => app.userId && app.jobId);
    } else {
      applications = await Application.find(query)
        .populate('userId', 'name email role')
        .populate('jobId', 'title status createdBy')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);
    }

    const totalApplications = await Application.countDocuments(query);
    const totalPages = Math.ceil(totalApplications / limit);

    // Get application statistics
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: totalApplications,
      applied: applicationStats.find(s => s._id === 'applied')?.count || 0,
      shortlisted: applicationStats.find(s => s._id === 'shortlisted')?.count || 0,
      rejected: applicationStats.find(s => s._id === 'rejected')?.count || 0,
    };

    res.status(200).json({
      applications,
      pagination: {
        currentPage: page,
        totalPages,
        totalApplications,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      stats
    });
  } catch (error) {
    console.error('Admin getAllApplications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['applied', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true, runValidators: true }
    ).populate('userId', 'name email').populate('jobId', 'title');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Admin updateApplicationStatus error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

// ===== DASHBOARD STATISTICS =====

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      userStats,
      jobStats,
      applicationStats,
      recentUsers,
      recentJobs,
      recentApplications
    ] = await Promise.all([
      // User statistics
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Job statistics
      Job.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Application statistics
      Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Recent users
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(5),
      
      // Recent jobs
      Job.find().populate('createdBy', 'name').select('title status createdAt').sort({ createdAt: -1 }).limit(5),
      
      // Recent applications
      Application.find()
        .populate('userId', 'name email')
        .populate('jobId', 'title')
        .select('status createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Format statistics
    const formattedUserStats = {
      total: userStats.reduce((sum, stat) => sum + stat.count, 0),
      employee: userStats.find(s => s._id === 'employee')?.count || 0,
      employer: userStats.find(s => s._id === 'employer')?.count || 0,
      admin: userStats.find(s => s._id === 'admin')?.count || 0,
    };

    const formattedJobStats = {
      total: jobStats.reduce((sum, stat) => sum + stat.count, 0),
      open: jobStats.find(s => s._id === 'OPEN')?.count || 0,
      closed: jobStats.find(s => s._id === 'CLOSED')?.count || 0,
    };

    const formattedApplicationStats = {
      total: applicationStats.reduce((sum, stat) => sum + stat.count, 0),
      applied: applicationStats.find(s => s._id === 'applied')?.count || 0,
      shortlisted: applicationStats.find(s => s._id === 'shortlisted')?.count || 0,
      rejected: applicationStats.find(s => s._id === 'rejected')?.count || 0,
    };

    // Calculate growth rates (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [
      recentUserGrowth,
      recentJobGrowth,
      recentApplicationGrowth
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Application.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    const [
      previousUserGrowth,
      previousJobGrowth,
      previousApplicationGrowth
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      Job.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      Application.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })
    ]);

    const calculateGrowthRate = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    res.status(200).json({
      overview: {
        users: formattedUserStats,
        jobs: formattedJobStats,
        applications: formattedApplicationStats,
      },
      growth: {
        users: {
          current: recentUserGrowth,
          previous: previousUserGrowth,
          rate: calculateGrowthRate(recentUserGrowth, previousUserGrowth)
        },
        jobs: {
          current: recentJobGrowth,
          previous: previousJobGrowth,
          rate: calculateGrowthRate(recentJobGrowth, previousJobGrowth)
        },
        applications: {
          current: recentApplicationGrowth,
          previous: previousApplicationGrowth,
          rate: calculateGrowthRate(recentApplicationGrowth, previousApplicationGrowth)
        }
      },
      recent: {
        users: recentUsers,
        jobs: recentJobs,
        applications: recentApplications
      }
    });
  } catch (error) {
    console.error('Admin getDashboardStats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

// ===== SYSTEM MANAGEMENT =====

// Get system health and metrics
export const getSystemHealth = async (req, res) => {
  try {
    const [
      dbStats,
      memoryUsage,
      uptime
    ] = await Promise.all([
      // Database connection status
      User.db.readyState === 1 ? 'connected' : 'disconnected',
      // Memory usage (basic)
      process.memoryUsage(),
      // Uptime
      process.uptime()
    ]);

    res.status(200).json({
      status: 'healthy',
      database: {
        status: dbStats,
        models: {
          users: await User.countDocuments(),
          jobs: await Job.countDocuments(),
          applications: await Application.countDocuments()
        }
      },
      server: {
        uptime: Math.floor(uptime),
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        },
        nodeVersion: process.version,
        platform: process.platform
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Admin getSystemHealth error:', error);
    res.status(500).json({ error: 'Failed to fetch system health' });
  }
};
