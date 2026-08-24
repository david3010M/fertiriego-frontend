import { BrainCircuit } from "lucide-react";

export const PREDICTIVE_ROUTE = "/inventario/predictivo";
export const PREDICTIVE_CONFIG_ROUTE = "/inventario/predictivo/configuracion";
export const PREDICTIVE_METRICS_ROUTE = "/inventario/predictivo/metricas";
export const PREDICTIVE_ENDPOINT = "/predictive";

export const PREDICTIVE_META = {
  MODEL: {
    name: "Motor Predictivo",
    description: "Alertas de abastecimiento y motor predictivo de reposición.",
    plural: "Alertas Predictivas",
    gender: true,
  },
  ICON: "BrainCircuit" as const,
  ICON_REACT: BrainCircuit,
  ROUTE: PREDICTIVE_ROUTE,
};

export type UrgencyLevel = "CRITICO" | "ADVERTENCIA" | "NORMAL";

export interface PredictiveAlert {
  product: {
    id: number;
    name: string;
  };
  current_stock: number;
  incoming_stock: number;
  sales_velocity_daily: number;
  sales_velocity_window_days: number;
  lead_time_days: number;
  safety_stock_units: number;
  days_of_inventory_remaining: number;
  reorder_point: number;
  suggested_purchase_qty: number;
  urgency: UrgencyLevel;
  preferred_supplier?: {
    id: number;
    name: string;
  } | null;
}

export interface AlertsResponse {
  message: string;
  data: PredictiveAlert[];
  total: number;
}

export interface AlertsFilters {
  product_id?: number | string | null;
  supplier_id?: number | string | null;
  urgency?: string | null;
  warehouse_id?: number | string | null;
}

// Replenishment
export interface ReplenishmentProduct {
  id: number;
  name: string;
  product_type: string;
  category: string;
  brand: string;
}

export interface ReplenishmentDetail {
  product: ReplenishmentProduct;
  current_stock: number;
  incoming_stock: number;
  sales_velocity_daily: number;
  sales_velocity_window_days: number;
  lead_time_days: number;
  safety_stock_days: number;
  safety_stock_units: number;
  days_of_inventory_remaining: number;
  reorder_point: number;
  suggested_purchase_qty: number;
  urgency: UrgencyLevel;
}

export interface ReplenishmentSummary {
  total_evaluados: number;
  criticos: number;
  advertencia: number;
  normal: number;
  sin_datos: number;
}

export interface ReplenishmentResponse {
  message: string;
  data: {
    summary: ReplenishmentSummary;
    details: ReplenishmentDetail[];
  };
}

export interface ReplenishmentRequest {
  product_id?: number | null;
  warehouse_id?: number | null;
}

// Metrics
export interface MetricsData {
  product: ReplenishmentProduct;
  current_stock: number;
  incoming_stock: number;
  sales_velocity_daily: number;
  sales_velocity_window_days: number;
  lead_time_days: number;
  safety_stock_days: number;
  safety_stock_units: number;
  days_of_inventory_remaining: number;
  reorder_point: number;
  suggested_purchase_qty: number;
  urgency: UrgencyLevel;
}

export interface MetricsResponse {
  message: string;
  data: MetricsData;
}

// Configuration
export interface PredictiveConfigRequest {
  product_id?: number | null;
  safety_stock_days: number;
  sales_velocity_window_days: number;
  critical_stock_days: number;
  warning_stock_days: number;
  alerts_enabled?: boolean | null;
}

export interface PredictiveConfigData {
  id: number;
  product_id: number | null;
  scope: "GLOBAL" | "PRODUCTO";
  safety_stock_days: number;
  sales_velocity_window_days: number;
  critical_stock_days: number;
  warning_stock_days: number;
  alerts_enabled: boolean;
  updated_at: string;
}

export interface PredictiveConfigResponse {
  message: string;
  data: PredictiveConfigData;
}
