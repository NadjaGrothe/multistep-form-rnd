import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { forwardRef, useImperativeHandle } from 'react';
import { store } from './form-store';
import { addressSchema } from './schema';
import { useStepController } from './useStepController';

// once updating to react 19 forwardRef is no longer needed (ref can be passed as prop directly)
export const AddressDetailsStep = forwardRef(function AddressDetailsStep(
  _props,
  ref
) {
  //keep in component
  const defaultValues = store((state) => state.data.address);
  const STEPS = store((state) => state.STEPS);
  const next = store((state) => state.next);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: addressSchema,
    },
    onSubmit: async ({ value }) => next(STEPS.address, value),
  });

  // custom hook
  const { isSubmitting, handleSubmit, previous } = useStepController({
    form,
    step: STEPS.address,
    store,
  });

  // check if can be moved to custom hook
  const updateData = store((state) => state.updateData);

  useImperativeHandle(
    ref,
    () => ({
      syncWithStore: () => {
        updateData(STEPS.address, form.state.values);
      },
    }),
    [updateData, form.state.values, STEPS.address]
  );

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
});
