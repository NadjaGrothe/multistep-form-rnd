import type { AnyFormApi } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
// import type { MultiStepFormStore } from './store';
import { useStore as useFormStore } from '@tanstack/react-form';

type StepOfStore<S> = S extends {
  currentStep: { value: infer Step };
}
  ? Step extends string
    ? Step
    : never
  : never;

interface UseStep<S> {
  form: AnyFormApi;
  step: StepOfStore<S>;
  store: S;
}

export const useStepValidation = <S extends UseBoundStore<StoreApi<unknown>>>({
  form,
  step,
  store,
}: UseStep<S>) => {
  const isValidInStore = store(
    //@ts-expect-error fix types
    (state) => state.stepValidation[step].isValid
  );
  const hasStepBeenCompleted = store(
    //@ts-expect-error fix types
    (state) => state.stepValidation[step].hasBeenCompleted
  );
  //@ts-expect-error fix types
  const setStepValidation = store((state) => state.setStepValidation);

  const [isStepValid, setIsStepValid] = useState(isValidInStore);

  //TODO: isSubmitting doesn't belong here
  const isSubmitting = useFormStore(form.store, (state) => state.isSubmitting);

  const isValid = useFormStore(form.store, (state) => state.isValid);
  const isDefaultValue = useFormStore(
    form.store,
    (state) => state.isDefaultValue
  );

  useEffect(() => {
    const isValidStep =
      (hasStepBeenCompleted && isDefaultValue && isValidInStore) ||
      (!isDefaultValue && isValid);
    setIsStepValid(isValidStep);
  }, [isDefaultValue, isValid, hasStepBeenCompleted, isValidInStore]);

  useEffect(() => {
    setStepValidation(step, isStepValid);
  }, [isStepValid, setStepValidation, step]);

  return {
    isSubmitting,
  };
};
