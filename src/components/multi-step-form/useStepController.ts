import type { AnyFormApi } from '@tanstack/react-form';
import { useStore as useFormStore } from '@tanstack/react-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { MultiStepFormStore } from './store';
import { useStepValidation } from './useStepValidation';

type StepControllerSlice<TData, Step extends string> = Pick<
  MultiStepFormStore<TData, Step>,
  'stepValidation' | 'setStepValidation' | 'previous'
>;

interface UseStepControllerProps<TStore, Step> {
  form: AnyFormApi;
  store: TStore;
  step: Step;
}

export const useStepController = <
  TData extends Record<string, unknown>,
  TStore extends UseBoundStore<StoreApi<StepControllerSlice<TData, Step>>>,
  Step extends string
>({
  form,
  store,
  step,
}: UseStepControllerProps<TStore, Step>) => {
  useStepValidation({
    form,
    step,
    store,
  });

  const isSubmitting = useFormStore(form.store, (state) => state.isSubmitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const previous = store((state) => state.previous);

  return { isSubmitting, handleSubmit, previous };
};
