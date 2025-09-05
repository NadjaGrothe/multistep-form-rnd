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

  const [accessibleStepIndexes, setAccessibleStepIndexes] = useState([0]);

  useEffect(() => {
    setActiveAccordionValue(currentStep);
  }, [currentStep]);

  const getCurrentStepIndex = useCallback(
    (step: TStepValue): number => {
      return stepOrder.indexOf(step);
    },
    [stepOrder]
  );

  const canAccessStep = useCallback(
    (step: TStepValue) => {
      const stepIndex = getCurrentStepIndex(step);
      return accessibleStepIndexes.includes(stepIndex);
    },
    [accessibleStepIndexes, getCurrentStepIndex]
  );

  useEffect(() => {
    const currentStepIndex = getCurrentStepIndex(currentStep);

    setAccessibleStepIndexes((prev) => {
      if (!prev.includes(currentStepIndex)) {
        return [...prev, currentStepIndex];
      }
      return prev;
    });
  }, [currentStep, getCurrentStepIndex]);

  const handleAccordionValueChange = useCallback(
    (value: TStepValue) => {
      if (!canAccessStep(value)) {
        return;
      }
      form.setFieldValue(stepFieldName, value);
    },
    [canAccessStep, form, stepFieldName]
  );

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
    setAccessibleStepIndexes([0]);
  }, [form, stepOrder]);

  return {
    activeAccordionValue,
    canAccessStep,
    handleAccordionValueChange,
    getPreviousStep,
    resetForm,
  };
}
