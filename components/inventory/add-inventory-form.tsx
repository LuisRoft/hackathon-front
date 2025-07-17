"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InventoryItem {
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  pricePerUnit: number;
  expirationDate?: string;
  supplier: string;
  location: string;
  description: string;
}

interface AddInventoryFormProps {
  onSubmit: (item: InventoryItem) => void;
  onCancel: () => void;
}

const categories = [
  "Carnes",
  "Pescados y Mariscos",
  "Verduras",
  "Frutas",
  "Lácteos",
  "Panadería",
  "Cereales y Granos",
  "Aceites",
  "Condimentos",
  "Especias",
  "Bebidas",
  "Congelados",
  "Enlatados",
  "Otros",
];

const units = [
  "kg",
  "litros",
  "unidades",
  "gramos",
  "mililitros",
  "docenas",
  "cajas",
  "bolsas",
  "latas",
  "botellas",
];

export function AddInventoryForm({
  onSubmit,
  onCancel,
}: AddInventoryFormProps) {
  const [formData, setFormData] = useState<InventoryItem>({
    name: "",
    category: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 100,
    unit: "kg",
    pricePerUnit: 0,
    expirationDate: "",
    supplier: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof InventoryItem, string>>
  >({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof InventoryItem, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.category) {
      newErrors.category = "La categoría es requerida";
    }

    if (formData.currentStock < 0) {
      newErrors.currentStock = "El stock actual no puede ser negativo";
    }

    if (formData.minStock < 0) {
      newErrors.minStock = "El stock mínimo no puede ser negativo";
    }

    if (formData.maxStock <= 0) {
      newErrors.maxStock = "El stock máximo debe ser mayor a 0";
    }

    if (formData.minStock >= formData.maxStock) {
      newErrors.minStock = "El stock mínimo debe ser menor al máximo";
    }

    if (formData.currentStock > formData.maxStock) {
      newErrors.currentStock = "El stock actual no puede ser mayor al máximo";
    }

    if (!formData.unit) {
      newErrors.unit = "La unidad es requerida";
    }

    if (formData.pricePerUnit <= 0) {
      newErrors.pricePerUnit = "El precio debe ser mayor a 0";
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = "El proveedor es requerido";
    }

    if (!formData.location.trim()) {
      newErrors.location = "La ubicación es requerida";
    }

    // Validar fecha de vencimiento si se proporciona
    if (formData.expirationDate) {
      const expirationDate = new Date(formData.expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expirationDate < today) {
        newErrors.expirationDate =
          "La fecha de vencimiento no puede ser en el pasado";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        ...formData,
        expirationDate: formData.expirationDate || undefined,
      };
      onSubmit(submitData);
    }
  };

  const handleInputChange = (
    field: keyof InventoryItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Nombre del Insumo *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Ej: Harina de Trigo"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1">Categoría *</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-background ${
              errors.category ? "border-red-500" : ""
            }`}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* Unidad */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Unidad de Medida *
          </label>
          <select
            value={formData.unit}
            onChange={(e) => handleInputChange("unit", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Actual */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Stock Actual *
          </label>
          <Input
            type="number"
            min="0"
            value={formData.currentStock}
            onChange={(e) =>
              handleInputChange("currentStock", Number(e.target.value))
            }
            className={errors.currentStock ? "border-red-500" : ""}
          />
          {errors.currentStock && (
            <p className="text-red-500 text-xs mt-1">{errors.currentStock}</p>
          )}
        </div>

        {/* Stock Mínimo */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Stock Mínimo *
          </label>
          <Input
            type="number"
            min="0"
            value={formData.minStock}
            onChange={(e) =>
              handleInputChange("minStock", Number(e.target.value))
            }
            className={errors.minStock ? "border-red-500" : ""}
          />
          {errors.minStock && (
            <p className="text-red-500 text-xs mt-1">{errors.minStock}</p>
          )}
        </div>

        {/* Stock Máximo */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Stock Máximo *
          </label>
          <Input
            type="number"
            min="1"
            value={formData.maxStock}
            onChange={(e) =>
              handleInputChange("maxStock", Number(e.target.value))
            }
            className={errors.maxStock ? "border-red-500" : ""}
          />
          {errors.maxStock && (
            <p className="text-red-500 text-xs mt-1">{errors.maxStock}</p>
          )}
        </div>

        {/* Precio por Unidad */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Precio por {formData.unit || "unidad"} *
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.pricePerUnit}
            onChange={(e) =>
              handleInputChange("pricePerUnit", Number(e.target.value))
            }
            placeholder="0.00"
            className={errors.pricePerUnit ? "border-red-500" : ""}
          />
          {errors.pricePerUnit && (
            <p className="text-red-500 text-xs mt-1">{errors.pricePerUnit}</p>
          )}
        </div>

        {/* Fecha de Vencimiento */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha de Vencimiento
          </label>
          <Input
            type="date"
            value={formData.expirationDate}
            onChange={(e) =>
              handleInputChange("expirationDate", e.target.value)
            }
            className={errors.expirationDate ? "border-red-500" : ""}
          />
          {errors.expirationDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>
          )}
        </div>

        {/* Proveedor */}
        <div>
          <label className="block text-sm font-medium mb-1">Proveedor *</label>
          <Input
            value={formData.supplier}
            onChange={(e) => handleInputChange("supplier", e.target.value)}
            placeholder="Ej: Molino San Juan"
            className={errors.supplier ? "border-red-500" : ""}
          />
          {errors.supplier && (
            <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
          )}
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium mb-1">Ubicación *</label>
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Ej: Almacén A - Estante 1"
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Descripción del insumo..."
            rows={3}
            className="w-full px-3 py-2 border rounded-md bg-background resize-none"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Agregar Insumo</Button>
      </div>
    </form>
  );
}
