import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

// Mock data for users
const mockUsers = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    password: "password123",
    role: "admin"
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "password123",
    role: "employer"
  },
  {
    name: "Mike Wilson",
    email: "mike.wilson@example.com",
    password: "password123",
    role: "employer"
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    password: "password123",
    role: "applicant"
  },
  {
    name: "David Brown",
    email: "david.brown@example.com",
    password: "password123",
    role: "applicant"
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    password: "password123",
    role: "applicant"
  },
  {
    name: "Tom Miller",
    email: "tom.miller@example.com",
    password: "password123",
    role: "applicant"
  },
  {
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    password: "password123",
    role: "applicant"
  }
];

// Mock data for jobs
const mockJobs = [
  {
    title: "Senior Full Stack Developer",
    description: "We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies including React, Node.js, and MongoDB. The ideal applicant should have strong problem-solving skills and experience with cloud platforms.",
    jobType: "FULL_TIME",
    jobSite: "REMOTE",
    location: {
      city: "San Francisco",
      country: "USA"
    },
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript", "AWS"],
    sector: "Technology",
    experienceLevel: "SENIOR",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    createdBy: null, // Will be set to employer ID
    status: "OPEN"
  },
  {
    title: "Frontend Developer",
    description: "Join our frontend team to build beautiful and responsive user interfaces. You'll work with React, TypeScript, and modern CSS frameworks. We're looking for someone passionate about user experience and clean code.",
    jobType: "FULL_TIME",
    jobSite: "HYBRID",
    location: {
      city: "New York",
      country: "USA"
    },
    skills: ["React", "TypeScript", "CSS", "HTML", "Redux", "Jest"],
    sector: "Technology",
    experienceLevel: "MID",
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  },
  {
    title: "Backend Developer",
    description: "We need a skilled Backend Developer to design and implement scalable APIs and microservices. Experience with Node.js, Python, or Java is required. You'll work on high-traffic applications and contribute to our architecture decisions.",
    jobType: "FULL_TIME",
    jobSite: "ONSITE",
    location: {
      city: "London",
      country: "UK"
    },
    skills: ["Node.js", "Python", "PostgreSQL", "Docker", "Kubernetes", "REST APIs"],
    sector: "Technology",
    experienceLevel: "SENIOR",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  },
  {
    title: "DevOps Engineer",
    description: "Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You'll work with AWS, Docker, Kubernetes, and various monitoring tools. Experience with infrastructure as code is a plus.",
    jobType: "FULL_TIME",
    jobSite: "REMOTE",
    location: {
      city: "Berlin",
      country: "Germany"
    },
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Linux"],
    sector: "Technology",
    experienceLevel: "MID",
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  },
  {
    title: "Data Scientist",
    description: "Join our data team to analyze large datasets and build machine learning models. You'll work with Python, R, and various ML frameworks. Experience with statistical analysis and data visualization is essential.",
    jobType: "FULL_TIME",
    jobSite: "HYBRID",
    location: {
      city: "Toronto",
      country: "Canada"
    },
    skills: ["Python", "R", "Machine Learning", "Pandas", "NumPy", "TensorFlow"],
    sector: "Data Science",
    experienceLevel: "SENIOR",
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  },
  {
    title: "UI/UX Designer",
    description: "We're seeking a creative UI/UX Designer to design intuitive and engaging user experiences. You'll work closely with product managers and developers to create wireframes, prototypes, and design systems.",
    jobType: "FULL_TIME",
    jobSite: "REMOTE",
    location: {
      city: "Sydney",
      country: "Australia"
    },
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"],
    sector: "Design",
    experienceLevel: "MID",
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  },
  {
    title: "Product Manager",
    description: "Lead product development from conception to launch. You'll work with cross-functional teams to define product requirements, prioritize features, and ensure successful delivery. Experience with agile methodologies is required.",
    jobType: "FULL_TIME",
    jobSite: "ONSITE",
    location: {
      city: "Seattle",
      country: "USA"
    },
    skills: ["Product Management", "Agile", "Jira", "Analytics", "User Research", "Strategy"],
    sector: "Product",
    experienceLevel: "SENIOR",
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  },
  {
    title: "Marketing Specialist",
    description: "Drive our digital marketing efforts across multiple channels. You'll create and execute marketing campaigns, manage social media presence, and analyze performance metrics. Experience with marketing automation tools is preferred.",
    jobType: "FULL_TIME",
    jobSite: "HYBRID",
    location: {
      city: "Amsterdam",
      country: "Netherlands"
    },
    skills: ["Digital Marketing", "Social Media", "Google Analytics", "Content Creation", "SEO", "Email Marketing"],
    sector: "Marketing",
    experienceLevel: "MID",
    deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  },
  {
    title: "Sales Representative",
    description: "Join our sales team to build relationships with clients and drive revenue growth. You'll identify new business opportunities, conduct sales presentations, and maintain customer relationships. B2B sales experience is required.",
    jobType: "FULL_TIME",
    jobSite: "ONSITE",
    location: {
      city: "Chicago",
      country: "USA"
    },
    skills: ["Sales", "CRM", "Lead Generation", "Negotiation", "Communication", "B2B"],
    sector: "Sales",
    experienceLevel: "JUNIOR",
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  },
  {
    title: "Customer Success Manager",
    description: "Ensure our customers achieve their goals and have a positive experience with our product. You'll work closely with customers to understand their needs, provide support, and identify opportunities for growth.",
    jobType: "FULL_TIME",
    jobSite: "REMOTE",
    location: {
      city: "Dublin",
      country: "Ireland"
    },
    skills: ["Customer Success", "Account Management", "Communication", "Problem Solving", "CRM", "Analytics"],
    sector: "Customer Success",
    experienceLevel: "MID",
    deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    createdBy: null,
    status: "OPEN"
  }
];

// Mock data for applications
const mockApplications = [
  {
    jobId: null, // Will be set to actual job ID
    userId: null, // Will be set to actual user ID
    resumeUrl: "https://example.com/resumes/emily-davis-resume.pdf",
    coverLetter: "I am very interested in this position and believe my skills in React and TypeScript make me a great fit for your team. I have 3 years of experience building responsive web applications and am passionate about creating excellent user experiences.",
    status: "applied"
  },
  {
    jobId: null,
    userId: null,
    resumeUrl: "https://example.com/resumes/david-brown-resume.pdf",
    coverLetter: "I am excited about the opportunity to work as a Backend Developer. My experience with Node.js and microservices architecture aligns perfectly with your requirements. I'm looking forward to contributing to your high-traffic applications.",
    status: "shortlisted"
  },
  {
    jobId: null,
    userId: null,
    resumeUrl: "https://example.com/resumes/lisa-anderson-resume.pdf",
    coverLetter: "As a DevOps Engineer with 4 years of experience, I am confident I can help optimize your cloud infrastructure and CI/CD processes. I have extensive experience with AWS, Docker, and Kubernetes.",
    status: "applied"
  },
  {
    jobId: null,
    userId: null,
    resumeUrl: "https://example.com/resumes/tom-miller-resume.pdf",
    coverLetter: "I am passionate about data science and machine learning. With my background in Python and statistical analysis, I believe I can contribute significantly to your data team and help build innovative ML models.",
    status: "applied"
  },
  {
    jobId: null,
    userId: null,
    resumeUrl: "https://example.com/resumes/jessica-taylor-resume.pdf",
    coverLetter: "I am a creative UI/UX Designer with a strong portfolio of user-centered designs. I excel at creating intuitive interfaces and have experience working with cross-functional teams to deliver exceptional user experiences.",
    status: "rejected"
  }
];

// Function to seed the database
export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Application.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Drop legacy indexes that may conflict (e.g., text index on skills)
    try {
      await Job.collection.dropIndexes();
      console.log('🧱 Dropped existing Job indexes');
    } catch (e) {
      if (e?.codeName === 'NamespaceNotFound') {
        // Collection may not exist yet; ignore
      } else {
        console.warn('⚠️  Could not drop Job indexes:', e?.message || e);
      }
    }

    // Create users
    const createdUsers = await User.insertMany(mockUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Get employer IDs for job creation
    const employers = createdUsers.filter(user => user.role === 'employer');
    const applicants = createdUsers.filter(user => user.role === 'applicant');

    // Update job data with employer IDs
    const jobsWithemployers = mockJobs.map((job, index) => ({
      ...job,
      createdBy: employers[index % employers.length]._id
    }));

    // Create jobs
    const createdJobs = await Job.insertMany(jobsWithemployers);
    console.log(`💼 Created ${createdJobs.length} jobs`);

    // Create applications with actual job and user IDs
    const applicationsWithIds = mockApplications.map((app, index) => ({
      ...app,
      jobId: createdJobs[index % createdJobs.length]._id,
      userId: applicants[index % applicants.length]._id
    }));

    // Create applications
    const createdApplications = await Application.insertMany(applicationsWithIds);
    console.log(`📝 Created ${createdApplications.length} applications`);

    console.log('✅ Database seeding completed successfully!');
    
    return {
      users: createdUsers.length,
      jobs: createdJobs.length,
      applications: createdApplications.length
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Function to clear the database
export const clearDatabase = async () => {
  try {
    console.log('🧹 Clearing database...');
    
    await Application.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});
    
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

// Function to get database statistics
export const getDatabaseStats = async () => {
  try {
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    
    return {
      users: userCount,
      jobs: jobCount,
      applications: applicationCount
    };
  } catch (error) {
    console.error('❌ Error getting database stats:', error);
    throw error;
  }
};
