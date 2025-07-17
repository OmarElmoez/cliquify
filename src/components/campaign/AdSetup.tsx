import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Upload, X } from 'lucide-react';
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
import getCreativeAds, { CreativeAd, TGetCreativeAdsResponse } from '@/services/creativeAds';
import MultiSelect from "@/components/shared/MultiSelect"
import { useDialog } from '@/hooks/useDialog';
import StatusDialog from '@/components/shared/StatusDialog';

import { cn } from '@/lib/utils';



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

type TUploadedImg = {
  img: File,
  imgUrl: string
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const AdSetup = ({ campaign, updateCampaign, control, handleNextStep, campaignType, updateCampaignType, setValue }: AdSetupProps) => {

  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  // const [campaignType, setCampaignType] = useState<'new' | 'existing'>('new');
  const [adCreativeType, setAdCreativeType] = useState<'existing' | 'new'>('new');
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>('');
  const [creativeAds, setCreativeAds] = useState<TGetCreativeAdsResponse>()
  const [isImgLoading, setIsImgLoading] = useState(false)
  const [uploadedImg, setUploadedImg] = useState<TUploadedImg>()
  const {
    isDialogOpen,
    dialogState,
    showDialog,
    handleDialogClose
  } = useDialog();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsImgLoading(true)
      try {
        const res = await getImageHashKey(file)
        setUploadedImg(({
          img: file,
          imgUrl: URL.createObjectURL(file)
        }))
        setIsImgLoading(false)
        updateCampaign({ image_hash: res.image_hash.hash });
        setValue('image_hash', res.image_hash.hash)
      } catch (error) {
        toast('failed to uplaod image')
        setIsImgLoading(false)
      }
    }
  };

  useEffect(() => {
    const fetchAdAccounts = async () => {
      try {
        const response = await getAdAccounts();
        if (typeof response === 'string') {
          showDialog('error', 'An Error Occurred', response, true)
        }
        setAdAccounts(response.data);
      } catch (error) {
        console.error('Error fetching ad accounts:', error);
        toast.error('Error fetching ad accounts');
      }
    };

    const fetchPages = async () => {
      try {
        const response = await getPages();
        setPages(response.pages);
      } catch (error) {
        console.error('Error fetching pages:', error);
        toast.error('Error fetching pages');
      }
    };

    fetchAdAccounts();
    fetchPages();
  }, []);

  useEffect(() => {

    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns({ account_id: selectedAdAccount });
        setCampaigns(response.results);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Error fetching campaigns');
      }
    };

    const fetchcreativeAds = async () => {
      try {
        const res = await getCreativeAds({ account_id: selectedAdAccount });
        setCreativeAds(res);
      } catch (error) {
        console.error('Error fetching creative ads:', error);
        toast.error('Error fetching creative ads');
      }
    };

    if (selectedAdAccount) {
      fetchCampaigns();
      fetchcreativeAds();
    }
  }, [selectedAdAccount]);

  const getCampaignObjective = (campaingId: string) => {
    const { objective } = campaigns?.find(campaign => campaign.campaign_id === campaingId);
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
    <>
      <StatusDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        title={dialogState.title}
        description={dialogState.description}
        variant={dialogState.variant}
        showActionButton={dialogState.showActionButton}
      />
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
                      {adAccounts?.map(account => (
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
                className="flex gap-4"
              >
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2" onClick={() => setValue('campaign_id', '')}>
                    <RadioGroupItem value="new" id="new-campaign" />
                    <Label htmlFor="new-campaign">Create new campaign</Label>
                  </div>
                  {/* Show error if no campaign_id and campaign_data is missing (schema error)
                {campaignType === 'new' && control._formState?.errors?.creative_data && (
                  <span className="text-sm text-red-500 mt-1">
                    {control._formState.errors.creative_data.message || "Campaign data is required if no campaign_id is provided"}
                  </span>
                )} */}
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
                  {campaign.campaign_data?.objective && <FormField
                    control={control}
                    name="campaign_data.special_ad_categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Ad Categories</FormLabel>
                        <FormControl>
                          <MultiSelect onChange={field.onChange} value={field.value} choices={(adCategoriesOptions(campaign.campaign_data?.objective))} placeholder='select ad categories' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />}
                </div>
              )}

              {campaignType === 'existing' && (
                campaigns?.length > 0 ? (
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
                              {campaigns?.map(camp => (
                                <SelectItem key={camp.campaign_id} value={camp.campaign_id}>
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
                ) : (
                  <div className="mt-4 pl-6">
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3 text-yellow-800 text-sm">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                      </svg>
                      <span>No campaigns avaliable for this account.</span>
                    </div>
                  </div>
                )
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
              className="flex gap-4"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2" onClick={() => setValue('creative_id', '')}>
                  <RadioGroupItem value="new" id="create-new" />
                  <Label htmlFor="create-new">Create new ad</Label>
                </div>
                {/* Show error if no creative_id and creative_data is missing (schema error) */}
                {adCreativeType === 'new' && control._formState?.errors?.creative_data && (
                  <span className="text-sm text-red-500 mt-1">
                    {typeof control._formState.errors.creative_data.message === 'string'
                      ? control._formState.errors.creative_data.message
                      : "Creative data is required if no creative_id is provided"}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing-post" />
                <Label htmlFor="existing-post">Select existing ad</Label>
              </div>
            </RadioGroup>

            {adCreativeType === 'existing' && creativeAds?.response && creativeAds.response.length > 0 && (
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
                          {creativeAds.response.map(post => (
                            <SelectItem key={post.creative_id} value={post.creative_id}>
                              {post.name}
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
            {adCreativeType === 'existing' && (!creativeAds?.response || creativeAds.response.length === 0) && (
              <div className="mt-4 pl-6">
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3 text-yellow-800 text-sm">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                  </svg>
                  <span>No existing ads found for this account.</span>
                </div>
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
                  {!uploadedImg && <div className="mt-2 flex items-center justify-center w-full">
                    <label className={cn("flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100",
                      isImgLoading && 'cursor-not-allowed'
                    )}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isImgLoading ? (
                          <div className="flex flex-col items-center">
                            <svg className="animate-spin h-8 w-8 text-gray-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <p className="text-sm text-gray-500">Uploading...</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x800px)</p>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </>
                        )}
                      </div>
                    </label>
                  </div>}
                  {uploadedImg && (
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg shadow-sm mt-4 max-w-xl relative">
                      <Button className='cursor-pointer absolute right-4 top-4 bg-transparent' onClick={() => {
                        setUploadedImg(undefined)
                        setValue('image_hash', '')
                      }}>
                        <X size={18} className='text-red-500' />
                      </Button>
                      {/* Image Preview */}
                      <div className="flex-shrink-0">
                        <img
                          src={uploadedImg.imgUrl}
                          alt={uploadedImg.img.name}
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                      {/* Image Details */}
                      <div className="flex flex-col justify-center">
                        <div className="text-sm text-gray-700 font-medium mb-2">File Details</div>
                        <div className="text-base text-gray-900 mb-1">
                          <span className="font-semibold">Name:</span> {uploadedImg.img.name}
                        </div>
                        <div className="text-base text-gray-900 mb-1">
                          <span className="font-semibold">Size:</span> {formatFileSize(uploadedImg.img.size)}
                        </div>
                        <div className="text-base text-gray-900">
                          <span className="font-semibold">Type:</span> {uploadedImg.img.type}
                        </div>
                      </div>
                    </div>
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
    </>
  );
};
