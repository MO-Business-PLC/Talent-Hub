import { useState } from "react";
import { API_BASE_URL } from "../lib/api";
import { getAccessToken } from "../lib/auth";

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    size: number;
    url: string;
    uploadedAt: string;
  };
}

interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<UploadResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`${API_BASE_URL}/api/upload/resume`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          // Don't set Content-Type header - let browser set it with boundary for FormData
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || "Upload failed"
        );
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to upload file. Please try again.";
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
    uploadFile,
    isLoading,
    error,
    clearError,
  };
}

export type { UploadResponse };


