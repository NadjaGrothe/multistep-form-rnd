import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { useStore as useFormStore } from '@tanstack/react-form';
import { forwardRef, useImperativeHandle } from 'react';
import { store } from './form-store';
import { accountingSchema, type AccountingFormData } from './schema';
import type { FormStepRef } from './types';
import { useStepValidation } from './useStepValidation';

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

  const isSubmitting = useFormStore(form.store, (state) => state.isSubmitting);

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

  useStepValidation({
    form,
    step: STEPS.accounting,
    store,
  });

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
