import { useCallback, useState } from 'react';

// Generic multi-step form hook that can work with any form data structure
export function useGenericMultiStepForm<TCompleteData, TStepData = unknown>({
  totalSteps,
  onComplete,
  onStepValidation,
}: {
  totalSteps: number;
  onComplete?: (data: TCompleteData) => void | Promise<void>;
  onStepValidation?: (
    step: number,
    data: TStepData
  ) => Promise<boolean> | boolean;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<TCompleteData>>({});

  const updateStepData = useCallback((stepData: Partial<TCompleteData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  }, []);

  const goToNext = useCallback(
    async (stepData: TStepData) => {
      // Update form data with current step data
      updateStepData(stepData as Partial<TCompleteData>);

      // Validate step if validation function provided
      if (onStepValidation) {
        const isValid = await onStepValidation(currentStep, stepData);
        if (!isValid) return false;
      }

      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        return true;
      }
      return false;
    },
    [currentStep, totalSteps, onStepValidation, updateStepData]
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

      if (onComplete) {
        await onComplete(completeData);
      }
    },
    [formData, onComplete]
  );

  const reset = useCallback(() => {
    setCurrentStep(1);
    setFormData({});
  }, []);

  return {
    currentStep,
    totalSteps,
    progress: (currentStep / totalSteps) * 100,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    formData,
    goToNext,
    goToPrevious,
    goToStep,
    updateStepData,
    completeForm,
    reset,
  };
}
