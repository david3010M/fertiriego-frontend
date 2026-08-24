import type { ModelComplete } from "@/lib/core.interface";
import type { Links, Meta } from "@/lib/pagination.interface";
import type { BranchResource } from "@/pages/branch/lib/branch.interface";
import { Warehouse } from "lucide-react";

const ROUTE = "/inventario/almacen";
const NAME = "Almacén";

export const WAREHOUSE: ModelComplete<WarehouseResource> = {
  MODEL: {
    name: NAME,
    description: "Gestión de almacenes y depósitos.",
    plural: "Almacenes",
    gender: true,
  },
  ICON: "Warehouse",
  ICON_REACT: Warehouse,
  ENDPOINT: "/warehouse",
  QUERY_KEY: "warehouses",
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
    id: 0,
    name: "",
    address: "",
    capacity: 0,
    responsible_id: 0,
    responsible_full_name: "",
    branch_id: 0,
    phone: "",
    email: "",
    created_at: "",
  },
};

export interface WarehouseResponse {
  data: WarehouseResource[];
  links: Links;
  meta: Meta;
}

export interface WarehouseResource {
  id: number;
  name: string;
  address: string;
  capacity: number;
  responsible_id: number;
  responsible_full_name: string;
  branch_id: number;
  branch?: BranchResource;
  phone: string;
  email: string;
  created_at: string;
}

export interface WarehouseResourceById {
  data: WarehouseResource;
}

export interface getWarehouseProps {
  params?: Record<string, any>;
}