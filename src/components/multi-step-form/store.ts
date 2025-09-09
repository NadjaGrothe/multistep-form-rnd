import { create } from 'zustand';

// multi step form store factory
export const createMultiStepFormStore = <T>(data: T) => {
  return create(() => ({
    // store needs to know:
    // - partial/complete form data
    // - active accordion value
    // - map of completed/valid steps
    // - list of accessible steps (all previous steps + current step, can only go forward if all previous steps are valid)
    // - functions to go to next/previous step, go to specific step (if accessible)
    data,
  }));
};
