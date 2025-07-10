import React, { useEffect, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import audiencesData, { addNewAudience } from '@/data/dummyAudiences';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AudienceData, audienceSchema } from '@/schemas/audience';
import { AdAccount, getAdAccounts } from '@/services/adAccountService';
import { toast } from 'sonner';
import { createAudience } from '@/services/audience';


type AudienceType = 'initial' | 'website-visitors' | 'lookalike';

interface CreateAudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleSuccessfullState: (state: boolean) => void
}

interface AudienceFormData {
  name: string;
  source: string;
  days?: number;
  sourceAudience?: string;
}

type TEventType = 'all-visitors' | 'pages-visitors' | 'time-visitors'

const CreateAudienceDialog = ({ open, onOpenChange, handleSuccessfullState }: CreateAudienceDialogProps) => {
  const [currentView, setCurrentView] = useState<AudienceType>('initial');
  const [eventType, setEventType] = useState<TEventType>();
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>('');
  const [formData, setFormData] = useState<AudienceFormData>({
    name: '',
    source: '',
    days: 60,
    sourceAudience: ''
  });
  const navigate = useNavigate();



  const form = useForm<AudienceData>({
    resolver: zodResolver(audienceSchema),
    defaultValues: {
      pixel_id: '',
      account_id: '',
      customaudience_data: {
        name: '',
        rule: {
          inclusions: {
            operator: 'and',
            rules: [
              {
                event_sources: [
                  {
                    type: 'pixel'
                  }
                ],
                filter: {
                  operator: '',
                  filters: [
                    {
                      field: '',
                      operator: '',
                      value: []
                    }
                  ]
                }
              }
            ],

          }
        }
      }
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customaudience_data.rule.inclusions.rules'
  })

  const handleBack = () => {
    setCurrentView('initial');
    setFormData({
      name: '',
      source: '',
      days: 60,
      sourceAudience: ''
    });
  };

  const handleClose = () => {
    setCurrentView('initial');
    setFormData({
      name: '',
      source: '',
      days: 60,
      sourceAudience: ''
    });
    onOpenChange(false);
  };

  const handleSelectAudienceType = (type: AudienceType) => {
    setCurrentView(type);
  };

  const handleInputChange = (field: keyof AudienceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateAudience = () => {
    let newAudience;

    if (currentView === 'lookalike' && formData.sourceAudience) {
      // Find the source audience
      const sourceAudience = audiencesData.find(aud => aud.id === formData.sourceAudience);

      if (sourceAudience) {
        newAudience = {
          id: `aud-${audiencesData.length + 1}`,
          name: `${sourceAudience.name} - Lookalike`,
          type: 'Lookalike',
          source: sourceAudience.source,
          size: '1000', // Default size for lookalike audiences
          status: 'Active'
        };
      }
    } else {
      newAudience = {
        id: `aud-${audiencesData.length + 1}`,
        name: formData.name,
        type: 'Website Visitors',
        source: formData.source,
        size: '0',
        status: 'Active'
      };
    }

    if (newAudience) {
      // Add the new audience to the data using the exported function
      addNewAudience(newAudience);
      navigate('/audiences');
      // Close the dialog and reset form
      handleClose();
    }
  };

  const renderInitialView = () => (
    <>
      <DialogHeader className="bg-brand-blue text-white px-4 py-4 flex flex-row items-center justify-between">
        <DialogTitle className="text-xl">Create audience</DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-brand-blue/80"
          onClick={handleClose}
        >
          <X size={18} />
        </Button>
      </DialogHeader>

      <div className="px-4 py-6 space-y-4">
        {/* Website Visitors Option */}
        <div
          onClick={() => handleSelectAudienceType('website-visitors')}
          className="border rounded-md p-4 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg mb-1">Website visitors</h3>
            <div className="flex gap-1">
              <img src="/lovable-uploads/d5f033f6-b183-4516-9513-cf2d1e501443.png" alt="Meta" className="w-6 h-6" />
              <img src="/lovable-uploads/cd26779e-65cb-474b-a2d2-3c5674a5638c.png" alt="LinkedIn" className="w-6 h-6" />
              <img src="/lovable-uploads/cd26779e-65cb-474b-a2d2-3c5674a5638c.png" alt="Google" className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-600">
            Nurture the people who've been to your site. Create an audience from your visitors and re-engage with them wherever they are online.
          </p>
        </div>

        {/* Lookalike Option */}
        {/* <div 
          onClick={() => handleSelectAudienceType('lookalike')}
          className="border rounded-md p-4 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg mb-1">Lookalike</h3>
            <div>
              <img src="/lovable-uploads/d5f033f6-b183-4516-9513-cf2d1e501443.png" alt="Meta" className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-600">
            Create a lookalike audience based on your ideal customer and expand your reach to people who are more likely to convert.
          </p>
        </div> */}
      </div>
    </>
  );

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

    fetchAdAccounts();
  }, [])

  const onSubmit = async (data: AudienceData) => {
    // Convert retention_days to seconds if present in the data
    if (data.customaudience_data?.rule?.inclusions?.rules) {
      data.customaudience_data.rule.inclusions.rules = data.customaudience_data.rule.inclusions.rules.map(rule => {
        return {
          ...rule,
          retention_seconds: rule.retention_seconds * 24 * 60 * 60
        };
      });
    }
    const res = await createAudience(data)
    if (res.id) {
      handleSuccessfullState(true)
      handleClose()
    }
  }

  const renderWebsiteVisitorsView = () => (
    <>
      <DialogHeader className="bg-brand-blue text-white px-4 py-4 flex flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-white hover:bg-brand-blue/80"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
        </Button>
        <DialogTitle className="text-xl">Create website traffic audience</DialogTitle>
      </DialogHeader>

      <div className="p-6 space-y-6">
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>

            <div className='flex gap-2 items-center'>
              <span>Include who meet</span>
              <FormField
                control={form.control}
                name="customaudience_data.rule.inclusions.operator"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-[80px]'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="and">ALL</SelectItem>
                        <SelectItem value="or">ANY</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span>of the following criteria:</span>
            </div>

            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-md">Select Ad Account</FormLabel>
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

            <FormField
              control={form.control}
              name="pixel_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-md">Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='3845563522362969'>test-ad-account Pixel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="font-medium text-md">Events</label>
              <Select onValueChange={(value: TEventType) => { setEventType(value) }} defaultValue={eventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all-visitors'>All website visitors</SelectItem>
                  {/* <SelectItem value='pages-visitors'>People who visited specific web pages</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`customaudience_data.rule.inclusions.rules.${index}.retention_seconds`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-md">Audience retention</FormLabel>
                    <div className='flex gap-4 items-center'>
                      <FormControl>
                        <Input
                          placeholder='Number of days'
                          className='w-1/2'
                          type='number'
                          min={1}
                          max={180}
                          {...field}
                          onChange={e => {
                            let value = Number(e.target.value);
                            if (value > 180) value = 180;
                            if (value < 1) value = 1;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <p className='font-medium'>Days</p>
                    </div>
                    <FormDescription>Enter Number between 1 and 180</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="customaudience_data.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-md">Audience name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
              {/* <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  console.log('Form errors:', form.formState.errors);
                  toast.error('Check the console for form errors.');
                }}
              >
                Log Form Errors
              </Button> */}
              <Button
                type='submit'
                className="bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white"
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                    Creating...
                  </>
                ) : (
                  "Create audience"
                )}
              </Button>
            </div>
          </form>
        </Form>
        {/* <div className="space-y-2">
          <label className="font-medium">Source</label>
          <Select onValueChange={(value) => handleInputChange('source', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a pixel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Facebook Pixel">Facebook Pixel</SelectItem>
              <SelectItem value="Google Analytics">Google Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* <div className="space-y-2">
          <label className="font-medium">Visited in the last</label>
          <Select
            defaultValue="60"
            onValueChange={(value) => handleInputChange('days', parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="60 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">180 days</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* <div className="space-y-2">
          <label className="font-medium">Name</label>
          <Input
            placeholder="Enter audience name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div> */}
      </div>
    </>
  );

  const renderLookalikeView = () => (
    <>
      <DialogHeader className="bg-brand-blue text-white px-4 py-4 flex flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-white hover:bg-brand-blue/80"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
        </Button>
        <DialogTitle className="text-xl">Lookalike</DialogTitle>
      </DialogHeader>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="font-medium">Source audience</label>
          <p className="text-sm text-blue-600 mb-2">
            How does lookalike audience syncing work? <span className="underline">Learn more</span>
          </p>
          <Select onValueChange={(value) => handleInputChange('sourceAudience', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an audience" />
            </SelectTrigger>
            <SelectContent>
              {audiencesData.map(audience => (
                <SelectItem key={audience.id} value={audience.id}>
                  {audience.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="border-t p-4 flex justify-between">
        <Button onClick={handleClose} variant="outline">
          Cancel
        </Button>
        <Button
          className="bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white"
          onClick={handleCreateAudience}
          disabled={!formData.sourceAudience}
        >
          Create audience
        </Button>
      </div>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'website-visitors':
        return renderWebsiteVisitorsView();
      case 'lookalike':
        return renderLookalikeView();
      case 'initial':
      default:
        return renderInitialView();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xl rounded-md overflow-hidden">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAudienceDialog;
