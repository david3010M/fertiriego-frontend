import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import TitleFormComponent from "@/components/TitleFormComponent";
import FormWrapper from "@/components/FormWrapper";
import { PRODUCTION_DOCUMENT } from "../lib/production-document.interface";
import type {
  CreateProductionDocumentBatchRequest,
  CreateProductionDocumentBatchItemRequest,
} from "../lib/production-document.interface";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader,
  Factory,
  ClipboardList,
  Package,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { FormSelect } from "@/components/FormSelect";
import { FormSelectAsync } from "@/components/FormSelectAsync";
import { DatePickerFormField } from "@/components/DatePickerFormField";
import { GroupFormSection } from "@/components/GroupFormSection";
import { DataTable } from "@/components/DataTable";
import { toast } from "sonner";
import type { WarehouseResource } from "@/pages/warehouse/lib/warehouse.interface";
import type { PersonResource } from "@/pages/person/lib/person.interface";
import { useWorkers } from "@/pages/worker/lib/worker.hook";
import { getAllWarehouseProducts } from "@/pages/warehouse-product/lib/warehouse-product.actions";
import {
  useProductionOrdersSearch,
  useProductionOrderById,
} from "@/pages/production-order/lib/production-order.hook";
import type {
  ProductionOrderResource,
  ProductionOrderComponentResource,
} from "@/pages/production-order/lib/production-order.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Fila de UI por cada ítem de la orden: una orden con varios productos genera
// N documentos independientes (uno por ítem marcado), todos en una sola
// request a POST /productiondocument/batch.
type BatchItemRow = {
  production_order_item_id: number;
  product_name: string;
  quantity_pending: number;
  status: string;
  selected: boolean;
  quantity_produced: string;
  labor_cost: string;
  overhead_cost: string;
  observations: string;
  components: ProductionOrderComponentResource[];
};

type GlobalFormValues = {
  production_order_id: string;
  warehouse_origin_id: string;
  warehouse_dest_id: string;
  production_date: string;
  responsible_id: string;
};

interface ProductionDocumentBatchFormProps {
  warehouses: WarehouseResource[];
  fromOrderId?: number;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateProductionDocumentBatchRequest,
  ) => Promise<void> | void;
}

const componentColumns: ColumnDef<ProductionOrderComponentResource>[] = [
  {
    accessorKey: "component",
    header: "Componente",
    cell: ({ row }) => <span>{row.original.component.name}</span>,
  },
  {
    accessorKey: "quantity_required",
    header: "Cant. Requerida",
    cell: ({ row }) => <span>{row.original.quantity_required}</span>,
  },
  {
    accessorKey: "unit_cost",
    header: "Costo Unit.",
    cell: ({ row }) => <span>S/ {row.original.unit_cost.toFixed(2)}</span>,
  },
];

export function ProductionDocumentBatchForm({
  warehouses,
  fromOrderId,
  isSubmitting = false,
  onSubmit,
}: ProductionDocumentBatchFormProps) {
  const { ROUTE, MODEL, ICON } = PRODUCTION_DOCUMENT;
  const navigate = useNavigate();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const form = useForm<GlobalFormValues>({
    defaultValues: {
      production_order_id: fromOrderId ? fromOrderId.toString() : "",
      warehouse_origin_id: "",
      warehouse_dest_id: "",
      production_date: todayStr,
      responsible_id: "",
    },
  });

  const productionOrderId = form.watch("production_order_id");

  const { data: order, isLoading: loadingOrder } = useProductionOrderById(
    Number(productionOrderId) || 0,
  );

  const [items, setItems] = useState<BatchItemRow[]>([]);

  // Al cargar (o cambiar de) orden, se reconstruyen las filas de ítems y se
  // rellenan los campos generales con los valores por defecto de la orden.
  useEffect(() => {
    if (!order) {
      setItems([]);
      return;
    }
    form.setValue("warehouse_origin_id", order.warehouse_origin_id.toString());
    form.setValue("warehouse_dest_id", order.warehouse_dest_id.toString());
    form.setValue("responsible_id", order.responsible_id.toString());
    setItems(
      order.items.map((item) => ({
        production_order_item_id: item.id,
        product_name: item.product.name,
        quantity_pending: item.quantity_pending,
        status: item.status,
        selected: item.quantity_pending > 0,
        quantity_produced:
          item.quantity_pending > 0 ? item.quantity_pending.toString() : "0",
        labor_cost: item.labor_cost.toString(),
        overhead_cost: item.overhead_cost.toString(),
        observations: "",
        components: item.components || [],
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const updateItem = (index: number, patch: Partial<BatchItemRow>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  };

  type StockCheckResult = {
    component_name: string;
    component_id: number;
    quantity_needed: number;
    stock_available: number;
    sufficient: boolean;
  };
  const [stockResults, setStockResults] = useState<StockCheckResult[]>([]);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<CreateProductionDocumentBatchRequest | null>(null);
  const [checkingStock, setCheckingStock] = useState(false);

  const buildPayload = (
    values: GlobalFormValues,
  ): CreateProductionDocumentBatchRequest | null => {
    const selectedItems = items.filter((it) => it.selected);
    if (selectedItems.length === 0) {
      toast.error("Debe seleccionar al menos un producto a producir");
      return null;
    }
    for (const it of selectedItems) {
      const qty = Number(it.quantity_produced);
      if (!qty || qty <= 0) {
        toast.error(
          `La cantidad producida de "${it.product_name}" debe ser mayor a 0`,
        );
        return null;
      }
      if (qty > it.quantity_pending) {
        toast.error(
          `La cantidad producida de "${it.product_name}" no puede superar lo pendiente (${it.quantity_pending})`,
        );
        return null;
      }
    }

    const batchItems: CreateProductionDocumentBatchItemRequest[] =
      selectedItems.map((it) => ({
        production_order_item_id: it.production_order_item_id,
        quantity_produced: Number(it.quantity_produced),
        responsible_id: values.responsible_id
          ? Number(values.responsible_id)
          : undefined,
        labor_cost: Number(it.labor_cost) || 0,
        overhead_cost: Number(it.overhead_cost) || 0,
        observations: it.observations || undefined,
      }));

    return {
      warehouse_origin_id: Number(values.warehouse_origin_id),
      warehouse_dest_id: Number(values.warehouse_dest_id),
      production_date: values.production_date,
      items: batchItems,
    };
  };

  const handleFormSubmit = form.handleSubmit(async (values) => {
    if (!values.production_order_id) {
      toast.error("Debe seleccionar una orden de producción");
      return;
    }
    const payload = buildPayload(values);
    if (!payload) return;

    // Verificación de stock: se agregan las cantidades requeridas por
    // componente entre todos los ítems seleccionados (mismo almacén origen).
    setCheckingStock(true);
    try {
      const neededByComponent = new Map<
        number,
        { name: string; quantity: number }
      >();
      for (const it of items.filter((i) => i.selected)) {
        for (const c of it.components) {
          const prev = neededByComponent.get(c.component_id);
          neededByComponent.set(c.component_id, {
            name: c.component.name,
            quantity: (prev?.quantity ?? 0) + c.quantity_required,
          });
        }
      }
      const results = await Promise.all(
        Array.from(neededByComponent.entries()).map(
          async ([componentId, { name, quantity }]) => {
            const stockData = await getAllWarehouseProducts({
              warehouse_id: Number(values.warehouse_origin_id),
              product_id: componentId,
            });
            const available =
              stockData.find((s) => s.product_id === componentId)?.stock ?? 0;
            return {
              component_name: name,
              component_id: componentId,
              quantity_needed: quantity,
              stock_available: available,
              sufficient: available >= quantity,
            };
          },
        ),
      );
      setStockResults(results);
      setPendingPayload(payload);
      setShowStockDialog(true);
    } catch {
      onSubmit(payload);
    } finally {
      setCheckingStock(false);
    }
  });

  const itemsForOrder = !!order;
  const noPendingItems =
    itemsForOrder && items.every((it) => it.quantity_pending <= 0);

  return (
    <FormWrapper>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <TitleFormComponent
            title={MODEL.name}
            mode="create"
            icon={ICON}
            backRoute={ROUTE}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {fromOrderId ? (
            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              <ClipboardList className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                Generando documentos desde la Orden de Producción #{fromOrderId}
              </span>
            </div>
          ) : (
            <FormSelectAsync
              control={form.control}
              name="production_order_id"
              label="Orden de Producción"
              placeholder="Seleccione una orden aprobada..."
              useQueryHook={useProductionOrdersSearch}
              mapOptionFn={(o: ProductionOrderResource) => ({
                value: o.id.toString(),
                label: o.order_number,
                description: `Cant: ${o.total_requested} · ${o.requested_date}`,
              })}
              withValue
            />
          )}

          {loadingOrder && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader className="h-4 w-4 animate-spin" />
              Cargando datos de la orden...
            </div>
          )}

          {noPendingItems && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              Esta orden no tiene productos con cantidad pendiente por producir.
            </div>
          )}

          {order && (
            <>
              {/* Información General */}
              <GroupFormSection
                icon={Factory}
                title="Información General"
                cols={{ sm: 1, md: 2, lg: 4 }}
              >
                <FormSelect
                  control={form.control}
                  name="warehouse_origin_id"
                  label="Almacén Origen"
                  placeholder="Seleccione almacén de origen"
                  options={warehouses.map((w) => ({
                    value: w.id.toString(),
                    label: w.name,
                    description: w.address,
                  }))}
                  withValue
                />

                <FormSelect
                  control={form.control}
                  name="warehouse_dest_id"
                  label="Almacén Destino"
                  placeholder="Seleccione almacén de destino"
                  options={warehouses.map((w) => ({
                    value: w.id.toString(),
                    label: w.name,
                    description: w.address,
                  }))}
                  withValue
                />

                <FormSelectAsync
                  control={form.control}
                  name="responsible_id"
                  label="Responsable"
                  placeholder="Seleccione responsable"
                  useQueryHook={useWorkers}
                  mapOptionFn={(w: PersonResource) => ({
                    value: w.id.toString(),
                    label:
                      w.business_name ||
                      `${w.names} ${w.father_surname} ${w.mother_surname}`,
                    description: w.number_document,
                  })}
                  withValue
                />

                <DatePickerFormField
                  control={form.control}
                  name="production_date"
                  label="Fecha de Producción"
                  placeholder="Seleccione fecha"
                  disabledRange={{ after: today }}
                />
              </GroupFormSection>

              {/* Productos a producir */}
              <GroupFormSection
                icon={Package}
                title="Productos a Producir"
                cols={{ sm: 1 }}
              >
                <div className="space-y-3 w-full">
                  {items.map((item, index) => {
                    const isDone = item.quantity_pending <= 0;
                    return (
                      <div
                        key={item.production_order_item_id}
                        className={`rounded-xl border bg-card shadow-sm overflow-hidden ${
                          !item.selected ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 px-3 py-2 bg-muted/40 border-b">
                          <Checkbox
                            checked={item.selected}
                            disabled={isDone}
                            onCheckedChange={(checked) =>
                              updateItem(index, { selected: checked === true })
                            }
                          />
                          <span className="text-sm font-semibold flex-1">
                            {item.product_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Pendiente: <strong>{item.quantity_pending}</strong>
                          </span>
                          {isDone && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              Completado
                            </span>
                          )}
                        </div>

                        {item.selected && !isDone && (
                          <div className="p-3 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div>
                                <label className="text-sm font-medium">
                                  Cant. a Producir
                                </label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  max={item.quantity_pending}
                                  value={item.quantity_produced}
                                  onChange={(e) =>
                                    updateItem(index, {
                                      quantity_produced: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Costo Laboral (S/)
                                </label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={item.labor_cost}
                                  onChange={(e) =>
                                    updateItem(index, {
                                      labor_cost: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Costo Indirecto (S/)
                                </label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={item.overhead_cost}
                                  onChange={(e) =>
                                    updateItem(index, {
                                      overhead_cost: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Observaciones
                                </label>
                                <Input
                                  value={item.observations}
                                  onChange={(e) =>
                                    updateItem(index, {
                                      observations: e.target.value,
                                    })
                                  }
                                  placeholder="Opcional"
                                />
                              </div>
                            </div>

                            {item.components.length > 0 && (
                              <DataTable
                                columns={componentColumns}
                                data={item.components}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </GroupFormSection>
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTE)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || checkingStock || !order}
            >
              {isSubmitting || checkingStock ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Generar Documentos"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showStockDialog} onOpenChange={setShowStockDialog}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {stockResults.every((r) => r.sufficient) ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              Verificación de Stock
            </AlertDialogTitle>
            <AlertDialogDescription>
              {stockResults.every((r) => r.sufficient)
                ? "Todos los componentes tienen stock suficiente en el almacén origen."
                : "Algunos componentes no tienen stock suficiente. Puede guardar de todas formas o cancelar para ajustar las cantidades."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 my-1 max-h-64 overflow-y-auto">
            {stockResults.map((r, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-2 rounded-md text-sm ${
                  r.sufficient
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {r.sufficient ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
                  )}
                  <span className="font-medium truncate">
                    {r.component_name}
                  </span>
                </div>
                <div className="text-right text-xs flex-shrink-0 ml-3 space-y-0.5">
                  <div>
                    Necesario:{" "}
                    <span className="font-semibold">{r.quantity_needed}</span>
                  </div>
                  <div>
                    Disponible:{" "}
                    <span className="font-semibold">{r.stock_available}</span>
                  </div>
                  {!r.sufficient && (
                    <div className="font-bold text-red-700">
                      Falta:{" "}
                      {(r.quantity_needed - r.stock_available).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingPayload) onSubmit(pendingPayload);
                setShowStockDialog(false);
              }}
            >
              Confirmar y Guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormWrapper>
  );
}
