import { useState } from "react";
import { postJson } from "../lib/api";
import { API_BASE_URL } from "../lib/api";
import { getAccessToken } from "../lib/auth";

interface ApplicationData {
  jobId: string;
  resumeUrl?: string;
  resumeFile?: File;
  coverLetter?: string;
}

interface ApplicationResponse {
  application: {
    _id: string;
    jobId: {
      _id: string;
      title: string;
      location: {
        city: string;
        country: string;
      };
      status: string;
    };
    userId: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    resumeUrl: string;
    coverLetter?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface UseApplicationReturn {
  submitApplication: (data: ApplicationData) => Promise<ApplicationResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useApplication(): UseApplicationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitApplication = async (data: ApplicationData): Promise<ApplicationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      let response: Response;

      if (data.resumeFile) {
        // Send as FormData for file upload
        const formData = new FormData();
        formData.append("jobId", data.jobId);
        if (data.coverLetter) {
          formData.append("coverLetter", data.coverLetter);
        }
        formData.append("resume", data.resumeFile);

        response = await fetch(`${API_BASE_URL}/api/applications`, {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
      } else {
        // Send as JSON for URL-based submission
        response = await fetch(`${API_BASE_URL}/api/applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          credentials: "include",
          body: JSON.stringify({
            jobId: data.jobId,
            resumeUrl: data.resumeUrl,
            coverLetter: data.coverLetter,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to submit application");
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      let errorMessage = "Failed to submit application. Please try again.";

      if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    submitApplication,
    isLoading,
    error,
    clearError,
  };
}

export type { ApplicationData, ApplicationResponse };



