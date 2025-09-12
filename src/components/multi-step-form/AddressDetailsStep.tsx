import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { forwardRef } from 'react';
import { store } from './form-store';
import { addressSchema } from './schema';
import type { FormStepRef } from './types';
import { useStepController } from './useStepController';

// once updating to react 19 forwardRef is no longer needed (ref can be passed as prop directly)
export const AddressDetailsStep = forwardRef<FormStepRef>(
  function AddressDetailsStep(_props, ref) {
    const defaultValues = store((state) => state.data.address);
    const STEPS = store((state) => state.STEPS);
    const form = useAppForm({
      defaultValues,
      validators: {
        onChange: addressSchema,
      },
      onSubmit: async ({ value }) => next(STEPS.address, value),
    });

    const { isSubmitting, handleSubmit, previous, next } = useStepController({
      form,
      step: STEPS.address,
      store,
      ref,
    });

    return (
      <form.AppForm>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onClick={() => previous(STEPS.address, form.state.values)}
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
  }
);
