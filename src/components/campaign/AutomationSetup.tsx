
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { CampaignData } from "@/pages/CreateCampaign";

interface AutomationSetupProps {
  campaign: CampaignData;
  updateCampaign: (data: Partial<CampaignData>) => void;
}

export const AutomationSetup = ({ campaign, updateCampaign }: AutomationSetupProps) => {
  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Campaign Automation</h2>
        <p className="text-sm text-gray-600">
          Set up automated rules to optimize your campaign performance.
        </p>
        
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-bidding" className="text-base">Automatic Bidding</Label>
              <p className="text-sm text-gray-500 mt-1">
                Automatically adjust bids to get the most results for your budget
              </p>
            </div>
            <Switch id="auto-bidding" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-placements" className="text-base">Automatic Placements</Label>
              <p className="text-sm text-gray-500 mt-1">
                Allow system to determine the best ad placements
              </p>
            </div>
            <Switch id="auto-placements" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-targeting" className="text-base">Expand Audience</Label>
              <p className="text-sm text-gray-500 mt-1">
                Automatically expand your audience to reach more people
              </p>
            </div>
            <Switch id="auto-targeting" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="budget-pacing" className="text-base">Budget Pacing</Label>
              <span className="text-sm font-medium">Standard</span>
            </div>
            <p className="text-sm text-gray-500">
              Control how quickly your budget is spent throughout the day
            </p>
            <Slider defaultValue={[50]} max={100} step={1} className="mt-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Standard (even delivery)</span>
              <span>Accelerated (faster delivery)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
