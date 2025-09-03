# Multi-Step Form Implementation

This is a React-based multi-step form system that provides both specific and generic implementations for creating complex forms with step-by-step validation.

## Features

- ✅ **Separate forms per step** - Each step has its own isolated form with validation
- ✅ **Step-by-step validation** - Validation occurs when moving between steps
- ✅ **State management** - Form data is preserved across steps
- ✅ **Generic reusable hook** - Can be used for any multi-step form structure
- ✅ **Progress indicator** - Visual progress bar shows current step
- ✅ **Navigation controls** - Previous/Next buttons with proper state management
- ✅ **TypeScript support** - Fully typed for better developer experience

## Project Structure

```
src/components/multi-step-form/
├── index.tsx                     # Main form component (3-step example)
├── schema.ts                     # Zod validation schemas & TypeScript types
├── useGenericMultiStepForm.ts    # Generic reusable hook
├── MultiStepContainer.tsx        # Reusable container component
├── Step1Form.tsx                 # Personal information step
├── Step2Form.tsx                 # Address information step
├── Step3Form.tsx                 # Accounting information step
└── ExampleGenericUsage.tsx       # Example of using the generic hook
```

## Current Implementation (3 Steps)

### Step 1: Personal Information

- First Name
- Last Name
- Email

### Step 2: Address Information

- Address Line 1
- Postcode
- Town/City

### Step 3: Accounting Information

- Tax Number
- Legal Company Name

## Using the Generic Hook

The `useGenericMultiStepForm` hook can be used to create any multi-step form:

```tsx
import { useGenericMultiStepForm } from './useGenericMultiStepForm';
import { MultiStepContainer } from './MultiStepContainer';

// Define your form data structure
type MyFormData = {
  field1: string;
  field2: number;
  // ... more fields
};

type Step1Data = Pick<MyFormData, 'field1'>;
type Step2Data = Pick<MyFormData, 'field2'>;

function MyMultiStepForm() {
  const multiStepForm = useGenericMultiStepForm<
    MyFormData,
    Step1Data | Step2Data
  >({
    totalSteps: 2,
    onComplete: async (data) => {
      console.log('Complete form data:', data);
      // Handle form submission
    },
    onStepValidation: async (step, data) => {
      // Custom validation logic per step
      return true;
    },
  });

  const {
    currentStep,
    totalSteps,
    progress,
    formData,
    goToNext,
    goToPrevious,
    completeForm,
  } = multiStepForm;

  return (
    <MultiStepContainer
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
    >
      {/* Your step components here */}
    </MultiStepContainer>
  );
}
```

## Key Benefits of This Approach

1. **Separate Form Validation**: Each step has its own form with TanStack Form, allowing proper step-by-step validation
2. **State Preservation**: Form data is preserved as users navigate between steps
3. **Reusable Components**: The generic hook and container can be used for any multi-step form
4. **Type Safety**: Full TypeScript support with proper type inference
5. **Flexible Navigation**: Support for going to specific steps, not just next/previous

## API Reference

### useGenericMultiStepForm Options

- `totalSteps: number` - Total number of steps in the form
- `onComplete?: (data: TCompleteData) => void | Promise<void>` - Called when form is completed
- `onStepValidation?: (step: number, data: TStepData) => Promise<boolean> | boolean` - Custom validation per step

### useGenericMultiStepForm Returns

- `currentStep: number` - Current step number (1-indexed)
- `totalSteps: number` - Total number of steps
- `progress: number` - Progress percentage (0-100)
- `isFirstStep: boolean` - Whether on first step
- `isLastStep: boolean` - Whether on last step
- `formData: Partial<TCompleteData>` - Current form data
- `goToNext: (stepData: TStepData) => Promise<boolean>` - Move to next step
- `goToPrevious: () => void` - Move to previous step
- `goToStep: (step: number) => void` - Jump to specific step
- `completeForm: (finalStepData: TStepData) => Promise<void>` - Complete the form
- `reset: () => void` - Reset form to initial state

## Future Enhancements

- Add form state persistence to localStorage
- Add step validation indicators
- Add ability to skip steps conditionally
- Add animations between steps
- Integration with state management libraries (Redux, Zustand, etc.)
- Add accessibility improvements (ARIA labels, keyboard navigation)
