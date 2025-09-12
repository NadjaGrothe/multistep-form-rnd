import type { AnyFormApi } from '@tanstack/react-form';
import { useStore as useFormStore } from '@tanstack/react-form';
import { useImperativeHandle } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { MultiStepFormStore } from './store';
import type { FormStepRef } from './types';
import { useStepValidation } from './useStepValidation';

type StepControllerSlice<TData, Step extends string> = Pick<
  MultiStepFormStore<TData, Step>,
  'stepValidation' | 'setStepValidation' | 'previous' | 'updateData' | 'STEPS'
>;

interface UseStepControllerProps<TStore, Step> {
  form: AnyFormApi;
  store: TStore;
  step: Step;
  ref: React.Ref<FormStepRef>;
}

export const useStepController = <
  TData extends Record<string, unknown>,
  TStore extends UseBoundStore<StoreApi<StepControllerSlice<TData, Step>>>,
  Step extends string
>({
  form,
  store,
  step,
  ref,
}: UseStepControllerProps<TStore, Step>) => {
  useStepValidation({
    form,
    step,
    store,
  });

  const updateData = store((state) => state.updateData);
  useImperativeHandle(
    ref,
    () => ({
      syncWithStore: () => {
        updateData(step, form.state.values);
      },
    }),
    [updateData, form.state.values, step]
  );

  const previous = store((state) => state.previous);

  const isSubmitting = useFormStore(form.store, (state) => state.isSubmitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return { isSubmitting, handleSubmit, previous };
};
