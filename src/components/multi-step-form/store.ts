import { create } from 'zustand';

type MultiStepFormStore<T> = {
  data: T;
  currentStep: string;
  next: () => void;
  previous: () => void;
  goToStep: (step: string) => void;
};

// multi step form store factory
export const createMultiStepFormStore = <T>(
  data: T,
  stepOrder: readonly string[]
) => {
  return create<MultiStepFormStore<T>>((set) => ({
    // store needs to know:
    // - partial/complete form data
    // - active accordion value
    // - map of completed/valid steps
    // - list of accessible steps (all previous steps + current step, can only go forward if all previous steps are valid)
    // - functions to go to next/previous step, go to specific step (if accessible)
    data,
    currentStep: stepOrder[0],
    next: () => {
      console.log('next step');
    },
    previous: () => {
      console.log('previous step');
    },
    //TODO: add validation to prevent going to inaccessible steps
    goToStep: (step: string) => set(() => ({ currentStep: step })),
  }));
};
