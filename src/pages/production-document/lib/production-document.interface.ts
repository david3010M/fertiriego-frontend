// ============================================
// PRODUCTION DOCUMENT - Interfaces, Types & Routes
// ============================================

import type { ModelComplete } from "@/lib/core.interface";
import type { Links, Meta } from "@/lib/pagination.interface";
import { Factory } from "lucide-react";

// ===== API RESOURCES =====

export type ProductionDocumentStatus = "BORRADOR" | "PROCESADO" | "CANCELADO";

export interface ProductionDocumentComponentResource {
  id: number;
  production_document_id: number;
  component_id: number;
  component_name: string;
  component_code?: string;
  component_weight: number;
  quantity_required: number;
  quantity_used: number;
  quantity_required_formatted: string;
  quantity_used_formatted: string;
  quantity_required_kg: number;
  quantity_used_kg: number;
  unit_cost: number;
  total_cost: number;
  total_cost_formatted: string;
  waste_quantity: number;
  waste_percentage: number;
  has_waste: boolean;
  notes: string;
  component: {
    id: number;
    name: string;
    codigo?: string;
    weight: number;
    unit: string;
    category: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductionDocumentResource {
  id: number;
  company_id: number;
  production_order_id?: number | null;
  warehouse_origin_id: number;
  warehouse_dest_id: number;
  product_id: number;
  user_id: number;
  responsible_id: number;
  warehouse_origin_name: string;
  warehouse_dest_name: string;
  product_name: string;
  product_code?: string;
  user_name: string;
  responsible_name: string;
  document_number: string;
  production_date: string;
  production_date_formatted: string;
  quantity_produced: number;
  total_component_cost: number;
  labor_cost: number;
  overhead_cost: number;
  total_production_cost: number;
  unit_production_cost: number;
  status: ProductionDocumentStatus;
  status_badge: string;
  observations?: string;
  total_components: number;
  total_waste: number;
  warehouse_origin: {
    id: number;
    name: string;
    address: string;
  };
  warehouse_dest: {
    id: number;
    name: string;
    address: string;
  };
  product: {
    id: number;
    name: string;
    codigo?: string;
    weight: number;
    unit: string;
  };
  user: {
    id: number;
    name: string;
    email?: string;
  };
  responsible: {
    id: number;
    full_name: string;
    document_number?: string;
  };
  details: ProductionDocumentComponentResource[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ProductionDocumentResourceById {
  data: ProductionDocumentResource;
}

// ===== API RESPONSES =====

export interface ProductionDocumentResponse {
  data: ProductionDocumentResource[];
  meta: Meta;
  links: Links;
}

// ===== CREATE/UPDATE REQUESTS =====

export interface CreateProductionDocumentComponentRequest {
  component_id: number;
  quantity_required: number;
  quantity_used: number;
  unit_cost: number;
  notes?: string;
}

export interface CreateProductionDocumentRequest {
  warehouse_origin_id: number;
  warehouse_dest_id: number;
  production_order_id?: number | null;
  product_id: number;
  user_id: number;
  responsible_id: number;
  production_date: string;
  quantity_produced: number;
  labor_cost: number;
  overhead_cost: number;
  observations?: string;
  components: CreateProductionDocumentComponentRequest[];
}

// ===== CREATE BATCH (varios documentos desde una orden de producción) =====
// ✅ Endpoint confirmado por backend: POST /productiondocument/batch. Genera
// un documento de producción independiente por cada ítem enviado, todos
// compartiendo almacén origen/destino y fecha de producción. Cada ítem se
// referencia por "production_order_item_id" (el id del ítem de la orden, NO
// el product_id), que es lo que permite al backend descontar el pendiente de
// ese ítem puntual aunque la orden tenga varios productos.
export interface CreateProductionDocumentBatchItemRequest {
  production_order_item_id: number;
  quantity_produced: number;
  responsible_id?: number | null;
  labor_cost?: number | null;
  overhead_cost?: number | null;
  observations?: string | null;
  // ⚠️ Opcional: solo se envía si se quiere sobrescribir el BOM del ítem.
  // Si se omite, el backend usa los componentes ya definidos en la orden.
  components?: CreateProductionDocumentComponentRequest[] | null;
}

export interface CreateProductionDocumentBatchRequest {
  warehouse_origin_id: number;
  warehouse_dest_id: number;
  production_date?: string | null;
  items: CreateProductionDocumentBatchItemRequest[];
}

export interface ProductionDocumentBatchResponse {
  message?: string;
  data: ProductionDocumentResource[];
}

export interface UpdateProductionDocumentRequest {
  warehouse_origin_id?: number;
  warehouse_dest_id?: number;
  product_id?: number;
  user_id?: number;
  responsible_id?: number;
  production_date?: string;
  quantity_produced?: number;
  labor_cost?: number;
  overhead_cost?: number;
  observations?: string;
  components?: CreateProductionDocumentComponentRequest[];
}

// ===== API QUERY PARAMS =====

export interface GetProductionDocumentsParams {
  page?: number;
  per_page?: number;
  created_at?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  document_number?: string | null;
  product_id?: number | null;
  production_date?: string | null;
  responsible_id?: number | null;
  status?: string | null;
  user_id?: number | null;
  warehouse_dest_id?: number | null;
  warehouse_origin_id?: number | null;
}

// ===== CONSTANTS =====

export const PRODUCTION_DOCUMENT_ENDPOINT = "/productiondocument";
export const PRODUCTION_DOCUMENT_BATCH_ENDPOINT = "/productiondocument/batch";
export const PRODUCTION_DOCUMENT_QUERY_KEY = "production-documents";

// ===== ROUTES =====

export const ProductionDocumentRoute = "/produccion/documentos-produccion";
export const ProductionDocumentAddRoute = "/produccion/documentos-produccion/agregar";
export const ProductionDocumentEditRoute = "/produccion/documentos-produccion/actualizar/:id";
export const ProductionDocumentDetailRoute = "/produccion/documentos-produccion/:id";

// ===== STATUS OPTIONS =====

export const PRODUCTION_DOCUMENT_STATUSES = [
  { value: "BORRADOR", label: "Borrador" },
  { value: "PROCESADO", label: "Procesado" },
  { value: "CANCELADO", label: "Cancelado" },
] as const;

// ===== MODEL COMPLETE =====
import type { ProductionDocumentSchema } from "./production-document.schema";

const NAME = "Documento de Producción";

export const PRODUCTION_DOCUMENT: ModelComplete<ProductionDocumentSchema> = {
  MODEL: {
    name: NAME,
    description: "Gestión de documentos de producción del sistema.",
    plural: "Documentos de Producción",
    gender: false,
  },
  ICON: "Factory",
  ICON_REACT: Factory,
  ENDPOINT: PRODUCTION_DOCUMENT_ENDPOINT,
  QUERY_KEY: PRODUCTION_DOCUMENT_QUERY_KEY,
  ROUTE: ProductionDocumentRoute,
  ROUTE_ADD: ProductionDocumentAddRoute,
  ROUTE_UPDATE: ProductionDocumentEditRoute,
  TITLES: {
    create: {
      title: `Crear ${NAME}`,
      subtitle: `Complete los campos para crear un nuevo ${NAME.toLowerCase()}`,
    },
    update: {
      title: `Actualizar ${NAME}`,
      subtitle: `Actualice los campos para modificar el ${NAME.toLowerCase()}`,
    },
    delete: {
      title: `Eliminar ${NAME}`,
      subtitle: `Confirme para eliminar el ${NAME.toLowerCase()}`,
    },
  },
  EMPTY: {} as any,
};
