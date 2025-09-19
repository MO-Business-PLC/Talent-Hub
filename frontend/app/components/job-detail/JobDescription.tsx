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
  return (
    <div className={`p-8 ${className}`}>
      {/* Position Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Position Overview
        </h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed mb-4">
            Velstar is a Shopify Plus agency, and we partner with brands to help
            them grow, we also do the same with our people.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Here at Velstar, we don't just make websites, we create exceptional
            digital experiences that customers love. Our team of designers,
            developers, strategists, and creators work together to push the
            boundaries of what's possible.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            We want everyone to see how much we value our team and the work we
            do. Our team has a wide range of skills and specialisms. Whether
            you're a developer, designer, or strategist, we have a place for you
            here.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            We are looking for a talented individual to join our team. You will
            be responsible for converting project specifications into clean,
            maintainable code. You will work closely with our designers,
            developers, and strategists to create innovative features for our
            clients on the Shopify platform.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Interested in joining us? You'll be in great company!
          </p>
        </div>
      </div>

      {/* Qualifications */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Qualifications
        </h3>
        <ul className="space-y-3">
          {requirements.map((requirement) => (
            <li key={requirement} className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preferred Qualifications */}
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

      {/* Perks and Benefits */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Perks and Benefits
        </h3>
        <ul className="space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
