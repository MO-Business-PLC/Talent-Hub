import JobApplicationForm from "../components/job-detail/JobApplicationForm";

export function meta() {
  return [
    { title: "Apply for Job - Talent Hub" },
    { name: "description", content: "Job application form for Talent Hub positions" },
  ];
}

export default function JobApplicationPage() {
  return <JobApplicationForm />;
}