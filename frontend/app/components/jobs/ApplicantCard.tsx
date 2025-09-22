import { useState } from "react";

interface ApplicantCardProps {
  applicant: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    jobId: {
      _id: string;
      title: string;
      location: {
        city: string;
        country: string;
      };
      status: string;
    };
    resumeUrl: string;
    coverLetter?: string;
    status: "applied" | "shortlisted" | "rejected";
    createdAt: string;
    updatedAt: string;
  };
  onShortlist: (applicantId: string) => void;
  onReject: (applicantId: string) => void;
  onViewDetail: (applicantId: string) => void;
  onDownloadCV: (resumeUrl: string, applicantName: string) => void;
}

export function ApplicantCard({
  applicant,
  onShortlist,
  onReject,
  onViewDetail,
  onDownloadCV,
}: ApplicantCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {/* Profile Section */}
        <div className="flex items-start space-x-4">
          {/* Profile Picture */}
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold text-sm">
              {getInitials(applicant.userId.name)}
            </span>
          </div>
          
          {/* Applicant Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {applicant.userId.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {applicant.jobId.title}
            </p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    onShortlist(applicant._id);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 mr-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Shortlist
                </button>
                <button
                  onClick={() => {
                    onReject(applicant._id);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
                <button
                  onClick={() => {
                    onViewDetail(applicant._id);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  See Detail
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Applicant Details */}
      <div className="mb-4">
        <ul className="space-y-1 text-sm text-gray-600">
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            2 years Experience
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            Education: Bachelor Degree
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Applied Date: {formatDate(applicant.createdAt)}
          </li>
        </ul>
      </div>

      {/* Cover Letter */}
      {applicant.coverLetter && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Cover letter</h4>
          <p className="text-sm text-gray-600 line-clamp-3">
            {applicant.coverLetter.length > 150 
              ? `${applicant.coverLetter.substring(0, 150)}...` 
              : applicant.coverLetter
            }
          </p>
          {applicant.coverLetter.length > 150 && (
            <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
              See More
            </button>
          )}
        </div>
      )}

      {/* Download CV Button */}
      <button
        onClick={() => onDownloadCV(applicant.resumeUrl, applicant.userId.name)}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download CV
      </button>
    </div>
  );
}



