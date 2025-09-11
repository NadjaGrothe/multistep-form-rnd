import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

type StepValidationState = {
  isValid: boolean;
  hasBeenCompleted: boolean;
};

export type MultiStepFormStore<T, Step extends string> = {
  data: T;
  // Enum-like record of steps for type-safe access, e.g., steps.user
  STEPS: { [K in Step]: K };
  // The ordered list of steps as derived from default values + extras
  stepOrder: readonly Step[];
  currentStep: {
    value: Step;
    index: number;
  };
  highestVisitedIndex: number;
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

export function createMultiStepFormStore<
  T extends Record<string, unknown>,
  Extra extends string = never
>(
  initialData: T,
  options?: { extraSteps?: readonly Extra[] }
): UseBoundStore<StoreApi<MultiStepFormStore<T, (keyof T & string) | Extra>>> {
  type Step = (keyof T & string) | Extra;

  /* Derive step order based on data keys + optional extra steps (i.e. confirmation) */
  const baseOrder: (keyof T & string)[] = Object.keys(initialData);
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
    /**
     * Generated enum like object for steps (i.e. STEPS.user, STEPS.address, STEPS.confirmation, etc.)
     */
    STEPS: (() => {
      const stepsBase = Object.fromEntries(
        baseOrder.map((k) => [k, k])
      ) as Record<keyof T & string, keyof T & string>;
      const stepsExtra = Object.fromEntries(extra.map((k) => [k, k])) as Record<
        Extra,
        Extra
      >;
      return { ...stepsBase, ...stepsExtra } as { [K in Step]: K };
    })(),
    stepOrder,
    currentStep: {
      value: stepOrder[0],
      index: 0,
    },
    highestVisitedIndex: 0,
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

      if (targetIndex <= state.highestVisitedIndex) return true;

      return false;
    },

    next: (stepData) =>
      set(() => {
        const state = get();
        state.updateData(stepData);
        const currentStepIndex = state.currentStep.index;

        if (currentStepIndex < stepOrder.length - 1) {
          const nextIndex = currentStepIndex + 1;
          return {
            currentStep: {
              value: stepOrder[nextIndex],
              index: nextIndex,
            },
            highestVisitedIndex: Math.max(state.highestVisitedIndex, nextIndex),
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
          const newIndex = currentStepIndex - 1;
          return {
            currentStep: {
              value: stepOrder[newIndex],
              index: newIndex,
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

        const targetIndex = stepOrder.indexOf(step);

        // Find the first invalid step up to the target (inclusive).
        let firstInvalidIndex = -1;
        for (let i = 0; i <= targetIndex; i++) {
          const stepName = stepOrder[i];
          if (!state.stepValidation[stepName]?.isValid) {
            firstInvalidIndex = i;
            break;
          }
        }

        const nextIndex =
          firstInvalidIndex !== -1 ? firstInvalidIndex : targetIndex;
        const nextStep = stepOrder[nextIndex];

        return {
          currentStep: {
            value: nextStep,
            index: nextIndex,
          },
        };
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
          data: initialData,
          highestVisitedIndex: 0,
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
