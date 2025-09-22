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

interface UseJobApplicantsReturn {
  applicants: Applicant[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useJobApplicants(jobId: string | undefined): UseJobApplicantsReturn {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplicants() {
      if (!jobId) {
        setError("Job ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await getJson<ApplicationsResponse>(`/api/applications/job/${jobId}`);
        setApplicants(response.applications);
      } catch (err: any) {
        console.error("Failed to fetch applicants:", err);
        setError(err.message || "Failed to fetch applicants");
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplicants();
  }, [jobId]);

  const refetch = () => {
    setError(null);
    setIsLoading(true);
    setApplicants([]);
  };

  return {
    applicants,
    isLoading,
    error,
    refetch,
  };
}

export type { Applicant, ApplicationsResponse };


