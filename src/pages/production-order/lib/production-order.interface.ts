// ============================================
// PRODUCTION ORDER - Interfaces, Types & Routes
// ============================================

import type { ModelComplete } from "@/lib/core.interface";
import type { Links, Meta } from "@/lib/pagination.interface";
import { ClipboardList } from "lucide-react";

// ===== STATUS =====

export type ProductionOrderStatus =
  | "BORRADOR"
  | "PENDIENTE"
  | "APROBADO"
  | "RECHAZADO"
  | "PROCESADO"
  | "ANULADO";

// ===== API RESOURCES (LIST) =====
// ⚠️ Confirmado con respuesta real (GET /production-orders): el listado YA
// agrupa por ítems (varios productos por orden), a diferencia del detalle
// (show, más abajo) que todavía entrega producto/componentes planos a nivel
// de orden. El listado ya no trae product_id/quantity_requested/costos a
// nivel de orden ni production_document_id: los costos y cantidades ahora
// viven por ítem, y los totales de cantidad se agregan en total_requested/
// total_produced/total_pending.

export interface ProductionOrderListItem {
  id: number;
  production_order_id: number;
  product_id: number;
  quantity_requested: number;
  quantity_produced: number;
  quantity_pending: number;
  progress_percentage: number;
  estimated_component_cost: number;
  labor_cost: number;
  overhead_cost: number;
  estimated_total_cost: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface ProductionOrderResource {
  id: number;
  order_number: string;
  status: ProductionOrderStatus;
  status_badge: string;
  requested_date: string;
  approved_at: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  currency: string;
  observations: string | null;
  rejection_reason: string | null;
  total_requested: number;
  total_produced: number;
  total_pending: number;
  items: ProductionOrderListItem[];
  company_id: number;
  warehouse_origin_id: number;
  warehouse_dest_id: number;
  user_id: number;
  responsible_id: number;
}

// ===== API RESOURCES (DETAIL - SHOW) =====

export interface ProductionOrderComponentResource {
  id: number;
  // ⚠️ Confirmado con respuesta real: a nivel de ítem viene null (el
  // componente pertenece al ítem, no directo a la orden).
  production_order_id: number | null;
  component_id: number;
  component: {
    id: number;
    name: string;
    category_id: number;
    category_name: string;
    brand_id: number | null;
    brand_name: string | null;
    unit_id: number;
    unit_name: string;
    observations: string;
  };
  quantity_required: number;
  unit_cost: number;
  waste_quantity: number;
  waste_percentage: number;
  total_cost: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionOrderWarehouse {
  id: number;
  name: string;
  address: string;
  capacity: number;
  responsible_id: number;
  responsible_full_name: string;
  branch_id: number;
  branch_name: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface ProductionOrderProduct {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  brand_id: number | null;
  brand_name: string | null;
  unit_id: number;
  unit_name: string;
  observations: string;
}

export interface ProductionOrderUser {
  id: number;
  name: string | null;
  username: string | null;
  person_id: number | null;
  person: {
    full_name: string;
    number_document: string;
    type_document: string;
  } | null;
  rol_id: number | null;
  rol_name: string | null;
}

// ✅ Confirmado con respuesta real (GET /production-orders/{id}): el detalle
// YA agrupa por ítems igual que el listado — cada producto de la orden viene
// en "items[]" con sus propias cantidades, costos, estado y su propio BOM
// ("components"). Ya no hay un "product"/"components" plano a nivel de orden
// (eso quedó reemplazado por items[]); los totales de cantidad siguen
// agregados en total_requested/total_produced/total_pending, pero ya no hay
// un costo total agregado a nivel de orden — los costos viven por ítem
// (estimated_component_cost/labor_cost/overhead_cost/estimated_total_cost).
export interface ProductionOrderItemProduct extends ProductionOrderProduct {
  product_type_id?: number;
  product_type_name?: string;
  weight?: number | null;
}

export interface ProductionOrderDetailItem {
  id: number;
  production_order_id: number;
  product: ProductionOrderItemProduct;
  product_id: number;
  quantity_requested: number;
  quantity_produced: number;
  quantity_pending: number;
  progress_percentage: number;
  estimated_component_cost: number;
  labor_cost: number;
  overhead_cost: number;
  estimated_total_cost: number;
  status: string;
  notes: string | null;
  components: ProductionOrderComponentResource[];
  // ⚠️ Documentos de producción ya generados para este ítem (batch). Forma
  // exacta no confirmada aún con datos reales; se deja como desconocida.
  production_documents: unknown[];
  created_at: string;
}

// ⚠️ Confirmado con respuesta real: "responsible" en el detalle viene como
// la persona plana (mismo shape que un Worker/Person), no envuelta en
// {name, person: {...}} como "user"/"approved_by". No trae "full_name"
// armado: hay que componerlo en la UI con names + father_surname + mother_surname.
export interface ProductionOrderResponsiblePerson {
  id: number;
  type_document: string;
  type_person?: string;
  number_document: string;
  names: string;
  father_surname: string;
  mother_surname: string;
  gender?: string | null;
  birth_date?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  business_name?: string | null;
  commercial_name?: string | null;
  driver_license?: string | null;
  user_id?: number | null;
  created_at?: string;
  roles?: unknown[];
  hire_date?: string | null;
  vacation_days_per_year?: number | null;
}

export interface ProductionOrderDetailResource {
  id: number;
  order_number: string;
  status: ProductionOrderStatus;
  status_badge: string;
  requested_date: string;
  approved_at: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  currency: string;
  observations: string | null;
  rejection_reason: string | null;
  total_requested: number;
  total_produced: number;
  total_pending: number;
  items: ProductionOrderDetailItem[];
  company_id: number;
  warehouse_origin_id: number;
  warehouse_dest_id: number;
  user_id: number;
  responsible_id: number;
  warehouse_origin: ProductionOrderWarehouse;
  warehouse_dest: ProductionOrderWarehouse;
  user: ProductionOrderUser;
  responsible: ProductionOrderResponsiblePerson;
  approved_by: ProductionOrderUser | null;
}

// ===== API RESPONSES =====

export interface ProductionOrderResponse {
  data: ProductionOrderResource[];
  meta: Meta;
  links: Links;
}

export interface ProductionOrderResourceById {
  data: ProductionOrderDetailResource;
}

// ===== CREATE/UPDATE REQUESTS =====

export interface ProductionOrderComponentRequest {
  component_id: number;
  quantity_required: number;
  unit_cost?: number;
  // ⚠️ waste_quantity/waste_percentage NO se envían en la request: el
  // backend los calcula automáticamente, igual que overhead_cost.
  notes?: string;
}

export interface ProductionOrderItemRequest {
  product_id: number;
  quantity_requested: number;
  labor_cost?: number;
  // ⚠️ overhead_cost NO se envía en la request: es calculado por el backend,
  // no es un dato que el usuario ingrese en el formulario.
  notes?: string;
  // ✅ Componentes opcionales: si no se envían, el backend los autocompleta
  // desde el combo (BOM) definido para el producto.
  components?: ProductionOrderComponentRequest[] | null;
}

export interface CreateProductionOrderRequest {
  warehouse_origin_id: number;
  warehouse_dest_id: number;
  responsible_id: number;
  requested_date: string;
  currency?: string;
  observations?: string;
  items: ProductionOrderItemRequest[];
}

export type UpdateProductionOrderRequest = Partial<CreateProductionOrderRequest>;

// ===== API QUERY PARAMS =====

export interface GetProductionOrdersParams {
  page?: number;
  per_page?: number;
}

// ===== SUMMARY (dashboard de estados) =====

export interface ProductionOrderSummary {
  total: number;
  borrador: number;
  pendiente: number;
  aprobado: number;
  rechazado: number;
  procesado: number;
  anulado: number;
}

export interface ProductionOrderSummaryResponse {
  message: string;
  data: ProductionOrderSummary;
}

// ===== REPORTE: ÓRDENES/ÍTEMS PENDIENTES A PRODUCIR =====
// ⚠️ Confirmado con respuesta real (GET /production-orders/pending): "data"
// NO es un arreglo, es un objeto agrupado por order_id (las claves son el
// order_id como string). Cada grupo trae los datos de la orden y un arreglo
// "items" con los ítems pendientes de esa orden (cantidades como string,
// salvo quantity_pending que llega numérico).
export interface ProductionOrderPendingReportItem {
  item_id: number;
  product: string;
  quantity_requested: string;
  quantity_produced: string;
  quantity_pending: number;
  status: string;
}

export interface ProductionOrderPendingReportOrder {
  order_id: number;
  order_number: string;
  status: ProductionOrderStatus;
  requested_date: string;
  warehouse: string;
  responsible: string;
  items: ProductionOrderPendingReportItem[];
}

export interface ProductionOrderPendingResponse {
  message: string;
  data: Record<string, ProductionOrderPendingReportOrder>;
}

// Fila aplanada (una por ítem pendiente) que consume la tabla de la UI.
export interface ProductionOrderPendingItem {
  order_id: number;
  order_number: string;
  requested_date: string;
  warehouse: string;
  responsible: string;
  item_id: number;
  product_name: string;
  quantity_requested: number;
  quantity_produced: number;
  quantity_pending: number;
  status: string;
}

// El backend agrupa por orden; la tabla necesita una fila por ítem, así que
// se aplana aquí una sola vez y lo reutilizan el hook y el store.
export function flattenPendingReport(
  data: Record<string, ProductionOrderPendingReportOrder>
): ProductionOrderPendingItem[] {
  return Object.values(data).flatMap((order) =>
    order.items.map((item) => ({
      order_id: order.order_id,
      order_number: order.order_number,
      requested_date: order.requested_date,
      warehouse: order.warehouse,
      responsible: order.responsible,
      item_id: item.item_id,
      product_name: item.product,
      quantity_requested: Number(item.quantity_requested),
      quantity_produced: Number(item.quantity_produced),
      quantity_pending: item.quantity_pending,
      status: item.status,
    }))
  );
}

// ===== HISTORIAL DE PRODUCCIÓN PARCIAL POR ÍTEM =====
// ✅ Confirmado con respuesta real (GET /production-order-items/{itemId}/history):
// una fila por documento de producción generado para el ítem. Las cantidades
// llegan como string (igual que en el reporte de pendientes) y "produced_by"
// es el nombre plano del usuario, no un objeto.
export interface ProductionOrderItemHistoryEntry {
  document_number: string;
  production_date: string;
  quantity_produced: string;
  produced_by: string;
}

export interface ProductionOrderItemHistoryResponse {
  message: string;
  data: ProductionOrderItemHistoryEntry[];
}

// ===== CONSTANTS =====

export const PRODUCTION_ORDER_ENDPOINT = "/production-orders";
export const PRODUCTION_ORDER_QUERY_KEY = "production-orders";
export const PRODUCTION_ORDER_SUMMARY_ENDPOINT = "/production-orders/summary";
export const PRODUCTION_ORDER_PENDING_ENDPOINT = "/production-orders/pending";
export const PRODUCTION_ORDER_ITEM_HISTORY_ENDPOINT = (itemId: number) =>
  `/production-order-items/${itemId}/history`;

// ===== ROUTES =====

export const ProductionOrderRoute = "/produccion/ordenes-produccion";
export const ProductionOrderAddRoute = "/produccion/ordenes-produccion/agregar";
export const ProductionOrderEditRoute = "/produccion/ordenes-produccion/actualizar/:id";
export const ProductionOrderDetailRoute = "/produccion/ordenes-produccion/:id";
export const ProductionOrderPendingRoute = "/produccion/pendientes-a-producir";

// ===== STATUS OPTIONS =====

export const PRODUCTION_ORDER_STATUSES = [
  { value: "BORRADOR", label: "Borrador" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "APROBADO", label: "Aprobado" },
  { value: "RECHAZADO", label: "Rechazado" },
  { value: "PROCESADO", label: "Procesado" },
  { value: "ANULADO", label: "Anulado" },
] as const;

// ===== MODEL COMPLETE =====

import type { ProductionOrderSchema } from "./production-order.schema";

const NAME = "Orden Pedido de Producción";

export const PRODUCTION_ORDER: ModelComplete<ProductionOrderSchema> = {
  MODEL: {
    name: NAME,
    description: "Gestión de órdenes de producción del sistema.",
    plural: "Órdenes Pedido Producción",
    gender: true,
  },
  ICON: "ClipboardList",
  ICON_REACT: ClipboardList,
  ENDPOINT: PRODUCTION_ORDER_ENDPOINT,
  QUERY_KEY: PRODUCTION_ORDER_QUERY_KEY,
  ROUTE: ProductionOrderRoute,
  ROUTE_ADD: ProductionOrderAddRoute,
  ROUTE_UPDATE: ProductionOrderEditRoute,
  TITLES: {
    create: {
      title: `Crear ${NAME}`,
      subtitle: `Complete los campos para crear una nueva ${NAME.toLowerCase()}`,
    },
    update: {
      title: `Actualizar ${NAME}`,
      subtitle: `Actualice los campos para modificar la ${NAME.toLowerCase()}`,
    },
    delete: {
      title: `Eliminar ${NAME}`,
      subtitle: `Confirme para eliminar la ${NAME.toLowerCase()}`,
    },
  },
  EMPTY: {} as any,
};
