import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    professionalTitle: "",
    industry: "",
    experienceLevel: "",

    // Contact Info
    email: "",
    phone: "",
    location: "",

    // Professional Profile
    bio: "",

    // Social Presence
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleContinue = () => {
    // Determine next tab based on current tab
    const tabs = ["personal", "contact", "professional", "social", "resume"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    // Determine previous tab based on current tab
    const tabs = ["personal", "contact", "professional", "social", "resume"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>

      {/* Tabs Navigation - Boxed Design */}
      <div className="bg-white rounded-lg shadow-sm p-2 mb-8">
        <div className="flex flex-wrap border border-gray-200 rounded-md overflow-hidden">
          <button
            className={`py-4 px-6 font-medium text-lg border-r border-gray-200 ${activeTab === "personal" ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </button>
          <button
            className={`py-4 px-6 font-medium text-lg border-r border-gray-200 ${activeTab === "contact" ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Information
          </button>
          <button
            className={`py-4 px-6 font-medium text-lg border-r border-gray-200 ${activeTab === "professional" ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("professional")}
          >
            Profile
          </button>
          <button
            className={`py-4 px-6 font-medium text-lg border-r border-gray-200 ${activeTab === "social" ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("social")}
          >
            Social Presence
          </button>
          <button
            className={`py-4 px-6 font-medium text-lg ${activeTab === "resume" ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("resume")}
          >
            Resume
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8">
          <form className="space-y-8">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>

                {/* Profile Image Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Profile Image</h4>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-64 flex flex-col justify-center items-center">
                        <svg
                          className="mx-auto h-16 w-16 text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-base text-gray-600 mb-2">Upload Photo or Drag it here</p>
                        <p className="text-sm text-gray-500">Max File size 2 MB</p>
                        <label
                          htmlFor="profile-upload"
                          className="mt-4 inline-block px-5 py-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                          Browse File
                          <input id="profile-upload" type="file" className="sr-only" />
                        </label>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-64 flex flex-col justify-center items-center">
                        <svg
                          className="mx-auto h-16 w-16 text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-8 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <p className="text-base text-gray-600 mb-2">
                          Upload Cover Photo or Drag it here
                        </p>
                        <p className="text-sm text-gray-500">Max File size 2 MB</p>
                        <label
                          htmlFor="cover-upload"
                          className="mt-4 inline-block px-5 py-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                          Browse File
                          <input id="cover-upload" type="file" className="sr-only" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="professionalTitle"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Professional Title
                    </label>
                    <input
                      type="text"
                      id="professionalTitle"
                      value={formData.professionalTitle}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Industry
                    </label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="experienceLevel"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Experience Level
                    </label>
                    <select
                      id="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Experience Level</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === "contact" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Profile Tab */}
            {activeTab === "professional" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Professional Profile</h3>

                <div>
                  <label htmlFor="bio" className="block text-base font-medium text-gray-700 mb-2">
                    Professional Summary
                  </label>
                  <textarea
                    id="bio"
                    rows={8}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell employers about yourself, your skills, and experience..."
                  ></textarea>
                </div>
              </div>
            )}

            {/* Social Presence Tab */}
            {activeTab === "social" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Social Presence</h3>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter LinkedIn URL"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="github"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      GitHub
                    </label>
                    <input
                      type="url"
                      id="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter GitHub URL"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="portfolio"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter portfolio website URL"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Resume Tab */}
            {activeTab === "resume" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Resume</h3>

                <div className="mt-2 flex justify-center px-8 pt-8 pb-10 border-2 border-gray-300 border-dashed rounded-md h-64">
                  <div className="space-y-3 text-center flex flex-col justify-center items-center">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-base text-gray-600 justify-center">
                      <label
                        htmlFor="resume-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="resume-upload"
                          name="resume-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-2">or drag and drop</p>
                    </div>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-10">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-8 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {activeTab === "resume" ? "Save Changes" : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}