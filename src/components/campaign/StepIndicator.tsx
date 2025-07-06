import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: string;
  steps: Array<{
    id: string;
    label: string;
    isCompleted: boolean;
    hasErrors: boolean;
  }>;
  onStepClick?: (stepId: string) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = step.isCompleted;
          const hasErrors = step.hasErrors;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  "flex items-center space-x-2",
                  isClickable && "cursor-pointer",
                  !isClickable && "cursor-not-allowed"
                )}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    isCompleted && !hasErrors && "bg-green-500 border-green-500 text-white",
                    isCompleted && hasErrors && "bg-red-500 border-red-500 text-white",
                    isCurrent && !isCompleted && "bg-blue-500 border-blue-500 text-white",
                    !isCurrent && !isCompleted && "bg-gray-200 border-gray-300 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-blue-600",
                    isCompleted && !hasErrors && "text-green-600",
                    isCompleted && hasErrors && "text-red-600",
                    !isCurrent && !isCompleted && "text-gray-500"
                  )}
                >
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5",
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}; 