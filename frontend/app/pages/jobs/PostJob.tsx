import { useState } from "react";
import { useNavigate } from "react-router";
import { postJson } from "../../lib/api";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiUsers,
  FiFileText,
  FiSave,
  FiX,
} from "react-icons/fi";
import CustomDropdown from "../../components/ui/CustomDropdown";

interface JobFormData {
  title: string;
  tags: string;
  jobRole: string;
  description: string;
  jobType: string;
  jobSite: string;
  location: {
    city: string;
    country: string;
  };
  skills: string[];
  sector: string;
  experienceLevel: string;
  education: string;
  experience: string;
  vacancies: number;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    type: string;
  };
  deadline: string;
  requirements: string[];
  benefits: string[];
  companyDescription: string;
}

export default function PostJob() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    tags: "",
    jobRole: "",
    description: "",
    jobType: "FULL_TIME",
    jobSite: "ONSITE",
    location: {
      city: "",
      country: "Ethiopia",
    },
    skills: [],
    sector: "",
    experienceLevel: "MID_LEVEL",
    education: "",
    experience: "",
    vacancies: 1,
    salaryRange: {
      min: 0,
      max: 0,
      currency: "ETB",
      type: "MONTHLY",
    },
    deadline: "",
    requirements: [],
    benefits: [],
    companyDescription: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const jobTypes = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "FREELANCE", label: "Freelance" },
  ];

  const jobSites = [
    { value: "ONSITE", label: "On-site" },
    { value: "REMOTE", label: "Remote" },
    { value: "HYBRID", label: "Hybrid" },
  ];

  const experienceLevels = [
    { value: "ENTRY_LEVEL", label: "Entry Level" },
    { value: "MID_LEVEL", label: "Mid Level" },
    { value: "SENIOR_LEVEL", label: "Senior Level" },
    { value: "EXECUTIVE", label: "Executive" },
  ];

  const educationLevels = [
    { value: "HIGH_SCHOOL", label: "High School" },
    { value: "ASSOCIATE", label: "Associate Degree" },
    { value: "BACHELOR", label: "Bachelor's Degree" },
    { value: "MASTER", label: "Master's Degree" },
    { value: "PHD", label: "PhD" },
    { value: "OTHER", label: "Other" },
  ];

  const experienceYears = [
    { value: "0-1", label: "0-1 years" },
    { value: "2-3", label: "2-3 years" },
    { value: "4-5", label: "4-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "10+", label: "10+ years" },
  ];

  const jobRoles = [
    { value: "DEVELOPER", label: "Developer" },
    { value: "DESIGNER", label: "Designer" },
    { value: "MANAGER", label: "Manager" },
    { value: "ANALYST", label: "Analyst" },
    { value: "CONSULTANT", label: "Consultant" },
    { value: "OTHER", label: "Other" },
  ];

  const countries = [
    { value: "Ethiopia", label: "Ethiopia" },
    { value: "Kenya", label: "Kenya" },
    { value: "Uganda", label: "Uganda" },
    { value: "Tanzania", label: "Tanzania" },
    { value: "Rwanda", label: "Rwanda" },
  ];

  const cities = [
    { value: "Addis Ababa", label: "Addis Ababa" },
    { value: "Dire Dawa", label: "Dire Dawa" },
    { value: "Mekelle", label: "Mekelle" },
    { value: "Hawassa", label: "Hawassa" },
    { value: "Bahir Dar", label: "Bahir Dar" },
  ];

  const salaryTypes = [
    { value: "HOURLY", label: "Hourly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
  ];

  const vacancyOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "10+", label: "10+" },
  ];

  const sectors = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Sales",
    "Human Resources",
    "Operations",
    "Design",
    "Engineering",
    "Other",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationChange = (field: "city" | "country", value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleSalaryChange = (
    field: "min" | "max" | "currency" | "type",
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: value,
      },
    }));
  };

  // const addSkill = () => {
  //   if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
  //     setFormData(prev => ({
  //       ...prev,
  //       skills: [...prev.skills, skillInput.trim()],
  //     }));
  //     setSkillInput("");
  //   }
  // };

  // const removeSkill = (skill: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     skills: prev.skills.filter(s => s !== skill),
  //   }));
  // };

  // const addRequirement = () => {
  //   if (
  //     requirementInput.trim() &&
  //     !formData.requirements.includes(requirementInput.trim())
  //   ) {
  //     setFormData(prev => ({
  //       ...prev,
  //       requirements: [...prev.requirements, requirementInput.trim()],
  //     }));
  //     setRequirementInput("");
  //   }
  // };

  // const removeRequirement = (requirement: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     requirements: prev.requirements.filter(r => r !== requirement),
  //   }));
  // };

  // const addBenefit = () => {
  //   if (
  //     benefitInput.trim() &&
  //     !formData.benefits.includes(benefitInput.trim())
  //   ) {
  //     setFormData(prev => ({
  //       ...prev,
  //       benefits: [...prev.benefits, benefitInput.trim()],
  //     }));
  //     setBenefitInput("");
  //   }
  // };

  // const removeBenefit = (benefit: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     benefits: prev.benefits.filter(b => b !== benefit),
  //   }));
  // };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.description.trim())
      newErrors.description = "Job description is required";
    if (!formData.location.city.trim()) newErrors.city = "City is required";
    if (!formData.jobRole.trim()) newErrors.jobRole = "Job role is required";
    if (!formData.deadline)
      newErrors.deadline = "Application deadline is required";

    // Check if deadline is in the future
    if (formData.deadline && new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = "Deadline must be in the future";
    }

    // Validate salary range
    if (formData.salaryRange.min > 0 && formData.salaryRange.max > 0) {
      if (formData.salaryRange.min >= formData.salaryRange.max) {
        newErrors.salary = "Maximum salary must be greater than minimum salary";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Transform data for API
      const jobData = {
        ...formData,
        skills: formData.skills,
        requirements: formData.requirements,
        benefits: formData.benefits,
        salaryRange:
          formData.salaryRange.min > 0 ? formData.salaryRange : undefined,
      };

      await postJson("/api/jobs", jobData);

      // Redirect to employer dashboard on success
      navigate("/employer-dashboard", {
        replace: true,
        state: { message: "Job posted successfully!" },
      });
    } catch (error: any) {
      console.error("Failed to post job:", error);
      setErrors({
        submit: error.message || "Failed to post job. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Post a Job
              </h1>
              <p className="text-gray-600">
                Please fill the following forms carefully
              </p>
            </div>

            {/* Job Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => handleInputChange("title", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-base focus:border-transparent transition-colors ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Full- Time UI/UX Designer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Tags and Job Role Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => handleInputChange("tags", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base focus:border-transparent"
                  placeholder="Enter your Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role
                </label>
                <CustomDropdown
                  options={jobRoles}
                  value={formData.jobRole}
                  onChange={value => handleInputChange("jobRole", value)}
                  placeholder="Select..."
                />
              </div>
            </div>

            {/* Salary Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Salary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Salary
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.salaryRange.min || ""}
                      onChange={e =>
                        handleSalaryChange("min", parseInt(e.target.value) || 0)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-base focus:border-transparent"
                      placeholder="Minimum Salary"
                    />
                    <div className="px-4 py-3 bg-gray-100 border-t border-b border-r border-gray-300 rounded-r-lg text-gray-700">
                      ETB
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Salary
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.salaryRange.max || ""}
                      onChange={e =>
                        handleSalaryChange("max", parseInt(e.target.value) || 0)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-base focus:border-transparent"
                      placeholder="Maximum Salary"
                    />
                    <div className="px-4 py-3 bg-gray-100 border-t border-b border-r border-gray-300 rounded-r-lg text-gray-700">
                      ETB
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Type
                  </label>
                  <CustomDropdown
                    options={salaryTypes}
                    value={formData.salaryRange.type}
                    onChange={value => handleSalaryChange("type", value)}
                    placeholder="Select..."
                  />
                </div>
              </div>
              {errors.salary && (
                <p className="mt-2 text-sm text-red-600">{errors.salary}</p>
              )}
            </div>

            {/* Advanced Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Advanced Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <CustomDropdown
                    options={educationLevels}
                    value={formData.education}
                    onChange={value => handleInputChange("education", value)}
                    placeholder="Select..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <CustomDropdown
                    options={experienceYears}
                    value={formData.experience}
                    onChange={value => handleInputChange("experience", value)}
                    placeholder="Select..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <CustomDropdown
                    options={jobTypes}
                    value={formData.jobType}
                    onChange={value => handleInputChange("jobType", value)}
                    placeholder="Select..."
                  />
                </div>
              </div>
            </div>

            {/* Second Row of Advanced Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vacancies
                </label>
                <CustomDropdown
                  options={vacancyOptions}
                  value={formData.vacancies.toString()}
                  onChange={value =>
                    handleInputChange("vacancies", parseInt(value))
                  }
                  placeholder="Select..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expire Date
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={e => handleInputChange("deadline", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-base focus:border-transparent transition-colors ${
                    errors.deadline ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="DD/MM/YY"
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Level
                </label>
                <CustomDropdown
                  options={experienceLevels}
                  value={formData.experienceLevel}
                  onChange={value =>
                    handleInputChange("experienceLevel", value)
                  }
                  placeholder="Select..."
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <CustomDropdown
                    options={countries}
                    value={formData.location.country}
                    onChange={value => handleLocationChange("country", value)}
                    placeholder="Select..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <CustomDropdown
                    options={cities}
                    value={formData.location.city}
                    onChange={value => handleLocationChange("city", value)}
                    placeholder="Select..."
                    error={errors.city}
                  />
                </div>
              </div>

              {/* Fully Remote Position Checkbox */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.jobSite === "REMOTE"}
                    onChange={e =>
                      handleInputChange(
                        "jobSite",
                        e.target.checked ? "REMOTE" : "ONSITE"
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-base"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Fully Remote Position
                  </span>
                </label>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-base focus:border-transparent transition-colors ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/employer-dashboard")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 bg-base text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    Post Job
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
