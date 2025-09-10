import { Accordion } from '@/components/ui/accordion';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { AccordionItemWrapper } from './AccordionItemWrapper';
import { AccountingDetailsStep } from './AccountingDetailsStep';
import { AddressDetailsStep } from './AddressDetailsStep';
import { UserDetailsStep } from './UserDetailsStep';
import { FORM_STEPS, type FormStep } from './constants';
import { store } from './form-store';
import type { FormStepRef } from './types';

export function DraftForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userStepRef = useRef<FormStepRef>(null);
  const addressStepRef = useRef<FormStepRef>(null);
  const accountingStepRef = useRef<FormStepRef>(null);

  const handleSubmit = async () => {
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
  };

  const accordionValue = store((state) => state.currentStep.value);
  const goToStepWithSync = store((state) => state.goToStepWithSync);
  const canAccessStep = store((state) => state.canAccessStep);
  const next = store((state) => state.next);
  const previous = store((state) => state.previous);
  const reset = store((state) => state.reset);
  const data = store((state) => state.data);

  const handleAccordionChange = (newStep: FormStep) => {
    let currentFormRef: FormStepRef | null = null;

    switch (accordionValue) {
      case FORM_STEPS.USER:
        currentFormRef = userStepRef.current;
        break;
      case FORM_STEPS.ADDRESS:
        currentFormRef = addressStepRef.current;
        break;
      case FORM_STEPS.ACCOUNTING:
        currentFormRef = accountingStepRef.current;
        break;
    }

    goToStepWithSync(newStep, currentFormRef || undefined);
  };

  return (
    <div className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-4 border">
      <Accordion
        type="single"
        value={accordionValue}
        onValueChange={handleAccordionChange}
        className="w-full"
      >
        <AccordionItemWrapper
          value={FORM_STEPS.USER}
          title="Personal Information"
          canAccess={canAccessStep(FORM_STEPS.USER)}
        >
          <UserDetailsStep ref={userStepRef} onNext={next} />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value={FORM_STEPS.ADDRESS}
          title="Address Information"
          canAccess={canAccessStep(FORM_STEPS.ADDRESS)}
        >
          <AddressDetailsStep
            ref={addressStepRef}
            onNext={next}
            onPrevious={previous}
          />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value={FORM_STEPS.ACCOUNTING}
          title="Accounting Information"
          canAccess={canAccessStep(FORM_STEPS.ACCOUNTING)}
        >
          <AccountingDetailsStep
            ref={accountingStepRef}
            onPrevious={previous}
            onNext={next}
          />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value={FORM_STEPS.CONFIRMATION}
          title="Confirmation"
          canAccess={canAccessStep(FORM_STEPS.CONFIRMATION)}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Confirmation</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
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
