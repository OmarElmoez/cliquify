import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import getAdsets, { Adset } from '@/services/adsets';
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import countries from '@/data/countries';
import { CampaignData } from '@/schemas/campaignSchema';
import { Control, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import OBJECTIVES from '@/data/objectives';
import getOptimizationGoals from '@/services/optimization-goals';

interface TargetingSetupProps {
  campaign: CampaignData;
  updateCampaign: (data: Partial<CampaignData>) => void;
  control: Control<CampaignData>;
  handleNextStep: () => void;
  selectedObjective: string;
  campaignType: string;
  updateAdsetType: (value: 'new' | 'existing') => void;
  adsetType: string;
}

// Age options for dropdowns
const ageOptions = Array.from({ length: 53 }, (_, i) => i + 13);

export const TargetingSetup: React.FC<TargetingSetupProps> = ({
  campaign,
  updateCampaign,
  control,
  handleNextStep,
  selectedObjective,
  campaignType,
  updateAdsetType,
  adsetType
}) => {

  const [adsets, setAdsets] = useState<Adset[]>([]);
  const [bidValue, setBidValue] = useState('');
  // const [adsetType, setAdsetType] = useState<'new' | 'existing'>('new');
  const [selectedOptimizationGoal, setSelectedOptimizationGoal] = useState('')
  const [optimizationGoals, setOptimizationGoals] = useState<string[]>([])

  // const relattedOptimizationGoals = selectedObjective && OBJECTIVES.filter(objective => objective.title === selectedObjective)[0]?.optimizationGoals || []


  useEffect(() => {
    const fetchAdsets = async () => {
      try {
        const res = await getAdsets({campaign_id: campaign.campaign_id});
        setAdsets(res.response);
      } catch (error) {
        console.error('Error fetching adsets:', error);
      }
    };

    const fetchOptimizationGoals = async () => {
      try {
        const res = await getOptimizationGoals({objective: campaign.campaign_data.objective});
        setOptimizationGoals(res["optimization goals"]);
      } catch (error) {
        console.error('Error fetching optimization goals:', error);
      }
    };
    if (campaign.account_id) {
      fetchAdsets();
    }
    fetchOptimizationGoals()
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Adset</h2>

        <div className="space-y-6 bg-white p-6 rounded-md border">
          <RadioGroup
            value={adsetType}
            onValueChange={(value: 'new' | 'existing') => updateAdsetType(value)}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-8">
              {campaignType !== 'new' && <div className="flex justify-center items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" className="mt-1" />
                <Label htmlFor="existing" className="font-medium">Use a saved adset</Label>
              </div>}

              <div className="flex justify-center items-center space-x-2">
                <RadioGroupItem value="new" id="new" className="mt-1" />
                <Label htmlFor="new" className="font-medium">Create a new adset</Label>
              </div>
            </div>

            {adsetType === 'existing' && (
              <div className="mt-4 pl-6">
                <FormField
                  control={control}
                  name="adset_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Saved Adset</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a saved adset" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {adsets?.map(adset => (
                            <SelectItem key={adset.id} value={adset.id}>
                              {adset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {adsetType === 'new' && (
              <div className="space-y-6 mt-4 pl-6">
                {/* Adset Name */}
                <FormField
                  control={control}
                  name="adset_data.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter adset name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={control}
                  name="adset_data.status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PAUSED">PAUSED</SelectItem>
                          <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optimization Goal */}
                <FormField
                  control={control}
                  name="adset_data.optimization_goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optimization Goal</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedOptimizationGoal(value)
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select optimization goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {optimizationGoals.map(goal => (
                            <SelectItem value={goal} key={goal}>{goal}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Billing Event */}
                <FormField
                  control={control}
                  name="adset_data.billing_event"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Event</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing event" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IMPRESSIONS">IMPRESSIONS</SelectItem>
                          {selectedOptimizationGoal === "LINK_CLICKS" && <SelectItem value="LINK_CLICKS">LINK CLICKS</SelectItem>}
                          {selectedOptimizationGoal === "PAGE_LIKES" && <SelectItem value="PAGE_LIKES">PAGE LIKES</SelectItem>}
                          {selectedOptimizationGoal === "POST_ENGAGEMENT" && <SelectItem value="POST_ENGAGEMENT">POST ENGAGEMENT</SelectItem>}
                          {selectedOptimizationGoal === "POST_ENGAGEMENT" && <SelectItem value="POST_ENGAGEMENT">Post ENGAGEMENT</SelectItem>}
                          {selectedOptimizationGoal === 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS' && <SelectItem value="VIDEO_VIEWS">VIDEO VIEWS</SelectItem>}
                          {selectedOptimizationGoal === 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS' && <SelectItem value='TWO_SECOND_CONTINUOUS_VIDEO_VIEWS'>TWO SECOND CONTINUOUS VIDEO VIEWS</SelectItem>}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bid Strategy */}
                <FormField
                  control={control}
                  name="adset_data.bid_strategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Strategy</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value)
                        setBidValue(value)
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bid strategy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOWEST_COST_WITHOUT_CAP">Lowest Cost Without Cap</SelectItem>
                          <SelectItem value="COST_CAP">Cost Cap</SelectItem>
                          <SelectItem value="LOWEST_COST_WITH_MIN_ROAS">Lowest Cost With Min ROAS</SelectItem>
                          <SelectItem value="LOWEST_COST_WITH_BID_CAP">Lowest Cost With Bid Cap</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bid Amount */}
                {bidValue !== "LOWEST_COST_WITHOUT_CAP" && <FormField
                  control={control}
                  name="adset_data.bid_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter bid amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />}

                {/* Location */}
                <FormField
                  control={control}
                  name="adset_data.geo_locations.countries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <MultiSelect
                          placeholder="Select locations..."
                          options={countries.map(location => ({ value: location.value, label: location.label }))}
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age Range */}
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <FormField
                        control={control}
                        name="adset_data.targeting.age_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-gray-500">Min Age</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Min Age" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ageOptions.map(age => (
                                  <SelectItem key={`min-${age}`} value={age.toString()}>
                                    {age}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-1/2">
                      <FormField
                        control={control}
                        name="adset_data.targeting.age_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-gray-500">Max Age</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Max Age" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ageOptions.map(age => (
                                  <SelectItem key={`max-${age}`} value={age.toString()}>
                                    {age === 65 ? '65+' : age}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <FormField
                  control={control}
                  name="adset_data.targeting.genders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <MultiSelect
                          placeholder="Select genders..."
                          options={[
                            { value: 1, label: 'Male' },
                            { value: 2, label: 'Female' }
                          ]}
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </RadioGroup>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button
          type="button"
          onClick={handleNextStep}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
