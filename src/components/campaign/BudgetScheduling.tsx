
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CampaignData } from "@/pages/CreateCampaign";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar as CalendarIcon, Clock, Info } from 'lucide-react';

interface BudgetSchedulingProps {
  campaign: CampaignData;
  updateCampaign: (data: Partial<CampaignData>) => void;
}

export const BudgetScheduling = ({ campaign, updateCampaign }: BudgetSchedulingProps) => {
  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Budget & Schedule</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Label>Budget</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px]">Set your daily or lifetime budget for this campaign</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-4 mt-2">
              <Select 
                value={campaign.budget.type}
                onValueChange={(value: 'daily' | 'lifetime') => updateCampaign({ 
                  budget: { ...campaign.budget, type: value } 
                })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Budget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (USD)</SelectItem>
                  <SelectItem value="lifetime">Lifetime (USD)</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                type="number" 
                placeholder="0.00" 
                className="w-[180px]" 
                value={campaign.budget.amount || ''} 
                onChange={(e) => updateCampaign({ 
                  budget: { ...campaign.budget, amount: parseFloat(e.target.value) || 0 } 
                })}
              />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label>Schedule</Label>
            <div className="flex gap-4 mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {campaign.schedule.startDate ? (
                      format(campaign.schedule.startDate, "PPP")
                    ) : (
                      <span>Pick a start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={campaign.schedule.startDate}
                    onSelect={(date) => updateCampaign({ 
                      schedule: { ...campaign.schedule, startDate: date } 
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select 
                value={campaign.schedule.startTime}
                onValueChange={(value) => updateCampaign({ 
                  schedule: { ...campaign.schedule, startTime: value } 
                })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{campaign.schedule.startTime || "Select time"}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="18:00">06:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
