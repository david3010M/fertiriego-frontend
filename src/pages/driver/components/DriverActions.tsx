"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DRIVER } from "../lib/driver.interface";

export default function DriverActions() {
  const { MODEL } = DRIVER;
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <Button
        
        className="ml-auto"
        onClick={() => navigate("/logistica/conductores/agregar")}
      >
        <Plus className="size-4 mr-2" /> Agregar {MODEL.name}
      </Button>
    </div>
  );
}
