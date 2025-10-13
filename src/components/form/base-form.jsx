// components/form/BaseForm.jsx
import { FormProvider } from "react-hook-form";

export default function BaseForm({ children, methods, onSubmit, transparant }) {
  // dark:border-slate-700  dark:bg-[#1D293D]
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className={`space-y-6  p-6 rounded-sm ${!transparant && "bg-white   "}`}
      >
        {children}
      </form>
    </FormProvider>
  );
}
