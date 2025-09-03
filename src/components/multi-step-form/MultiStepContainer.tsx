import { Progress } from '@/components/ui/progress';

export interface MultiStepContainerProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  children: React.ReactNode;
  showProgress?: boolean;
  className?: string;
}

export function MultiStepContainer({
  currentStep,
  totalSteps,
  progress,
  children,
  showProgress = true,
  className = 'flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border',
}: MultiStepContainerProps) {
  return (
    <div className={className}>
      {showProgress && (
        <div className="flex flex-col items-center justify-start gap-1">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <Progress value={progress} />
        </div>
      )}

      <div key={currentStep} className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}
