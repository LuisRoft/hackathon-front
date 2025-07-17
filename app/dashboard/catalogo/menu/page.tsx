"use client";

import { useState } from "react";
import { MenusDataTable } from "@/components/catalogo/menu/menu-data-table";
import { MenuForm } from "@/components/catalogo/menu/menu-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Tipo de Menú
export interface Menu {
  id: string;
  name: string;
  description: string;
  dishes: string[]; // IDs o nombres de platos
}

// Datos falsos para test
const fakeMenus: Menu[] = [
  {
    id: "menu-1",
    name: "Menú Ejecutivo",
    description: "Incluye plato fuerte, bebida y postre.",
    dishes: ["Pollo Asado", "Arroz", "Ensalada"],
  },
  {
    id: "menu-2",
    name: "Menú Vegetariano",
    description: "Opciones frescas y sin carne.",
    dishes: ["Ensalada César", "Pasta Primavera"],
  },
  {
    id: "menu-3",
    name: "Menú Infantil",
    description: "Platos para niños con bebida y juguete.",
    dishes: ["Hamburguesa", "Papas Fritas"],
  },
];

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>(fakeMenus);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const createMenu = async (menuData: Omit<Menu, "id">) => {
    const newMenu: Menu = {
      ...menuData,
      id: `menu-${Date.now()}`,
    };
    setMenus([...menus, newMenu]);
    setIsCreateDialogOpen(false);
  };

  const updateMenu = async (id: string, menuData: Partial<Menu>) => {
    setMenus(menus.map((menu) => (menu.id === id ? { ...menu, ...menuData } : menu)));
    setIsEditDialogOpen(false);
    setSelectedMenu(null);
  };

  const deleteMenu = async (id: string) => {
    setMenus(menus.filter((menu) => menu.id !== id));
  };

  const handleEdit = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Menús</h1>
          <p className="text-muted-foreground">Administra los menús de tu restaurante.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Menú
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Menú</DialogTitle>
            </DialogHeader>
            <MenuForm onSubmit={createMenu} />
          </DialogContent>
        </Dialog>
      </div>

      <MenusDataTable data={menus} onEdit={handleEdit} onDelete={deleteMenu} />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Menú</DialogTitle>
          </DialogHeader>
          {selectedMenu && (
            <MenuForm
              menu={selectedMenu}
              onSubmit={(data) => updateMenu(selectedMenu.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
