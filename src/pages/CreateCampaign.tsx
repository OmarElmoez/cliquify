
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AdTypeSelection } from "@/components/campaign/AdTypeSelection";
import { AdSetup } from "@/components/campaign/AdSetup";
import { TargetingSetup } from "@/components/campaign/TargetingSetup";
import { BudgetScheduling } from "@/components/campaign/BudgetScheduling";

export type CampaignData = {
  adType: string;
  adAccount: string;
  page: string;
  campaignType: 'new' | 'existing';
  existingCampaign?: string;
  adCreativeType: 'existing' | 'new';
  existingPost?: string;
  url?: string;
  image?: File | null;
  body?: string;
  headline?: string;
  callToAction?: string;
  audience: 'new' | 'existing';
  existingAudience?: string;
  location?: string;
  minAge?: number;
  maxAge?: number;
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  filters: Array<{type: string, value: string}>;
  targetingOptions: {
    demographics: string[];
    interests: string[];
    behaviors: string[];
  };
  budget: {
    type: 'daily' | 'lifetime';
    amount: number;
  };
  schedule: {
    startDate?: Date;
    startTime?: string;
  };
  specialAdCategory?: string;
};

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'adType' | 'setup'>('adType');
  const [activeTab, setActiveTab] = useState('ad');
  const [campaign, setCampaign] = useState<CampaignData>({
    adType: '',
    adAccount: '',
    page: '',
    campaignType: 'new',
    adCreativeType: 'new',
    audience: 'new',
    minAge: 18,
    maxAge: 65,
    filters: [],
    targetingOptions: {
      demographics: [],
      interests: [],
      behaviors: [],
    },
    budget: {
      type: 'daily',
      amount: 0,
    },
    schedule: {}
  });

  const handleExit = () => {
    navigate('/');
  };

  const handleSave = () => {
    // Save draft logic
    console.log("Saving campaign:", campaign);
  };

  const handlePublish = () => {
    // Publish campaign logic
    console.log("Publishing campaign:", campaign);
    navigate('/');
  };

  const handleAdTypeSelect = (adType: string) => {
    setCampaign(prev => ({ ...prev, adType }));
    setStep('setup');
  };

  const updateCampaign = (data: Partial<CampaignData>) => {
    setCampaign(prev => ({ ...prev, ...data }));
  };

  if (step === 'adType') {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleExit} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold">Create New Campaign</h1>
        </div>
        
        <AdTypeSelection onSelect={handleAdTypeSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#1A1F2C] text-white px-4 py-2 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white hover:text-white/80" onClick={handleExit}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:text-white/80" onClick={handleSave}>
            Save
          </Button>
          <span className="text-sm">Unsaved changes</span>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium">
            {campaign.adType} - {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </h1>
          <Button variant="ghost" size="sm" className="text-white hover:text-white/80" onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="flex border-b">
          <div 
            className={`px-6 py-3 cursor-pointer ${activeTab === 'ad' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => setActiveTab('ad')}
          >
            Ad
          </div>
          <div 
            className={`px-6 py-3 cursor-pointer ${activeTab === 'targeting' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => setActiveTab('targeting')}
          >
            Targeting
          </div>
          <div 
            className={`px-6 py-3 cursor-pointer ${activeTab === 'budget' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            Budget & Schedule
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {activeTab === 'ad' && (
            <AdSetup campaign={campaign} updateCampaign={updateCampaign} />
          )}
          
          {activeTab === 'targeting' && (
            <TargetingSetup campaign={campaign} updateCampaign={updateCampaign} />
          )}
          
          {activeTab === 'budget' && (
            <BudgetScheduling campaign={campaign} updateCampaign={updateCampaign} />
          )}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => {
                if (activeTab === 'ad') setStep('adType');
                else if (activeTab === 'targeting') setActiveTab('ad');
                else if (activeTab === 'budget') setActiveTab('targeting');
              }}
            >
              Back
            </Button>
            
            <Button 
              onClick={() => {
                if (activeTab === 'ad') setActiveTab('targeting');
                else if (activeTab === 'targeting') setActiveTab('budget');
                else if (activeTab === 'budget') handlePublish();
              }}
            >
              {activeTab === 'budget' ? 'Publish' : 'Next'} 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateCampaign;
