import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import {
  accountingDetailsSchema,
  type AccountingDetailsFormData,
} from './schema';

type AccountingDetailsStepProps = {
  initialData?: Partial<AccountingDetailsFormData>;
  onPrevious: () => void;
  onNext: (data: AccountingDetailsFormData) => Promise<boolean>;
};

export function AccountingDetailsStep({
  initialData,
  onPrevious,
  onNext,
}: AccountingDetailsStepProps) {
  const form = useAppForm({
    defaultValues: {
      taxNumber: initialData?.taxNumber || '',
      legalCompanyName: initialData?.legalCompanyName || '',
    } satisfies AccountingDetailsFormData,
    validators: {
      onChange: accountingDetailsSchema,
    },
    onSubmit: async ({ value }) => {
      await onNext(value);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
          <Button size="sm" variant="ghost" onClick={onPrevious} type="button">
            Previous
          </Button>

          <Button size="sm" type="submit" disabled={isSubmitting}>
            Next
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}
