import { create } from 'zustand';

type StepValidationState = {
  isValid: boolean;
  hasBeenCompleted: boolean;
};

type MultiStepFormStore<T, S extends readonly string[]> = {
  data: T;
  currentStep: {
    value: S[number];
    index: number;
  };
  stepValidation: Record<S[number], StepValidationState>;
  next: (stepData: Partial<T>) => void;
  previous: (stepData: Partial<T>) => void;
  updateData: (newData: Partial<T>) => void;
  setStepValidation: (
    step: S[number],
    isValid: boolean,
    hasBeenCompleted?: boolean
  ) => void;
  canAccessStep: (step: S[number]) => boolean;
  reset: () => void;

  goToStepWithSync: (
    step: S[number],
    currentFormRef?: { syncWithStore: () => void }
  ) => void;
};

export const createMultiStepFormStore = <T, S extends readonly string[]>(
  data: T,
  stepOrder: S
) => {
  const initialStepValidation = {} as Record<S[number], StepValidationState>;
  stepOrder.forEach((step: S[number]) => {
    initialStepValidation[step] = {
      isValid: false,
      hasBeenCompleted: false,
    };
  });

  return create<MultiStepFormStore<T, S>>((set, get) => ({
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
        const stepName: S[number] = stepOrder[i];
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
        const resetStepValidation = {} as Record<
          S[number],
          StepValidationState
        >;
        stepOrder.forEach((step: S[number]) => {
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
