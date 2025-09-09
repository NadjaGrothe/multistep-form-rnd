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
  return create<MultiStepFormStore<T>>((set, get) => ({
    // store needs to know:
    // - partial/complete form data
    // - active accordion value
    // - map of completed/valid steps
    // - list of accessible steps (all previous steps + current step, can only go forward if all previous steps are valid)
    // - functions to go to next/previous step, go to specific step (if accessible)
    //TODO: update data on step completion/navigate away
    data,
    currentStep: stepOrder[0], // could be an object with more info if needed (i.e. value, index, isComplete, isValid)
    next: () =>
      set(() => {
        const currentStepIndex = stepOrder.indexOf(get().currentStep);
        if (currentStepIndex < stepOrder.length - 1) {
          return { currentStep: stepOrder[currentStepIndex + 1] };
        }
        return {};
      }),
    previous: () =>
      set(() => {
        const currentStepIndex = stepOrder.indexOf(get().currentStep);
        if (currentStepIndex > 0) {
          return { currentStep: stepOrder[currentStepIndex - 1] };
        }
        return {};
      }),
    //TODO: add validation to prevent going to inaccessible steps & handle form value updates
    goToStep: (step: string) => set(() => ({ currentStep: step })),
  }));
};
