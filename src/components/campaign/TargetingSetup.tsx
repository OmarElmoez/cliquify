
import React, { useState } from 'react';
import { CampaignData } from '@/pages/CreateCampaign';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

interface TargetingSetupProps {
  campaign: CampaignData;
  updateCampaign: (data: Partial<CampaignData>) => void;
}

// Age options for dropdowns
const ageOptions = Array.from({ length: 53 }, (_, i) => i + 13);

// Dummy location data
const locationOptions = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
];

export const TargetingSetup: React.FC<TargetingSetupProps> = ({ campaign, updateCampaign }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Audience</h2>
        
        <div className="space-y-6 bg-white p-6 rounded-md border">
          <RadioGroup 
            value={campaign.audience} 
            onValueChange={(value) => updateCampaign({ audience: value as 'new' | 'existing' })}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-8">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="existing" id="existing" className="mt-1" />
                <Label htmlFor="existing" className="font-medium">Use a saved audience</Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="new" id="new" className="mt-1" />
                <Label htmlFor="new" className="font-medium">Create a new audience</Label>
              </div>
            </div>
            
            {campaign.audience === 'existing' && (
              <div className="mt-4 pl-6">
                <Select 
                  value={campaign.existingAudience} 
                  onValueChange={(value) => updateCampaign({ existingAudience: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a saved audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audience1">Audience 1</SelectItem>
                    <SelectItem value="audience2">Audience 2</SelectItem>
                    <SelectItem value="audience3">Audience 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {campaign.audience === 'new' && (
              <div className="space-y-6 mt-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={campaign.location || ''}
                    onValueChange={(value) => updateCampaign({ location: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select locations" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map(location => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <Label htmlFor="minAge" className="text-sm text-gray-500 mb-1">Min Age</Label>
                      <Select
                        value={campaign.minAge?.toString() || '18'}
                        onValueChange={(value) => updateCampaign({ minAge: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Min Age" />
                        </SelectTrigger>
                        <SelectContent>
                          {ageOptions.map(age => (
                            <SelectItem key={`min-${age}`} value={age.toString()}>
                              {age}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-1/2">
                      <Label htmlFor="maxAge" className="text-sm text-gray-500 mb-1">Max Age</Label>
                      <Select
                        value={campaign.maxAge?.toString() || '65'}
                        onValueChange={(value) => updateCampaign({ maxAge: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Max Age" />
                        </SelectTrigger>
                        <SelectContent>
                          {ageOptions.map(age => (
                            <SelectItem key={`max-${age}`} value={age.toString()}>
                              {age === 65 ? '65+' : age}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Demographics, Interests, Behaviors, and Estimated audience size have been removed */}
              </div>
            )}
          </RadioGroup>
          
          {/* Narrow audience button (removed as requested) */}
          
          {/* Add exclusion button (removed as requested) */}
        </div>
      </div>
    </div>
  );
};
