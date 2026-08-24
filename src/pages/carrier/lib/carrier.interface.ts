import type { ModelComplete } from "@/lib/core.interface";
import { Bus } from "lucide-react";

const ROUTE = "/logistica/transportistas";
const NAME = "Transportista";

export const CARRIER: ModelComplete<any> = {
  MODEL: {
    name: NAME,
    description: "Gestión de transportistas del sistema.",
    plural: "Transportistas",
    gender: false,
  },
  ICON: "Bus",
  ICON_REACT: Bus,
  ENDPOINT: "/person",
  QUERY_KEY: "carriers",
  ROUTE,
  ROUTE_ADD: `${ROUTE}/agregar`,
  ROUTE_UPDATE: `${ROUTE}/editar`,
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

export const CARRIER_ROLE_CODE = "Transportista";
export const CARRIER_ROLE_ID = 6;
