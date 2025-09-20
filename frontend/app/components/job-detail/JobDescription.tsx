export interface JobDescriptionProps {
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  className?: string;
}

export function JobDescription({
  description,
  requirements,
  responsibilities,
  benefits = [],
  className = "",
}: JobDescriptionProps) {
  console.log("description", description);
  return (
    <div className={`p-8 ${className}`}>
      {/* Position Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Position Overview
        </h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
        </div>
      </div>

      {/* Qualifications */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Qualifications
        </h3>
        <ul className="space-y-3">
          {requirements.map(requirement => (
            <li key={requirement} className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preferred Qualifications */}
      {requirements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preferred Qualifications:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">
                Familiarity with eCommerce platforms (Shopify, Magento,
                WooCommerce, and Visualsoft).
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">
                Knowledge of payment gateways.
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">
                Experience in building RESTful APIs.
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Perks and Benefits */}
      {benefits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Perks and Benefits
          </h3>
          <ul className="space-y-3">
            {benefits.map(benefit => (
              <li key={benefit} className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
