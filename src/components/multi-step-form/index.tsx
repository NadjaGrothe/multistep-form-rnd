import { Accordion } from '@/components/ui/accordion';
import { useState } from 'react';
import { Button } from '../ui/button';
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
    totalSteps: 4,
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
    formData,
    goToNext,
    goToPrevious,
    completeForm,
    activeAccordionValue,
    handleAccordionValueChange,
    canAccessStep,
    reset,
  } = multiStepForm;

  const handleStep1Next = async (data: PersonalDetailsFormData) => {
    return await goToNext(data);
  };

  const handleStep2Next = async (data: AddressDetailsFormData) => {
    return await goToNext(data);
  };

  const handleStep3Next = async (data: AccountingDetailsFormData) => {
    return await goToNext(data);
  };

  const handleStep4Submit = async (data: CompleteFormData) => {
    await completeForm(data);
  };

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
          title="Personal Information"
          canAccess={canAccessStep(1)}
        >
          <PersonalDetailsStep
            initialData={formData}
            onNext={handleStep1Next}
          />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value="step-2"
          title="Address Information"
          canAccess={canAccessStep(2)}
        >
          <AddressDetailsStep
            initialData={formData}
            onNext={handleStep2Next}
            onPrevious={goToPrevious}
          />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value="step-3"
          title="Accounting Information"
          canAccess={canAccessStep(3)}
        >
          <AccountingDetailsStep
            initialData={formData}
            onPrevious={goToPrevious}
            onNext={handleStep3Next}
          />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value={'step-4'}
          title="Confirmation"
          canAccess={canAccessStep(4)}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Confirmation</h2>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              disabled={isSubmitting}
              onClick={async () =>
                await handleStep4Submit(formData as CompleteFormData)
              }
            >
              Submit
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={reset}>
              Reset
            </Button>
          </div>
        </AccordionItemWrapper>
      </Accordion>
    </div>
  );
}
