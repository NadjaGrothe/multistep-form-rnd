import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AccordionItemWrapperProps {
  value: string;
  title: string;
  canAccess?: boolean; //TODO: remove conditional
  children: React.ReactNode;
  className?: string;
}

export function AccordionItemWrapper({
  value,
  title,
  canAccess = true,
  children,
  className = 'border rounded-lg mb-2',
}: AccordionItemWrapperProps) {
  return (
    <AccordionItem value={value} className={className}>
      <AccordionTrigger
        className={`px-4 hover:no-underline ${
          canAccess ? '' : 'opacity-50 cursor-not-allowed'
        }`}
        disabled={!canAccess}
      >
        <span className="font-medium">{title}</span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}
