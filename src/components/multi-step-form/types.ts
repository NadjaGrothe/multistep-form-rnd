export interface FormStepRef {
  syncWithStore: () => void;
}

export interface FormStepProps {
  onNext?: (data: Record<string, unknown>) => void;
  onPrevious?: (data: Record<string, unknown>) => void;
}
