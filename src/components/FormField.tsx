// one label + input block in the New-Frontend custom-field style
export default function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="custom-field">
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <div className="field-type">
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={
            onChange ? (event) => onChange(event.target.value) : undefined
          }
        />
      </div>
    </div>
  );
}
