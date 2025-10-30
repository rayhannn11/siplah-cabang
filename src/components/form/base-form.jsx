// components/form/BaseForm.jsx
import { FormProvider } from "react-hook-form";

export default function BaseForm({ children, methods, onSubmit, transparant }) {
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
