"use client";

import { useState } from "react";
import { ClientsDataTable } from "@/components/clients/clients-data-table";
import { ClientForm } from "@/components/clients/client-form";
import { ClientOrderHistory } from "@/components/clients/client-order-history";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Tipos de datos
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Order {
  id: string;
  clientId: string;
  orderNumber: string;
  date: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Datos fake
const fakeClients: Client[] = [
  {
    id: "1",
    name: "Ana García",
    email: "ana.garcia@email.com",
    phone: "+34 612 345 678",
    address: "Calle Mayor 123, Madrid",
    totalOrders: 15,
    totalSpent: 342.5,
    lastOrderDate: "2024-06-28",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+34 623 456 789",
    address: "Avenida Central 45, Barcelona",
    totalOrders: 8,
    totalSpent: 156.75,
    lastOrderDate: "2024-06-25",
    status: "active",
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "María López",
    email: "maria.lopez@email.com",
    phone: "+34 634 567 890",
    address: "Plaza España 67, Valencia",
    totalOrders: 22,
    totalSpent: 487.25,
    lastOrderDate: "2024-06-30",
    status: "active",
    createdAt: "2023-11-20",
  },
  {
    id: "4",
    name: "José Martínez",
    email: "jose.martinez@email.com",
    phone: "+34 645 678 901",
    address: "Calle Luna 89, Sevilla",
    totalOrders: 3,
    totalSpent: 67.5,
    lastOrderDate: "2024-05-15",
    status: "inactive",
    createdAt: "2024-05-01",
  },
  {
    id: "5",
    name: "Laura Sánchez",
    email: "laura.sanchez@email.com",
    phone: "+34 656 789 012",
    address: "Paseo del Prado 234, Madrid",
    totalOrders: 12,
    totalSpent: 298.8,
    lastOrderDate: "2024-06-27",
    status: "active",
    createdAt: "2024-03-08",
  },
];

const fakeOrders: Order[] = [
  {
    id: "ord-1",
    clientId: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-06-28",
    total: 45.5,
    status: "completed",
    items: [
      { id: "1", name: "Pizza Margherita", quantity: 1, price: 12.5 },
      { id: "2", name: "Ensalada César", quantity: 2, price: 8.75 },
      { id: "3", name: "Coca Cola", quantity: 2, price: 2.5 },
    ],
  },
  {
    id: "ord-2",
    clientId: "1",
    orderNumber: "ORD-2024-002",
    date: "2024-06-25",
    total: 32.25,
    status: "completed",
    items: [
      { id: "4", name: "Hamburguesa Clásica", quantity: 1, price: 15.5 },
      { id: "5", name: "Papas Fritas", quantity: 1, price: 6.75 },
      { id: "6", name: "Agua", quantity: 2, price: 2.0 },
    ],
  },
  {
    id: "ord-3",
    clientId: "2",
    orderNumber: "ORD-2024-003",
    date: "2024-06-25",
    total: 28.75,
    status: "completed",
    items: [
      { id: "7", name: "Pasta Carbonara", quantity: 1, price: 14.5 },
      { id: "8", name: "Pan de Ajo", quantity: 1, price: 4.25 },
      { id: "9", name: "Vino Tinto", quantity: 1, price: 10.0 },
    ],
  },
];

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(fakeClients);
  const [orders, setOrders] = useState<Order[]>(fakeOrders);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Funciones CRUD - listas para conectar con backend
  const createClient = async (
    clientData: Omit<
      Client,
      "id" | "createdAt" | "totalOrders" | "totalSpent" | "lastOrderDate"
    >
  ) => {
    // TODO: Reemplazar con llamada al backend
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: "",
    };
    setClients([...clients, newClient]);
    setIsCreateDialogOpen(false);
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    // TODO: Reemplazar con llamada al backend
    setClients(
      clients.map((client) =>
        client.id === id ? { ...client, ...clientData } : client
      )
    );
    setIsEditDialogOpen(false);
    setSelectedClient(null);
  };

  const deleteClient = async (id: string) => {
    // TODO: Reemplazar con llamada al backend
    setClients(clients.filter((client) => client.id !== id));
  };

  const getClientOrders = (clientId: string): Order[] => {
    // TODO: Reemplazar con llamada al backend
    return orders.filter((order) => order.clientId === clientId);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  const handleViewHistory = (client: Client) => {
    setSelectedClient(client);
    setIsOrderHistoryOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra la información de tus clientes y su historial de pedidos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm onSubmit={createClient} />
          </DialogContent>
        </Dialog>
      </div>

      <ClientsDataTable
        data={clients}
        onEdit={handleEdit}
        onDelete={deleteClient}
        onViewHistory={handleViewHistory}
      />

      {/* Dialog para editar cliente */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientForm
              client={selectedClient}
              onSubmit={(
                data: Omit<
                  Client,
                  | "id"
                  | "createdAt"
                  | "totalOrders"
                  | "totalSpent"
                  | "lastOrderDate"
                >
              ) => updateClient(selectedClient.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para historial de pedidos */}
      <Dialog open={isOrderHistoryOpen} onOpenChange={setIsOrderHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Historial de Pedidos - {selectedClient?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientOrderHistory
              client={selectedClient}
              orders={getClientOrders(selectedClient.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
