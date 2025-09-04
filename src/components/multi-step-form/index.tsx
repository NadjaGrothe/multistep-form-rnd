import { Accordion } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { AccordionItemWrapper } from './AccordionItemWrapper';
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
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        alert('Form submitted successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
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
    activeAccordionValue,
    handleAccordionValueChange,
    canAccessStep,
    getStepTitle,
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

  const stepTitles = [
    'Personal Information',
    'Address Information',
    'Accounting Information',
  ];

  return (
    <div className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-4 border">
      <div className="flex flex-col items-center justify-start gap-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <Progress value={progress} className="w-full" />
      </div>

      <Accordion
        type="single"
        value={activeAccordionValue}
        onValueChange={handleAccordionValueChange}
        className="w-full"
      >
        <AccordionItemWrapper
          value="step-1"
          title={getStepTitle(1, stepTitles)}
          canAccess={canAccessStep(1)}
        >
          <Step1Form
            initialData={formData}
            onNext={handleStep1Next}
            onPrevious={goToPrevious}
            isFirstStep={isFirstStep}
          />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value="step-2"
          title={getStepTitle(2, stepTitles)}
          canAccess={canAccessStep(2)}
        >
          <Step2Form
            initialData={formData}
            onNext={handleStep2Next}
            onPrevious={goToPrevious}
            isLastStep={false}
          />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value="step-3"
          title={getStepTitle(3, stepTitles)}
          canAccess={canAccessStep(3)}
        >
          <Step3Form
            initialData={formData}
            onPrevious={goToPrevious}
            onSubmit={handleStep3Submit}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
          />
        </AccordionItemWrapper>
      </Accordion>
    </div>
  );
}
