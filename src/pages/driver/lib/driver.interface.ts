import type { ModelComplete } from "@/lib/core.interface";
import { Truck } from "lucide-react";

const ROUTE = "/logistica/conductores";
const NAME = "Conductor";

export const DRIVER: ModelComplete<any> = {
  MODEL: {
    name: NAME,
    description: "Gestión de conductores del sistema.",
    plural: "Conductores",
    gender: false,
  },
  ICON: "Truck",
  ICON_REACT: Truck,
  ENDPOINT: "/person",
  QUERY_KEY: "drivers",
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
  EMPTY: {},
};

export const DRIVER_ROLE_CODE = "Conductor";
export const DRIVER_ROLE_ID = 7;
