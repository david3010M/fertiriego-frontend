import type { ModelComplete } from "@/lib/core.interface";
import type { Links, Meta } from "@/lib/pagination.interface";
import { Truck } from "lucide-react";

const ROUTE = "/logistica/vehiculos";
const NAME = "Vehículo";

export const VEHICLE: ModelComplete<VehicleResource> = {
  MODEL: {
    name: NAME,
    description: "Gestión de vehículos.",
    plural: "Vehículos",
    gender: false,
  },
  ICON: "Truck",
  ICON_REACT: Truck,
  ENDPOINT: "/vehicles",
  QUERY_KEY: "vehicles",
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
    plate: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    vehicle_type: "",
    max_weight: "",
    mtc: "",
    status: "Activo",
    observations: "",
    owner: {
      id: 0,
      full_name: "",
      document_number: null,
    },
    created_at: "",
  },
};

export interface VehicleResponse {
  data: VehicleResource[];
  links: Links;
  meta: Meta;
}

export interface VehicleResource {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vehicle_type: string;
  max_weight: string;
  mtc: string;
  status: string;
  observations: string;
  owner: {
    id: number;
    full_name: string;
    document_number: string | null;
  };
  created_at: string;
}

export interface VehicleResourceById {
  data: VehicleResource;
}

export interface getVehicleProps {
  params?: Record<string, any>;
}
