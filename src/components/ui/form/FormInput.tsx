import { Input } from '../input';
import { Label } from '../label';
import { useFieldContext } from './context';
import { FieldInfo } from './FieldInfo';

interface FormInputProps extends React.ComponentProps<typeof Input> {
  label: string;
}

export const FormInput = ({ label, ...props }: FormInputProps) => {
  const field = useFieldContext<string>();

  return (
    <div>
      <Label className="mb-1.5" htmlFor={field.name}>
        {label}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        onChange={(e) => field.handleChange(e.target.value)}
        // onBlur={() => field.handleBlur()}
        onBlur={field.handleBlur}
        value={field.state.value}
        {...props}
      />
      <FieldInfo field={field} />
    </div>
  );
};
