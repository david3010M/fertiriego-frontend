"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { LogIn, LogOut } from "lucide-react";
import { GeneralModal } from "@/components/GeneralModal";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAllWorkers } from "@/pages/worker/lib/worker.hook";
import type { PersonResource } from "@/pages/person/lib/person.interface";
import { warningToast } from "@/lib/core.function";
import { useCreateAttendanceLog } from "../lib/attendance.hook";
import type {
  AttendanceMethod,
  AttendanceType,
} from "../lib/attendance.interface";

const METHOD_OPTIONS = [
  { value: "DIGITAL", label: "Digital" },
  { value: "BIOMETRICO", label: "Biométrico" },
  { value: "QR", label: "QR" },
];

function getPersonDisplayName(person: PersonResource) {
  return person.type_document === "RUC"
    ? person.business_name
    : `${person.names} ${person.father_surname} ${person.mother_surname}`.trim();
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AttendanceManualLogModal({ open, onClose }: Props) {
  const workers = useAllWorkers();
  const createLog = useCreateAttendanceLog();

  const [personId, setPersonId] = useState("");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(() => format(new Date(), "HH:mm"));
  const [method, setMethod] = useState<AttendanceMethod>("DIGITAL");
  const [notes, setNotes] = useState("");

  const workerOptions = useMemo(
    () =>
      (workers || []).map((p) => ({
        value: p.id.toString(),
        label: getPersonDisplayName(p),
      })),
    [workers],
  );

  const resetForm = () => {
    setPersonId("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setTime(format(new Date(), "HH:mm"));
    setMethod("DIGITAL");
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleMark = (type: AttendanceType) => {
    if (!personId) {
      warningToast("Seleccione un trabajador");
      return;
    }
    if (!date || !time) {
      warningToast("Ingrese la fecha y hora de la marcación");
      return;
    }

    createLog.mutate(
      {
        person_id: Number(personId),
        type,
        date,
        time: time.length === 5 ? `${time}:00` : time,
        method,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => handleClose(),
      },
    );
  };

  return (
    <GeneralModal
      open={open}
      onClose={handleClose}
      title="Registrar marcación manual"
      subtitle="Para trabajadores que no cuentan con el sistema de marcación."
      icon="CalendarCheck2"
      size="md"
      mode="create"
    >
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label>Trabajador</Label>
          <SearchableSelect
            options={workerOptions}
            value={personId}
            onChange={setPersonId}
            placeholder="Seleccione un trabajador"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="attendance-date">Fecha</Label>
            <Input
              id="attendance-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attendance-time">Hora</Label>
            <Input
              id="attendance-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Método</Label>
          <SearchableSelect
            options={METHOD_OPTIONS}
            value={method}
            onChange={(v) => setMethod((v || "DIGITAL") as AttendanceMethod)}
            placeholder="Método"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendance-notes">Observaciones (opcional)</Label>
          <Textarea
            id="attendance-notes"
            placeholder="Motivo del registro manual, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createLog.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => handleMark("ENTRADA")}
            disabled={createLog.isPending}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <LogIn className="size-4" />
            Marcar Entrada
          </Button>
          <Button
            type="button"
            onClick={() => handleMark("SALIDA")}
            disabled={createLog.isPending}
            className="gap-2 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <LogOut className="size-4" />
            Marcar Salida
          </Button>
        </div>
      </div>
    </GeneralModal>
  );
}
