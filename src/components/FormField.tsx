// one label + input block in the New-Frontend custom-field style
export default function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
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
        />
      </div>
    </div>
  );
}
