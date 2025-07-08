import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Upload } from 'lucide-react';
import { AdAccount, getAdAccounts } from '@/services/adAccountService';
import { getPages, Page } from '@/services/pages';
import { toast } from 'sonner';
import { Campaign, getCampaigns } from '@/services/campaignService';
import callToActions from '@/data/callToActions';
import { CampaignData } from '@/schemas/campaignSchema';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '../ui/button';
import OBJECTIVES from '@/data/objectives';
import getImageHashKey from '@/services/getImageHashKey';
import getCreativeAds, { CreativeAd } from '@/services/creativeAds';
import { MultiSelect } from "@/components/ui/multi-select";
import { Checkbox } from '../ui/checkbox';



const posts = [
  { id: 'post1', name: 'Product Announcement Post' },
  { id: 'post2', name: 'Summer Sale Post' },
];

interface AdSetupProps {
  campaign: CampaignData;
  updateCampaign: (data: Partial<CampaignData>) => void;
  control: Control<CampaignData>;
  setValue: UseFormSetValue<CampaignData>;
  handleNextStep: () => void;
  campaignType: string;
  updateCampaignType: (value: string) => void
}

export const AdSetup = ({ campaign, updateCampaign, control, handleNextStep, campaignType, updateCampaignType, setValue }: AdSetupProps) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const res = await getImageHashKey(e.target.files[0])
      updateCampaign({ image_hash: res.image_hash.hash });
      setValue('image_hash', res.image_hash.hash)
    }
  };

  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  // const [campaignType, setCampaignType] = useState<'new' | 'existing'>('new');
  const [adCreativeType, setAdCreativeType] = useState<'existing' | 'new'>('new');
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>('');
  const [creativeAds, setCreativeAds] = useState<CreativeAd[]>([])

  useEffect(() => {
    const fetchAdAccounts = async () => {
      try {
        const response = await getAdAccounts();
        setAdAccounts(response.data);
      } catch (error) {
        console.error('Error fetching ad accounts:', error);
        toast.error('Error fetching ad accounts');
      }
    };

    const fetchcreativeAds = async () => {
      try {
        const res = await getCreativeAds();
        setCreativeAds(res);
      } catch (error) {
        console.error('Error fetching creative ads:', error);
        toast.error('Error fetching creative ads');
      }
    };

    fetchAdAccounts();
    fetchcreativeAds();
  }, []);

  useEffect(() => {

    const fetchPages = async () => {
      try {
        const response = await getPages();
        setPages(response.pages);
      } catch (error) {
        console.error('Error fetching pages:', error);
        toast.error('Error fetching pages');
      }
    };

    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns({ account_id: selectedAdAccount });
        setCampaigns(response.results);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Error fetching campaigns');
      }
    };

    if (selectedAdAccount) {
      fetchPages();
      fetchCampaigns();
    }
  }, [selectedAdAccount]);

  const getCampaignObjective = (campaingId: string) => {
    const { objective } = campaigns.find(campaign => campaign.id === campaingId);
    updateCampaign({ campaign_data: { ...campaign.campaign_data, objective } })
  }

  const adCategoriesOptions = (objectiveVal: string) => {

    switch (objectiveVal) {
      case 'OUTCOME_AWARENESS':
      case 'OUTCOME_TRAFFIC':
      case 'OUTCOME_ENGAGEMENT':
      case 'OUTCOME_APP_PROMOTION':
        return [{ value: 'NONE', label: 'NONE' }];

      case 'OUTCOME_LEADS':
      case 'OUTCOME_SALES':
        return [{ value: 'NONE', label: 'NONE' },
        { value: 'CREDIT', label: 'CREDIT' },
        { value: 'EMPLOYMENT', label: 'EMPLOYMENT' },
        { value: 'HOUSING', label: 'HOUSING' },
        { value: 'ISSUES_ELECTIONS_POLITICS', label: 'ISSUES_ELECTIONS_POLITICS' }]

      default:
        return [];
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Ad Name */}
      <FormField
        control={control}
        name="ad_data.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ad Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter ad name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ad Status */}
      <FormField
        control={control}
        name="ad_data.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ad Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ad status" />
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

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ad Setup</h2>

        <div className="space-y-4">
          {/* Ad Account Selection */}
          <FormField
            control={control}
            name="account_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Ad Account</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedAdAccount(value);
                }} value={selectedAdAccount}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Ad Account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {adAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Page Selection */}
          <FormField
            control={control}
            name="page_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Page</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Page" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pages.map(page => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Campaign</Label>
            <RadioGroup
              value={campaignType}
              onValueChange={(value: 'new' | 'existing') => updateCampaignType(value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new-campaign" />
                <Label htmlFor="new-campaign">Create new campaign</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing-campaign" />
                <Label htmlFor="existing-campaign">Add to existing campaign</Label>
              </div>
            </RadioGroup>

            {campaignType === 'new' && (
              <div className="mt-2 pl-6 space-y-4">
                {/* Campaign Name */}
                <FormField
                  control={control}
                  name="campaign_data.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter campaign name"
                          {...field}

                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Objective */}
                <FormField
                  control={control}
                  name="campaign_data.objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objective</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        updateCampaign({ campaign_data: { ...campaign.campaign_data, objective: value } })
                        // updateObjectiveValue(value)
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select objective" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OBJECTIVES.map(objective => (
                            <SelectItem key={objective.title} value={objective.title}>
                              {objective.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={control}
                  name="campaign_data.status"
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

                {/* Buying Type */}
                <FormField
                  control={control}
                  name="campaign_data.buying_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buying Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select buying type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AUCTION">AUCTION</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Special Ad Categories */}
                {/* <FormField
                  control={control}
                  name="campaign_data.special_ad_categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Ad Categories</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={[
                            { label: "None", value: "NONE" },
                            { label: "Credit", value: "CREDIT" },
                            { label: "Employment", value: "EMPLOYMENT" },
                            { label: "Housing", value: "HOUSING" },
                            { label: "Issues/Elections/Politics", value: "ISSUES_ELECTIONS_POLITICS" },
                          ]}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select categories..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                {/* <FormField
                  control={control}
                  name="campaign_data.special_ad_categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Ad Categories</FormLabel>
                      <FormControl>
                        <MultiSelect
                          placeholder="Select categories..."
                          options={[
                            { value: 'NONE', label: 'NONE' },
                            { value: 'CREDIT', label: 'CREDIT' },
                            { value: 'EMPLOYMENT', label: 'EMPLOYMENT' },
                            { value: 'HOUSING', label: 'HOUSING' },
                            { value: 'ISSUES_ELECTIONS_POLITICS', label: 'ISSUES_ELECTIONS_POLITICS' }
                          ]}
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={control}
                  name="campaign_data.special_ad_categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Ad Categories</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          {(adCategoriesOptions(campaign.campaign_data?.objective)).map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`special-ad-category-${option.value}`}
                                checked={Array.isArray(field.value) ? field.value.includes(option.value) : false}
                                onCheckedChange={checked => {
                                  let newValue: string[] = Array.isArray(field.value) ? [...field.value] : [];
                                  if (checked) {
                                    if (!newValue.includes(option.value)) {
                                      newValue.push(option.value);
                                    }
                                  } else {
                                    newValue = newValue.filter(v => v !== option.value);
                                  }
                                  field.onChange(newValue);
                                }}
                              />
                              <label htmlFor={`special-ad-category-${option.value}`} className="text-sm">
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {campaignType === 'existing' && (
              <div className="mt-2 pl-6">
                <FormField
                  control={control}
                  name="campaign_id"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        updateCampaign({ campaign_id: value })
                        getCampaignObjective(value)
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select existing campaign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campaigns.map(camp => (
                            <SelectItem key={camp.id} value={camp.id}>
                              {camp.name}
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
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Ad Creative</h3>

        <div className="space-y-2">
          <RadioGroup
            value={adCreativeType}
            onValueChange={(value: 'existing' | 'new') => setAdCreativeType(value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="create-new" />
              <Label htmlFor="create-new">Create new ad</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing-post" />
              <Label htmlFor="existing-post">Select existing ad</Label>
            </div>
          </RadioGroup>

          {adCreativeType === 'existing' && (
            <div className="mt-4 pl-6">
              <FormField
                control={control}
                name="creative_id"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select existing ad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {creativeAds?.map(post => (
                          <SelectItem key={post.creative__creative_id} value={post.creative__creative_id}>
                            {post.creative__name}
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

          {adCreativeType === 'new' && (
            <div className="mt-4 pl-6 space-y-4">
              {/* Creative Name */}
              <FormField
                control={control}
                name="creative_data.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter ad name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL */}
              <FormField
                control={control}
                name="creative_data.object_story_spec.link_data.link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div>
                <Label>Upload Image</Label>
                <div className="mt-2 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x800px)</p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {campaign.image_hash && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected file: {campaign.image_hash}
                  </p>
                )}
              </div>

              {/* Message */}
              <FormField
                control={control}
                name="creative_data.object_story_spec.link_data.message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the main text for your ad"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={control}
                name="creative_data.object_story_spec.link_data.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Call to Action */}
              <FormField
                control={control}
                name="creative_data.object_story_spec.link_data.call_to_action.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call to Action</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select call to action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {callToActions.map(cta => (
                          <SelectItem key={cta.label} value={cta.value}>
                            {cta.label}
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
