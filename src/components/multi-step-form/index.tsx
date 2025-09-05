import { Accordion } from '@/components/ui/accordion';
import { useAppForm } from '@/components/ui/form';
import { Button } from '../ui/button';
import { AccordionItemWrapper } from './AccordionItemWrapper';
import { AccountingDetailsStep } from './AccountingDetailsStep';
import { AddressDetailsStep } from './AddressDetailsStep';
import { PersonalDetailsStep } from './PersonalDetailsStep';
import { formStepEnum, stepOrder } from './schema';
import { multiStepFormOptions } from './shared-form';
import { useMultiStepForm } from './useMultiStepForm';

export function DraftForm() {
  const form = useAppForm({
    ...multiStepFormOptions,
    onSubmit: ({ value, formApi }) => {
      if (value.step === formStepEnum.PERSONAL) {
        formApi.setFieldValue('step', formStepEnum.ADDRESS);
        console.log('Personal Details Submitted', value);
      }

      if (value.step === formStepEnum.ADDRESS) {
        formApi.setFieldValue('step', formStepEnum.ACCOUNTING);
        console.log('Address Details Submitted', value);
      }

      if (value.step === formStepEnum.ACCOUNTING) {
        formApi.setFieldValue('step', formStepEnum.CONFIRMATION);
        console.log('Accounting Details Submitted', value);
      }

      if (value.step === formStepEnum.CONFIRMATION) {
        alert(JSON.stringify(value, null, 2));
      }
    },
  });

  const {
    activeAccordionValue,
    canAccessStep,
    handleAccordionValueChange,
    resetForm,
  } = useMultiStepForm({
    form,
    stepOrder,
    stepFieldName: 'step',
  });

  return (
    <div className="p-8 w-full rounded-md max-w-4xl border">
      <Accordion
        type="single"
        className="w-full"
        value={activeAccordionValue}
        onValueChange={handleAccordionValueChange}
      >
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
              canAccess={canAccessStep(formStepEnum.PERSONAL)}
            >
              <PersonalDetailsStep form={form} />
            </AccordionItemWrapper>

            <AccordionItemWrapper
              value={formStepEnum.ADDRESS}
              title="Address Information"
              canAccess={canAccessStep(formStepEnum.ADDRESS)}
            >
              <AddressDetailsStep form={form} />
            </AccordionItemWrapper>

            <AccordionItemWrapper
              value={formStepEnum.ACCOUNTING}
              title="Accounting Information"
              canAccess={canAccessStep(formStepEnum.ACCOUNTING)}
            >
              <AccountingDetailsStep form={form} />
            </AccordionItemWrapper>

            <AccordionItemWrapper
              value={formStepEnum.CONFIRMATION}
              title="Confirmation"
              canAccess={canAccessStep(formStepEnum.CONFIRMATION)}
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Confirmation</h2>
                <pre>{JSON.stringify(form.store.state.values, null, 2)}</pre>
                <Button type="submit" size="sm" variant="secondary">
                  Submit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Reset
                </Button>
              </div>
            </AccordionItemWrapper>
          </form>
        </form.AppForm>
      </Accordion>
    </div>
  );
}
