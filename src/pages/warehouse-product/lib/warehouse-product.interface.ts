import type { ModelComplete } from "@/lib/core.interface";
import type { Links, Meta } from "@/lib/pagination.interface";
import { Package } from "lucide-react";

const ROUTE = "/inventario/producto-almacen";
const NAME = "Producto de Almacén";

export const WAREHOUSE_PRODUCT: ModelComplete<WarehouseProductResource> = {
  MODEL: {
    name: NAME,
    description: "Gestión de stock de productos en almacenes.",
    plural: "Productos en Almacén",
    gender: true,
  },
  ICON: "Package",
  ICON_REACT: Package,
  ENDPOINT: "/warehouseproduct",
  QUERY_KEY: "warehouse-products",
  ROUTE,
  ROUTE_ADD: `${ROUTE}/agregar`,
  ROUTE_UPDATE: `${ROUTE}/actualizar`,
  TITLES: {
    create: {
      title: `Crear ${NAME}`,
      subtitle: `Complete los campos para asignar un producto a un almacén`,
    },
    update: {
      title: `Actualizar ${NAME}`,
      subtitle: `Actualice los campos para modificar el stock del producto`,
    },
    delete: {
      title: `Eliminar ${NAME}`,
      subtitle: `Confirme para eliminar la asignación del producto`,
    },
  },
  EMPTY: {
    id: 0,
    warehouse_id: 0,
    warehouse_name: "",
    product_id: 0,
    product_name: "",
    stock: 0,
    min_stock: null,
    max_stock: null,
    created_at: "",
  },
};

export interface WarehouseProductResponse {
  data: WarehouseProductResource[];
  links: Links;
  meta: Meta;
}

export interface WarehouseProductResource {
  id: number;
  warehouse_id: number;
  warehouse_name: string;
  product_id: number;
  product_name: string;
  stock: number;
  min_stock: number | null;
  max_stock: number | null;
  created_at: string;
}

export interface WarehouseProductResourceById {
  data: WarehouseProductResource;
}

export interface getWarehouseProductProps {
  params?: Record<string, any>;
}
