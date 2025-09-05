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
  children,
  className = 'flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border',
}: MultiStepContainerProps) {
  return (
    <div className={className}>
      <div key={currentStep} className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}
