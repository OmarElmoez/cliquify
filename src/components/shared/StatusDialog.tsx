
import React, { useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { AlertTriangle, CheckCircle } from "lucide-react";

type DialogVariant = 'error' | 'success';

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  variant?: DialogVariant;
  showActionButton?: boolean;
}

const StatusDialog: React.FC<ErrorDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = 'error',
  showActionButton = true
}) => {
  const isError = variant === 'error';
  const defaultTitle = isError ? "Error" : "Success";
  
  // Auto-close dialog after 750ms (changed from 500ms)
  // useEffect(() => {
  //   if (open) {
  //     const timer = setTimeout(() => {
  //       onOpenChange(false);
  //     }, 1000);
      
  //     return () => clearTimeout(timer);
  //   }
  // }, [open, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="animate-in fade-in duration-300">
        <AlertDialogHeader className="flex flex-col items-center">
          <div className={`${isError ? 'bg-red-100' : 'bg-green-100'} p-3 rounded-full mb-3`}>
            {isError ? (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
          </div>
          <AlertDialogTitle className="text-xl">{title || defaultTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-center mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {showActionButton && (
          <AlertDialogFooter>
            <AlertDialogAction 
              className="bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90 w-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusDialog;
