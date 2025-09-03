import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { step2Schema, type Step2FormData } from './schema';

type Step2FormProps = {
  initialData?: Partial<Step2FormData>;
  onPrevious: () => void;
  onNext?: (data: Step2FormData) => Promise<boolean>;
  onSubmit?: (data: Step2FormData) => Promise<void>;
  isLastStep: boolean;
  isSubmitting?: boolean;
};

export function Step2Form({
  initialData,
  onPrevious,
  onNext,
  onSubmit,
  isLastStep,
  isSubmitting: externalSubmitting,
}: Step2FormProps) {
  const form = useAppForm({
    defaultValues: {
      address1: initialData?.address1 || '',
      postcode: initialData?.postcode || '',
      townCity: initialData?.townCity || '',
    } satisfies Step2FormData,
    validators: {
      onChange: step2Schema,
    },
    onSubmit: async ({ value }) => {
      if (isLastStep && onSubmit) {
        await onSubmit(value);
      } else if (!isLastStep && onNext) {
        await onNext(value);
      }
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
          <Button size="sm" variant="ghost" onClick={onPrevious} type="button">
            Previous
          </Button>
          {isLastStep ? (
            <Button
              size="sm"
              type="submit"
              disabled={isSubmitting || externalSubmitting}
            >
              {isSubmitting || externalSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          ) : (
            <Button
              size="sm"
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </form.AppForm>
  );
}
