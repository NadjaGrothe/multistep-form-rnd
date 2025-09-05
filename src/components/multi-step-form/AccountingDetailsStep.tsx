import { Button } from '../ui/button';
import { withForm } from '../ui/form';
import { multiStepFormOptions } from './shared-form';

export const AccountingDetailsStep = withForm({
  ...multiStepFormOptions,
  render: function Render({ form }) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>

        <form.AppField
          name="accountingDetails.taxNumber"
          children={(field) => (
            <field.FormInput
              label="Tax Number"
              placeholder="GB123456789"
              type="text"
            />
          )}
        />
        <form.AppField
          name="accountingDetails.legalCompanyName"
          children={(field) => (
            <field.FormInput
              label="Legal Company Name"
              placeholder="My Company Ltd"
              type="text"
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
