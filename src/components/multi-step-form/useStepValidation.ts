import type { AnyFormApi } from '@tanstack/react-form';
import { useStore as useFormStore } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { MultiStepFormStore } from './store';

// Minimal slice we need from a MultiStepFormStore
type StepValidationSlice<TData, Step extends string> = Pick<
  MultiStepFormStore<TData, Step>,
  'stepValidation' | 'setStepValidation'
>;

export function useStepValidation<
  TData extends Record<string, unknown>,
  Step extends string,
  TStore extends UseBoundStore<StoreApi<StepValidationSlice<TData, Step>>>
>({ form, step, store }: { form: AnyFormApi; step: Step; store: TStore }) {
  const isValidInStore = store((state) => state.stepValidation[step].isValid);
  const hasStepBeenCompleted = store(
    (state) => state.stepValidation[step].hasBeenCompleted
  );
  const setStepValidation = store((state) => state.setStepValidation);

  const [isStepValid, setIsStepValid] = useState(isValidInStore);

  const isValid = useFormStore(form.store, (state) => state.isValid);
  const isDefaultValue = useFormStore(
    form.store,
    (state) => state.isDefaultValue
  );

  useEffect(() => {
    const derived =
      (hasStepBeenCompleted && isDefaultValue && isValidInStore) ||
      (!isDefaultValue && isValid);
    setIsStepValid(derived);
  }, [hasStepBeenCompleted, isDefaultValue, isValid, isValidInStore]);

  useEffect(() => {
    setStepValidation(step, isStepValid);
  }, [step, isStepValid, setStepValidation]);
}
