"use client";

import { useEffect, useState } from "react";
import TitleComponent from "@/components/TitleComponent";
import UserOptions from "./UserOptions";
import UserTable from "./UserTable";
import { UserColumns } from "./UserColumns";
import UserActions from "./UserActions";
import { useUsers } from "../lib/User.hook";
import { SimpleDeleteDialog } from "@/components/SimpleDeleteDialog";
import { deleteUser } from "../lib/User.actions";
import {
  ERROR_MESSAGE,
  errorToast,
  SUCCESS_MESSAGE,
  successToast,
} from "@/lib/core.function";
import DataTablePagination from "@/components/DataTablePagination";
import { USER } from "../lib/User.interface";
import UserModal from "./UserModal";
import { DEFAULT_PER_PAGE } from "@/lib/core.constants";

const { MODEL, ICON } = USER;

export default function UserPage() {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useUsers({
    page,
    per_page,
    search,
  });

  useEffect(() => {
    setPage(1);
  }, [search, per_page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      await refetch();
      successToast(SUCCESS_MESSAGE(MODEL, "delete"));
    } catch (error: any) {
      errorToast(
        error.response.data.message ?? error.response.data.error,
        ERROR_MESSAGE(MODEL, "delete"),
      );
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TitleComponent
          title={MODEL.name}
          subtitle={MODEL.description}
          icon={ICON}
        />
        <UserActions />
      </div>

      <UserTable
        isLoading={isLoading}
        columns={UserColumns({ onEdit: setEditId, onDelete: setDeleteId })}
        data={data?.data || []}
      >
        <UserOptions search={search} setSearch={setSearch} />
      </UserTable>

      <DataTablePagination
        page={page}
        totalPages={data?.meta?.last_page || 1}
        onPageChange={setPage}
        per_page={per_page}
        setPerPage={setPerPage}
        totalData={data?.meta?.total || 0}
      />

      {/* Formularios */}
      {editId !== null && (
        <UserModal
          id={editId}
          open={true}
          onClose={() => setEditId(null)}
          title={MODEL.name}
          mode="edit"
        />
      )}

      {deleteId !== null && (
        <SimpleDeleteDialog
          open={true}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
