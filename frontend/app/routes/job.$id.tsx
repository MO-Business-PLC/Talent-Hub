import JobDetail from "~/pages/jobs/JobDetail";

export function meta({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the job data based on params.id
  return [
    { title: `Job Details - TalentHub` },
    {
      name: "description",
      content: "View detailed information about this job opportunity.",
    },
  ];
}

export default function JobDetailRoute() {
  return <JobDetail />;
}
