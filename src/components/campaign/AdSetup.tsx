
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { CampaignData } from "@/pages/CreateCampaign";

// Mock data - replace with actual API data in production
const adAccounts = [
  { id: 'acc1', name: 'Business Account 1' },
  { id: 'acc2', name: 'Business Account 2' },
];

const pages = [
  { id: 'page1', name: 'Business Page 1' },
  { id: 'page2', name: 'Business Page 2' },
];

const campaigns = [
  { id: 'camp1', name: 'Summer Campaign 2025' },
  { id: 'camp2', name: 'Product Launch Campaign' },
];

const posts = [
  { id: 'post1', name: 'Product Announcement Post' },
  { id: 'post2', name: 'Summer Sale Post' },
];

const callToActions = [
  'Learn More',
  'Sign Up',
  'Shop Now',
  'Book Now',
  'Contact Us',
  'Download',
  'Apply Now',
  'Get Quote',
  'Subscribe',
];

interface AdSetupProps {
  campaign: CampaignData;
  updateCampaign: (data: Partial<CampaignData>) => void;
}

export const AdSetup = ({ campaign, updateCampaign }: AdSetupProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateCampaign({ image: e.target.files[0] });
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ad Setup</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="adAccount">Select Ad Account</Label>
            <Select 
              value={campaign.adAccount} 
              onValueChange={(value) => updateCampaign({ adAccount: value })}
            >
              <SelectTrigger id="adAccount" className="w-full">
                <SelectValue placeholder="Select Ad Account" />
              </SelectTrigger>
              <SelectContent>
                {adAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="page">Select Page</Label>
            <Select 
              value={campaign.page} 
              onValueChange={(value) => updateCampaign({ page: value })}
            >
              <SelectTrigger id="page" className="w-full">
                <SelectValue placeholder="Select Page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map(page => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Campaign</Label>
            <RadioGroup 
              value={campaign.campaignType}
              onValueChange={(value: 'new' | 'existing') => updateCampaign({ campaignType: value })}
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

            {campaign.campaignType === 'existing' && (
              <div className="mt-2 pl-6">
                <Select 
                  value={campaign.existingCampaign} 
                  onValueChange={(value) => updateCampaign({ existingCampaign: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select existing campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map(camp => (
                      <SelectItem key={camp.id} value={camp.id}>
                        {camp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Ad Creative</h3>
        
        <div className="space-y-2">
          <RadioGroup 
            value={campaign.adCreativeType}
            onValueChange={(value: 'existing' | 'new') => updateCampaign({ adCreativeType: value })}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing-post" />
              <Label htmlFor="existing-post">Select existing post</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="create-new" />
              <Label htmlFor="create-new">Create new ad</Label>
            </div>
          </RadioGroup>

          {campaign.adCreativeType === 'existing' ? (
            <div className="mt-4 pl-6">
              <Label htmlFor="existing-post-select">Select Post</Label>
              <Select 
                value={campaign.existingPost} 
                onValueChange={(value) => updateCampaign({ existingPost: value })}
              >
                <SelectTrigger id="existing-post-select" className="w-full">
                  <SelectValue placeholder="Select existing post" />
                </SelectTrigger>
                <SelectContent>
                  {posts.map(post => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="mt-4 pl-6 space-y-4">
              <div>
                <Label htmlFor="url">URL</Label>
                <Input 
                  id="url" 
                  placeholder="https://example.com" 
                  value={campaign.url || ''} 
                  onChange={(e) => updateCampaign({ url: e.target.value })}
                />
              </div>
              
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
                {campaign.image && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected file: {campaign.image.name}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="body">Ad Text</Label>
                <Textarea 
                  id="body" 
                  placeholder="Enter the main text for your ad" 
                  value={campaign.body || ''} 
                  onChange={(e) => updateCampaign({ body: e.target.value })}
                  className="h-24"
                />
              </div>
              
              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input 
                  id="headline" 
                  placeholder="Enter a catchy headline" 
                  value={campaign.headline || ''} 
                  onChange={(e) => updateCampaign({ headline: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="cta">Call to Action</Label>
                <Select 
                  value={campaign.callToAction} 
                  onValueChange={(value) => updateCampaign({ callToAction: value })}
                >
                  <SelectTrigger id="cta" className="w-full">
                    <SelectValue placeholder="Select call to action" />
                  </SelectTrigger>
                  <SelectContent>
                    {callToActions.map(cta => (
                      <SelectItem key={cta} value={cta}>
                        {cta}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
