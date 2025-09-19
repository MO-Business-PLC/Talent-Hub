import { useState } from "react";
import {
  FiX,
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";
import { HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi";
import { type Applicant } from "../../hooks/useEmployerApplications";

interface CandidateDetailsModalProps {
  application: Applicant | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function CandidateDetailsModal({
  application,
  isOpen,
  onClose,
  onStatusUpdate,
}: CandidateDetailsModalProps) {
  if (!isOpen || !application) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <HiClock className="w-5 h-5 text-blue-500" />;
      case "shortlisted":
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <HiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <HiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Candidate Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Candidate Info */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {application.userId.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {application.userId.name}
              </h3>
              <p className="text-gray-600 mb-2">{application.userId.email}</p>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}
              >
                {getStatusIcon(application.status)}
                <span className="ml-1 capitalize">{application.status}</span>
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <FiBriefcase className="w-4 h-4 mr-2" />
              Job Applied For
            </h4>
            <p className="text-gray-900 font-medium">{application.jobId.title}</p>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <FiMapPin className="w-4 h-4 mr-1" />
              {application.jobId.location.city}, {application.jobId.location.country}
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <FiCalendar className="w-4 h-4 mr-2" />
                Application Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Applied:</span>
                  <p className="font-medium">{formatDate(application.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium">{formatDate(application.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}

            {/* Resume */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Resume</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(application.resumeUrl, "_blank")}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiDownload className="w-4 h-4 mr-2" />
                  Download Resume
                </button>
                <span className="text-sm text-gray-600">PDF Document</span>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Contact Candidate</h4>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiMail className="w-4 h-4 mr-2" />
                Send Email
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <FiPhone className="w-4 h-4 mr-2" />
                Schedule Call
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Status update functionality will be available soon.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
