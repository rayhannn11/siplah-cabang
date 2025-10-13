// src/hooks/useSubmit.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alertSuccess, alertError } from "../lib/alerts";

/**
 * @param {object} config
 * @param {'post'|'put'} config.method - HTTP method
 * @param {function} config.fn - mutation function (API call)
 * @param {string} [config.fnName] - optional debug name
 * @param {string[]} [config.queryKey] - optional react-query cache key to invalidate
 * @param {string} [config.successMessage]
 * @param {string} [config.errorMessage]
 * @param {function} [config.onSuccess]
 * @param {function} [config.onError]
 */
export default function useSubmit({
  method,
  fn,
  fnName,
  queryKey,
  successMessage = "Berhasil disimpan.",
  errorMessage = "Gagal menyimpan.",
  onSuccess,
  onError,
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fn,
    onSuccess: (res, ...args) => {
      console.log(`[${fnName || method.toUpperCase()}] success:`, res);
      if (queryKey) queryClient.invalidateQueries({ queryKey });
      alertSuccess(successMessage);
      if (onSuccess) onSuccess(res, ...args);
    },
    onError: (err) => {
      console.error(`[${fnName || method.toUpperCase()}] error:`, err);
      alertError(errorMessage);
      if (onError) onError(err);
    },
  });
}
