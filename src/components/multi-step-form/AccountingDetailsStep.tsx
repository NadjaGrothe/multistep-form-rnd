import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { useStore } from '@tanstack/react-form';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { store } from './form-store';
import { accountingSchema, type AccountingFormData } from './schema';
import type { FormStepRef } from './types';

type AccountingDetailsStepProps = {
  onPrevious: ({ accounting }: { accounting: AccountingFormData }) => void;
  onNext: ({ accounting }: { accounting: AccountingFormData }) => void;
};

export const AccountingDetailsStep = forwardRef<
  FormStepRef,
  AccountingDetailsStepProps
>(function AccountingDetailsStep({ onPrevious, onNext }, ref) {
  const defaultValues = store((state) => state.data.accounting);
  const setStepValidation = store((state) => state.setStepValidation);
  const updateData = store((state) => state.updateData);
  const STEPS = store((s) => s.STEPS);
  const hasStepBeenCompleted = store(
    (state) => state.stepValidation[STEPS.accounting].hasBeenCompleted
  );
  const isValidInStore = store(
    (state) => state.stepValidation[STEPS.address].isValid
  );

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: accountingSchema,
    },
    onSubmit: ({ value }) => {
      setStepValidation(STEPS.accounting, true, true);
      onNext({ accounting: value });
    },
  });

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const isValid = useStore(form.store, (state) => state.isValid);
  const isDefaultValue = useStore(form.store, (state) => state.isDefaultValue);

  const [isStepValid, setIsStepValid] = useState(isValidInStore);

  useImperativeHandle(
    ref,
    () => ({
      syncWithStore: () => {
        updateData({ accounting: form.state.values });
      },
    }),
    [updateData, form.state.values]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  useEffect(() => {
    const isValidStep =
      (hasStepBeenCompleted && isDefaultValue && isValidInStore) ||
      (!isDefaultValue && isValid);
    setIsStepValid(isValidStep);
  }, [isDefaultValue, isValid, hasStepBeenCompleted, isValidInStore]);

  useEffect(() => {
    setStepValidation(STEPS.accounting, isStepValid);
  }, [isStepValid, setStepValidation, STEPS.accounting]);

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Accounting Information</h2>

        <form.AppField
          name="taxNumber"
          children={(field) => (
            <field.FormInput
              label="Tax Number"
              placeholder="123-456-789"
              type="text"
            />
          )}
        />

        <form.AppField
          name="legalCompanyName"
          children={(field) => (
            <field.FormInput
              label="Legal Company Name"
              placeholder="Acme Corp Ltd."
              type="text"
            />
          )}
        />

        <div className="flex items-center justify-between gap-3 w-full pt-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPrevious({ accounting: form.state.values })}
            type="button"
          >
            Previous
          </Button>

          <Button size="sm" type="submit" disabled={isSubmitting}>
            Next
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
});
