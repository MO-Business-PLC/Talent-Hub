import { useState, useEffect } from "react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  resume?: {
    url: string;
    publicId: string;
    originalName: string;
  };
  profileImage?: string | null;
  professionalTitle?: string | null;
  industry?: string | null;
  experienceLevel?: string | null;
  phoneNumber?: string | null;
  location?: {
    city: string | null;
    country: string | null;
  };
  professionalSummary?: string | null;
  linkedInUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UseUserProfileReturn {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } else {
        setError("User not found in localStorage");
      }
    } catch (err: any) {
      console.error("Failed to parse user data:", err);
      setError("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
  };
}
