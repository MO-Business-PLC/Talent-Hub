import { useState, useCallback, useEffect } from "react";
import { getJson } from "../lib/api";
import type { Job, JobsResponse } from "./useJobs";

interface JobSearchFilters {
  search?: string;
  location?: string;
  jobType?: string;
  jobSite?: string;
  experienceLevel?: string;
  sector?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface JobSearchOptions extends JobSearchFilters {
  page?: number;
  limit?: number;
}

interface UseJobSearchReturn {
  jobs: Job[];
  pagination: JobsResponse["pagination"] | null;
  isLoading: boolean;
  error: string | null;
  searchJobs: (query?: string, location?: string) => void;
  applyFilters: (filters: JobSearchFilters) => void;
  changePage: (page: number) => void;
  clearError: () => void;
  refetch: () => void;
  hasSearched: boolean;
}

export function useJobSearch(
  initialOptions: JobSearchOptions = {}
): UseJobSearchReturn {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchOptions, setSearchOptions] = useState<JobSearchOptions>({
    page: 1,
    limit: 10,
    status: "OPEN",
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialOptions,
  });

  const fetchJobs = useCallback(async (options: JobSearchOptions) => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add pagination
      queryParams.append("page", (options.page || 1).toString());
      queryParams.append("limit", (options.limit || 10).toString());

      // Add search and filters
      if (options.search?.trim()) {
        queryParams.append("search", options.search.trim());
      }

      if (options.jobType) {
        queryParams.append("jobType", options.jobType);
      }

      if (options.jobSite) {
        queryParams.append("jobSite", options.jobSite);
      }

      if (options.experienceLevel) {
        queryParams.append("experienceLevel", options.experienceLevel);
      }

      if (options.sector) {
        queryParams.append("sector", options.sector);
      }

      if (options.status) {
        queryParams.append("status", options.status);
      }

      if (options.sortBy) {
        queryParams.append("sortBy", options.sortBy);
      }

      if (options.sortOrder) {
        queryParams.append("sortOrder", options.sortOrder);
      }

      // Add location filter if provided (search in city or country)
      if (options.location?.trim()) {
        queryParams.append(
          "search",
          options.search
            ? `${options.search} ${options.location}`.trim()
            : options.location.trim()
        );
      }

      const response = await getJson<JobsResponse>(
        `/api/jobs?${queryParams.toString()}`
      );

      setData(response);
      setHasSearched(true);
    } catch (err: any) {
      console.error("Failed to fetch jobs:", err);
      let errorMessage = "Failed to fetch jobs. Please try again.";

      if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load with default options
  useEffect(() => {
    fetchJobs(searchOptions);
  }, [fetchJobs, searchOptions]);

  const searchJobs = useCallback(
    (query?: string, location?: string) => {
      const newOptions = {
        ...searchOptions,
        search: query,
        location,
        page: 1, // Reset to first page on new search
      };
      setSearchOptions(newOptions);
    },
    [searchOptions]
  );

  const applyFilters = useCallback(
    (filters: JobSearchFilters) => {
      const newOptions = {
        ...searchOptions,
        ...filters,
        page: 1, // Reset to first page when filters change
      };
      setSearchOptions(newOptions);
    },
    [searchOptions]
  );

  const changePage = useCallback(
    (page: number) => {
      const newOptions = {
        ...searchOptions,
        page,
      };
      setSearchOptions(newOptions);
    },
    [searchOptions]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refetch = useCallback(() => {
    fetchJobs(searchOptions);
  }, [fetchJobs, searchOptions]);

  return {
    jobs: data?.jobs || [],
    pagination: data?.pagination || null,
    isLoading,
    error,
    searchJobs,
    applyFilters,
    changePage,
    clearError,
    refetch,
    hasSearched,
  };
}

// Helper function to format job data for display
export function formatJobForDisplay(job: Job) {
  return {
    id: job._id,
    title: job.title,
    company: job.createdBy?.name || "Company",
    location: `${job.location.city}, ${job.location.country}`,
    salary: "Salary not specified", // Backend doesn't include salary in response
    type: formatJobType(job.jobType, job.jobSite),
    postedAt: formatTimeAgo(job.createdAt),
    description: job.description,
    tags: job.skills || [],
    sector: job.sector,
    experienceLevel: job.experienceLevel,
    deadline: job.deadline,
    status: job.status,
  };
}

function formatJobType(
  jobType: string,
  jobSite?: string
): "Full-time" | "Part-time" | "Contract" | "Remote" {
  // If job site is remote, prioritize showing "Remote"
  if (jobSite === "REMOTE") {
    return "Remote";
  }

  const types: Record<
    string,
    "Full-time" | "Part-time" | "Contract" | "Remote"
  > = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Contract", // Map internship to contract
    FREELANCE: "Contract", // Map freelance to contract
  };
  return types[jobType] || "Full-time";
}

function formatJobSite(jobSite: string): string {
  const sites: Record<string, string> = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };
  return sites[jobSite] || jobSite;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24 * 30) {
    const weeks = Math.floor(diffInHours / (24 * 7));
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else {
    const months = Math.floor(diffInHours / (24 * 30));
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
}
