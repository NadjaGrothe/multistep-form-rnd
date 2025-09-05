import { Accordion } from '@/components/ui/accordion';
import { useAppForm } from '@/components/ui/form';
import { useStore } from '@tanstack/react-form';
import { Button } from '../ui/button';
import { AccordionItemWrapper } from './AccordionItemWrapper';
import { AccountingDetailsStep } from './AccountingDetailsStep';
import { AddressDetailsStep } from './AddressDetailsStep';
import { PersonalDetailsStep } from './PersonalDetailsStep';
import { formStepEnum } from './schema';
import { multiStepFormOptions } from './shared-form';

export function DraftForm() {
  const form = useAppForm({
    ...multiStepFormOptions,
    onSubmit: ({ value, formApi }) => {
      if (value.step !== 'confirmation') return;
      if (value.step === 'confirmation') {
        alert(JSON.stringify(value, null, 2));
        formApi.reset();
      }
    },
  });

  const currentStepWatcher = useStore(form.store, (state) => state.values.step);

  return (
    <div className="p-8 w-full rounded-md max-w-4xl border">
      <div className="flex flex-col items-center justify-start gap-2">
        {/* <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <Progress value={progress} className="w-full" /> */}
      </div>

      <Accordion type="single" className="w-full" value={currentStepWatcher}>
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="w-full"
          >
            <AccordionItemWrapper
              value={formStepEnum.PERSONAL}
              title="Personal Information"
              canAccess={true}
            >
              <PersonalDetailsStep form={form} />
            </AccordionItemWrapper>

            <AccordionItemWrapper
              value={formStepEnum.ADDRESS}
              title="Address Information"
              canAccess={true}
            >
              <AddressDetailsStep form={form} />
            </AccordionItemWrapper>

            <AccordionItemWrapper
              value={formStepEnum.ACCOUNTING}
              title="Accounting Information"
              canAccess={true}
            >
              <AccountingDetailsStep form={form} />
            </AccordionItemWrapper>

            <AccordionItemWrapper
              value={formStepEnum.CONFIRMATION}
              title="Confirmation"
              canAccess={true}
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Confirmation</h2>
                <pre>{JSON.stringify(form.store.state.values, null, 2)}</pre>
                <Button type="submit" size="sm" variant="secondary">
                  Submit
                </Button>
              </div>
            </AccordionItemWrapper>
          </form>
        </form.AppForm>
      </Accordion>
    </div>
  );
}
