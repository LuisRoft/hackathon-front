"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Menu } from "@/app/dashboard/catalogo/menu/page";

interface MenuFormProps {
  menu?: Menu;
  onSubmit: (data: Omit<Menu, "id">) => void;
}

export function MenuForm({ menu, onSubmit }: MenuFormProps) {
  const [name, setName] = useState(menu?.name ?? "");
  const [description, setDescription] = useState(menu?.description ?? "");
  const [dishes, setDishes] = useState(menu?.dishes.join(", ") ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dishesArray = dishes.split(",").map((dish) => dish.trim());
    onSubmit({ name, description, dishes: dishesArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre del Menú</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Menú Especial"
          required
        />
      </div>
      <div>
        <Label>Descripción</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del menú"
          required
        />
      </div>
      <div>
        <Label>Platos (separados por comas)</Label>
        <Input
          value={dishes}
          onChange={(e) => setDishes(e.target.value)}
          placeholder="Ej: Plato 1, Plato 2, Plato 3"
        />
      </div>
      <Button type="submit">{menu ? "Actualizar" : "Crear"} Menú</Button>
    </form>
  );
}
