"use client";

import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  User,
  Package,
  FileText,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  id: string;
  orderNumber: string;
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

interface OrderDetailsModalProps {
  order: Order;
  menuItems: MenuItem[];
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  paymentLabels: Record<string, string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderId: string, newStatus: Order["status"]) => void;
}

export function OrderDetailsModal({
  order,
  statusLabels,
  statusColors,
  paymentLabels,
  open,
  onOpenChange,
  onUpdateStatus,
}: OrderDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodLabel = () => {
    switch (order.paymentMethod) {
      case "card":
        return "Tarjeta";
      case "transfer":
        return "Transferencia";
      default:
        return "Efectivo";
    }
  };

  const getPaymentMethodIcon = () => {
    switch (order.paymentMethod) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "transfer":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <span className="text-sm">💵</span>;
    }
  };

  const getNextStatus = () => {
    switch (order.status) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "delivered";
      default:
        return null;
    }
  };

  const getNextStatusLabel = () => {
    const nextStatus = getNextStatus();
    return nextStatus ? statusLabels[nextStatus] : null;
  };

  const isOverdue =
    new Date(order.deliveryDate) < new Date() &&
    !["delivered", "cancelled"].includes(order.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full min-w-fit">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalles del Pedido {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
                <Badge variant="outline">
                  {paymentLabels[order.paymentStatus]}
                </Badge>
                {isOverdue && <Badge variant="destructive">Vencido</Badge>}
              </div>

              {getNextStatus() && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, getNextStatus()!)}
                >
                  Marcar como {getNextStatusLabel()}
                </Button>
              )}
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Items del Pedido</h3>

              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.menuItem.name}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {item.menuItem.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Cantidad: {item.quantity}</span>
                          <span>
                            Precio unitario: €{item.menuItem.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          €{(item.quantity * item.menuItem.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {item.specialInstructions && (
                      <div className="mt-2 p-2 text-black bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <strong>Instrucciones especiales:</strong>{" "}
                        {item.specialInstructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>€{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (10.5%):</span>
                    <span>€{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>€{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notas del Pedido
                </h3>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </label>
                  <p className="font-medium">{order.customerName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.customerPhone}</span>
                </div>

                {order.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Entrega
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha y Hora
                  </label>
                  <p
                    className={`font-medium ${isOverdue ? "text-red-600" : ""}`}
                  >
                    {formatDate(order.deliveryDate)}
                    {isOverdue && " (Vencido)"}
                  </p>
                </div>

                {order.deliveryAddress && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Dirección
                    </label>
                    <p className="text-sm">{order.deliveryAddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pago
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon()}
                  <span className="text-sm">{getPaymentMethodLabel()}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado del Pago
                  </label>
                  <p className="font-medium">
                    <Badge variant="outline">
                      {paymentLabels[order.paymentStatus]}
                    </Badge>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Total a Pagar
                  </label>
                  <p className="text-xl font-bold">€{order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Order Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fechas
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha del Pedido
                  </label>
                  <p className="text-sm">{formatDate(order.orderDate)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Entrega
                  </label>
                  <p
                    className={`text-sm ${
                      isOverdue ? "text-red-600 font-medium" : ""
                    }`}
                  >
                    {formatDate(order.deliveryDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Acciones Rápidas
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {order.status === "pending" && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onUpdateStatus(order.id, "confirmed")}
                  >
                    Confirmar Pedido
                  </Button>
                )}

                {order.status === "confirmed" && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onUpdateStatus(order.id, "preparing")}
                  >
                    Iniciar Preparación
                  </Button>
                )}

                {order.status === "preparing" && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onUpdateStatus(order.id, "ready")}
                  >
                    Marcar como Listo
                  </Button>
                )}

                {order.status === "ready" && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onUpdateStatus(order.id, "delivered")}
                  >
                    Marcar como Entregado
                  </Button>
                )}

                {!["delivered", "cancelled"].includes(order.status) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => onUpdateStatus(order.id, "cancelled")}
                  >
                    Cancelar Pedido
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
