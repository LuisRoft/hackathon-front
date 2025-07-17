"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dish } from "@/app/dashboard/catalogo/platos/page";

interface DishFormProps {
  dish?: Dish;
  onSubmit: (data: Omit<Dish, "id">) => void;
}

export function DishForm({ dish, onSubmit }: DishFormProps) {
  const [formData, setFormData] = useState({
    name: dish?.name || "",
    description: dish?.description || "",
    ingredients: dish?.ingredients?.join(", ") || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = "Los ingredientes son requeridos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        ingredients: formData.ingredients
          .split(",")
          .map((ing) => ing.trim())
          .filter(Boolean),
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nombre del Plato *
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Ej: Pizza Margherita"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descripción *
        </label>
        <Input
          id="description"
          type="text"
          placeholder="Describe el plato..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="ingredients" className="text-sm font-medium">
          Ingredientes (separados por coma) *
        </label>
        <Input
          id="ingredients"
          type="text"
          placeholder="Ej: Tomate, Mozzarella, Albahaca"
          value={formData.ingredients}
          onChange={(e) => handleInputChange("ingredients", e.target.value)}
          className={errors.ingredients ? "border-red-500" : ""}
        />
        {errors.ingredients && (
          <p className="text-sm text-red-500">{errors.ingredients}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {dish ? "Actualizar Plato" : "Crear Plato"}
        </Button>
      </div>
    </form>
  );
}
