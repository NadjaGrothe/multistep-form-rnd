import { useCallback, useState } from 'react';

export function useGenericMultiStepForm<TCompleteData, TStepData = unknown>({
  totalSteps,
  onComplete,
}: {
  totalSteps: number;
  onComplete: (data: TCompleteData) => void | Promise<void>;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TCompleteData>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeAccordionValue, setActiveAccordionValue] =
    useState<string>('step-1');

  const updateStepData = useCallback((stepData: Partial<TCompleteData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  }, []);

  const goToNext = useCallback(
    async (stepData: TStepData) => {
      // Update form data with current step data
      updateStepData(stepData as Partial<TCompleteData>);

      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);

        // Update completed steps and accordion value
        setCompletedSteps((prev) => new Set(prev).add(currentStep));
        setActiveAccordionValue(`step-${currentStep + 1}`);

        return true;
      }
      return false;
    },
    [currentStep, totalSteps, updateStepData]
  );

  const goToPrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const completeForm = useCallback(
    async (finalStepData: TStepData) => {
      const completeData = {
        ...formData,
        ...finalStepData,
      } as TCompleteData;
      setFormData(completeData);

      // Mark final step as completed
      setCompletedSteps((prev) => new Set(prev).add(currentStep));

      if (onComplete) {
        await onComplete(completeData);
      }
    },
    [formData, onComplete, currentStep]
  );

  const handleAccordionValueChange = useCallback(
    (value: string) => {
      const stepNumber = parseInt(value.split('-')[1]);

      // Only allow opening if it's step 1, or if previous steps are completed
      if (stepNumber === 1 || completedSteps.has(stepNumber - 1)) {
        setActiveAccordionValue(value);
        setCurrentStep(stepNumber);
      }
    },
    [completedSteps]
  );

  const canAccessStep = useCallback(
    (step: number) => {
      return step === 1 || completedSteps.has(step - 1);
    },
    [completedSteps]
  );

  const getStepTitle = useCallback(
    (step: number, titles: string[]) => {
      const isCompleted = completedSteps.has(step);
      const title = titles[step - 1];
      return isCompleted ? `✓ ${title}` : title;
    },
    [completedSteps]
  );

  const reset = useCallback(() => {
    setCurrentStep(1);
    setFormData({});
    setCompletedSteps(new Set());
    setActiveAccordionValue('step-1');
  }, []);

  return {
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    formData,
    goToNext,
    goToPrevious,
    goToStep,
    updateStepData,
    completeForm,
    reset,
    completedSteps,
    activeAccordionValue,
    handleAccordionValueChange,
    canAccessStep,
    getStepTitle,
  };
}
