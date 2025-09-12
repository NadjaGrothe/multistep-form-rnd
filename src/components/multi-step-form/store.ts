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
  /**
   * Marks the step valid & completed then advances with the provided value.
   * Only callable for real data keys (excludes extra steps like confirmation).
   */
  next: <K extends keyof T>(step: K, value: T[K]) => void;
  previous: <K extends keyof T>(step: K, value: T[K]) => void;
  /**
   * Update a single step's data (mirrors next signature but without navigation/validation side-effects)
   */
  updateData: <K extends keyof T>(step: K, value: T[K]) => void;
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

    next: (step, value) => {
      const state = get();
      state.setStepValidation(step as Step, true, true);
      state.updateData(step, value);

      const currentIndex = state.currentStep.index;
      if (currentIndex < stepOrder.length - 1) {
        const nextIndex = currentIndex + 1;
        set({
          currentStep: { value: stepOrder[nextIndex], index: nextIndex },
          highestVisitedIndex: Math.max(state.highestVisitedIndex, nextIndex),
        });
      }
    },
    previous: (step, value) =>
      set(() => {
        const state = get();
        state.updateData(step, value);
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
        let nextIndex = targetIndex;
        for (let i = 0; i <= targetIndex; i++) {
          const stepName = stepOrder[i];
          if (!state.stepValidation[stepName]?.isValid) {
            nextIndex = i;
            break;
          }
        }

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

    updateData: (step, value) =>
      set(() => {
        const current = get().data;
        return {
          data: {
            ...current,
            [step]: value,
          },
        };
      }),
  }));
}
