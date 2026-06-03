import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MultiSelectOrInputProps {
  label: string;
  description?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly string[];
}

export function MultiSelectOrInput({
  label,
  description,
  value,
  onChange,
  options,
}: MultiSelectOrInputProps) {
  const [customValue, setCustomValue] = useState('');

  const toggleOption = (option: string) => {
    onChange(
      value.includes(option) ? value.filter((item) => item !== option) : [...value, option]
    );
  };

  const addCustomValue = () => {
    const trimmed = customValue.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setCustomValue('');
  };

  const removeValue = (item: string) => {
    onChange(value.filter((current) => current !== item));
  };

  return (
    <div>
      <Label className="text-base font-semibold">{label}</Label>
      {description && <p className="mb-3 mt-1 text-sm text-muted-foreground">{description}</p>}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option}
            variant={value.includes(option) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleOption(option)}
          >
            {option}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="Type a custom model and press Add"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomValue();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addCustomValue}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {value.some((item) => !options.includes(item)) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value
            .filter((item) => !options.includes(item))
            .map((item) => (
              <Badge key={item} variant="secondary" className="gap-1">
                {item}
                <button type="button" onClick={() => removeValue(item)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
