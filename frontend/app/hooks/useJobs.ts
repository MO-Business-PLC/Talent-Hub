import { useState, useEffect } from "react";
import { getJson } from "../lib/api";

interface Job {
  _id: string;
  title: string;
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
  deadline: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface JobsResponse {
  jobs: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseJobsOptions {
  page?: number;
  limit?: number;
  status?: string;
}

export function useJobs(userId?: string, options: UseJobsOptions = {}) {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 10, status } = options;

  useEffect(() => {
    async function fetchJobs() {
      let currentUserId = userId;

      if (!currentUserId) {
        // Try to get user from localStorage
        try {
          const userStr = localStorage.getItem("user");
          if (!userStr) {
            setError("User not found. Please login again.");
            setIsLoading(false);
            return;
          }
          const user = JSON.parse(userStr);
          currentUserId = user._id || user.id;
          console.log("Retrieved user ID from localStorage:", currentUserId);
        } catch (err) {
          console.error("Failed to parse user data:", err);
          setError("Failed to get user information");
          setIsLoading(false);
          return;
        }
      }

      if (!currentUserId) {
        setError("User ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (status) {
          queryParams.append("status", status);
        }

        const response = await getJson<JobsResponse>(
          `/api/jobs/user/${currentUserId}?${queryParams.toString()}`
        );

        setData(response);
      } catch (err: any) {
        console.error("Failed to fetch jobs:", err);
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, [userId, page, limit, status]);

  const refetch = () => {
    setError(null);
    setIsLoading(true);
    // Trigger useEffect by changing a dependency
    setData(null);
  };

  return {
    jobs: data?.jobs || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export type { Job, JobsResponse };
