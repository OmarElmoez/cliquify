
import React, { useState } from 'react';
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

type AudienceType = 'initial' | 'website-visitors' | 'lookalike';

interface CreateAudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateAudienceDialog = ({ open, onOpenChange }: CreateAudienceDialogProps) => {
  const [currentView, setCurrentView] = useState<AudienceType>('initial');
  
  const handleBack = () => {
    setCurrentView('initial');
  };

  const handleClose = () => {
    setCurrentView('initial');
    onOpenChange(false);
  };

  const handleSelectAudienceType = (type: AudienceType) => {
    setCurrentView(type);
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
        <div 
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
        </div>
      </div>
    </>
  );

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
        <div className="space-y-2">
          <label className="font-medium">Source pixel</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a pixel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pixel-1">Pixel 1</SelectItem>
              <SelectItem value="pixel-2">Pixel 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Visited in the last</label>
          <Select defaultValue="60">
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
        </div>

        <div className="space-y-2">
          <label className="font-medium">Name</label>
          <Input placeholder="Enter audience name" />
        </div>
      </div>

      <div className="border-t p-4 flex justify-between">
        <Button onClick={handleClose} variant="outline">
          Cancel
        </Button>
        <Button className="bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white">
          Create audience
        </Button>
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
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audience-1">Website Visitors - Last 30 days</SelectItem>
              <SelectItem value="audience-2">Previous Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t p-4 flex justify-between">
        <Button onClick={handleClose} variant="outline">
          Cancel
        </Button>
        <Button className="bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white">
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
