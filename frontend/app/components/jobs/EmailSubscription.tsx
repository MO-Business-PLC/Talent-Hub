export interface EmailSubscriptionProps {
  className?: string;
}

export function EmailSubscription({ className = "" }: EmailSubscriptionProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Get update email</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        It is essential to work with dedication. Enjoy the process and embrace the challenges.
      </p>
      
      <div className="space-y-3">
        <input
          type="email"
          placeholder="contact@myemail.com"
          defaultValue="contact@myemail.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base focus:border-transparent text-sm"
        />
        <button className="w-full bg-base hover:bg-primary-600 text-white py-2 rounded-lg font-medium transition-colors duration-200">
          Subscribe
        </button>
      </div>
    </div>
  );
}
