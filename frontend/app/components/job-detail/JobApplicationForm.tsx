import { useState } from "react";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  linkedInUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  cvFile: File | null;
}

export default function JobApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    linkedInUrl: "",
    portfolioUrl: "",
    coverLetter: "",
    cvFile: null,
  });

  const [characterCount, setCharacterCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "coverLetter") {
      setCharacterCount(value.length);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, cvFile: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      alert("Application submitted successfully!");
    }, 1500);
  };

  const handleSaveDraft = () => {
    console.log("Form saved as draft:", formData);
    alert("Application saved as draft!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
 <header className="bg-gray-100">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white rounded-2xl shadow-sm">
    {/* Left - Logo */}
       <div className="flex items-center">
            <img src="./images/auth/logo.png" alt="TalentHub" className="h-8 w-auto" />
          </div>

    {/* Middle - Navigation */}
    <nav className="flex items-center space-x-8">
      <a
        href="/home"
        className="text-gray-700 hover:text-[#0366c2] font-medium"
      >
        Find Job
      </a>
      <a
        href="/jobs"
        className="text-gray-700 hover:text-[#0366c2] font-medium"
      >
        Find Employer
      </a>
      <a
        href="employee-dashboard"
        className="bg-blue-100 text-[#0366c2] font-medium px-3 py-1 rounded-md"
      >
        Dashboard
      </a>
    </nav>

    {/* Right - Notification + Profile */}
    <div className="flex items-center space-x-6">
      {/* Notification */}
      <div className="relative cursor-pointer">
        <svg
          className="h-6 w-6 text-[#0366c2]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute -top-1 -right-1 bg-[#0366c2] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          3
        </span>
      </div>

      {/* Profile Image */}
      <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
        <img
          src="./images/profile.jpg"
          alt="User"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  </div>
</header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Form Header - Centered with Big Font */}
          <div className="p-8 border-b border-gray-200 text-center">
            <h2 className="text-5xl mt-4 text-gray-800 font-semibold">Apply for Senior UI/UX Designer</h2>
            <p className="mt-3 text-gray-600 text-xl">Hey, could you fill out these forms carefully?</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-lg font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100"
                placeholder="Enter your Email"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100"
                placeholder="Enter your Phone Number"
                required
              />
            </div>

            {/* LinkedIn Profile URL */}
      <div>
        <label
          htmlFor="linkedInUrl"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          LinkedIn profile URL
        </label>
        <input
          type="url"
          id="linkedInUrl"
          name="linkedInUrl"
          value={formData.linkedInUrl}
          onChange={handleInputChange}
          className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100"
          placeholder="Enter your LinkedIn profile URL"
        />
      </div>


            {/* Portfolio URL */}
            <div>
              <label htmlFor="portfolioUrl" className="block text-lg font-medium text-gray-700 mb-2">
                Portfolio URL
              </label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100"
                placeholder="Enter your Portfolio URL"
              />
            </div>

            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-lg font-medium text-gray-700 mb-2">
                Cover letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100"
                placeholder="Write why you are fit for this position..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Make it less than 1000 Characters • {characterCount}/1000
              </p>
            </div>

            {/* Upload CV */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Upload your CV
              </label>
              <div className="mt-1 flex justify-center px-8 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-3 text-center">
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
                  <div className="flex text-lg text-gray-600 justify-center">
                    <label
                      htmlFor="cvFile"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Browse File</span>
                      <input
                        id="cvFile"
                        name="cvFile"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf"
                        required
                      />
                    </label>
                    <p className="pl-2">or drag it here</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Only pdf file and Max File size 2MB
                  </p>
                  {formData.cvFile && (
                    <p className="text-md text-green-600 mt-2">
                      Selected: {formData.cvFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-6 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 text-lg font-medium"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-lg font-medium"
              >
                Save It As A Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}