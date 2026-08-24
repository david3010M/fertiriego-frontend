import type { ModelComplete } from "@/lib/core.interface";
import type { Links, Meta } from "@/lib/pagination.interface";
import { FileText } from "lucide-react";
import type { WarehouseDocumentSchema } from "./warehouse-document.schema";

const ROUTE = "/inventario/documentos-almacen";
const NAME = "Documento de Almacén";

export const WAREHOUSE_DOCUMENT: ModelComplete<WarehouseDocumentSchema> = {
  MODEL: {
    name: NAME,
    description: "Gestión de documentos de entrada y salida de almacén.",
    plural: "Documentos de Almacén",
    gender: false,
  },
  ICON: "FileText",
  ICON_REACT: FileText,
  ENDPOINT: "/warehousedocument",
  QUERY_KEY: "warehouse-documents",
  ROUTE,
  ROUTE_ADD: `${ROUTE}/agregar`,
  ROUTE_UPDATE: `${ROUTE}/actualizar`,
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
  EMPTY: {
    warehouse_id: "",
    document_type: "",
    destination_warehouse_id: "",
    document_number: "",
    person_id: "",
    document_date: "",
    currency: "",
    observations: "",
    details: [],
  },
};

// Document Types
export type DocumentType =
  | "ENTRADA_DEVOLUCION"
  | "ENTRADA_AJUSTE"
  | "ENTRADA_TRANSFERENCIA"
  | "ENTRADA_DONACION"
  | "SALIDA_DEVOLUCION"
  | "SALIDA_AJUSTE"
  | "SALIDA_TRANSFERENCIA"
  | "SALIDA_MERMA"
  | "SALIDA_DONACION"
  | "SALIDA_USO_INTERNO";

export type DocumentStatus = "BORRADOR" | "CONFIRMADO" | "CANCELADO";

// Warehouse Document Detail
export interface WarehouseDocumentDetail {
  id: number;
  warehouse_document_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  observations: string;
}

// Warehouse Document Resource
export interface WarehouseDocumentResource {
  id: number;
  correlativo: string;
  warehouse_id: number;
  warehouse_name: string;
  document_type: DocumentType;
  document_number: string;
  destination_warehouse_id: number | null;
  destination_warehouse_name: string | null;
  person_id: number;
  person_fullname: string;
  user_id: number;
  user_name: string;
  document_date: string;
  posting_date: null;
  status: DocumentStatus;
  currency: string;
  observations: string;
  details: WarehouseDocumentDetail[];
  created_at: string;
}

// API Responses
export interface WarehouseDocumentResponse {
  data: WarehouseDocumentResource[];
  links: Links;
  meta: Meta;
}

export interface WarehouseDocumentResourceById {
  data: WarehouseDocumentResource;
}

// Request Types
export const CURRENCIES = [
  { value: "PEN", label: "S/. Soles" },
  { value: "USD", label: "$ Dólares" },
  { value: "EUR", label: "€ Euros" },
] as const;

export interface CreateWarehouseDocumentRequest {
  warehouse_id: number;
  document_type: DocumentType;
  destination_warehouse_id?: number;
  document_number: string;
  person_id: number;
  document_date: string;
  currency: string;
  observations?: string;
  details: {
    product_id: number;
    quantity: number;
    unit_cost: number;
    observations?: string;
  }[];
}

export interface UpdateWarehouseDocumentRequest {
  warehouse_id?: number;
  document_type?: DocumentType;
  destination_warehouse_id?: number;
  document_number?: string;
  person_id?: number;
  document_date?: string;
  currency?: string;
  observations?: string;
  details?: {
    id?: number;
    warehouse_document_id?: number;
    product_id: number;
    quantity: number;
    unit_cost: number;
    observations?: string;
  }[];
}

export interface GetWarehouseDocumentsProps {
  params?: Record<string, unknown>;
}
