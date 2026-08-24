import { BarChart3 } from "lucide-react";

export const VACATION_REPORT_SCHEDULED_ENDPOINT = "/vacations/reports/scheduled";
export const VACATION_REPORT_BALANCE_ENDPOINT = "/vacations/reports/balance";
export const VACATION_REPORT_REQUESTS_ENDPOINT = "/vacations/reports/requests";

export const VACATION_REPORT_ROUTE = "/vacaciones/reporte";

export const VACATION_REPORT_META = {
  MODEL: {
    name: "Reporte de Vacaciones",
    description:
      "Vacaciones programadas, balance de días y solicitudes por estado.",
    plural: "Reportes de Vacaciones",
    gender: true,
  },
  ICON: "BarChart3" as const,
  ICON_REACT: BarChart3,
  ROUTE: VACATION_REPORT_ROUTE,
};

export interface VacationReportParams {
  date_from?: string;
  date_until?: string;
  person_id?: number;
  status?: string;
}

export interface ScheduledVacationItem {
  request_id: number;
  worker_id: number;
  worker_name: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  period_year: number;
}

export interface ScheduledVacationReportResponse {
  message: string;
  data: {
    period: { from: string | null; until: string | null };
    total: number;
    data: ScheduledVacationItem[];
  };
}

export interface VacationBalanceItem {
  worker: { id: number; full_name: string };
  total_entitled: number;
  total_used: number;
  total_pending: number;
}

export interface VacationBalanceReportResponse {
  message: string;
  data: VacationBalanceItem[];
  total: number;
}

export type VacationRequestReportStatus =
  | "PENDIENTE"
  | "APROBADO"
  | "RECHAZADO"
  | "CANCELADO";

export interface VacationRequestReportItem {
  id: number;
  worker: { id: number; full_name: string };
  period_year: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string | null;
  status: VacationRequestReportStatus;
  requested_by: string;
  reviewed_by: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface VacationRequestsReportResponse {
  message: string;
  data: {
    totals: Record<VacationRequestReportStatus, number>;
    total: number;
    data: VacationRequestReportItem[];
  };
}
