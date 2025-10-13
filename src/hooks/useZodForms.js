// hooks/useZodForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Custom hook dengan zod resolver dan optional default values.
 * Tetap mengembalikan full instance React Hook Form untuk support FormProvider.
 */
export default function useZodForm(schema, options = {}) {
  return useForm({
    resolver: zodResolver(schema),
    mode: "onTouched", // atau "all", "onChange", sesuai preferensi
    ...options,
  });
}
