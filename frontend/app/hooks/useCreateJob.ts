import { useState } from "react";
import { useNavigate } from "react-router";
import { postJson } from "../lib/api";

interface CreateJobData {
  title: string;
  tags?: string;
  jobRole?: string;
  description: string;
  jobType: string;
  jobSite: string;
  location: {
    city: string;
    country: string;
  };
  skills: string[];
  sector?: string;
  experienceLevel: string;
  education?: string;
  experience?: string;
  vacancies?: number;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    type: string;
  };
  deadline: string;
  requirements?: string[];
  benefits?: string[];
  companyDescription?: string;
}

interface CreateJobResponse {
  message: string;
  job: {
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
    sector?: string;
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
  };
}

interface UseCreateJobReturn {
  createJob: (jobData: CreateJobData) => Promise<CreateJobResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useCreateJob(): UseCreateJobReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createJob = async (
    jobData: CreateJobData
  ): Promise<CreateJobResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Map frontend form data to backend API schema
      const apiPayload = {
        title: jobData.title,
        description: jobData.description,
        jobType: jobData.jobType,
        jobSite: jobData.jobSite,
        location: {
          city: jobData.location.city,
          country: jobData.location.country,
        },
        skills: jobData.skills || [],
        sector: jobData.sector || "",
        experienceLevel: mapExperienceLevel(jobData.experienceLevel),
        deadline: jobData.deadline,
      };

      const response = await postJson<CreateJobResponse>(
        "/api/jobs",
        apiPayload
      );

      // Navigate to employer dashboard with success message
      navigate("/employer/dashboard", {
        replace: true,
        state: {
          message: "Job posted successfully!",
          jobId: response.job._id,
        },
      });

      return response;
    } catch (err: any) {
      let errorMessage = "Failed to post job. Please try again.";

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
    createJob,
    isLoading,
    error,
    clearError,
  };
}

// Helper function to map frontend experience levels to backend format
function mapExperienceLevel(level: string): string {
  const mapping: Record<string, string> = {
    ENTRY_LEVEL: "JUNIOR",
    MID_LEVEL: "MID",
    SENIOR_LEVEL: "SENIOR",
    EXECUTIVE: "SENIOR", // Map executive to senior as backend only has JUNIOR, MID, SENIOR
  };

  return mapping[level] || "MID";
}
