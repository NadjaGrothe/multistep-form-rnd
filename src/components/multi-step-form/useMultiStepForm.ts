import { type AnyFormApi, useStore } from '@tanstack/react-form';
import { useCallback, useEffect, useState } from 'react';

interface UseMultiStepFormProps<TStepValue = string> {
  form: AnyFormApi;
  stepOrder: readonly TStepValue[]; // Array of step values
  stepFieldName?: string; // Field name in form state, defaults to 'step'
}

export function useMultiStepForm<TStepValue extends string = string>({
  form,
  stepOrder,
  stepFieldName = 'step',
}: UseMultiStepFormProps<TStepValue>) {
  const currentStep: TStepValue = useStore(
    form.store,
    (state) => state.values[stepFieldName]
  );

  const [activeAccordionValue, setActiveAccordionValue] =
    useState<string>(currentStep);

  // Track which step indexes have been made accessible
  const [accessibleStepIndexes, setAccessibleStepIndexes] = useState<
    Set<number>
  >(
    new Set([0]) // First step (index 0) is always accessible
  );

  // Sync accordion value with current step
  useEffect(() => {
    setActiveAccordionValue(currentStep);
  }, [currentStep]);

  // Get current step index
  const getCurrentStepIndex = useCallback(
    (step: TStepValue): number => {
      return stepOrder.indexOf(step);
    },
    [stepOrder]
  );

  // Check if a step has been completed (validated successfully)
  const isStepCompleted = useCallback(
    (step: TStepValue) => {
      const stepIndex = getCurrentStepIndex(step);
      const currentStepIndex = getCurrentStepIndex(currentStep);

      // A step is completed if the current step is beyond it
      return currentStepIndex > stepIndex;
    },
    [currentStep, getCurrentStepIndex]
  );

  // Check if a step can be accessed
  const canAccessStep = useCallback(
    (step: TStepValue) => {
      const stepIndex = getCurrentStepIndex(step);
      return accessibleStepIndexes.has(stepIndex);
    },
    [accessibleStepIndexes, getCurrentStepIndex]
  );

  // Update accessible steps when current step changes
  useEffect(() => {
    const currentStepIndex = getCurrentStepIndex(currentStep);

    // Make all steps up to and including current step accessible
    setAccessibleStepIndexes((prev) => {
      const newAccessible = new Set(prev);
      for (let i = 0; i <= currentStepIndex; i++) {
        newAccessible.add(i);
      }
      return newAccessible;
    });
  }, [currentStep, getCurrentStepIndex]);

  // Handle accordion value changes with access control
  const handleAccordionValueChange = useCallback(
    (value: TStepValue) => {
      if (!canAccessStep(value)) {
        return;
      }

      setActiveAccordionValue(value);
      form.setFieldValue(stepFieldName, value);
    },
    [canAccessStep, form, stepFieldName]
  );

  // Helper to get previous step
  const getPreviousStep = useCallback(
    (step: TStepValue): TStepValue | null => {
      const currentStepIndex = getCurrentStepIndex(step);
      const previousStepIndex = currentStepIndex - 1;
      return stepOrder[previousStepIndex] || null;
    },
    [getCurrentStepIndex, stepOrder]
  );

  const resetForm = useCallback(() => {
    form.reset();
    setActiveAccordionValue(stepOrder[0]);
    setAccessibleStepIndexes(new Set([0]));
  }, [form, stepOrder]);

  return {
    currentStep,
    currentStepIndex: getCurrentStepIndex(currentStep),
    activeAccordionValue,
    accessibleStepIndexes,
    canAccessStep,
    isStepCompleted,
    handleAccordionValueChange,
    // getNextStep,
    getPreviousStep,
    stepOrder,
    resetForm,
  };
}
