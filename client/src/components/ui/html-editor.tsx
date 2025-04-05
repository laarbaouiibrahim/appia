import { useState, useEffect, forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface HtmlEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onUpdateValue?: (value: string) => void;
}

const HtmlEditor = forwardRef<HTMLTextAreaElement, HtmlEditorProps>(
  ({ className, onUpdateValue, ...props }, ref) => {
    const [editorValue, setEditorValue] = useState<string>(props.value as string || '');
    
    useEffect(() => {
      if (props.value !== undefined) {
        setEditorValue(props.value as string);
      }
    }, [props.value]);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditorValue(e.target.value);
      onUpdateValue?.(e.target.value);
    };
    
    return (
      <Textarea
        ref={ref}
        className={cn(
          "font-mono text-sm min-h-[300px] resize-y whitespace-pre tab-size-2",
          className
        )}
        onChange={handleChange}
        value={editorValue}
        {...props}
      />
    );
  }
);

HtmlEditor.displayName = "HtmlEditor";

export { HtmlEditor };
