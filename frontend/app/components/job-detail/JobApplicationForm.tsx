import { useState } from "react";
import { useApplication } from "../../hooks/useApplication";
import { useUserProfile } from "../../hooks/useUserProfile";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  linkedInUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  cvFile: File | null;
}

interface JobApplicationFormProps {
  jobId: string;
}

export default function JobApplicationForm({ jobId }: JobApplicationFormProps) {
  const jobTitle = "this position";
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    submitApplication,
    isLoading: isSubmittingApplication,
    error: applicationError,
  } = useApplication();

  const { user, isLoading: isLoadingUser } = useUserProfile();

  // Check if user has a resume URL
  const hasResumeUrl = user?.resume?.url;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "coverLetter") {
      setCharacterCount(value.length);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, cvFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    // Only require CV file if user doesn't have a resume URL
    if (!hasResumeUrl && !formData.cvFile) {
      setSubmitError("Please upload your CV");
      return;
    }

    try {
      // Submit the application with file or URL
      await submitApplication({
        jobId,
        coverLetter: formData.coverLetter || undefined,
        resumeFile: hasResumeUrl ? undefined : (formData.cvFile || undefined),
        resumeUrl: hasResumeUrl ? user?.resume?.url : undefined,
      });

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        linkedInUrl: "",
        portfolioUrl: "",
        coverLetter: "",
        cvFile: null,
      });
      setCharacterCount(0);
    } catch (error: any) {
      setSubmitError(
        error.message || "Failed to submit application. Please try again."
      );
    }
  };

  const handleSaveDraft = () => {
    console.log("Form saved as draft:", formData);
    alert("Application saved as draft!");
  };

  // Show loading state while user data is being loaded
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Form Header - Centered with Big Font */}
          <div className="p-8 border-b border-gray-200 text-center">
            <h2 className="text-5xl mt-4 text-gray-800 font-semibold">
              Apply for this position
            </h2>
            <p className="mt-3 text-gray-600 text-xl">
              Hey, could you fill out these forms carefully?
            </p>

            {/* Show resume status if user has resume URL */}
            {hasResumeUrl && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Resume Found!</span>
                  <span className="ml-2">We'll use your uploaded resume: {user?.resume?.originalName}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {(submitError || applicationError) && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {submitError || applicationError}
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Application submitted successfully!
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
                required
                disabled={isSubmittingApplication}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your Email"
                required
                disabled={isSubmittingApplication}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your Phone Number"
                required
                disabled={isSubmittingApplication}
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
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your LinkedIn profile URL"
                disabled={isSubmittingApplication}
              />
            </div>

            {/* Portfolio URL */}
            <div>
              <label
                htmlFor="portfolioUrl"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Portfolio URL
              </label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your Portfolio URL"
                disabled={isSubmittingApplication}
              />
            </div>

            {/* Cover Letter */}
            <div>
              <label
                htmlFor="coverLetter"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Cover letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                className="block w-full px-5 py-3 text-lg border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Write why you are fit for this position..."
                required
                disabled={isSubmittingApplication}
              />
              <p className="text-sm text-gray-500 mt-2">
                Make it less than 1000 Characters • {characterCount}/1000
              </p>
            </div>

            {/* Upload CV - Only show if user doesn't have resume URL */}
            {!hasResumeUrl && (
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
                          disabled={isSubmittingApplication}
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
            )}

            {/* Success/Error Messages */}
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Application submitted successfully!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your application has been sent to the employer. You will
                        be notified about the status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(submitError || applicationError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-2.414 2.414L7.586 10l-1.293 1.293a1 1 0 102.414 2.414L10 12.414l1.293 1.293a1 1 0 002.414-2.414L12.414 10l1.293-1.293a1 1 0 00-2.414-2.414L10 7.586 8.707 6.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error submitting application
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{submitError || applicationError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-6 pt-6">
              <button
                type="submit"
                disabled={isSubmittingApplication}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 text-lg font-medium"
              >
                {isSubmittingApplication
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmittingApplication}
                className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-lg font-medium disabled:opacity-50"
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
