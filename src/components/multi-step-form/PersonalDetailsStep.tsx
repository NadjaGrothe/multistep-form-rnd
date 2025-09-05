import { Button } from '../ui/button';
import { withForm } from '../ui/form';
import { multiStepFormOptions } from './shared-form';

export const PersonalDetailsStep = withForm({
  ...multiStepFormOptions,
  render: function Render({ form }) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>

        <form.AppField
          name="personalDetails.nameFirst"
          children={(field) => (
            <field.FormInput label="First name" placeholder="John" />
          )}
        />

        <form.AppField
          name="personalDetails.nameLast"
          children={(field) => (
            <field.FormInput label="Last name" placeholder="Doe" type="text" />
          )}
        />

        <form.AppField
          name="personalDetails.email"
          children={(field) => (
            <field.FormInput
              label="Email"
              placeholder="john@mailprovider.co.uk"
              type="email"
            />
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
