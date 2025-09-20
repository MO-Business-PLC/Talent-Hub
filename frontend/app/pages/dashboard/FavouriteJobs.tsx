import { useNavigate } from "react-router";

export function FavoriteJobs() {
  const navigate = useNavigate();

  const handleApplyNow = (jobId) => {
    navigate(`/job-application`);
  };

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Jobs (12)</h2>

      {/* Favorite Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  JOB TITLE
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  COMPANY
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  LOCATION
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SALARY
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Frontend Developer
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TechCorp</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  San Francisco, CA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $120,000 - $150,000
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => handleApplyNow(1)}
                >
                  Apply Now
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Data Scientist
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DataWorks</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Remote</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $130,000 - $160,000
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => handleApplyNow(2)}
                >
                  Apply Now
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Product Designer
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DesignHub</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New York, NY</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $110,000 - $140,000
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => handleApplyNow(3)}
                >
                  Apply Now
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
