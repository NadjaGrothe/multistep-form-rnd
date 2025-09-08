import { Accordion } from '@/components/ui/accordion';
import { useState } from 'react';
import { AccordionItemWrapper } from './AccordionItemWrapper';
import { AccountingDetailsStep } from './AccountingDetailsStep';
import { AddressDetailsStep } from './AddressDetailsStep';
import { PersonalDetailsStep } from './PersonalDetailsStep';
import {
  type AccountingDetailsFormData,
  type AddressDetailsFormData,
  type CompleteFormData,
  type PersonalDetailsFormData,
} from './schema';
import { useGenericMultiStepForm } from './useGenericMultiStepForm';

export function DraftForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const multiStepForm = useGenericMultiStepForm<
    CompleteFormData,
    PersonalDetailsFormData | AddressDetailsFormData | AccountingDetailsFormData
  >({
    totalSteps: 3,
    onComplete: async (data: CompleteFormData) => {
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

  const handleStep1Next = async (data: PersonalDetailsFormData) => {
    return await goToNext(data);
  };

  const handleStep2Next = async (data: AddressDetailsFormData) => {
    return await goToNext(data);
  };

  const handleStep3Submit = async (data: AccountingDetailsFormData) => {
    await completeForm(data);
  };

  const stepTitles = [
    'Personal Information',
    'Address Information',
    'Accounting Information',
  ];

  return (
    <div className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-4 border">
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
          <PersonalDetailsStep
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
          <AddressDetailsStep
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
          <AccountingDetailsStep
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
