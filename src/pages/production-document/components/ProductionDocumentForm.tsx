import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import TitleFormComponent from "@/components/TitleFormComponent";
import FormWrapper from "@/components/FormWrapper";
import { PRODUCTION_DOCUMENT } from "../lib/production-document.interface";
import { productionDocumentSchema } from "../lib/production-document.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Loader,
  Factory,
  Pencil,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { FormSelect } from "@/components/FormSelect";
import { DatePickerFormField } from "@/components/DatePickerFormField";
import { GroupFormSection } from "@/components/GroupFormSection";
import { DataTable } from "@/components/DataTable";
import { toast } from "sonner";
import type { WarehouseResource } from "@/pages/warehouse/lib/warehouse.interface";
import type { ProductResource } from "@/pages/product/lib/product.interface";
import type { PersonResource } from "@/pages/person/lib/person.interface";
import { useProduct } from "@/pages/product/lib/product.hook";
import { FormSelectAsync } from "@/components/FormSelectAsync";
import { useWorkers } from "@/pages/worker/lib/worker.hook";
import { useAuthStore } from "@/pages/auth/lib/auth.store";
import { getAllWarehouseProducts } from "@/pages/warehouse-product/lib/warehouse-product.actions";
import { useWarehouseProducts } from "@/pages/warehouse-product/lib/warehouse-product.hook";
import type { WarehouseProductResource } from "@/pages/warehouse-product/lib/warehouse-product.interface";
import { useProductionOrdersSearch } from "@/pages/production-order/lib/production-order.hook";
import { findProductionOrderById } from "@/pages/production-order/lib/production-order.actions";
import type { ProductionOrderResource } from "@/pages/production-order/lib/production-order.interface";
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

export type ProductionDocumentFormValues = {
  warehouse_origin_id: string;
  warehouse_dest_id: string;
  product_id: string;
  user_id: string;
  responsible_id: string;
  production_order_id: string;
  production_date: string;
  quantity_produced: string;
  labor_cost: string;
  overhead_cost: string;
  observations?: string;
  components: {
    component_id: string;
    component_name?: string;
    quantity_required: string;
    quantity_used: string;
    unit_cost: string;
    notes?: string;
  }[];
};

interface ProductionDocumentFormProps {
  mode?: "create" | "edit";
  onSubmit: (values: ProductionDocumentFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  initialValues?: ProductionDocumentFormValues;
  warehouses: WarehouseResource[];
}

export function ProductionDocumentForm({
  mode = "create",
  onSubmit,
  isSubmitting = false,
  initialValues,
  warehouses,
}: ProductionDocumentFormProps) {
  const { ROUTE, MODEL, ICON } = PRODUCTION_DOCUMENT;
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const componentForm = useForm<{ component_id: string; user_id: string }>({
    defaultValues: { component_id: "", user_id: user?.id.toString() || "" },
  });

  const isOrderPreFilled = !!initialValues?.production_order_id;

  const defaultValues: ProductionDocumentFormValues = {
    warehouse_origin_id: "",
    warehouse_dest_id: "",
    product_id: "",
    user_id: user?.id.toString() || "",
    responsible_id: "",
    production_order_id: "",
    production_date: "",
    quantity_produced: "",
    labor_cost: "",
    overhead_cost: "",
    observations: "",
    components: [],
  };

  const mergedDefaults: ProductionDocumentFormValues = {
    ...defaultValues,
    ...(initialValues || {}),
    user_id: user?.id.toString() || initialValues?.user_id || "",
  };

  // Estado para detalles
  type ComponentRow = {
    component_id: string;
    component_name: string;
    quantity_required: number;
    quantity_used: number;
    unit_cost: number;
    notes: string;
  };

  const [components, setComponents] = useState<ComponentRow[]>([]);
  const [currentComponent, setCurrentComponent] = useState<
    Partial<ComponentRow>
  >({
    component_id: "",
    quantity_required: 0,
    quantity_used: 0,
    unit_cost: 0,
    notes: "",
  });
  const [editingComponentIndex, setEditingComponentIndex] = useState<
    number | null
  >(null);

  type StockCheckResult = {
    component_name: string;
    component_id: string;
    quantity_needed: number;
    stock_available: number;
    sufficient: boolean;
  };
  const [stockResults, setStockResults] = useState<StockCheckResult[]>([]);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<ProductionDocumentFormValues | null>(null);
  const [checkingStock, setCheckingStock] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const form = useForm<ProductionDocumentFormValues>({
    resolver: zodResolver(
      productionDocumentSchema,
    ) as Resolver<ProductionDocumentFormValues>,
    defaultValues: {
      ...mergedDefaults,
      production_date: mergedDefaults.production_date || todayStr,
    },
  });

  const warehouseOriginId = form.watch("warehouse_origin_id");

  // Cargar componentes iniciales cuando hay initialValues
  useEffect(() => {
    if (initialValues?.components && initialValues.components.length > 0) {
      const mappedComponents: ComponentRow[] = initialValues.components.map(
        (c) => ({
          component_id: c.component_id,
          component_name: c.component_name || "Componente desconocido",
          quantity_required: parseFloat(c.quantity_required) || 0,
          quantity_used: parseFloat(c.quantity_used) || 0,
          unit_cost: parseFloat(c.unit_cost) || 0,
          notes: c.notes || "",
        }),
      );
      setComponents(mappedComponents);
    }
  }, [initialValues]);

  // Agregar/Actualizar componente
  const handleAddOrUpdateComponent = () => {
    if (
      !currentComponent.component_id ||
      !currentComponent.component_name ||
      !currentComponent.quantity_required ||
      !currentComponent.quantity_used ||
      currentComponent.unit_cost === undefined
    ) {
      toast.error("Complete todos los campos del componente");
      return;
    }

    const newComponent: ComponentRow = {
      component_id: currentComponent.component_id,
      component_name: currentComponent.component_name,
      quantity_required: currentComponent.quantity_required,
      quantity_used: currentComponent.quantity_used,
      unit_cost: currentComponent.unit_cost,
      notes: currentComponent.notes || "",
    };

    if (editingComponentIndex !== null) {
      const updated = [...components];
      updated[editingComponentIndex] = newComponent;
      setComponents(updated);
      setEditingComponentIndex(null);
    } else {
      setComponents([...components, newComponent]);
    }

    componentForm.reset({ component_id: "" });
    setCurrentComponent({
      component_id: "",
      component_name: "",
      quantity_required: 0,
      quantity_used: 0,
      unit_cost: 0,
      notes: "",
    });
  };

  // Editar componente
  const handleEditComponent = (index: number) => {
    const component = components[index];
    componentForm.setValue("component_id", component.component_id);
    setCurrentComponent({
      component_id: component.component_id,
      component_name: component.component_name,
      quantity_required: component.quantity_required,
      quantity_used: component.quantity_used,
      unit_cost: component.unit_cost,
      notes: component.notes,
    });
    setEditingComponentIndex(index);
  };

  // Eliminar componente
  const handleDeleteComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  // Sincronizar components con form
  useEffect(() => {
    const formatted = components.map((c) => ({
      component_id: c.component_id,
      quantity_required: c.quantity_required.toString(),
      quantity_used: c.quantity_used.toString(),
      unit_cost: c.unit_cost.toString(),
      notes: c.notes,
    }));
    form.setValue("components", formatted);
  }, [components, form]);

  // Columnas para DataTable
  const createComponentColumns = (
    onEdit: (index: number) => void,
    onDelete: (index: number) => void,
  ): ColumnDef<ComponentRow>[] => [
    {
      accessorKey: "component_name",
      header: "Componente",
      cell: ({ row }) => <span>{row.original.component_name}</span>,
    },
    {
      accessorKey: "quantity_required",
      header: "Cantidad Requerida",
      cell: ({ row }) => <span>{row.original.quantity_required}</span>,
    },
    {
      accessorKey: "quantity_used",
      header: "Cantidad Usada",
      cell: ({ row }) => <span>{row.original.quantity_used}</span>,
    },
    {
      accessorKey: "unit_cost",
      header: "Costo Unitario",
      cell: ({ row }) => <span>S/ {row.original.unit_cost.toFixed(2)}</span>,
    },
    {
      accessorKey: "notes",
      header: "Notas",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.notes || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onEdit(row.index)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onDelete(row.index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const componentColumns = createComponentColumns(
    handleEditComponent,
    handleDeleteComponent,
  );

  // Submit con validación de stock
  const handleFormSubmit = form.handleSubmit(async (values) => {
    if (components.length === 0) {
      toast.error("Debe agregar al menos un componente");
      return;
    }

    const payload: ProductionDocumentFormValues = {
      ...values,
      components: components.map((c) => ({
        component_id: c.component_id,
        quantity_required: c.quantity_required.toString(),
        quantity_used: c.quantity_used.toString(),
        unit_cost: c.unit_cost.toString(),
        notes: c.notes,
      })),
    };

    if (values.warehouse_origin_id && components.length > 0) {
      setCheckingStock(true);
      try {
        const results = await Promise.all(
          components.map(async (c) => {
            const stockData = await getAllWarehouseProducts({
              warehouse_id: Number(values.warehouse_origin_id),
              product_id: Number(c.component_id),
            });
            const available =
              stockData.find((s) => s.product_id === Number(c.component_id))
                ?.stock ?? 0;
            return {
              component_name: c.component_name,
              component_id: c.component_id,
              quantity_needed: c.quantity_used,
              stock_available: available,
              sufficient: available >= c.quantity_used,
            };
          }),
        );
        setStockResults(results);
        setPendingPayload(payload);
        setShowStockDialog(true);
      } catch {
        onSubmit(payload);
      } finally {
        setCheckingStock(false);
      }
    } else {
      onSubmit(payload);
    }
  });

  return (
    <FormWrapper>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <TitleFormComponent
            title={MODEL.name}
            mode={mode}
            icon={ICON}
            backRoute={ROUTE}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {isOrderPreFilled ? (
            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              <ClipboardList className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                Generado desde la Orden de Producción #
                {form.watch("production_order_id")}
              </span>
            </div>
          ) : (
            <div className="space-y-2">
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
                onValueChange={async (value) => {
                  if (!value) return;
                  try {
                    const res = await findProductionOrderById(Number(value));
                    const order = res.data.data;
                    // ⚠️ La orden ahora agrupa varios productos (items[]),
                    // cada uno con su propio producto/componentes/costos —
                    // ya no hay un único producto a nivel de orden para
                    // autocompletar aquí. Solo se rellenan los datos
                    // comunes a la orden; el producto y sus componentes se
                    // completan manualmente más abajo.
                    form.setValue(
                      "warehouse_origin_id",
                      order.warehouse_origin_id.toString(),
                    );
                    form.setValue(
                      "warehouse_dest_id",
                      order.warehouse_dest_id.toString(),
                    );
                    form.setValue(
                      "responsible_id",
                      order.responsible_id.toString(),
                    );
                    toast.success("Datos de la orden cargados correctamente");
                  } catch {
                    toast.error("Error al cargar los datos de la orden");
                  }
                }}
                withValue
              />
              {form.watch("production_order_id") && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-sm">
                  <ClipboardList className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">
                    Orden #{form.watch("production_order_id")} seleccionada ·
                    Campos rellenados automáticamente
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Información General */}
          <GroupFormSection
            icon={Factory}
            title="Información General"
            cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
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
              name="product_id"
              label="Producto"
              placeholder="Seleccione producto"
              useQueryHook={useProduct}
              mapOptionFn={(p: ProductResource) => ({
                value: p.id.toString(),
                label: p.name,
                description: p.unit_name,
              })}
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

            <FormField
              control={form.control}
              name="quantity_produced"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad Producida</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="labor_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo Laboral (S/)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overhead_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo Indirecto (S/)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-full">
              {/* Observaciones */}
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Notas adicionales"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </GroupFormSection>

          {/* Componentes */}
          <GroupFormSection icon={Factory} title="Componentes" cols={{ sm: 1 }}>
            <div className="space-y-4">
              {/* Formulario inline */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end border p-3 rounded-lg bg-muted/30">
                <div className=" md:col-span-2">
                  <FormSelectAsync
                    control={componentForm.control}
                    name="component_id"
                    label="Componente"
                    useQueryHook={useWarehouseProducts}
                    mapOptionFn={(wp: WarehouseProductResource) => ({
                      value: wp.product_id.toString(),
                      label: wp.product_name,
                      description: `Stock: ${wp.stock}`,
                    })}
                    additionalParams={
                      warehouseOriginId
                        ? { warehouse_id: Number(warehouseOriginId) }
                        : {}
                    }
                    disabled={!warehouseOriginId}
                    onValueChange={(value, item) =>
                      setCurrentComponent((prev) => ({
                        ...prev,
                        component_id: value,
                        component_name:
                          (item as WarehouseProductResource)?.product_name ??
                          "",
                      }))
                    }
                    withValue
                    placeholder={
                      warehouseOriginId
                        ? "Buscar componente..."
                        : "Seleccione primero el almacén origen"
                    }
                    className="md:w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Cant. Req.</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentComponent.quantity_required || ""}
                    onChange={(e) =>
                      setCurrentComponent({
                        ...currentComponent,
                        quantity_required: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Cant. Usada</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentComponent.quantity_used || ""}
                    onChange={(e) =>
                      setCurrentComponent({
                        ...currentComponent,
                        quantity_used: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Costo Unit.</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentComponent.unit_cost || ""}
                    onChange={(e) =>
                      setCurrentComponent({
                        ...currentComponent,
                        unit_cost: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <Button type="button" onClick={handleAddOrUpdateComponent}>
                  <Plus />
                  {editingComponentIndex !== null ? "Actualizar" : "Agregar"}
                </Button>
              </div>

              {components.length > 0 && (
                <DataTable columns={componentColumns} data={components} />
              )}
            </div>
          </GroupFormSection>

          {form.formState.errors &&
            Object.keys(form.formState.errors).length > 0 && (
              <div className="p-4 bg-red-100 text-red-800 rounded">
                <strong>Errores de validación:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {Object.entries(form.formState.errors).map(([key, error]) => (
                    <li key={key}>
                      {key}: {(error as any)?.message || "Error"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTE)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || checkingStock}>
              {isSubmitting || checkingStock ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : mode === "create" ? (
                "Guardar"
              ) : (
                "Actualizar"
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
            {stockResults.every((r) => r.sufficient) && (
              <AlertDialogAction
                onClick={() => {
                  if (pendingPayload) onSubmit(pendingPayload);
                  setShowStockDialog(false);
                }}
              >
                Confirmar y Guardar
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormWrapper>
  );
}
