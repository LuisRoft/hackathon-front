"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InventoryCard } from "@/components/inventory/inventory-card";
import { AddInventoryForm } from "@/components/inventory/add-inventory-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryItem {
  id: string;
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

const mockInventoryData: InventoryItem[] = [
  {
    id: "1",
    name: "Harina de Trigo",
    category: "Panadería",
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    unit: "kg",
    pricePerUnit: 2.5,
    expirationDate: "2025-09-15",
    supplier: "Molino San Juan",
    location: "Almacén A - Estante 1",
    description: "Harina de trigo para todo uso",
  },
  {
    id: "2",
    name: "Pollo Entero",
    category: "Carnes",
    currentStock: 2,
    minStock: 10,
    maxStock: 30,
    unit: "kg",
    pricePerUnit: 8.5,
    expirationDate: "2025-07-20",
    supplier: "Avícola Del Campo",
    location: "Refrigerador 1",
    description: "Pollo fresco de granja",
  },
  {
    id: "3",
    name: "Tomates Cherry",
    category: "Verduras",
    currentStock: 25,
    minStock: 5,
    maxStock: 40,
    unit: "kg",
    pricePerUnit: 4.0,
    expirationDate: "2025-07-22",
    supplier: "Finca Verde",
    location: "Refrigerador 2",
    description: "Tomates cherry frescos para ensaladas",
  },
  {
    id: "4",
    name: "Aceite de Oliva",
    category: "Aceites",
    currentStock: 8,
    minStock: 3,
    maxStock: 20,
    unit: "litros",
    pricePerUnit: 12.0,
    supplier: "Oleícola España",
    location: "Despensa - Estante 3",
    description: "Aceite de oliva extra virgen",
  },
  {
    id: "5",
    name: "Sal Marina",
    category: "Condimentos",
    currentStock: 0,
    minStock: 2,
    maxStock: 10,
    unit: "kg",
    pricePerUnit: 1.5,
    supplier: "Salinas del Pacífico",
    location: "Despensa - Estante 2",
    description: "Sal marina fina para cocina",
  },
  {
    id: "6",
    name: "Queso Mozzarella",
    category: "Lácteos",
    currentStock: 12,
    minStock: 5,
    maxStock: 25,
    unit: "kg",
    pricePerUnit: 6.5,
    expirationDate: "2025-08-10",
    supplier: "Lácteos La Pradera",
    location: "Refrigerador 3",
    description: "Queso mozzarella fresco para pizzas",
  },
];

export default function InventarioPage() {
  const [inventory, setInventory] =
    useState<InventoryItem[]>(mockInventoryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const categories = [
    "all",
    ...Array.from(new Set(inventory.map((item) => item.category))),
  ];

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return "out";
    if (item.currentStock <= item.minStock) return "low";
    return "good";
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;

    const status = getStockStatus(item);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "low" && status === "low") ||
      (filterStatus === "out" && status === "out") ||
      (filterStatus === "good" && status === "good");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const updateStock = (itemId: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, currentStock: Math.max(0, newStock) }
          : item
      )
    );
  };

  const addNewItem = (newItem: Omit<InventoryItem, "id">) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setInventory((prev) => [...prev, item]);
    setIsAddDialogOpen(false);
  };

  const deleteItem = (itemId: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== itemId));
  };

  const lowStockCount = inventory.filter(
    (item) => getStockStatus(item) === "low"
  ).length;
  const outOfStockCount = inventory.filter(
    (item) => getStockStatus(item) === "out"
  ).length;
  const totalItems = inventory.length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
          <p className="text-muted-foreground">
            Administra los insumos y productos de tu catering
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Insumo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Insumo</DialogTitle>
            </DialogHeader>
            <AddInventoryForm
              onSubmit={addNewItem}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Total Items</span>
          </div>
          <p className="text-2xl font-bold mt-2">{totalItems}</p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Stock Adecuado</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">
            {totalItems - lowStockCount - outOfStockCount}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">Stock Bajo</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-yellow-600">
            {lowStockCount}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">Sin Stock</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">
            {outOfStockCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar insumos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.slice(1).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="good">Stock Adecuado</SelectItem>
            <SelectItem value="low">Stock Bajo</SelectItem>
            <SelectItem value="out">Sin Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onUpdateStock={updateStock}
            onDelete={deleteItem}
            status={getStockStatus(item)}
          />
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No se encontraron insumos
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterCategory !== "all" || filterStatus !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primer insumo al inventario"}
          </p>
        </div>
      )}
    </div>
  );
}
