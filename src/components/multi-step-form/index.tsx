import { Button } from '@/components/ui/button';
import { useAppForm, withForm } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useCallback, type JSX } from 'react';
import * as z from 'zod';
import { formSchema } from './schema';
import { useMultiStepForm } from './use-multi-step-form';

export function DraftForm() {
  const form = useAppForm({
    defaultValues: {
      nameFirst: '',
      nameLast: '',
      email: '',
      address1: '',
      postcode: '',
      townCity: '',
    } satisfies z.infer<typeof formSchema>,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      console.log('handle submit');
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );
  // const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  return (
    <div>
      <form.AppForm>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"
        >
          <MultiStepViewer form={form} />
        </form>
      </form.AppForm>
    </div>
  );
}

//------------------------------
// Define the form structure for type inference
const multiStepFormOptions = {
  defaultValues: {
    nameFirst: '',
    nameLast: '',
    email: '',
    address1: '',
    postcode: '',
    townCity: '',
  } satisfies z.infer<typeof formSchema>,
};
//------------------------------

const MultiStepViewer = withForm({
  ...multiStepFormOptions,
  render: function MultiStepFormRender({ form }) {
    const stepFormElements: {
      [key: number]: JSX.Element;
    } = {
      1: (
        <div className="space-y-4">
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
        </div>
      ),
      2: (
        <div>
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
        </div>
      ),
    };

    const steps = Object.keys(stepFormElements).map(Number);

    const { currentStep, isLastStep, goToNext, goToPrevious } =
      useMultiStepForm({
        initialSteps: steps,
        onStepValidation: () => {
          /**
           * TODO: handle step validation
           */
          return true;
        },
      });
    const current = stepFormElements[currentStep];

    const {
      baseStore: {
        state: { isSubmitting },
      },
    } = form;

    return (
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col items-center justify-start gap-1">
          <span>
            Step {currentStep} of {steps.length}
          </span>
          <Progress value={(currentStep / steps.length) * 100} />
        </div>
        <div key={currentStep} className="flex flex-col gap-2">
          {current}
        </div>
        <div className="flex items-center justify-between gap-3 w-full pt-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={goToPrevious}
            type="button"
          >
            Previous
          </Button>
          {isLastStep ? (
            <Button size="sm" type="submit">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          ) : (
            <Button
              size="sm"
              type="button"
              variant={'secondary'}
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    );
  },
});
