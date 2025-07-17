import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { AdTypeSelection } from "@/components/campaign/AdTypeSelection";
import { AdSetup } from "@/components/campaign/AdSetup";
import { TargetingSetup } from "@/components/campaign/TargetingSetup";
import { BudgetScheduling } from "@/components/campaign/BudgetScheduling";
import { StepIndicator } from "@/components/campaign/StepIndicator";
import {
  campaignDataSchema,
  type CampaignData,
} from "@/schemas/campaignSchema";
import getStepFields from '@/utils/getStepFields';
import { Form } from "@/components/ui/form"
import { toast } from 'sonner';
import createCampaign from '@/services/createCampaign';
import { useDialog } from '@/hooks/useDialog';
import StatusDialog from '@/components/shared/StatusDialog';
import { validateStep } from '@/utils/validateStep';
export type StepType = 'ad' | 'targeting' | 'budget';
const CreateCampaign = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'adType' | 'setup'>('adType');
  const [activeTab, setActiveTab] = useState<StepType>('ad');
  const [campaign, setCampaign] = useState<CampaignData>();
  const [campaignType, setCampaignType] = useState<'new' | 'existing'>('new');
  const [adsetType, setAdsetType] = useState<'new' | 'existing'>('new');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const {
    isDialogOpen,
    dialogState,
    showDialog,
    handleDialogClose
  } = useDialog();
  const form = useForm<CampaignData>({
    resolver: zodResolver(campaignDataSchema),
    mode: 'onChange',
    defaultValues: {
      account_id: '',
      campaign_id: '',
      adset_id: '',
      page_id: '',
      creative_id: '',
      image_hash: '',
      campaign_data: {
        name: '',
        status: 'PAUSED',
        objective: '',
        buying_type: 'AUCTION',
        special_ad_categories: [],
      },
      adset_data: {
        name: '',
        status: 'PAUSED',
        start_time: '',
        end_time: '',
        optimization_goal: '',
        billing_event: '',
        bid_amount: '',
        bid_strategy: '',
        lifetime_budget: '',
        daily_budget: '',
        targeting: {
          age_min: 18,
          age_max: 65,
          genders: [1, 2],
          geo_locations: {
            countries: [],
          },
          targeting_automation: {
            advantage_audience: 0
          }
        },
      },
      creative_data: {
        name: '',
        object_story_spec: {
          link_data: {
            link: '',
            message: '',
            description: '',
            call_to_action: {
              type: '',
              value: {
                link: ""
              }
            },
          },
        },
      },
      ad_data: {
        name: '',
        status: 'PAUSED',
      },
    },
  });

  const handleExit = () => {
    navigate('/dashboard');
  };

  const updateCampaignType = (value: "new" | "existing") => {
    setCampaignType(value);
  }

  const updateAdsetType = (value: "new" | "existing") => {
    setAdsetType(value);
  }

  // const handleSave = async () => {
  //   const isValid = await form.trigger();
  //   if (isValid) {
  //     const formData = form.getValues();
  //     console.log("Saving campaign:", formData);
  //   }
  // };

  // Step validation functions
  const validateCurrentStep = async (): Promise<boolean> => {
    await form.trigger(['ad_data.name', 'ad_data.status', 'account_id', 'page_id']);
    const validationResult = validateStep(activeTab, () => form.getValues());
    if (!validationResult.valid) {
      showDialog('error', 'Absent Fields', validationResult.error, true)
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, activeTab]));
      if (activeTab === 'ad') setActiveTab('targeting');
      else if (activeTab === 'targeting') setActiveTab('budget');
    } else {
      console.log(`Validation failed for ${activeTab} step`);
    }
  };

  // const handleStepClick = (stepId: string) => {
  //   // Only allow navigation to completed steps or current step
  //   if (completedSteps.has(stepId) || stepId === activeTab) {
  //     setActiveTab(stepId);
  //   }
  // };

  // Check if current step has errors
  const getStepErrors = (stepId: string): boolean => {
    const stepFields = getStepFields(stepId);
    return stepFields.some(field => {
      const error = form.formState.errors[field as any];
      return error !== undefined;
    });
  };

  const handlePublish = async (data: CampaignData) => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      if (
        data &&
        data.creative_data &&
        data.creative_data.object_story_spec &&
        data.creative_data.object_story_spec.link_data &&
        data.creative_data.object_story_spec.link_data.call_to_action &&
        data.creative_data.object_story_spec.link_data.call_to_action.value
      ) {
        data.creative_data.object_story_spec.link_data.call_to_action.value.link =
          data.creative_data.object_story_spec.link_data.link;
      }
      // Create a copy of the data
      const payload = { ...data };

      // Campaign logic: if one exists, remove the other
      if (payload.campaign_id) {
        delete payload.campaign_data;
      } else if (payload.campaign_data && Object.keys(payload.campaign_data).length > 0) {
        delete payload.campaign_id;
      }

      // Adset logic: if one exists, remove the other
      if (payload.adset_id) {
        delete payload.adset_data;
      } else if (payload.adset_data && Object.keys(payload.adset_data).length > 0) {
        delete payload.adset_id;
      }

      // Creative logic: if one exists, remove the other
      if (payload.creative_id) {
        delete payload.creative_data;
      } else if (payload.creative_data && Object.keys(payload.creative_data).length > 0) {
        delete payload.creative_id;
      }

      if (payload.adset_data && payload.adset_data.bid_strategy === "LOWEST_COST_WITHOUT_CAP") {
        delete payload.adset_data.bid_amount
      }

      if (payload?.adset_data?.daily_budget && payload?.adset_data?.end_time === '') {
        delete payload.adset_data.end_time
      }

      if (payload?.adset_data?.daily_budget && payload?.adset_data?.start_time === '') {
        delete payload.adset_data.start_time
      }

      if (payload?.adset_data?.lifetime_budget && payload?.adset_data?.start_time === '') {
        delete payload.adset_data.start_time
      }

      if (payload?.adset_data?.daily_budget) {
        delete payload.adset_data.lifetime_budget
      } else if (payload?.adset_data?.lifetime_budget) {
        delete payload.adset_data.daily_budget
      }

      const response = await createCampaign(payload);
      if (typeof response === 'string') {
        showDialog('error', 'Unexpected Error', response, true)
      }
      if (response.campaign_id) {
        navigate('/dashboard');
      }
    } else {
      toast.error('Please fill in all the fields');
    }
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
          {/* <h1 className="text-xl font-semibold">Create New Campaign</h1> */}
        </div>

        <AdTypeSelection onSelect={handleAdTypeSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StatusDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          title={dialogState.title}
          description={dialogState.description}
          variant={dialogState.variant}
          showActionButton={dialogState.showActionButton}
        />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#1A1F2C] text-white px-4 py-2 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white hover:text-black/80" onClick={handleExit}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            className="text-white border-white hover:text-white/80"
            onClick={() => {
              // Print form errors to the console
              form.trigger().then(() => {
                console.log("Form errors:", form.formState.errors);
              });
            }}
          >
            Console Form Errors
          </Button> */}
          {/* <Button variant="ghost" size="sm" className="text-white hover:text-white/80" onClick={handleSave}>
            Save
          </Button> */}
          {/* <span className="text-sm">Unsaved changes</span> */}
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium">
            {new Date().toLocaleDateString([], {dateStyle: 'full'})} - {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
          {/* <Button variant="ghost" size="sm" className="text-white hover:text-white/80" onClick={handlePublish}>
            Publish
          </Button> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {/* <div className="flex border-b">
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
        </div> */}

        <div className="container mx-auto px-6 py-8">
          {/* Step Indicator */}
          <StepIndicator
            currentStep={activeTab}
            steps={adsetType === 'existing' ? [
              {
                id: 'ad',
                label: 'Step 1',
                isCompleted: completedSteps.has('ad'),
                hasErrors: getStepErrors('ad'),
              },
              {
                id: 'targeting',
                label: 'Last Step',
                isCompleted: completedSteps.has('targeting'),
                hasErrors: getStepErrors('targeting'),
              },
            ] : [
              {
                id: 'ad',
                label: 'Step 1',
                isCompleted: completedSteps.has('ad'),
                hasErrors: getStepErrors('ad'),
              },
              {
                id: 'targeting',
                label: 'Step 2',
                isCompleted: completedSteps.has('targeting'),
                hasErrors: getStepErrors('targeting'),
              },
              {
                id: 'budget',
                label: 'Last Step',
                isCompleted: completedSteps.has('budget'),
                hasErrors: getStepErrors('budget'),
              },
            ]}
            onStepClick={() => {}}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePublish)}>
              {activeTab === 'ad' && (
                <AdSetup
                  campaign={campaign}
                  updateCampaign={updateCampaign}
                  control={form.control}
                  setValue={form.setValue}
                  handleNextStep={handleNextStep}
                  campaignType={campaignType}
                  updateCampaignType={updateCampaignType}
                />

              )}

              {activeTab === 'targeting' && (
                <TargetingSetup
                  campaign={campaign}
                  updateCampaign={updateCampaign}
                  control={form.control}
                  handleNextStep={handleNextStep}
                  selectedObjective={campaign.campaign_data?.objective}
                  campaignType={campaignType}
                  updateAdsetType={updateAdsetType}
                  adsetType={adsetType}
                  setValue={form.setValue}
                />
              )}

              {activeTab === 'budget' && adsetType === 'existing' ?
                (<Button
                  type="submit"
                >
                  Publish
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>)
                : (activeTab === 'budget' && adsetType !== 'existing') &&
                (
                  <BudgetScheduling
                    campaign={campaign}
                    updateCampaign={updateCampaign}
                    control={form.control}
                    setValue={form.setValue}
                  />
                )}


              <div className="flex justify-end mt-8">
                {/* <Button
              variant="outline"
              onClick={() => {
                if (activeTab === 'ad') setStep('adType');
                else if (activeTab === 'targeting') setActiveTab('ad');
                else if (activeTab === 'budget') setActiveTab('targeting');
              }}
            >
              Back
            </Button> */}

                {/* {activeTab === 'budget' ? <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  Publish
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button> : <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={form.formState.isSubmitting}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>} */}
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default CreateCampaign;
