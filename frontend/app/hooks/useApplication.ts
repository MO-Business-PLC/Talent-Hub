import { useState } from "react";
import { postJson } from "../lib/api";

interface ApplicationData {
  jobId: string;
  resumeUrl: string;
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
      const response = await postJson<ApplicationResponse>("/api/applications", data);
      return response;
    } catch (err: any) {
      let errorMessage = "Failed to submit application. Please try again.";

      if (err instanceof Response) {
        try {
          const errorData = await err.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = err.statusText || errorMessage;
        }
      } else if (err.message) {
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
