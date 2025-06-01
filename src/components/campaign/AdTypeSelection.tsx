
import React from 'react';

// Ad type definitions
const adTypes = [
  {
    id: 'engagement',
    title: 'Engagement ad',
    description: 'Get more people to engage with you',
    platforms: ['facebook']
  }
];

interface AdTypeSelectionProps {
  onSelect: (adType: string) => void;
}

export const AdTypeSelection = ({ onSelect }: AdTypeSelectionProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Choose your ad type</h2>
      <div className="grid gap-4">
        {adTypes.map((type) => (
          <div
            key={type.id}
            className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => onSelect(type.title)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{type.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              </div>
              <div className="flex gap-1">
                {type.platforms.includes('facebook') && (
                  <div className="w-6 h-6 bg-[#1877F2] rounded flex items-center justify-center">
                    <span className="text-white text-xs">f</span>
                  </div>
                )}
                {type.platforms.includes('linkedin') && (
                  <div className="w-6 h-6 bg-[#0A66C2] rounded flex items-center justify-center">
                    <span className="text-white text-xs">in</span>
                  </div>
                )}
                {type.platforms.includes('google') && (
                  <div className="w-6 h-6 bg-[#4285F4] rounded flex items-center justify-center">
                    <span className="text-white text-xs">G</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
