import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { store } from './form-store';
import { addressSchema, type AddressFormData } from './schema';

type AddressDetailsStepProps = {
  onPrevious: ({ address }: { address: AddressFormData }) => void;
  onNext: ({ address }: { address: AddressFormData }) => void;
};

export function AddressDetailsStep({
  onPrevious,
  onNext,
}: AddressDetailsStepProps) {
  const defaultValues = store((state) => state.data.address);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: addressSchema,
    },
    onSubmit: async ({ value }) => {
      onNext({ address: value });
    },
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const {
    baseStore: {
      state: { isSubmitting },
    },
  } = form;

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
}
