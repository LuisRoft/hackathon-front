"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Building2,
  AlertTriangle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

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

interface InventoryCardProps {
  item: InventoryItem;
  onUpdateStock: (itemId: string, newStock: number) => void;
  onDelete: (itemId: string) => void;
  status: "good" | "low" | "out";
}

export function InventoryCard({
  item,
  onUpdateStock,
  onDelete,
  status,
}: InventoryCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case "out":
        return <Badge variant="destructive">Sin Stock</Badge>;
      case "low":
        return <Badge variant="destructive">Stock Bajo</Badge>;
      default:
        return <Badge variant="default">Stock OK</Badge>;
    }
  };

  const getStockBarColor = () => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (percentage <= (item.minStock / item.maxStock) * 100)
      return "bg-red-500";
    if (percentage <= 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  const stockPercentage = Math.min(
    (item.currentStock / item.maxStock) * 100,
    100
  );

  const isExpiringSoon = item.expirationDate
    ? new Date(item.expirationDate) <=
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    : false;

  const incrementStock = () => {
    if (item.currentStock < item.maxStock) {
      onUpdateStock(item.id, item.currentStock + 1);
    }
  };

  const decrementStock = () => {
    if (item.currentStock > 0) {
      onUpdateStock(item.id, item.currentStock - 1);
    }
  };

  const confirmDelete = () => {
    onDelete(item.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        className={`bg-card rounded-lg border p-4 transition-all hover:shadow-md ${
          status === "out"
            ? "!border-red-300"
            : status === "low"
            ? "!border-yellow-300"
            : "border-border"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{item.category}</Badge>
              {getStatusBadge()}
              {isExpiringSoon && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Vence Pronto
                </Badge>
              )}
            </div>
          </div>

          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
              </DialogHeader>
              <p>
                ¿Estás seguro de que quieres eliminar "{item.name}" del
                inventario?
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stock Information */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Stock Actual</span>
            <span className="font-semibold">
              {item.currentStock} {item.unit}
            </span>
          </div>

          {/* Stock Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all ${getStockBarColor()}`}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {item.minStock}</span>
            <span>Max: {item.maxStock}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">
            Precio por {item.unit}:
          </span>
          <span className="font-semibold ml-2">
            ${item.pricePerUnit.toFixed(2)}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementStock}
              disabled={item.currentStock <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="min-w-[3rem] text-center font-medium">
              {item.currentStock}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={incrementStock}
              disabled={item.currentStock >= item.maxStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Ver Detalles
          </Button>
        </div>

        {/* Quick Info */}
        <div className="space-y-1 text-xs text-muted-foreground">
          {item.expirationDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                Vence: {new Date(item.expirationDate).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{item.location}</span>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {item.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Información General</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categoría:</span>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock Actual:</span>
                  <span className="font-medium">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rango de Stock:</span>
                  <span>
                    {item.minStock} - {item.maxStock} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Precio por {item.unit}:
                  </span>
                  <span className="font-medium">
                    ${item.pricePerUnit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor Total:</span>
                  <span className="font-medium">
                    ${(item.currentStock * item.pricePerUnit).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Ubicación y Proveedor</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Ubicación:</span>
                    <p>{item.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Proveedor:</span>
                    <p>{item.supplier}</p>
                  </div>
                </div>
                {item.expirationDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">
                        Fecha de Vencimiento:
                      </span>
                      <p
                        className={
                          isExpiringSoon ? "text-orange-600 font-medium" : ""
                        }
                      >
                        {new Date(item.expirationDate).toLocaleDateString()}
                        {isExpiringSoon && " (Vence Pronto)"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {item.description && (
              <div>
                <h4 className="font-medium mb-2">Descripción</h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
