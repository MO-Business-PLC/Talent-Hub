import { useState } from "react";
import { postJson } from "../lib/api";

interface UpdateApplicationStatusData {
  applicationId: string;
  status: "applied" | "shortlisted" | "rejected";
}

interface UpdateApplicationStatusResponse {
  message: string;
  application: {
    _id: string;
    status: string;
    updatedAt: string;
  };
}

interface UseApplicationManagementReturn {
  updateApplicationStatus: (
    data: UpdateApplicationStatusData
  ) => Promise<UpdateApplicationStatusResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useApplicationManagement(): UseApplicationManagementReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateApplicationStatus = async (
    data: UpdateApplicationStatusData
  ): Promise<UpdateApplicationStatusResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await postJson<UpdateApplicationStatusResponse>(
        `/api/applications/${data.applicationId}/status`,
        { status: data.status }
      );
      return response;
    } catch (err: any) {
      let errorMessage = "Failed to update application status. Please try again.";

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
    updateApplicationStatus,
    isLoading,
    error,
    clearError,
  };
}

export type { UpdateApplicationStatusData, UpdateApplicationStatusResponse };
