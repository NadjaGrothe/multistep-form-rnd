import { Button } from '../ui/button';
import { withForm } from '../ui/form';
import { multiStepFormOptions } from './shared-form';

export const AddressDetailsStep = withForm({
  ...multiStepFormOptions,
  render: function Render({ form }) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>

        <form.AppField
          name="addressDetails.address1"
          children={(field) => (
            <field.FormInput
              label="Address 1"
              placeholder="123 Main St"
              type="text"
            />
          )}
        />

        <form.AppField
          name="addressDetails.townCity"
          children={(field) => (
            <field.FormInput
              label="Town/City"
              placeholder="London"
              type="text"
            />
          )}
        />

        <form.AppField
          name="addressDetails.postcode"
          children={(field) => (
            <field.FormInput label="Postcode" placeholder="SE1 5HS" />
          )}
        />

        <div className="flex items-center justify-end gap-3 w-full pt-3">
          <Button size="sm" variant="secondary">
            Next
          </Button>
        </div>
      </div>
    );
  },
});
