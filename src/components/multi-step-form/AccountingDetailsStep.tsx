import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { forwardRef, useImperativeHandle } from 'react';
import { store } from './form-store';
import { accountingSchema } from './schema';

import { useStepController } from './useStepController';

export const AccountingDetailsStep = forwardRef(function AccountingDetailsStep(
  _props,
  ref
) {
  const defaultValues = store((state) => state.data.accounting);
  const STEPS = store((state) => state.STEPS);

  const updateData = store((state) => state.updateData);
  const next = store((state) => state.next);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: accountingSchema,
    },
    onSubmit: ({ value }) => next(STEPS.accounting, value),
  });

  const { isSubmitting, handleSubmit, previous } = useStepController({
    form,
    step: STEPS.accounting,
    store,
  });

  useImperativeHandle(
    ref,
    () => ({
      syncWithStore: () => {
        updateData({ accounting: form.state.values });
      },
    }),
    [updateData, form.state.values]
  );

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
            onClick={() => previous({ accounting: form.state.values })}
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
