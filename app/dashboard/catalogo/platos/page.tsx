"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DishesDataTable } from "@/components/catalogo/dishes/dishes-data-table";
import { DishForm } from "@/components/catalogo/dishes/dishes-form";

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
}

// Datos de ejemplo
const fakeDishes: Dish[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Pizza clásica italiana con tomate, mozzarella y albahaca.",
    ingredients: ["Tomate", "Mozzarella", "Albahaca"],
  },
  {
    id: "2",
    name: "Pasta Carbonara",
    description: "Pasta con huevo, panceta y queso parmesano.",
    ingredients: ["Pasta", "Huevo", "Panceta", "Queso Parmesano"],
  },
  {
    id: "3",
    name: "Ensalada César",
    description: "Ensalada con lechuga, pollo, crutones y aderezo César.",
    ingredients: ["Lechuga", "Pollo", "Crutones", "Aderezo César"],
  },
];

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>(fakeDishes);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Crear plato
  const createDish = async (dishData: Omit<Dish, "id">) => {
    const newDish: Dish = {
      ...dishData,
      id: `dish-${Date.now()}`,
    };
    setDishes([...dishes, newDish]);
    setIsCreateDialogOpen(false);
  };

  // Actualizar plato
  const updateDish = async (id: string, dishData: Omit<Dish, "id">) => {
    setDishes(
      dishes.map((dish) =>
        dish.id === id ? { ...dish, ...dishData } : dish
      )
    );
    setIsEditDialogOpen(false);
    setSelectedDish(null);
  };

  // Eliminar plato
  const deleteDish = async (id: string) => {
    setDishes(dishes.filter((dish) => dish.id !== id));
  };

  // Editar
  const handleEdit = (dish: Dish) => {
    setSelectedDish(dish);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Platos</h1>
          <p className="text-muted-foreground">
            Administra la información de los platos de tu menú.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Plato</DialogTitle>
            </DialogHeader>
            <DishForm onSubmit={createDish} />
          </DialogContent>
        </Dialog>
      </div>

      <DishesDataTable
        data={dishes}
        onEdit={handleEdit}
        onDelete={deleteDish}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Plato</DialogTitle>
          </DialogHeader>
          {selectedDish && (
            <DishForm
              dish={selectedDish}
              onSubmit={(data) => updateDish(selectedDish.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
