import { useFormContext } from "react-hook-form";
import clsx from "clsx";

export default function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  className = "w-full",
  required = false,
  disabled: customDisabled = false,
  autoFocus = false,
  transformValue,
  icon: Icon, // <- Tambah prop icon
  ...rest
}) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const error = errors?.[name]?.message;
  const disabled = isSubmitting || customDisabled;

  let valueProp = {};
  if (type === "number") {
    valueProp = { valueAsNumber: true };
  } else if (type === "date") {
    valueProp = { valueAsDate: true };
  } else if (type === "checkbox") {
    valueProp = {};
  }

  if (transformValue) {
    valueProp = { setValueAs: transformValue };
  }

  return (
    <div className={clsx("form-control mb-0", className)}>
      {label && (
        <label htmlFor={name} className="label mb-1 ">
          <span className="label-text text-base font-medium">{label}</span>
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black  z-10" />
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          required={required}
          className={clsx(
            "input input-bordered text-base w-full dark:bg-white dark:outline-1  dark:text-black dark:placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus:ring-0 focus:outline-offset-0",
            Icon && "pl-10", // kasih padding kalau ada icon
            error && "input-error"
          )}
          {...register(name, {
            ...valueProp,
          })}
          {...rest}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
