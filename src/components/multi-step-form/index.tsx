import { useState } from 'react';
import { MultiStepContainer } from './MultiStepContainer';
import {
  type MultiStepFormData,
  type Step1Data,
  type Step2Data,
  type Step3Data,
} from './schema';
import { Step1Form } from './Step1Form';
import { Step2Form } from './Step2Form';
import { Step3Form } from './Step3Form';
import { useGenericMultiStepForm } from './useGenericMultiStepForm';

export function DraftForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const multiStepForm = useGenericMultiStepForm<
    MultiStepFormData,
    Step1Data | Step2Data | Step3Data
  >({
    totalSteps: 3,
    onComplete: async (data: MultiStepFormData) => {
      setIsSubmitting(true);
      try {
        console.log('Complete form data:', data);
        // Here you would typically send the data to your API
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
        alert('Form submitted successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    onStepValidation: async (step, data) => {
      console.log(`Validating step ${step}:`, data);
      // Here you could add custom validation logic
      // For example, check if email is unique on step 1
      return true;
    },
  });

  const {
    currentStep,
    totalSteps,
    progress,
    isFirstStep,
    isLastStep,
    formData,
    goToNext,
    goToPrevious,
    completeForm,
  } = multiStepForm;

  const handleStep1Next = async (data: Step1Data) => {
    return await goToNext(data);
  };

  const handleStep2Next = async (data: Step2Data) => {
    return await goToNext(data);
  };

  const handleStep3Submit = async (data: Step3Data) => {
    await completeForm(data);
  };

  return (
    <MultiStepContainer
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
    >
      {currentStep === 1 && (
        <Step1Form
          initialData={formData}
          onNext={handleStep1Next}
          onPrevious={goToPrevious}
          isFirstStep={isFirstStep}
        />
      )}

      {currentStep === 2 && (
        <Step2Form
          initialData={formData}
          onNext={handleStep2Next}
          onPrevious={goToPrevious}
          isLastStep={false}
        />
      )}

      {currentStep === 3 && (
        <Step3Form
          initialData={formData}
          onPrevious={goToPrevious}
          onSubmit={handleStep3Submit}
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
        />
      )}
    </MultiStepContainer>
  );
}
