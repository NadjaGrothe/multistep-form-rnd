import { Accordion } from '@/components/ui/accordion';
import { useState } from 'react';
import { Button } from '../ui/button';
import { AccordionItemWrapper } from './AccordionItemWrapper';
import { AccountingDetailsStep } from './AccountingDetailsStep';
import { AddressDetailsStep } from './AddressDetailsStep';
import { UserDetailsStep } from './UserDetailsStep';
import { store } from './form-store';

export function DraftForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleStep1Next = async (data: UserFormData) => {
  //   return await goToNext({
  //     user: data,
  //   });
  // };

  // const handleStep2Next = async (data: AddressFormData) => {
  //   return await goToNext({
  //     address: data,
  //   });
  // };

  // const handleStep3Next = async (data: AccountingFormData) => {
  //   return await goToNext({
  //     accounting: data,
  //   });
  // };

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

  const accordionValue = store((state) => state.currentStep);
  const goToStep = store((state) => state.goToStep);
  const next = store((state) => state.next);
  const previous = store((state) => state.previous);
  const reset = store((state) => state.reset);
  const data = store((state) => state.data);

  return (
    <div className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-4 border">
      <Accordion
        type="single"
        value={accordionValue}
        onValueChange={goToStep}
        className="w-full"
      >
        <AccordionItemWrapper
          //TODO: create enum for step values & reuse for stepOrder in store.ts
          value="user"
          title="Personal Information"
          // canAccess={canAccessStep(1)}
        >
          <UserDetailsStep onNext={next} />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value="address"
          title="Address Information"
          // canAccess={canAccessStep(2)}
        >
          <AddressDetailsStep onNext={next} onPrevious={previous} />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value="accounting"
          title="Accounting Information"
          // canAccess={canAccessStep(3)}
        >
          <AccountingDetailsStep onPrevious={previous} onNext={next} />
        </AccordionItemWrapper>

        <AccordionItemWrapper
          value="confirmation"
          title="Confirmation"
          // canAccess={canAccessStep(4)}
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
