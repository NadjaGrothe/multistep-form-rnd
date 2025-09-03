import type { AnyFieldApi } from '@tanstack/react-form';

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-red-500">{field.state.meta.errors[0].message}</em>
      ) : (
        <span className="opacity-0 pointer-events-none"></span>
      )}
      {/* {field.state.meta.isValidating ? 'Validating...' : null} */}
    </>
  );
}
