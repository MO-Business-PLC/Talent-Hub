import Jobs from "~/pages/jobs/Jobs";

export function meta() {
  return [
    { title: "Jobs - Talent Hub" },
    { name: "description", content: "Jobs for Talent Hub" },
  ];
}

export default function JobsRoute() {
  return <Jobs />;
}
