import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { forwardRef, useImperativeHandle } from 'react';
import { store } from './form-store';
import { userSchema } from './schema';
import { useStepController } from './useStepController';

export const UserDetailsStep = forwardRef(function UserDetailsStep(
  _props,
  ref
) {
  const defaultValues = store((state) => state.data.user);
  const updateData = store((state) => state.updateData);
  const next = store((state) => state.next);
  const STEPS = store((state) => state.STEPS);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: userSchema,
    },
    onSubmit: ({ value }) => next(STEPS.user, value),
  });

  const { isSubmitting, handleSubmit } = useStepController({
    form,
    step: STEPS.user,
    store,
  });

  useImperativeHandle(
    ref,
    () => ({
      syncWithStore: () => {
        updateData(STEPS.user, form.state.values);
      },
    }),
    [updateData, form.state.values, STEPS.user]
  );

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>

        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
          <form.AppField
            name="nameFirst"
            children={(field) => (
              <field.FormInput
                label="First name"
                placeholder="John"
                type="text"
              />
            )}
          />
          <form.AppField
            name="nameLast"
            children={(field) => (
              <field.FormInput
                label="Last name"
                placeholder="Doe"
                type="text"
              />
            )}
          />
        </div>

        <form.AppField
          name="email"
          children={(field) => (
            <field.FormInput
              label="Email"
              placeholder="john@mailprovider.co.uk"
              type="email"
            />
          )}
        />

        <div className="flex items-center justify-between gap-3 w-full pt-3">
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
