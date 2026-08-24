"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type PersonSchema } from "@/pages/person/lib/person.schema";
import { PersonForm } from "@/pages/person/components/PersonForm";
import {
  findPersonById,
  updatePerson,
} from "@/pages/person/lib/person.actions";
import {
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  successToast,
  errorToast,
} from "@/lib/core.function";
import type { PersonResource } from "@/pages/person/lib/person.interface";
import TitleFormComponent from "@/components/TitleFormComponent";
import FormWrapper from "@/components/FormWrapper";
import FormSkeleton from "@/components/FormSkeleton";
import { CARRIER, CARRIER_ROLE_ID } from "../lib/carrier.interface";

const { MODEL, ICON } = CARRIER;

export default function CarrierEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personData, setPersonData] = useState<PersonResource | null>(null);

  useEffect(() => {
    const loadPersonData = async () => {
      if (!id) {
        navigate("/logistica/transportistas");
        return;
      }

      try {
        setIsLoading(true);
        const response = await findPersonById(Number(id));
        const person = response.data;
        setPersonData(person);
      } catch {
        errorToast("Error al cargar los datos del transportista");
        navigate("/logistica/transportistas");
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonData();
  }, [id, navigate]);

  const handleSubmit = async (data: PersonSchema) => {
    if (!personData) return;

    setIsSubmitting(true);
    try {
      // Transform PersonSchema to UpdatePersonRequest
      const updatePersonData = {
        type_document: data.type_document,
        type_person: data.type_person,
        number_document: data.number_document,
        names: data.names || "",
        gender: data.type_person === "NATURAL" ? data.gender || "M" : undefined,
        birth_date:
          data.type_person === "NATURAL" ? data.birth_date || "" : undefined,
        father_surname: data.father_surname || "",
        mother_surname: data.mother_surname || "",
        business_name: data.business_name || "",
        commercial_name: data.commercial_name || "",
        address: data.address || "",
        phone: data.phone,
        email: data.email,
      };

      await updatePerson(personData.id, updatePersonData);
      successToast(
        SUCCESS_MESSAGE({ name: "Transportista", gender: false }, "edit"),
      );
      navigate("/logistica/transportistas");
    } catch (error: any) {
      const errorMessage =
        ((error.response.data.message ??
          error.response.data.error) as string) ??
        "Error al actualizar transportista";

      errorToast(
        errorMessage,
        ERROR_MESSAGE({ name: "Transportista", gender: false }, "edit"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <FormWrapper>
        <div className="flex items-center gap-4 mb-6">
          <TitleFormComponent title={MODEL.name} mode="edit" icon={ICON} />
        </div>

        <FormSkeleton />
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <div className="flex items-center gap-4 mb-6">
        <TitleFormComponent title={MODEL.name} mode="edit" icon={ICON} />
      </div>

      <PersonForm
        initialData={personData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/logistica/transportistas")}
        roleId={CARRIER_ROLE_ID}
        isWorker={false}
      />
    </FormWrapper>
  );
}
