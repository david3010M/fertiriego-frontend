import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseDocumentForm from "./WarehouseDocumentForm";
import { WAREHOUSE_DOCUMENT } from "../lib/warehouse-document.interface";
import type { WarehouseDocumentSchema } from "../lib/warehouse-document.schema";
import { storeWarehouseDocument } from "../lib/warehouse-document.actions";
import { useAllWarehouses } from "@/pages/warehouse/lib/warehouse.hook";
import { successToast, errorToast } from "@/lib/core.function";
import TitleFormComponent from "@/components/TitleFormComponent";
import FormWrapper from "@/components/FormWrapper";

const { ICON, EMPTY, TITLES, ROUTE } = WAREHOUSE_DOCUMENT;

export default function WarehouseDocumentAddPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: warehouses } = useAllWarehouses();

  // Calcular valores por defecto dinámicamente
  const defaultValues = useMemo(() => {
    // Fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Si solo hay un almacén, seleccionarlo automáticamente
    const defaultWarehouse =
      warehouses && warehouses.length === 1 ? warehouses[0].id.toString() : "";

    return {
      ...EMPTY,
      warehouse_id: defaultWarehouse,
      document_date: today,
    };
  }, [warehouses]);

  const handleSubmit = async (data: WarehouseDocumentSchema) => {
    setIsSubmitting(true);
    try {
      const payload = {
        warehouse_id: parseInt(data.warehouse_id),
        document_type: data.document_type as any,
        ...(data.destination_warehouse_id && {
          destination_warehouse_id: parseInt(data.destination_warehouse_id),
        }),
        document_number: data.document_number,
        person_id: parseInt(data.person_id),
        document_date: data.document_date,
        currency: data.currency,
        observations: data.observations,
        details: data.details.map((detail) => ({
          product_id: parseInt(detail.product_id),
          quantity: detail.quantity,
          unit_cost: detail.unit_cost,
          observations: detail.observations,
        })),
      };

      await storeWarehouseDocument(payload);
      successToast("Documento creado exitosamente");
      navigate("/inventario/documentos-almacen");
    } catch (error: any) {
      const errorMessage =
        error.response.data.message ??
        error.response.data.error ??
        "Error al crear el documento";
      errorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper>
      <TitleFormComponent
        title={TITLES.create.title}
        mode="create"
        backRoute={ROUTE}
        icon={ICON}
      />

      {warehouses && (
        <WarehouseDocumentForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          isSubmitting={isSubmitting}
          mode="create"
          warehouses={warehouses}
        />
      )}
    </FormWrapper>
  );
}
