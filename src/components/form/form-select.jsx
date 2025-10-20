// ✅ Refactored FormSelect with consistent layout as FormInput
import { useFormContext } from "react-hook-form";
import clsx from "clsx";

export default function FormSelect({
  name,
  label,
  options = [],
  placeholder = "Pilih opsi",
  className = "w-full",
  required = false,
  disabled: customDisabled = false,
  transformValue,
  ...rest
}) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const error = errors?.[name]?.message;
  const disabled = isSubmitting || customDisabled;

  let valueProp = {};
  if (transformValue) {
    valueProp = { setValueAs: transformValue };
  } else {
    valueProp = {}; // jangan pakai valueAsNumber sebagai default
  }

  return (
    <div className={clsx("form-control", className)}>
      {label && (
        <label htmlFor={name} className="label mb-1 ">
          <span className="label-text text-base font-medium">{label}</span>
        </label>
      )}

      <select
        id={name}
        disabled={disabled}
        required={required}
        className={clsx(
          "select select-bordered text-base w-full",
          error && "select-error"
        )}
        {...register(name, {
          ...valueProp,
        })}
        {...rest}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
