import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  useProductionOrders,
  useProductionOrdersSummary,
  useSubmitProductionOrder,
  useApproveProductionOrder,
  useRejectProductionOrder,
  useCancelProductionOrder,
  useDeleteProductionOrder,
} from "../lib/production-order.hook";
import { PRODUCTION_ORDER, ProductionOrderPendingRoute } from "../lib/production-order.interface";
import type { GetProductionOrdersParams } from "../lib/production-order.interface";
import { createProductionOrderColumns } from "./ProductionOrderColumns";
import PageWrapper from "@/components/PageWrapper";
import PageSkeleton from "@/components/PageSkeleton";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { SummaryCard } from "@/components/SummaryCard";
import {
  Plus,
  XCircle,
  Loader,
  ClipboardList,
  FileClock,
  ThumbsUp,
  ThumbsDown,
  PackageCheck,
  Ban,
  ListChecks,
} from "lucide-react";
import TitleComponent from "@/components/TitleComponent";
import DataTablePagination from "@/components/DataTablePagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/pages/auth/lib/auth.store";

export default function ProductionOrderIndexPage() {
  const { ROUTE_ADD, ROUTE, ROUTE_UPDATE, MODEL, ICON } = PRODUCTION_ORDER;
  const navigate = useNavigate();
  const { access, user } = useAuthStore();

  const canApproveOrder =
    user?.rol_id === 1 ||
    !!access?.find((perm) =>
      perm.permissions.some((p) =>
        p.routes.some((r) => r === "aprobar-orden-produccion"),
      ),
    );
  const canRejectOrder =
    user?.rol_id === 1 ||
    !!access?.find((perm) =>
      perm.permissions.some((p) =>
        p.routes.some((r) => r === "rechazar-orden-produccion"),
      ),
    );

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const params: GetProductionOrdersParams = useMemo(
    () => ({ page, per_page: perPage }),
    [page, perPage],
  );

  const { data: orders, meta, isLoading } = useProductionOrders(params);
  const { data: summary, isLoading: isLoadingSummary } = useProductionOrdersSummary();

  const submitOrder = useSubmitProductionOrder();
  const approveOrder = useApproveProductionOrder();
  const rejectOrder = useRejectProductionOrder();
  const cancelOrder = useCancelProductionOrder();
  const removeOrder = useDeleteProductionOrder();

  // Reject dialog state
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionReasonError, setRejectionReasonError] = useState("");

  const handleSubmit = (id: number) => submitOrder.mutate(id);

  const handleApprove = (id: number) => approveOrder.mutate(id);

  const handleReject = () => {
    if (rejectionReason.trim().length < 4) {
      setRejectionReasonError("El motivo debe tener al menos 4 caracteres");
      return;
    }
    if (!rejectingId) return;
    rejectOrder.mutate(
      { id: rejectingId, rejection_reason: rejectionReason.trim() },
      {
        onSuccess: () => {
          setRejectingId(null);
          setRejectionReason("");
          setRejectionReasonError("");
        },
      },
    );
  };

  const handleCancel = (id: number) => cancelOrder.mutate(id);

  const handleDelete = (id: number) => removeOrder.mutate(id);

  const columns = useMemo(
    () =>
      createProductionOrderColumns({
        onView: (id) => navigate(`${ROUTE}/${id}`),
        onEdit: (id) => navigate(ROUTE_UPDATE.replace(":id", id.toString())),
        onGenerateDocument: (id) =>
          navigate("/produccion/documentos-produccion/agregar", {
            state: { fromOrderId: id },
          }),
        onSubmit: handleSubmit,
        onApprove: handleApprove,
        onRejectClick: (id) => setRejectingId(id),
        onCancel: handleCancel,
        onDelete: handleDelete,
        canApprove: canApproveOrder,
        canReject: canRejectOrder,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, ROUTE, ROUTE_UPDATE, page, perPage, canApproveOrder, canRejectOrder],
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <PageWrapper>
      <div className="mb-6 flex items-center justify-between">
        <TitleComponent
          title={MODEL.plural ?? "Órdenes de Producción"}
          subtitle={MODEL.description}
          icon={ICON}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(ProductionOrderPendingRoute)}>
            <ListChecks className="h-4 w-4 mr-2" />
            Pendientes a Producir
          </Button>
          <Button onClick={() => navigate(ROUTE_ADD)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {!isLoadingSummary && summary && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <SummaryCard
            icon={<ClipboardList className="h-4 w-4" />}
            label="Total"
            value={summary.total.toString()}
            color="primary"
          />
          <SummaryCard
            icon={<FileClock className="h-4 w-4" />}
            label="Borrador"
            value={summary.borrador.toString()}
            color="slate"
          />
          <SummaryCard
            icon={<FileClock className="h-4 w-4" />}
            label="Pendiente"
            value={summary.pendiente.toString()}
            color="amber"
          />
          <SummaryCard
            icon={<ThumbsUp className="h-4 w-4" />}
            label="Aprobado"
            value={summary.aprobado.toString()}
            color="green"
          />
          <SummaryCard
            icon={<ThumbsDown className="h-4 w-4" />}
            label="Rechazado"
            value={summary.rechazado.toString()}
            color="red"
          />
          <SummaryCard
            icon={<PackageCheck className="h-4 w-4" />}
            label="Procesado"
            value={summary.procesado.toString()}
            color="blue"
          />
          <SummaryCard
            icon={<Ban className="h-4 w-4" />}
            label="Anulado"
            value={summary.anulado.toString()}
            color="zinc"
          />
        </div>
      )}

      <div className="space-y-4">
        <DataTable columns={columns} data={orders ?? []} />
        {meta && (
          <DataTablePagination
            page={page}
            per_page={meta.per_page ?? perPage}
            totalPages={meta.last_page}
            totalData={meta.total}
            onPageChange={handlePageChange}
            setPerPage={setPerPage}
          />
        )}
      </div>

      {/* Dialog de Rechazo */}
      <Dialog
        open={rejectingId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingId(null);
            setRejectionReason("");
            setRejectionReasonError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar Orden</DialogTitle>
            <DialogDescription>
              Indica el motivo del rechazo. Esta información quedará registrada
              en la orden.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>
              Motivo de rechazo <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (e.target.value.trim().length >= 4)
                  setRejectionReasonError("");
              }}
              placeholder="Describe el motivo del rechazo..."
              rows={4}
              maxLength={1000}
            />
            {rejectionReasonError && (
              <p className="text-sm text-destructive">{rejectionReasonError}</p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {rejectionReason.length} / 1000
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectingId(null)}
              disabled={rejectOrder.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectOrder.isPending}
            >
              {rejectOrder.isPending ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
