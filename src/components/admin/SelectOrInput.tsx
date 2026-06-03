import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOrInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  selectPlaceholder?: string;
  formatOption?: (option: string) => string;
  error?: string;
  required?: boolean;
}

export function SelectOrInput({
  label,
  value,
  onChange,
  options,
  placeholder = 'Type a custom value',
  selectPlaceholder = 'Or select from list',
  formatOption,
  error,
  required,
}: SelectOrInputProps) {
  const selectValue = options.includes(value) ? value : '';

  return (
    <div>
      <Label>
        {label}
        {required ? ' *' : ''}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5"
      />
      <Select value={selectValue} onValueChange={onChange}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {formatOption ? formatOption(option) : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
