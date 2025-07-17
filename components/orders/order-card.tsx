"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

interface OrderCardProps {
  order: Order;
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  paymentLabels: Record<string, string>;
  onUpdateStatus: (orderId: string, newStatus: Order["status"]) => void;
  onDelete: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
}

export function OrderCard({
  order,
  statusLabels,
  statusColors,
  paymentLabels,
  onUpdateStatus,
  onDelete,
  onViewDetails,
}: OrderCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodIcon = () => {
    switch (order.paymentMethod) {
      case "card":
        return <CreditCard className="h-3 w-3" />;
      case "transfer":
        return <CreditCard className="h-3 w-3" />;
      default:
        return <span className="text-xs">💵</span>;
    }
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

  const confirmDelete = () => {
    onDelete(order.id);
    setShowDeleteConfirm(false);
  };

  const isOverdue =
    new Date(order.deliveryDate) < new Date() &&
    !["delivered", "cancelled"].includes(order.status);

  return (
    <>
      <div
        className={`bg-card rounded-lg border p-4 transition-all hover:shadow-md w-full ${
          isOverdue ? "border-red-200 bg-red-50" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Vencido
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-2">{order.customerName}</p>
            <div className="flex items-center gap-3">
              <Badge className={statusColors[order.status]}>
                {statusLabels[order.status]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {paymentLabels[order.paymentStatus]}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(order)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onUpdateStatus(order.id, "confirmed")}
                disabled={
                  order.status === "delivered" || order.status === "cancelled"
                }
              >
                Confirmar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateStatus(order.id, "preparing")}
                disabled={
                  order.status === "delivered" || order.status === "cancelled"
                }
              >
                Marcar Preparando
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateStatus(order.id, "ready")}
                disabled={
                  order.status === "delivered" || order.status === "cancelled"
                }
              >
                Marcar Listo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateStatus(order.id, "delivered")}
                disabled={
                  order.status === "delivered" || order.status === "cancelled"
                }
              >
                Marcar Entregado
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{order.customerPhone}</span>
          </div>
          {order.customerEmail && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{order.customerEmail}</span>
            </div>
          )}
          {order.deliveryAddress && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-3 w-3 mt-0.5" />
              <span className="text-xs">{order.deliveryAddress}</span>
            </div>
          )}
        </div>

        {/* Order Items Summary */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">
            Items del Pedido ({order.items.length})
          </h4>
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.menuItem.name}
                </span>
                <span className="font-medium">
                  €{(item.quantity * item.menuItem.price).toFixed(2)}
                </span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{order.items.length - 2} items más...
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="mb-4 space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Pedido: {formatDate(order.orderDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              Entrega: {formatDate(order.deliveryDate)}
            </span>
          </div>
        </div>

        {/* Payment & Total */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {getPaymentMethodIcon()}
              <span>{getPaymentMethodLabel()}</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-bold text-lg">€{order.total.toFixed(2)}</div>
            </div>
          </div>

          {order.notes && (
            <div className="mt-2 p-2 bg-muted rounded text-xs">
              <strong>Notas:</strong> {order.notes}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(order)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver Detalle
          </Button>
          {order.status === "pending" && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onUpdateStatus(order.id, "confirmed")}
            >
              Confirmar
            </Button>
          )}
          {order.status === "confirmed" && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onUpdateStatus(order.id, "preparing")}
            >
              Preparar
            </Button>
          )}
          {order.status === "ready" && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onUpdateStatus(order.id, "delivered")}
            >
              Entregar
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>
            ¿Estás seguro de que quieres eliminar el pedido "{order.orderNumber}
            "? Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
