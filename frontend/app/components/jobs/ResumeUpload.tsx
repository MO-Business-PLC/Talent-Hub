export interface ResumeUploadProps {
  className?: string;
}

export function ResumeUpload({ className = "" }: ResumeUploadProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Get noticed faster</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Whoever desires to avoid the labor of love should know that it is a beautiful struggle.
      </p>
      
      <button className="w-full bg-base hover:bg-primary-600 text-white py-2 rounded-lg font-medium transition-colors duration-200">
        Upload Your Resume
      </button>
    </div>
  );
}
