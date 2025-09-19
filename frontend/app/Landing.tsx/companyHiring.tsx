import React, { useRef, useEffect, useState } from 'react';

const CompaniesHiring: React.FC = () => {
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (styleRef.current) return;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .marquee { animation: marquee 25s linear infinite; }
      .marquee:hover { animation-play-state: paused; }
    `;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => { if (styleRef.current) document.head.removeChild(styleRef.current); };
  }, []);

  // Check sessionStorage to see if component was already shown
  useEffect(() => {
    const hasShown = sessionStorage.getItem('companiesHiringShown');
    if (!hasShown && !hasAnimatedRef.current) {
      // Only show animation if it's the first time
      hasAnimatedRef.current = true;
      sessionStorage.setItem('companiesHiringShown', 'true');
    }
  }, []);

  const BriefcaseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  const BuildingIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  const SparklesIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const companies = [
    { name: 'Google', domain: 'google.com' },
    { name: 'Spotify', domain: 'spotify.com' },
    { name: 'Amazon', domain: 'amazon.com' },
    { name: 'Microsoft', domain: 'microsoft.com' },
    { name: 'Pinterest', domain: 'pinterest.com' },
    { name: 'Slack', domain: 'slack.com' },
    { name: 'YouTube', domain: 'youtube.com' },
    { name: 'Figma', domain: 'figma.com' },
    { name: 'Netflix', domain: 'netflix.com' },
    { name: 'Airbnb', domain: 'airbnb.com' },
    { name: 'Uber', domain: 'uber.com' },
    { name: 'Dropbox', domain: 'dropbox.com' },
    { name: 'Salesforce', domain: 'salesforce.com' },
    { name: 'Atlassian', domain: 'atlassian.com' },
    { name: 'Zoom', domain: 'zoom.us' },
    { name: 'Shopify', domain: 'shopify.com' }
  ];

  return (
    <div className="w-full py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-500 mb-4">Top Companies <span className='text-blue-500'>Hiring</span> Now</h2>
          <p className="text-lg text-gray-600">Trusted by 120,000+ businesses worldwide to find top talent</p>
        </div>

        {/* Logos - Seamless Infinite Loop */}
        <div className="relative mb-12 overflow-hidden">
          <div className="flex marquee">
            {/* First loop */}
            {companies.map((company, i) => (
              <div key={`first-${i}`} className="flex items-center space-x-3 mx-6 min-w-[140px] h-16 flex-shrink-0">
                <img 
                  src={`https://logo.clearbit.com/${company.domain}`} 
                  alt={company.name} 
                  className="h-8 w-8 rounded-full object-contain opacity-70 hover:opacity-100 transition-all duration-300 border-2 border-white shadow-md flex-shrink-0" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${company.name.charAt(0)}`;
                  }}
                />
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap flex-shrink-0">
                  {company.name}
                </span>
              </div>
            ))}
            {/* Second loop for seamless connection */}
            {companies.map((company, i) => (
              <div key={`second-${i}`} className="flex items-center space-x-3 mx-6 min-w-[140px] h-16 flex-shrink-0">
                <img 
                  src={`https://logo.clearbit.com/${company.domain}`} 
                  alt={company.name} 
                  className="h-8 w-8 rounded-full object-contain opacity-70 hover:opacity-100 transition-all duration-300 border-2 border-white shadow-md flex-shrink-0" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${company.name.charAt(0)}`;
                  }}
                />
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap flex-shrink-0">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { value: '175,324', label: 'Live Jobs', icon: <BriefcaseIcon />, color: 'border-blue-200' },
            { value: '97,354', label: 'Companies', icon: <BuildingIcon />, color: 'border-green-200' },
            { value: '38,7154', label: 'Candidates', icon: <UsersIcon />, color: 'border-purple-200' },
            { value: '7,532', label: 'New Jobs', icon: <SparklesIcon />, color: 'border-orange-200' }
          ].map((stat, i) => (
            <div key={i} className={`bg-white flex items-center gap-8 rounded-2xl p-6 shadow-lg border-amber-100 ${stat.color} hover:shadow-xl transition-all duration-300`}>
              <div className="flex-shrink-0 text-3xl text-gray-500 p-3 bg-gray-100">{stat.icon}</div>
              <div className="flex-1">
                <div className="text-2xl font-normal text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesHiring;