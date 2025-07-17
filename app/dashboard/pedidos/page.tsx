"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Eye,
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
import { OrderCard } from "@/components/orders/order-card";
import { CreateOrderForm } from "@/components/orders/create-order-form";
import { OrderDetailsModal } from "@/components/orders/order-details-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
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

// Mock data para menús disponibles
const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Paella Valenciana",
    description: "Arroz con pollo, conejo, verduras y azafrán",
    price: 45.0,
    category: "Platos Principales",
    available: true,
  },
  {
    id: "2",
    name: "Lasaña de Carne",
    description: "Pasta con carne bolognesa, bechamel y queso",
    price: 35.0,
    category: "Platos Principales",
    available: true,
  },
  {
    id: "3",
    name: "Ensalada César",
    description: "Lechuga, pollo, crutones, parmesano y aderezo césar",
    price: 18.0,
    category: "Ensaladas",
    available: true,
  },
  {
    id: "4",
    name: "Tiramisú",
    description: "Postre italiano con café, mascarpone y cacao",
    price: 12.0,
    category: "Postres",
    available: true,
  },
  {
    id: "5",
    name: "Salmón a la Plancha",
    description: "Filete de salmón con verduras al vapor",
    price: 42.0,
    category: "Platos Principales",
    available: false,
  },
];

// Mock data para pedidos
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "PED-2025-001",
    customerName: "María González",
    customerPhone: "+34 612 345 678",
    customerEmail: "maria.gonzalez@email.com",
    orderDate: "2025-07-15T10:30:00",
    deliveryDate: "2025-07-18T14:00:00",
    status: "confirmed",
    items: [
      {
        menuItem: mockMenuItems[0],
        quantity: 2,
        specialInstructions: "Sin mariscos por favor",
      },
      {
        menuItem: mockMenuItems[2],
        quantity: 1,
      },
    ],
    subtotal: 108.0,
    tax: 11.34,
    total: 119.34,
    notes: "Evento corporativo - 20 personas",
    deliveryAddress: "Calle Mayor 123, Madrid",
    paymentMethod: "transfer",
    paymentStatus: "paid",
  },
  {
    id: "2",
    orderNumber: "PED-2025-002",
    customerName: "Carlos Rodríguez",
    customerPhone: "+34 687 123 456",
    orderDate: "2025-07-16T09:15:00",
    deliveryDate: "2025-07-17T19:30:00",
    status: "preparing",
    items: [
      {
        menuItem: mockMenuItems[1],
        quantity: 3,
      },
      {
        menuItem: mockMenuItems[3],
        quantity: 3,
      },
    ],
    subtotal: 141.0,
    tax: 14.81,
    total: 155.81,
    notes: "Cumpleaños familiar",
    deliveryAddress: "Avenida de la Paz 45, Barcelona",
    paymentMethod: "card",
    paymentStatus: "paid",
  },
  {
    id: "3",
    orderNumber: "PED-2025-003",
    customerName: "Ana Martín",
    customerPhone: "+34 654 987 321",
    orderDate: "2025-07-17T11:45:00",
    deliveryDate: "2025-07-20T13:00:00",
    status: "pending",
    items: [
      {
        menuItem: mockMenuItems[0],
        quantity: 1,
      },
      {
        menuItem: mockMenuItems[2],
        quantity: 2,
        specialInstructions: "Aderezo aparte",
      },
      {
        menuItem: mockMenuItems[3],
        quantity: 1,
      },
    ],
    subtotal: 93.0,
    tax: 9.77,
    total: 102.77,
    deliveryAddress: "Plaza del Sol 8, Valencia",
    paymentMethod: "cash",
    paymentStatus: "pending",
  },
];

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const statusLabels = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    ready: "Listo",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    preparing: "bg-orange-100 text-orange-800 border-orange-200",
    ready: "bg-green-100 text-green-800 border-green-200",
    delivered: "bg-gray-100 text-gray-800 border-gray-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const paymentLabels = {
    pending: "Pendiente",
    paid: "Pagado",
    refunded: "Reembolsado",
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesPayment =
      filterPayment === "all" || order.paymentStatus === filterPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const addNewOrder = (newOrder: Omit<Order, "id" | "orderNumber">) => {
    const order: Order = {
      ...newOrder,
      id: Date.now().toString(),
      orderNumber: `PED-2025-${String(orders.length + 1).padStart(3, "0")}`,
    };
    setOrders((prev) => [...prev, order]);
    setIsCreateDialogOpen(false);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Estadísticas
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const todayRevenue = orders
    .filter(
      (o) => new Date(o.orderDate).toDateString() === new Date().toDateString()
    )
    .reduce((sum, o) => sum + o.total, 0);
  const confirmedOrders = orders.filter(
    (o) => o.status === "confirmed" || o.status === "preparing"
  ).length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">
            Administra los pedidos de catering de tus clientes
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Pedido</DialogTitle>
            </DialogHeader>
            <CreateOrderForm
              menuItems={mockMenuItems}
              onSubmit={addNewOrder}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Total Pedidos</span>
          </div>
          <p className="text-2xl font-bold mt-2">{totalOrders}</p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">Pendientes</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-yellow-600">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">En Proceso</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">
            {confirmedOrders}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-medium">Ingresos Hoy</span>
          </div>
          <p className="text-2xl font-bold mt-2 text-emerald-600">
            €{todayRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de pedido, cliente o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="preparing">Preparando</SelectItem>
            <SelectItem value="ready">Listo</SelectItem>
            <SelectItem value="delivered">Entregado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los pagos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pagos</SelectItem>
            <SelectItem value="pending">Pago Pendiente</SelectItem>
            <SelectItem value="paid">Pagado</SelectItem>
            <SelectItem value="refunded">Reembolsado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            statusLabels={statusLabels}
            statusColors={statusColors}
            paymentLabels={paymentLabels}
            onUpdateStatus={updateOrderStatus}
            onDelete={deleteOrder}
            onViewDetails={viewOrderDetails}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No se encontraron pedidos
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterStatus !== "all" || filterPayment !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza creando tu primer pedido"}
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          menuItems={mockMenuItems}
          statusLabels={statusLabels}
          statusColors={statusColors}
          paymentLabels={paymentLabels}
          open={showOrderDetails}
          onOpenChange={setShowOrderDetails}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}
