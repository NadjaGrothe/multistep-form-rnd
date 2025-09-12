import { Accordion } from '@/components/ui/accordion';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { AccordionItemWrapper } from './AccordionItemWrapper';
import { AccountingDetailsStep } from './AccountingDetailsStep';
import { AddressDetailsStep } from './AddressDetailsStep';
import { UserDetailsStep } from './UserDetailsStep';
import { store } from './form-store';
import type { FormStepRef } from './types';

type StoreStep = ReturnType<typeof store.getState>['currentStep']['value'];

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

  const reset = store((state) => state.reset);
  const data = store((state) => state.data);

  const STEPS = store((s) => s.STEPS);

  const handleAccordionChange = (newStep: StoreStep) => {
    let currentFormRef: FormStepRef | null = null;

    switch (accordionValue) {
      case STEPS.user:
        currentFormRef = userStepRef.current;
        break;
      case STEPS.address:
        currentFormRef = addressStepRef.current;
        break;
      case STEPS.accounting:
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
          value={STEPS.user}
          title="Personal Information"
          canAccess={canAccessStep(STEPS.user)}
        >
          <UserDetailsStep ref={userStepRef} />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value={STEPS.address}
          title="Address Information"
          canAccess={canAccessStep(STEPS.address)}
        >
          <AddressDetailsStep ref={addressStepRef} />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value={STEPS.accounting}
          title="Accounting Information"
          canAccess={canAccessStep(STEPS.accounting)}
        >
          <AccountingDetailsStep ref={accountingStepRef} />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value={STEPS.confirmation}
          title="Confirmation"
          canAccess={canAccessStep(STEPS.confirmation)}
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
