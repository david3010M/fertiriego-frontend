import { useEffect, useState } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { Plus, RefreshCw } from "lucide-react";
import TitleComponent from "@/components/TitleComponent";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import DataTablePagination from "@/components/DataTablePagination";
import { DEFAULT_PER_PAGE } from "@/lib/core.constants";
import { useAttendanceLogs } from "../lib/attendance.hook";
import { AttendanceColumns } from "./AttendanceColumns";
import AttendanceOptions from "./AttendanceOptions";
import { ATTENDANCE_META } from "../lib/attendance.interface";
import AttendanceStatusLegendDialog from "./AttendanceStatusLegendDialog";
import AttendanceManualLogModal from "./AttendanceManualLogModal";

// ============================================================================
// DOCUMENTACIÓN DE ESTADOS DE ASISTENCIA
// ============================================================================
/*
| Estado      | Cuándo se asigna
|-------------|------------------------------------------------------------------
| PRESENTE    | El trabajador marcó entrada dentro del margen de tolerancia
|             | (ej. tolerancia 10 min → llega hasta 08:10 y es PRESENTE).
|
| TARDANZA    | Marcó entrada pero superó los minutos de tolerancia configurados
|             | en el turno. Ej: turno 08:00, tolerancia 10 min, llegó 08:20 = TARDANZA.
|
| FALTA       | No existe ninguna marcación de ENTRADA para ese día.
|             | Es el estado por defecto hasta que marque.
|
| JUSTIFICADO | Existe una justificación APROBADA que cubre esa fecha
|             | (permiso, vacaciones, enfermedad). Tiene prioridad sobre todo.
|
| MEDIO_DIA   | Marcó entrada pero los minutos trabajados (entre entrada y salida)
|             | son menos de la mitad del mínimo configurado en el turno.
|             | Ej: turno con min_hours=8 → trabajó menos de 4h = MEDIO_DIA.
|             | Aplica también cuando solo hay marcación de entrada sin salida
|             | y han pasado pocas horas.
|
| DESCANSO    | Día libre, feriado o día de descanso programado.
|             | Se asigna manualmente o puede extenderse en el futuro
|             | desde un calendario de feriados.
*/

export default function AttendanceLogPage() {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    startOfMonth(new Date()),
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    endOfMonth(new Date()),
  );
  const [personId, setPersonId] = useState("");
  const [status, setStatus] = useState("");
  const [manualModalOpen, setManualModalOpen] = useState(false);

  const params = {
    page,
    per_page,
    date_from: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
    date_until: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
    person_id: personId ? Number(personId) : undefined,
    status: status || undefined,
  };

  const { data, isLoading, isFetching, refetch } = useAttendanceLogs(params);

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo, personId, status, per_page]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TitleComponent
          title={ATTENDANCE_META.MODEL.name}
          subtitle={ATTENDANCE_META.MODEL.description}
          icon={ATTENDANCE_META.ICON}
        />
        <div className="flex items-center gap-2">
          <AttendanceStatusLegendDialog />
          <Button onClick={() => setManualModalOpen(true)}>
            <Plus className="size-4 mr-2" />
            Registrar marcación
          </Button>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`size-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="border-none text-muted-foreground max-w-full">
        <DataTable
          columns={AttendanceColumns}
          data={data?.data || []}
          isLoading={isLoading}
          initialColumnVisibility={{}}
        >
          <AttendanceOptions
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateChange={(from, to) => {
              setDateFrom(from);
              setDateTo(to);
            }}
            personId={personId}
            setPersonId={setPersonId}
            status={status}
            setStatus={setStatus}
          />
        </DataTable>
      </div>

      <DataTablePagination
        page={page}
        totalPages={data?.meta?.last_page || 1}
        onPageChange={setPage}
        per_page={per_page}
        setPerPage={setPerPage}
        totalData={data?.meta?.total || 0}
      />

      <AttendanceManualLogModal
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
      />
    </div>
  );
}
