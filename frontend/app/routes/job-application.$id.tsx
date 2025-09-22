import JobApplicationForm from "../components/job-detail/JobApplicationForm";
import { useParams, useNavigate } from "react-router";
import { isAuthenticated } from "../lib/auth";
import { useEffect } from "react";
import { useToast } from "../components/ui";

export function meta({ params }: { params: { id: string } }) {
  return [
    { title: `Apply for Job - Talent Hub` },
    { name: "description", content: "Apply for this job opportunity." },
  ];
}

export default function JobApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      showToast({
        type: 'warning',
        title: 'Login Required',
        message: 'Please login first to apply for this job.',
        duration: 4000
      });
      // Delay redirect to give users time to see the toast
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }
  }, [navigate, showToast]);
  
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600">The job you're trying to apply for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <JobApplicationForm jobId={id} />;
}



