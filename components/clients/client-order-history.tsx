"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Client, Order } from "@/app/dashboard/clientes/page";

interface ClientOrderHistoryProps {
  client: Client;
  orders: Order[];
}

export function ClientOrderHistory({
  client,
  orders,
}: ClientOrderHistoryProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">Completado</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Estadísticas del cliente
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;

  return (
    <div className="space-y-6">
      {/* Estadísticas del cliente */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{orders.length}</p>
          <p className="text-sm text-muted-foreground">Total Pedidos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
          <p className="text-sm text-muted-foreground">Completados</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-sm text-muted-foreground">Total Gastado</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(averageOrderValue)}
          </p>
          <p className="text-sm text-muted-foreground">Promedio por Pedido</p>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Historial de Pedidos</h3>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Este cliente aún no ha realizado pedidos.
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Número de Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleOrderExpansion(order.id)}
                        >
                          {expandedOrders.has(order.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                    </TableRow>
                    {expandedOrders.has(order.id) && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="px-4 py-3 bg-muted/25">
                            <h4 className="font-medium mb-2">
                              Detalles del Pedido
                            </h4>
                            <div className="space-y-1">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(item.quantity * item.price)}
                                  </span>
                                </div>
                              ))}
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between items-center font-medium">
                                  <span>Total del Pedido:</span>
                                  <span>{formatCurrency(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
