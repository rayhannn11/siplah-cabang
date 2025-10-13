import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alertSuccess, alertError } from "../lib/alerts";

export default function useDelete({
  mutationFn,
  queryKey,
  onSuccess,
  onError,
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (res, ...args) => {
      alertSuccess("Data berhasil dihapus.");
      if (queryKey) queryClient.invalidateQueries({ queryKey });
      if (onSuccess) onSuccess(res, ...args);
    },
    onError: (err) => {
      alertError("Gagal menghapus data.");
      if (onError) onError(err);
    },
  });
}
