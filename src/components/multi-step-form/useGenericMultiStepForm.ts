import { useCallback, useState } from 'react';

export function useGenericMultiStepForm<TCompleteData>({
  totalSteps,
}: {
  totalSteps: number;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TCompleteData>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  // const [activeAccordionValue, setActiveAccordionValue] =
  //   useState<string>('step-1');

  const updateStepData = useCallback((stepData: Partial<TCompleteData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  }, []);

  const goToNext = useCallback(
    async (stepData: Partial<TCompleteData>) => {
      // Update form data with current step data
      updateStepData(stepData as Partial<TCompleteData>);

      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);

        // Update completed steps and accordion value
        setCompletedSteps((prev) => new Set(prev).add(currentStep));
        // setActiveAccordionValue(`step-${currentStep + 1}`);

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

  // const handleAccordionValueChange = useCallback(
  //   (value: string) => {
  //     const stepNumber = parseInt(value.split('-')[1]);

  //     // Only allow opening if it's step 1, or if previous steps are completed
  //     if (stepNumber === 1 || completedSteps.has(stepNumber - 1)) {
  //       setActiveAccordionValue(value);
  //       setCurrentStep(stepNumber);
  //     }
  //   },
  //   [completedSteps]
  // );

  const canAccessStep = useCallback(
    (step: number) => {
      return step === 1 || completedSteps.has(step - 1);
    },
    [completedSteps]
  );

  const reset = useCallback(() => {
    setCurrentStep(1);
    setFormData({});
    setCompletedSteps(new Set());
    // setActiveAccordionValue('step-1');
  }, []);

  return {
    formData,
    goToNext,
    goToPrevious,
    goToStep,
    updateStepData,
    reset,
    completedSteps,
    // activeAccordionValue,
    // handleAccordionValueChange,
    canAccessStep,
  };
}
