import JobApplicationForm from "../components/job-detail/JobApplicationForm";
import { useParams } from "react-router";

export function meta({ params }: { params: { id: string } }) {
  return [
    { title: `Apply for Job - Talent Hub` },
    { name: "description", content: "Apply for this job opportunity." },
  ];
}

export default function JobApplicationPage() {
  const { id } = useParams();
  
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

