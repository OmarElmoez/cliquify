import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar as CalendarIcon, ChevronRight, Info } from 'lucide-react';
import { CampaignData } from '@/schemas/campaignSchema';
import { Control, UseFormSetValue } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface BudgetSchedulingProps {
  campaign: CampaignData;
  updateCampaign: (data: Partial<CampaignData>) => void;
  control: Control<CampaignData>;
  setValue: UseFormSetValue<CampaignData>;
}

export const BudgetScheduling = ({
  campaign,
  updateCampaign,
  control,
  setValue
}: BudgetSchedulingProps) => {

  const [budgetType, setBudgetType] = useState<'daily' | 'lifetime'>();
  const [startData, setStartData] = useState({
    date: "",
    time: "00:00"
  });
  const [endData, setEndData] = useState({
    date: "",
    time: "00:00"
  });

  useEffect(() => {
    updateCampaign({
      adset_data: { ...campaign.adset_data, start_time: `${startData.date}, ${startData.time}` }
    });
  }, [startData.date, startData.time])

  useEffect(() => {
    updateCampaign({
      adset_data: { ...campaign.adset_data, end_time: `${endData.date}, ${endData.time}` }
    });
  }, [endData.date, endData.time])

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Budget & Schedule</h2>

        <div className="space-y-4">
          {/* Budget Type and Amount */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label data-required='true'>Budget</Label>
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
                onValueChange={(value: 'daily' | 'lifetime') => {
                  setBudgetType(value);
                }}
                defaultValue={budgetType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Budget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (USD)</SelectItem>
                  <SelectItem value="lifetime">Lifetime (USD)</SelectItem>
                </SelectContent>
              </Select>

              {budgetType && (
                <FormField
                  control={control}
                  key={budgetType}
                  name={budgetType === 'lifetime' ? 'adset_data.lifetime_budget' : 'adset_data.daily_budget'}
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        min={0}
                        className="w-[180px]"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                          // Update both daily and lifetime budget based on selected type
                          // if (budgetType === 'lifetime') {
                          //   updateCampaign({
                          //     adset_data: {
                          //       ...campaign.adset_data,
                          //       lifetime_budget: value,
                          //       daily_budget: undefined
                          //     }
                          //   });
                          // } else {
                          //   updateCampaign({
                          //     adset_data: {
                          //       ...campaign.adset_data,
                          //       daily_budget: value,
                          //       lifetime_budget: undefined
                          //     }
                          //   });
                          // }
                        }}
                      />
                    </FormControl>
                  )}
                />
              )}
            </div>
          </div>

          {/* Start Date & Time */}
          <FormField
            control={control}
            name="adset_data.start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Start Date & Time</FormLabel>
                <div className="flex gap-4 mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{startData.date ? format(new Date(startData.date), "PPP") : "Pick a start date"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startData.date ? new Date(startData.date) : undefined}
                        onSelect={(date) => {
                          setStartData(prev => ({
                            ...prev,
                            date: format(date, "yyyy-MM-dd")
                          }))
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormControl>
                    <Input
                      type="time"
                      className="w-[180px]"
                      value={startData.time || "00:00"}
                      onChange={(e) => {
                        setStartData(prev => ({
                          ...prev,
                          time: e.target.value
                        }))
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date & Time (only for lifetime budget) */}
          {(
            <FormField
              control={control}
              name="adset_data.end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-required={budgetType === 'lifetime' ? 'true' : undefined}>Schedule End Date & Time</FormLabel>
                  <div className="flex gap-4 mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[240px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>{endData.date ? format(new Date(endData.date), "PPP") : "Pick an end date"}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endData.date ? new Date(endData.date) : undefined}
                          onSelect={(date) => {
                            setEndData(prev => ({
                              ...prev,
                              date: format(date, "yyyy-MM-dd")
                            }))
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormControl>
                      <Input
                        type="time"
                        className="w-[180px]"
                        value={endData.time || "00:00"}
                        onChange={(e) => {
                          setEndData(prev => ({
                            ...prev,
                            time: e.target.value
                          }))
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex justify-end mt-8">
        <Button
            type="submit"
            disabled={control._formState?.isSubmitting}
            onClick={() => {
              startData.date && setValue('adset_data.start_time', `${startData.date}, ${startData.time}`);
              endData.date && setValue('adset_data.end_time', `${endData.date}, ${endData.time}`);
            }}
          >
            {control._formState?.isSubmitting ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                Publishing...
              </>
            ) : (
              <>
                Publish
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
      </div>
      </div>
    </div>
  );
};
