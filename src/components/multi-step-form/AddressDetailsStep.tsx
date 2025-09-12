import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { useStore as useFormStore } from '@tanstack/react-form';
import { forwardRef, useImperativeHandle } from 'react';
import { store } from './form-store';
import { addressSchema, type AddressFormData } from './schema';
import type { FormStepRef } from './types';
import { useStepValidation } from './useStepValidation';

type AddressDetailsStepProps = {
  onPrevious: ({ address }: { address: AddressFormData }) => void;
  onNext: ({ address }: { address: AddressFormData }) => void;
};

export const AddressDetailsStep = forwardRef<
  FormStepRef,
  AddressDetailsStepProps
>(function AddressDetailsStep({ onPrevious, onNext }, ref) {
  const defaultValues = store((state) => state.data.address);
  const setStepValidation = store((state) => state.setStepValidation);
  const updateData = store((state) => state.updateData);
  const STEPS = store((s) => s.STEPS);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: addressSchema,
    },
    onSubmit: async ({ value }) => {
      setStepValidation(STEPS.address, true, true);
      onNext({ address: value });
    },
  });

  const isSubmitting = useFormStore(form.store, (state) => state.isSubmitting);

  useImperativeHandle(
    ref,
    () => ({
      syncWithStore: () => {
        updateData({ address: form.state.values });
      },
    }),
    [updateData, form.state.values]
  );

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  useStepValidation({
    form,
    step: STEPS.address,
    store,
  });

  return (
    <form.AppForm>
      <form onSubmit={handleAction} className="space-y-4">
        <h2 className="text-xl font-semibold">Address Information</h2>

        <form.AppField
          name="address1"
          children={(field) => (
            <field.FormInput
              label="Address Line 1"
              placeholder="Marketplace 1"
              type="text"
            />
          )}
        />

        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
          <form.AppField
            name="postcode"
            children={(field) => (
              <field.FormInput
                label="Postcode *"
                placeholder="TR1 2RT"
                type="text"
              />
            )}
          />
          <form.AppField
            name="townCity"
            children={(field) => (
              <field.FormInput
                label="Town/City *"
                placeholder="Nottingham"
                type="text"
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-3 w-full pt-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPrevious({ address: form.state.values })}
            type="button"
          >
            Previous
          </Button>

          <Button
            size="sm"
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
          >
            Next
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
});
