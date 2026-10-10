import { FRAMEWORKS } from "@/lib/frameworks";
import { fieldClass } from "@/components/ui";

export function FrameworkSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className={fieldClass}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {FRAMEWORKS.map((item) => (
        <option key={item.id} value={item.id}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
