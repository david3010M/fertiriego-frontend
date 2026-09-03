import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAttendanceLogs, storeAttendanceLog } from "./attendance.actions";
import {
  ATTENDANCE_QUERY_KEY,
  type CreateAttendanceLogRequest,
} from "./attendance.interface";
import { errorToast, successToast } from "@/lib/core.function";

export function useAttendanceLogs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEY, params],
    queryFn: () => getAttendanceLogs({ params }),
    refetchOnWindowFocus: false,
  });
}

export function useCreateAttendanceLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttendanceLogRequest) => storeAttendanceLog(data),
    onSuccess: (response) => {
      successToast(response?.message || "Marcación registrada correctamente");
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
    },
    onError: (error: any) => {
      errorToast(
        error?.response?.data?.message || "Error al registrar la marcación",
      );
    },
  });
}
