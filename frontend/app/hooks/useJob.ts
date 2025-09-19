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

interface JobResponse {
  job: Job;
}

export function useJob(jobId: string | undefined) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) {
        setError("Job ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await getJson<JobResponse>(`/api/jobs/${jobId}`);
        setJob(response.job);
      } catch (err: any) {
        console.error("Failed to fetch job:", err);
        setError(err.message || "Failed to fetch job");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  const refetch = () => {
    setError(null);
    setIsLoading(true);
    setJob(null);
  };

  return {
    job,
    isLoading,
    error,
    refetch,
  };
}

export type { Job, JobResponse };
