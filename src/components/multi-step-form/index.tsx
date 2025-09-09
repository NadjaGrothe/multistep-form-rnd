import { Accordion } from '@/components/ui/accordion';
import { useState } from 'react';
import { Button } from '../ui/button';
import { AccordionItemWrapper } from './AccordionItemWrapper';
import { AccountingDetailsStep } from './AccountingDetailsStep';
import { AddressDetailsStep } from './AddressDetailsStep';
import { UserDetailsStep } from './UserDetailsStep';
import {
  type AccountingFormData,
  type AddressFormData,
  type CompleteFormData,
  type UserFormData,
} from './schema';
import { useGenericMultiStepForm } from './useGenericMultiStepForm';

export function DraftForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const multiStepForm = useGenericMultiStepForm<CompleteFormData>({
    totalSteps: 4,
  });

  const {
    formData,
    goToNext,
    goToPrevious,
    activeAccordionValue,
    handleAccordionValueChange,
    canAccessStep,
    reset,
  } = multiStepForm;

  const handleStep1Next = async (data: UserFormData) => {
    return await goToNext({
      user: data,
    });
  };

  const handleStep2Next = async (data: AddressFormData) => {
    return await goToNext({
      address: data,
    });
  };

  const handleStep3Next = async (data: AccountingFormData) => {
    return await goToNext({
      accounting: data,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Complete form data:', formData);
      // Here you would typically send the data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <UserDetailsStep onNext={handleStep1Next} />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value="step-2"
          title="Address Information"
          canAccess={canAccessStep(2)}
        >
          <AddressDetailsStep
    
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
              onClick={handleSubmit}
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
