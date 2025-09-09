import { Button } from '@/components/ui/button';
import { useAppForm } from '@/components/ui/form';
import { store } from './form-store';
import { userSchema, type UserFormData } from './schema';

type PersonalDetailsStepProps = {
  onNext: ({ user }: { user: UserFormData }) => void;
};

export function UserDetailsStep({ onNext }: PersonalDetailsStepProps) {
  const defaultValues = store((state) => state.data.user);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: userSchema,
    },
    onSubmit: ({ value }) => {
      onNext({ user: value });
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
