import { useState, useEffect } from "react";
import { getJson } from "../lib/api";

interface UserApplication {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    location: {
      city: string;
      country: string;
    };
    status: string;
    createdBy: {
      _id: string;
      name: string;
    };
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  resumeUrl: string;
  coverLetter?: string;
  status: "applied" | "shortlisted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface UserApplicationsResponse {
  applications: UserApplication[];
}

interface UseUserApplicationsReturn {
  applications: UserApplication[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUserApplications(): UseUserApplicationsReturn {
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserApplications() {
      try {
        setIsLoading(true);
        setError(null);

        // Get user ID from localStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          setError("User not found. Please login again.");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user._id || user.id;

        if (!userId) {
          setError("User ID not found");
          setIsLoading(false);
          return;
        }

        console.log("Fetching user applications for user:", userId);
        const response = await getJson<UserApplicationsResponse>(`/api/applications/${userId}`);
        console.log("User applications response:", response);
        setApplications(response.applications);
      } catch (err: any) {
        console.error("Failed to fetch user applications:", err);
        setError(err.message || "Failed to fetch applications");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserApplications();
  }, []);

  const refetch = () => {
    setError(null);
    setIsLoading(true);
    setApplications([]);
  };

  return {
    applications,
    isLoading,
    error,
    refetch,
  };
}

export type { UserApplication, UserApplicationsResponse };
