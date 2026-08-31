import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePurchaseOrder } from "../lib/purchase-order.hook";
import TitleComponent from "@/components/TitleComponent";
import PurchaseOrderActions from "./PurchaseOrderActions";
import PurchaseOrderTable from "./PurchaseOrderTable";
import PurchaseOrderOptions from "./PurchaseOrderOptions";
import { deletePurchaseOrder } from "../lib/purchase-order.actions";
import { SimpleDeleteDialog } from "@/components/SimpleDeleteDialog";
import {
  successToast,
  errorToast,
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
} from "@/lib/core.function";
import { PurchaseOrderColumns } from "./PurchaseOrderColumns";
import DataTablePagination from "@/components/DataTablePagination";
import {
  PURCHASE_ORDER,
  type PurchaseOrderResource,
} from "../lib/purchase-order.interface";
import { DEFAULT_PER_PAGE } from "@/lib/core.constants";
import PurchaseOrderDetailSheet from "./PurchaseOrderDetailSheet";

const { MODEL, ICON } = PURCHASE_ORDER;

export default function PurchaseOrderPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState<PurchaseOrderResource | null>(null);

  const { data, isLoading, refetch } = usePurchaseOrder({
    page,
    search,
    per_page,
    status: selectedStatus,
  });

  useEffect(() => {
    setPage(1);
  }, [search, per_page, selectedStatus]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePurchaseOrder(deleteId);
      await refetch();
      successToast(SUCCESS_MESSAGE(MODEL, "delete"));
    } catch (error: any) {
      const errorMessage =
        (error.response.data.message ?? error.response.data.error) ||
        ERROR_MESSAGE(MODEL, "delete");
      errorToast(errorMessage);
    } finally {
      setDeleteId(null);
    }
  };

  const handleCreatePurchaseOrder = () => {
    navigate("/ordenes-compra/agregar");
  };

  const handleEditPurchaseOrder = (id: number) => {
    navigate(`/ordenes-compra/actualizar/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TitleComponent
          title={MODEL.plural!}
          subtitle={MODEL.description}
          icon={ICON}
        />
        <PurchaseOrderActions
          onCreatePurchaseOrder={handleCreatePurchaseOrder}
        />
      </div>

      <PurchaseOrderTable
        isLoading={isLoading}
        columns={PurchaseOrderColumns({
          onView: setSelectedPurchaseOrder,
          onEdit: handleEditPurchaseOrder,
          onDelete: setDeleteId,
        })}
        data={data?.data || []}
      >
        <PurchaseOrderOptions
          search={search}
          setSearch={setSearch}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </PurchaseOrderTable>

      <DataTablePagination
        page={page}
        totalPages={data?.meta?.last_page || 1}
        onPageChange={setPage}
        per_page={per_page}
        setPerPage={setPerPage}
        totalData={data?.meta?.total || 0}
      />

      {deleteId !== null && (
        <SimpleDeleteDialog
          open={true}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}

      <PurchaseOrderDetailSheet
        purchaseOrder={selectedPurchaseOrder}
        open={selectedPurchaseOrder !== null}
        onClose={() => setSelectedPurchaseOrder(null)}
      />
    </div>
  );
}
