import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { step1Schema, type Step1FormData } from './schema';

type Step1FormProps = {
  initialData?: Partial<Step1FormData>;
  onNext: (data: Step1FormData) => Promise<boolean>;
  onPrevious: () => void;
  isFirstStep: boolean;
};

export function Step1Form({
  initialData,
  onNext,
  onPrevious,
  isFirstStep,
}: Step1FormProps) {
  const form = useAppForm({
    defaultValues: {
      nameFirst: initialData?.nameFirst || '',
      nameLast: initialData?.nameLast || '',
      email: initialData?.email || '',
    } satisfies Step1FormData,
    validators: {
      onChange: step1Schema,
    },
    onSubmit: async ({ value }) => {
      await onNext(value);
    },
  });

  const handleNext = async (e: React.FormEvent) => {
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
      <form onSubmit={handleNext} className="space-y-4">
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
            variant="ghost"
            onClick={onPrevious}
            type="button"
            disabled={isFirstStep}
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
