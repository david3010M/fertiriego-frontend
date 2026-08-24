import { Monitor } from "lucide-react";

export const DASHBOARD_MONITORING_ROUTE = "/inventario/dashboard-monitoreo";
export const DASHBOARD_ENDPOINT = "/dashboard";

export const DASHBOARD_META = {
  MODEL: {
    name: "Monitoreo de Inventario",
    description: "Indicadores y resúmenes para la toma de decisiones.",
    plural: "Monitoreo",
  },
  ICON: "Monitor" as const,
  ICON_REACT: Monitor,
  ROUTE: DASHBOARD_MONITORING_ROUTE,
};

export type DashboardUrgency =
  | "CRITICO"
  | "ADVERTENCIA"
  | "critico"
  | "advertencia";

export interface DashboardFilters {
  limit?: number | null;
  urgency?: DashboardUrgency | null;
  warehouse_id?: number | null;
}

export interface DashboardSummary {
  products_out_of_stock: number;
  products_critical: number;
  products_at_risk: number;
  pending_purchase_orders: number;
  estimated_investment_required: number;
  total_products_evaluated: number;
  calculated_at: string;
}

export interface DashboardSummaryResponse {
  message: string;
  data: DashboardSummary;
}

export interface DashboardSuggestionSupplier {
  id: number;
  name: string;
}

export interface DashboardSuggestion {
  product_id: number;
  product_name: string;
  urgency: string;
  current_stock: number;
  incoming_stock: number;
  days_of_inventory_remaining: number;
  suggested_purchase_qty: number;
  unit_price_estimated: number;
  estimated_cost: number;
  preferred_supplier: DashboardSuggestionSupplier | null;
}

export interface DashboardSuggestionsResponse {
  message: string;
  data: DashboardSuggestion[];
  total: number;
}

export interface InventoryDistributionItem {
  status: string;
  count: number;
  percentage: number;
}

export interface InventoryStatus {
  total_products: number;
  distribution: InventoryDistributionItem[];
  over_stock_products: number;
  over_stock_percentage: number;
  calculated_at: string;
}

export interface InventoryStatusResponse {
  message: string;
  data: InventoryStatus;
}
