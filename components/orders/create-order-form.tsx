"use client";

import { useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  User,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface Order {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderDate: string;
  deliveryDate: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  deliveryAddress?: string;
  paymentMethod: "cash" | "card" | "transfer";
  paymentStatus: "pending" | "paid" | "refunded";
}

interface CreateOrderFormProps {
  menuItems: MenuItem[];
  onSubmit: (order: Order) => void;
  onCancel: () => void;
}

export function CreateOrderForm({
  menuItems,
  onSubmit,
  onCancel,
}: CreateOrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryDate: "",
    deliveryAddress: "",
    paymentMethod: "cash" as const,
    paymentStatus: "pending" as const,
    notes: "",
  });

  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const TAX_RATE = 0.105; // 10.5% IVA

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.quantity * item.menuItem.price,
      0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const addMenuItem = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find(
      (item) => item.menuItem.id === menuItem.id
    );

    if (existingItem) {
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems((prev) => [...prev, { menuItem, quantity: 1 }]);
    }
  };

  const updateItemQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeMenuItem(menuItemId);
      return;
    }

    setSelectedItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const removeMenuItem = (menuItemId: string) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.menuItem.id !== menuItemId)
    );
  };

  const updateSpecialInstructions = (
    menuItemId: string,
    instructions: string
  ) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "El nombre del cliente es requerido";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "El teléfono es requerido";
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = "La fecha de entrega es requerida";
    } else {
      const deliveryDate = new Date(formData.deliveryDate);
      const now = new Date();
      if (deliveryDate < now) {
        newErrors.deliveryDate =
          "La fecha de entrega no puede ser en el pasado";
      }
    }

    if (selectedItems.length === 0) {
      newErrors.items = "Debe agregar al menos un item al pedido";
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "La dirección de entrega es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { subtotal, tax, total } = calculateTotals();

    const order: Order = {
      ...formData,
      orderDate: new Date().toISOString(),
      status: "pending",
      items: selectedItems,
      subtotal,
      tax,
      total,
      customerEmail: formData.customerEmail || undefined,
      notes: formData.notes || undefined,
    };

    onSubmit(order);
  };

  const { subtotal, tax, total } = calculateTotals();

  const availableMenuItems = menuItems.filter((item) => item.available);
  const categories = Array.from(
    new Set(availableMenuItems.map((item) => item.category))
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[70vh] overflow-y-auto w-full"
    >
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Información del Cliente
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre del Cliente *
            </label>
            <Input
              value={formData.customerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              placeholder="Nombre completo"
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono *</label>
            <Input
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerPhone: e.target.value,
                }))
              }
              placeholder="+34 612 345 678"
              className={errors.customerPhone ? "border-red-500" : ""}
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customerPhone}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Email (Opcional)
            </label>
            <Input
              type="email"
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerEmail: e.target.value,
                }))
              }
              placeholder="cliente@email.com"
            />
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Información de Entrega
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha y Hora de Entrega *
            </label>
            <Input
              type="datetime-local"
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  deliveryDate: e.target.value,
                }))
              }
              className={errors.deliveryDate ? "border-red-500" : ""}
            />
            {errors.deliveryDate && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Método de Pago
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Dirección de Entrega *
            </label>
            <Input
              value={formData.deliveryAddress}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  deliveryAddress: e.target.value,
                }))
              }
              placeholder="Calle, número, ciudad, código postal"
              className={errors.deliveryAddress ? "border-red-500" : ""}
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-xs mt-1">
                {errors.deliveryAddress}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Menu Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Seleccionar Menú</h3>

        {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}

        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-md border-b pb-1">{category}</h4>
            <div className="grid grid-cols-1 gap-2">
              {availableMenuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h5 className="font-medium">{item.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addMenuItem(item)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Items Seleccionados</h3>

          <div className="space-y-3">
            {selectedItems.map((item, index) => (
              <div
                key={item.menuItem.id}
                className="border rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium">{item.menuItem.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      €{item.menuItem.price.toFixed(2)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateItemQuantity(item.menuItem.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="min-w-[2rem] text-center font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateItemQuantity(item.menuItem.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMenuItem(item.menuItem.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right min-w-[4rem]">
                    <p className="font-semibold">
                      €{(item.quantity * item.menuItem.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <Input
                    placeholder="Instrucciones especiales (opcional)"
                    value={item.specialInstructions || ""}
                    onChange={(e) =>
                      updateSpecialInstructions(
                        item.menuItem.id,
                        e.target.value
                      )
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary */}
      {selectedItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resumen del Pedido</h3>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (10.5%):</span>
              <span>€{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Notas Adicionales
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Información adicional sobre el pedido..."
          rows={3}
          className="w-full px-3 py-2 border rounded-md bg-background resize-none"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={selectedItems.length === 0}>
          Crear Pedido
        </Button>
      </div>
    </form>
  );
}
