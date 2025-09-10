import { create } from 'zustand';

type StepValidationState = {
  isValid: boolean;
  hasBeenCompleted: boolean;
};

//TODO: change types so 'step' is one of the values in stepOrder (as opposed to any string)
type MultiStepFormStore<T> = {
  data: T;
  currentStep: {
    value: string;
    index: number;
  };
  stepValidation: Record<string, StepValidationState>;
  next: (stepData: Partial<T>) => void;
  previous: (stepData: Partial<T>) => void;
  updateData: (newData: Partial<T>) => void;
  setStepValidation: (
    step: string,
    isValid: boolean,
    hasBeenCompleted?: boolean
  ) => void;
  canAccessStep: (step: string) => boolean;
  reset: () => void;

  goToStepWithSync: (
    step: string,
    currentFormRef?: { syncWithStore: () => void }
  ) => void;
};

export const createMultiStepFormStore = <T>(
  data: T,
  stepOrder: readonly string[]
) => {
  const initialStepValidation: Record<string, StepValidationState> = {};
  stepOrder.forEach((step) => {
    initialStepValidation[step] = {
      isValid: false,
      hasBeenCompleted: false,
    };
  });

  return create<MultiStepFormStore<T>>((set, get) => ({
    data,
    currentStep: {
      value: stepOrder[0],
      index: 0,
    },
    stepValidation: initialStepValidation,

    setStepValidation: (step, isValid, hasBeenCompleted) =>
      set((state) => ({
        stepValidation: {
          ...state.stepValidation,
          [step]: {
            isValid,
            hasBeenCompleted:
              hasBeenCompleted ?? state.stepValidation[step].hasBeenCompleted,
          },
        },
      })),

    canAccessStep: (targetStep) => {
      const state = get();
      const targetIndex = stepOrder.indexOf(targetStep);

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

    goToStepWithSync: (step, currentFormRef) =>
      set(() => {
        const state = get();
        if (currentFormRef) {
          currentFormRef.syncWithStore();
        }

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
            hasBeenCompleted: false,
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
