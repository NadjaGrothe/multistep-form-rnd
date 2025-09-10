import { create } from 'zustand';

type StepValidationState = {
  isValid: boolean;
};

type MultiStepFormStore<T> = {
  data: T;
  currentStep: {
    value: string;
    index: number;
  };
  stepValidation: Record<string, StepValidationState>;
  next: (stepData: Partial<T>) => void;
  previous: (stepData: Partial<T>) => void;
  goToStep: (step: string) => void;
  updateData: (newData: Partial<T>) => void;
  setStepValidation: (step: string, isValid: boolean) => void;
  canAccessStep: (step: string) => boolean;
  reset: () => void;
};

export const createMultiStepFormStore = <T>(
  data: T,
  stepOrder: readonly string[]
) => {
  const initialStepValidation: Record<string, StepValidationState> = {};
  stepOrder.forEach((step) => {
    initialStepValidation[step] = {
      isValid: false,
    };
  });

  return create<MultiStepFormStore<T>>((set, get) => ({
    data,
    currentStep: {
      value: stepOrder[0],
      index: 0,
    },
    stepValidation: initialStepValidation,

    setStepValidation: (step, isValid) =>
      set((state) => ({
        stepValidation: {
          ...state.stepValidation,
          [step]: {
            isValid,
          },
        },
      })),

    canAccessStep: (targetStep) => {
      const state = get();
      const targetIndex = stepOrder.indexOf(targetStep);

      if (targetIndex === -1) return false;

      // First step is always accessible
      if (targetIndex === 0) return true;

      // Check if all previous steps are valid
      for (let i = 0; i < targetIndex; i++) {
        const stepName = stepOrder[i];
        if (!state.stepValidation[stepName]?.isValid) {
          return false;
        }
      }

      return true;
    },

    next: (stepData) =>
      set(() => {
        const state = get();
        state.updateData(stepData);
        const currentStepIndex = state.currentStep.index;

        if (currentStepIndex < stepOrder.length - 1) {
          const nextStep = stepOrder[currentStepIndex + 1];

          // Only proceed if next step is accessible
          if (state.canAccessStep(nextStep)) {
            return {
              currentStep: {
                value: nextStep,
                index: currentStepIndex + 1,
              },
            };
          }
        }
        return {};
      }),

    previous: (stepData) =>
      set(() => {
        const state = get();
        state.updateData(stepData);
        const currentStepIndex = state.currentStep.index;

        // Backwards navigation is always allowed
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

    goToStep: (step) =>
      set(() => {
        const state = get();

        // Only allow navigation to accessible steps
        if (state.canAccessStep(step)) {
          return {
            currentStep: {
              value: step,
              index: stepOrder.indexOf(step),
            },
          };
        }

        return {};
      }),

    reset: () =>
      set(() => {
        const resetStepValidation: Record<string, StepValidationState> = {};
        stepOrder.forEach((step) => {
          resetStepValidation[step] = {
            isValid: false,
          };
        });

        return {
          currentStep: { value: stepOrder[0], index: 0 },
          data,
          stepValidation: resetStepValidation,
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
