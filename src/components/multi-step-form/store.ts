import { create } from 'zustand';

type MultiStepFormStore<T> = {
  data: T;
  currentStep: {
    value: string;
    index: number;
  };
  next: (stepData: Partial<T>) => void;
  previous: (stepData: Partial<T>) => void;
  goToStep: (step: string) => void;
  updateData: (newData: Partial<T>) => void;
  reset: () => void;
};

export const createMultiStepFormStore = <T>(
  data: T,
  stepOrder: readonly string[]
) => {
  return create<MultiStepFormStore<T>>((set, get) => ({
    //TODO:
    // - keep track of valid/completed steps (use to prevent going to inaccessible steps)
    // - somehow update data when going to specific step (find a way to access the form.state.values of each ste (child, but goToStep has to be called from parent))
    data,
    currentStep: {
      value: stepOrder[0],
      index: 0,
    },

    next: (stepData) =>
      set(() => {
        const state = get();
        state.updateData(stepData);
        const currentStepIndex = state.currentStep.index;
        if (currentStepIndex < stepOrder.length - 1) {
          return {
            currentStep: {
              value: stepOrder[currentStepIndex + 1],
              index: currentStepIndex + 1,
            },
          };
        }
        return {};
      }),
    previous: (stepData) =>
      set(() => {
        const state = get();
        state.updateData(stepData);
        const currentStepIndex = state.currentStep.index;
        if (currentStepIndex > 0) {
          return {
            currentStep: {
              value: stepOrder[currentStepIndex - 1],
              index: currentStepIndex - 1,
            },
          };
        }
        return {};
      }),

    //TODO: add validation to prevent going to inaccessible steps & handle form value updates
    goToStep: (step) =>
      //TODO: how can I get the partially updated form data here?
      set(() => {
        // get().updateData(stepData);
        return {
          currentStep: {
            value: step,
            index: stepOrder.indexOf(step),
          },
        };
      }),
    reset: () =>
      set(() => {
        return {
          currentStep: { value: stepOrder[0], index: 0 },
          data,
        };
      }),
    updateData: (newData) =>
      set(() => ({
        data: {
          ...get().data,
          ...newData,
        },
      })),
  }));
};
