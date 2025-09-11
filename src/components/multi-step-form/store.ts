import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

type StepValidationState = {
  isValid: boolean;
  hasBeenCompleted: boolean;
};

type MultiStepFormStore<T, Step extends string> = {
  data: T;
  // Enum-like record of steps for type-safe access, e.g., steps.user
  STEPS: { [K in Step]: K };
  // The ordered list of steps as derived from default values + extras
  stepOrder: readonly Step[];
  currentStep: {
    value: Step;
    index: number;
  };
  stepValidation: Record<Step, StepValidationState>;
  next: (stepData: Partial<T>) => void;
  previous: (stepData: Partial<T>) => void;
  updateData: (newData: Partial<T>) => void;
  setStepValidation: (
    step: Step,
    isValid: boolean,
    hasBeenCompleted?: boolean
  ) => void;
  canAccessStep: (step: Step) => boolean;
  reset: () => void;

  goToStepWithSync: (
    step: Step,
    currentFormRef?: { syncWithStore: () => void }
  ) => void;
};

// Overloads to keep strong typing when adding extra steps like 'confirmation'
export function createMultiStepFormStore<
  T extends Record<string, unknown>,
  Extra extends string = never
>(
  data: T,
  options?: { extraSteps?: readonly Extra[] }
): UseBoundStore<StoreApi<MultiStepFormStore<T, (keyof T & string) | Extra>>>;

export function createMultiStepFormStore<
  T extends Record<string, unknown>,
  Extra extends string = never
>(
  initialData: T,
  options?: { extraSteps?: readonly Extra[] }
): UseBoundStore<StoreApi<MultiStepFormStore<T, (keyof T & string) | Extra>>> {
  type Step = (keyof T & string) | Extra;

  const baseOrder = Object.keys(initialData) as (keyof T & string)[];
  const extra = options?.extraSteps ?? [];
  const stepOrder: Step[] = [...baseOrder, ...extra];

  const initialStepValidation = stepOrder.reduce<
    Record<Step, StepValidationState>
  >((acc, step) => {
    acc[step] = { isValid: false, hasBeenCompleted: false };
    return acc;
  }, {} as Record<Step, StepValidationState>);

  return create<MultiStepFormStore<T, Step>>((set, get) => ({
    data: initialData,
    STEPS: (() => {
      const stepsBase = Object.fromEntries(
        baseOrder.map((k) => [k, k])
      ) as Record<keyof T & string, keyof T & string>;
      const stepsExtra = Object.fromEntries(
        (extra as readonly Extra[]).map((k) => [k, k])
      ) as Record<Extra, Extra>;
      return { ...stepsBase, ...stepsExtra } as { [K in Step]: K };
    })(),
    stepOrder,
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
      const targetIndex = stepOrder.indexOf(targetStep as Step);

      for (let i = 0; i < targetIndex; i++) {
        const stepName = stepOrder[i] as Step;
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
          const nextStep = stepOrder[currentStepIndex + 1] as Step;

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
              value: stepOrder[currentStepIndex - 1] as Step,
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
              index: stepOrder.indexOf(step as Step),
            },
          };
        }

        return {};
      }),

    reset: () =>
      set(() => {
        const resetStepValidation = stepOrder.reduce<
          Record<Step, StepValidationState>
        >((acc, step) => {
          acc[step] = { isValid: false, hasBeenCompleted: false };
          return acc;
        }, {} as Record<Step, StepValidationState>);

        return {
          currentStep: { value: stepOrder[0], index: 0 },
          initialData,
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
}
