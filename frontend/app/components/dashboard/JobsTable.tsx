import { FiEye, FiEdit, FiTrash2, FiPlus, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  applicants: number;
  status: "Active" | "Paused" | "Closed";
  postedDate: string;
}

interface JobsTableProps {
  jobs: Job[];
  onView?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
  onCreate?: () => void;
}

export function JobsTable({
  jobs,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: JobsTableProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Paused":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewApplicants = (jobId: string) => {
    navigate(`/employer/jobs/${jobId}/applicants`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Posted Jobs</h2>
          <button
            onClick={onCreate}
            className="flex items-center px-4 py-2 bg-base text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posted Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {job.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewApplicants(job.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    View Applicants
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.postedDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView?.(job.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="View"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit?.(job.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(job.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-gray-400 mb-4">
            <FiBriefcase className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs posted yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by posting your first job opening.
          </p>
          <button
            onClick={onCreate}
            className="inline-flex items-center px-4 py-2 bg-base text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Post Your First Job
          </button>
        </div>
      )}
    </div>
  );
}
