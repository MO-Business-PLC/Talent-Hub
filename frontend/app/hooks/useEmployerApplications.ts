import { useState, useEffect } from "react";
import { getJson } from "../lib/api";

interface Applicant {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  jobId: {
    _id: string;
    title: string;
    location: {
      city: string;
      country: string;
    };
    status: string;
  };
  resumeUrl: string;
  coverLetter?: string;
  status: "applied" | "shortlisted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface ApplicationsResponse {
  applications: Applicant[];
}

interface UseEmployerApplicationsReturn {
  applications: Applicant[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEmployerApplications(): UseEmployerApplicationsReturn {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching employer applications...");
        const response = await getJson<ApplicationsResponse>("/api/applications/employer");
        console.log("Applications response:", response);
        setApplications(response.applications);
      } catch (err: any) {
        console.error("Failed to fetch employer applications:", err);
        setError(err.message || "Failed to fetch applications");
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
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

export type { Applicant, ApplicationsResponse };
