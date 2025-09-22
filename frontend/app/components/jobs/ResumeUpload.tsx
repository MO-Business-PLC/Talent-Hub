import { useEffect, useRef, useState } from "react";
import { useFileUpload } from "../../hooks/useFileUpload";

export interface ResumeUploadProps {
  className?: string;
}

export function ResumeUpload({ className = "" }: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadFile, isLoading, error, clearError } = useFileUpload();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasResume, setHasResume] = useState<boolean>(() => {
    try {
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return Boolean(user?.resume?.url);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Sync with localStorage if it changes from elsewhere
    const handler = () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return setHasResume(false);
        const user = JSON.parse(userStr);
        setHasResume(Boolean(user?.resume?.url));
      } catch {
        setHasResume(false);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleButtonClick = () => {
    clearError();
    setSuccessMessage(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFile(file);
      // Update localStorage user resume for immediate availability
      const userStr = localStorage.getItem("user");
      if (userStr && result?.data?.url) {
        const user = JSON.parse(userStr);
        user.resume = {
          url: result.data.url,
          originalName: result.data.originalName,
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
      setSuccessMessage("Resume uploaded successfully!");
      setHasResume(true);
      e.target.value = "";
    } catch (err) {
      // Error state handled in hook; ensure input can be re-used
      e.target.value = "";
    }
  };

  if (hasResume) return null;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Get noticed faster</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Upload your resume once and reuse it when applying to jobs.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="w-full bg-base hover:bg-primary-600 disabled:opacity-60 text-white py-2 rounded-lg font-medium transition-colors duration-200"
      >
        {isLoading ? "Uploading..." : "Upload Your Resume"}
      </button>

      {error && (
        <p className="text-sm text-red-600 mt-3">{error}</p>
      )}
      {successMessage && (
        <p className="text-sm text-green-600 mt-3">{successMessage}</p>
      )}
    </div>
  );
}
