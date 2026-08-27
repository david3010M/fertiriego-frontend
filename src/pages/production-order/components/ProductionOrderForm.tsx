import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import TitleFormComponent from "@/components/TitleFormComponent";
import PageWrapper from "@/components/PageWrapper";
import { PRODUCTION_ORDER } from "../lib/production-order.interface";
import { productionOrderSchema } from "../lib/production-order.schema";
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
  ClipboardList,
  Package,
  MessageSquarePlus,
  X,
  CornerDownRight,
} from "lucide-react";
import { FormSelect } from "@/components/FormSelect";
import { FormSwitch } from "@/components/FormSwitch";
import { DatePickerFormField } from "@/components/DatePickerFormField";
import { GroupFormSection } from "@/components/GroupFormSection";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { WarehouseResource } from "@/pages/warehouse/lib/warehouse.interface";
import type { ProductResource } from "@/pages/product/lib/product.interface";
import type { PersonResource } from "@/pages/person/lib/person.interface";
import { useProduct } from "@/pages/product/lib/product.hook";
import { FormSelectAsync } from "@/components/FormSelectAsync";
import { useWorkers } from "@/pages/worker/lib/worker.hook";

export type ProductionOrderComponentFormValues = {
  component_id: string;
  component_name?: string;
  quantity_required: string;
  unit_cost: string;
  // ⚠️ waste_quantity/waste_percentage NO se capturan aquí: el backend los
  // calcula automáticamente y se muestran solo como dato de solo lectura en
  // el detalle (igual que overhead_cost a nivel de ítem).
  notes?: string;
};

export type ProductionOrderItemFormValues = {
  product_id: string;
  product_name?: string;
  quantity_requested: string;
  labor_cost: string;
  // ⚠️ overhead_cost NO se captura aquí: el backend lo calcula
  // automáticamente y se muestra solo como dato de solo lectura en el detalle.
  notes?: string;
  use_combo: boolean;
  components: ProductionOrderComponentFormValues[];
};

export type ProductionOrderFormValues = {
  warehouse_origin_id: string;
  warehouse_dest_id: string;
  responsible_id: string;
  requested_date: string;
  currency: string;
  observations?: string;
  items: ProductionOrderItemFormValues[];
};

interface ProductionOrderFormProps {
  mode?: "create" | "edit";
  onSubmit: (values: ProductionOrderFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  initialValues?: ProductionOrderFormValues;
  warehouses: WarehouseResource[];
}

const CURRENCY_OPTIONS = [
  { value: "PEN", label: "PEN - Sol Peruano" },
  { value: "USD", label: "USD - Dólar" },
];

const emptyComponent: ProductionOrderComponentFormValues = {
  component_id: "",
  component_name: "",
  quantity_required: "",
  unit_cost: "",
  notes: "",
};

const emptyItem = (): ProductionOrderItemFormValues => ({
  product_id: "",
  product_name: "",
  quantity_requested: "",
  labor_cost: "0",
  notes: "",
  use_combo: true,
  components: [],
});

/**
 * Selector de producto/componente aislado con su propio react-hook-form
 * interno, para poder reutilizarlo dentro de un array dinámico de ítems sin
 * que varias instancias compartan (y se pisen) el mismo campo de formulario.
 */
function AsyncProductPicker({
  label,
  placeholder,
  defaultLabel,
  onSelect,
  additionalParams,
  className,
}: {
  label?: string;
  placeholder: string;
  defaultLabel?: string;
  onSelect: (value: string, item: ProductResource | undefined) => void;
  additionalParams?: Record<string, any>;
  className?: string;
}) {
  const localForm = useForm<{ value: string }>({
    defaultValues: { value: "" },
  });
  return (
    <FormSelectAsync
      control={localForm.control}
      name="value"
      label={label ?? ""}
      placeholder={placeholder}
      useQueryHook={useProduct}
      mapOptionFn={(p: ProductResource) => ({
        value: p.id.toString(),
        label: p.name,
        description: p.unit_name,
      })}
      additionalParams={additionalParams}
      defaultOption={
        defaultLabel ? { value: "", label: defaultLabel } : undefined
      }
      onValueChange={(value, item) =>
        onSelect(value, item as ProductResource | undefined)
      }
      withValue={false}
      className={className}
    />
  );
}

/**
 * Switch aislado con su propio react-hook-form interno (mismo motivo que
 * AsyncProductPicker): permite usar FormSwitch dentro de un array dinámico de
 * ítems, notificando el cambio hacia arriba vía onChange en vez de compartir
 * el control del formulario principal.
 */
function ComboToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const localForm = useForm<{ use_combo: boolean }>({
    defaultValues: { use_combo: checked },
  });
  const value = localForm.watch("use_combo");

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <FormSwitch
      control={localForm.control}
      name="use_combo"
      label="Componentes"
      text={value ? "Automático" : "Manual"}
      size="sm"
    />
  );
}

// Estilos "tipo Excel" para las celdas editables de la grilla de
// componentes: sin bordes/radio propios ni fondo — la celda de la tabla
// dibuja la cuadrícula y el input/selector solo rellena su espacio.
const cellInputClass =
  "h-9 w-full rounded-none border-0 bg-transparent px-2 shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary";
const cellPickerClass =
  "h-9 w-full rounded-none border-0 bg-transparent! px-2 shadow-none justify-between focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary";

/**
 * Fila de la grilla de componentes manuales, definida como componente
 * propio y estable (no una función creada en cada render) para que React
 * la reconcilie por posición en vez de remontarla — evita que el
 * AsyncProductPicker pierda el foco/reinicie su búsqueda en cada tecleo.
 * El ícono de la primera columna indica que es un subcomponente (árbol)
 * del producto final de la fila superior.
 */
function ComponentRow({
  itemIndex,
  componentIndex,
  component,
  otherComponentIds,
  onChange,
  onDelete,
}: {
  itemIndex: number;
  componentIndex: number;
  component: ProductionOrderComponentFormValues;
  /** ids de componentes ya elegidos en otras filas del mismo ítem, para evitar duplicados */
  otherComponentIds: string[];
  onChange: (
    itemIndex: number,
    componentIndex: number,
    patch: Partial<ProductionOrderComponentFormValues>,
  ) => void;
  onDelete: (itemIndex: number, componentIndex: number) => void;
}) {
  return (
    <TableRow>
      <TableCell className="border-r p-0 text-center text-muted-foreground">
        <CornerDownRight className="mx-auto h-4 w-4" />
      </TableCell>
      <TableCell className="border-r p-0">
        <AsyncProductPicker
          placeholder="Buscar componente..."
          defaultLabel={component.component_name}
          className={cellPickerClass}
          onSelect={(value, prod) => {
            if (value && otherComponentIds.includes(value)) {
              toast.error(
                `"${prod?.name ?? "Este componente"}" ya fue agregado en otra fila`,
              );
              return;
            }
            onChange(itemIndex, componentIndex, {
              component_id: value,
              component_name: prod?.name ?? "",
            });
          }}
        />
      </TableCell>
      <TableCell className="border-r p-0">
        <Input
          type="number"
          step="0.01"
          min="0.01"
          className={cellInputClass}
          value={component.quantity_required}
          onChange={(e) =>
            onChange(itemIndex, componentIndex, {
              quantity_required: e.target.value,
            })
          }
          placeholder="0.00"
        />
      </TableCell>
      <TableCell className="border-r p-0">
        <Input
          type="number"
          step="0.01"
          min="0"
          className={cellInputClass}
          value={component.unit_cost}
          onChange={(e) =>
            onChange(itemIndex, componentIndex, {
              unit_cost: e.target.value,
            })
          }
          placeholder="0.00"
        />
      </TableCell>
      <TableCell className="border-r p-0">
        <Input
          className={cellInputClass}
          value={component.notes}
          onChange={(e) =>
            onChange(itemIndex, componentIndex, { notes: e.target.value })
          }
          placeholder="Notas..."
          maxLength={500}
        />
      </TableCell>
      <TableCell className="p-0 text-center">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(itemIndex, componentIndex)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ProductionOrderForm({
  mode = "create",
  onSubmit,
  isSubmitting = false,
  initialValues,
  warehouses,
}: ProductionOrderFormProps) {
  const { ROUTE, MODEL, ICON } = PRODUCTION_ORDER;
  const navigate = useNavigate();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const defaultValues: ProductionOrderFormValues = {
    warehouse_origin_id: "",
    warehouse_dest_id: "",
    responsible_id: "",
    requested_date: todayStr,
    currency: "PEN",
    observations: "",
    items: [emptyItem()],
  };

  const form = useForm<ProductionOrderFormValues>({
    resolver: zodResolver(
      productionOrderSchema,
    ) as Resolver<ProductionOrderFormValues>,
    defaultValues: initialValues ?? defaultValues,
  });

  const [items, setItems] = useState<ProductionOrderItemFormValues[]>(
    initialValues?.items?.length ? initialValues.items : [emptyItem()],
  );

  // Índices de ítems cuyo campo de notas está expandido (se abre al hacer clic en "Agregar nota")
  const [notesExpanded, setNotesExpanded] = useState<Set<number>>(
    () =>
      new Set(items.map((it, i) => (it.notes ? i : -1)).filter((i) => i >= 0)),
  );
  const toggleNotes = (itemIndex: number) => {
    setNotesExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(itemIndex)) next.delete(itemIndex);
      else next.add(itemIndex);
      return next;
    });
  };


  useEffect(() => {
    form.setValue("items", items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const updateItem = (
    index: number,
    patch: Partial<ProductionOrderItemFormValues>,
  ) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, emptyItem()]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      toast.error("La orden debe tener al menos un producto a producir");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Agrega una fila de componente vacía directamente a la grilla del ítem,
  // para editarla en línea sin un paso separado de "agregar/actualizar".
  const addComponentRow = (itemIndex: number) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === itemIndex
          ? { ...it, components: [...it.components, { ...emptyComponent }] }
          : it,
      ),
    );
  };

  const updateComponentRow = (
    itemIndex: number,
    componentIndex: number,
    patch: Partial<ProductionOrderComponentFormValues>,
  ) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== itemIndex) return it;
        return {
          ...it,
          components: it.components.map((c, ci) =>
            ci === componentIndex ? { ...c, ...patch } : c,
          ),
        };
      }),
    );
  };

  const handleDeleteComponent = (itemIndex: number, componentIndex: number) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === itemIndex
          ? {
              ...it,
              components: it.components.filter(
                (_, ci) => ci !== componentIndex,
              ),
            }
          : it,
      ),
    );
  };

  const handleFormSubmit = form.handleSubmit(() => {
    if (items.length === 0) {
      toast.error("Debe agregar al menos un producto a producir");
      return;
    }
    // Un mismo producto no puede repetirse como dos ítems distintos de la orden.
    const seenProductIds = new Set<string>();
    for (const item of items) {
      if (!item.product_id) {
        toast.error("Todos los productos deben estar seleccionados");
        return;
      }
      if (seenProductIds.has(item.product_id)) {
        toast.error(
          `"${item.product_name || "Un producto"}" está repetido en la orden`,
        );
        return;
      }
      seenProductIds.add(item.product_id);
      if (!item.quantity_requested || Number(item.quantity_requested) <= 0) {
        toast.error(
          "La cantidad solicitada debe ser mayor a 0 en todos los productos",
        );
        return;
      }
      if (!item.use_combo) {
        if (item.components.length === 0) {
          toast.error(
            `Debe agregar al menos un componente manual para "${item.product_name || "el producto"}", o active "Automático"`,
          );
          return;
        }
        // Un mismo componente no puede repetirse dentro del mismo producto.
        const seenComponentIds = new Set<string>();
        for (const c of item.components) {
          if (!c.component_id) {
            toast.error(
              `Debe seleccionar todos los componentes de "${item.product_name || "el producto"}"`,
            );
            return;
          }
          if (seenComponentIds.has(c.component_id)) {
            toast.error(
              `"${c.component_name || "Un componente"}" está repetido en "${item.product_name || "el producto"}"`,
            );
            return;
          }
          seenComponentIds.add(c.component_id);
          if (!c.quantity_required || Number(c.quantity_required) <= 0) {
            toast.error(
              `La cantidad requerida debe ser mayor a 0 en los componentes de "${item.product_name || "el producto"}"`,
            );
            return;
          }
        }
      }
    }
    const payload: ProductionOrderFormValues = {
      ...form.getValues(),
      items: items.map((it) => ({
        ...it,
        components: it.use_combo ? [] : it.components,
      })),
    };
    onSubmit(payload);
  });

  return (
    <PageWrapper>
      <div className="mb-6">
        <TitleFormComponent
          title={MODEL.name}
          mode={mode}
          icon={ICON}
          backRoute={ROUTE}
        />
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            {/* Información General */}
            <div className="lg:col-span-1 lg:sticky lg:top-4 gap-6">
              <GroupFormSection
                icon={ClipboardList}
                title="Información General"
                cols={{ sm: 1, md: 2, xl: 1 }}
              >
                <FormSelect
                  control={form.control}
                  name="warehouse_origin_id"
                  label="Almacén Origen"
                  placeholder="Seleccione almacén de origen"
                  options={warehouses
                    .map((w) => ({
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
                  options={warehouses
                    .map((w) => ({
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
                  placeholder="Buscar responsable..."
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
                  name="requested_date"
                  label="Fecha Solicitada"
                  placeholder="Seleccione fecha"
                />

                <FormSelect
                  control={form.control}
                  name="currency"
                  label="Moneda"
                  placeholder="Seleccione moneda"
                  options={CURRENCY_OPTIONS}
                  withValue
                />

                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Observaciones adicionales..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </GroupFormSection>
            </div>

            {/* Productos a producir (ítems anidados) */}
            <div className="lg:col-span-3">
              <GroupFormSection
                icon={Package}
                title="Productos a Producir"
                cols={{ sm: 1 }}
              >
                <div className="space-y-3 w-full">
                  {items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded-xl border bg-card shadow-sm overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                            {itemIndex + 1}
                          </span>
                          {item.product_name || `Producto #${itemIndex + 1}`}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveItem(itemIndex)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Quitar
                        </Button>
                      </div>

                      <div className="p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                          <div className="md:col-span-4">
                            <label className="text-sm font-medium">
                              Producto Final
                            </label>
                            <AsyncProductPicker
                              placeholder="Buscar producto..."
                              defaultLabel={item.product_name}
                              onSelect={(value, prod) => {
                                const usedByOtherItem = items.some(
                                  (it, i) =>
                                    i !== itemIndex &&
                                    value &&
                                    it.product_id === value,
                                );
                                if (usedByOtherItem) {
                                  toast.error(
                                    `"${prod?.name ?? "Este producto"}" ya fue agregado en otro producto de la orden`,
                                  );
                                  return;
                                }
                                updateItem(itemIndex, {
                                  product_id: value,
                                  product_name: prod?.name ?? "",
                                });
                              }}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-medium">
                              Cant. Solicitada
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={item.quantity_requested}
                              onChange={(e) =>
                                updateItem(itemIndex, {
                                  quantity_requested: e.target.value,
                                })
                              }
                              placeholder="0.00"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-medium">
                              Costo Laboral (S/)
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.labor_cost}
                              onChange={(e) =>
                                updateItem(itemIndex, {
                                  labor_cost: e.target.value,
                                })
                              }
                              placeholder="0.00"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <ComboToggle
                              checked={item.use_combo}
                              onChange={(checked) =>
                                updateItem(itemIndex, { use_combo: checked })
                              }
                            />
                          </div>

                          <div className="md:col-span-2">
                            {!notesExpanded.has(itemIndex) && (
                              <>
                                <label className="text-sm font-medium invisible hidden md:block">
                                  Notas
                                </label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full h-8 text-muted-foreground"
                                  onClick={() => toggleNotes(itemIndex)}
                                >
                                  <MessageSquarePlus className="h-3.5 w-3.5 mr-1" />
                                  Agregar nota
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {notesExpanded.has(itemIndex) && (
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <label className="text-sm font-medium">
                                Notas del producto
                              </label>
                              <Input
                                autoFocus
                                value={item.notes}
                                onChange={(e) =>
                                  updateItem(itemIndex, {
                                    notes: e.target.value,
                                  })
                                }
                                placeholder="Notas opcionales..."
                                maxLength={500}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-muted-foreground"
                              onClick={() => {
                                updateItem(itemIndex, { notes: "" });
                                toggleNotes(itemIndex);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {/* Componentes manuales del ítem: la grilla se
                            muestra directa, sin subtítulo ni botón aparte
                            arriba — el nombre va en el encabezado de columna
                            y "Agregar fila" queda pegado a la última fila
                            (dentro de la tabla) para no tener que subir a
                            buscarlo cuando hay muchos componentes. */}
                        {!item.use_combo && (
                          <div className="overflow-hidden rounded-lg border">
                            <Table className="border-separate border-spacing-0">
                              <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                  <TableHead className="w-8 border-r" />
                                  <TableHead className="border-r">
                                    Componentes manuales
                                  </TableHead>
                                  <TableHead className="w-28 border-r">
                                    Cant. Req.
                                  </TableHead>
                                  <TableHead className="w-28 border-r">
                                    Costo Unit.
                                  </TableHead>
                                  <TableHead className="border-r">
                                    Notas
                                  </TableHead>
                                  <TableHead className="w-10" />
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {item.components.length > 0 ? (
                                  item.components.map(
                                    (component, componentIndex) => (
                                      <ComponentRow
                                        key={componentIndex}
                                        itemIndex={itemIndex}
                                        componentIndex={componentIndex}
                                        component={component}
                                        otherComponentIds={item.components
                                          .filter(
                                            (_, ci) => ci !== componentIndex,
                                          )
                                          .map((c) => c.component_id)
                                          .filter(Boolean)}
                                        onChange={updateComponentRow}
                                        onDelete={handleDeleteComponent}
                                      />
                                    ),
                                  )
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      className="text-center text-sm text-muted-foreground"
                                    >
                                      Sin componentes.
                                    </TableCell>
                                  </TableRow>
                                )}
                                <TableRow className="hover:bg-transparent">
                                  <TableCell colSpan={6} className="p-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-full justify-start text-muted-foreground"
                                      onClick={() => addComponentRow(itemIndex)}
                                    >
                                      <Plus className="h-3.5 w-3.5 mr-1" />
                                      Agregar fila
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddItem}
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar otro producto
                  </Button>

                  {form.formState.errors.items && (
                    <p className="text-sm text-destructive">
                      {(form.formState.errors.items as any)?.message}
                    </p>
                  )}
                </div>
              </GroupFormSection>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTE)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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
    </PageWrapper>
  );
}
