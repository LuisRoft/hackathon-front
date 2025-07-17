"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

export const description = "Gráfico de pedidos por período";

// Datos simulados para pedidos por día (últimos 7 días)
const chartDataDaily = [
  { period: "Lun", pedidos: 45 },
  { period: "Mar", pedidos: 52 },
  { period: "Mié", pedidos: 38 },
  { period: "Jue", pedidos: 61 },
  { period: "Vie", pedidos: 73 },
  { period: "Sáb", pedidos: 89 },
  { period: "Dom", pedidos: 67 },
];

// Datos simulados para pedidos por semana (últimas 8 semanas)
const chartDataWeekly = [
  { period: "Sem 1", pedidos: 310 },
  { period: "Sem 2", pedidos: 285 },
  { period: "Sem 3", pedidos: 342 },
  { period: "Sem 4", pedidos: 298 },
  { period: "Sem 5", pedidos: 365 },
  { period: "Sem 6", pedidos: 421 },
  { period: "Sem 7", pedidos: 398 },
  { period: "Sem 8", pedidos: 425 },
];

// Datos simulados para pedidos por mes (últimos 6 meses)
const chartDataMonthly = [
  { period: "Enero", pedidos: 1245 },
  { period: "Febrero", pedidos: 1380 },
  { period: "Marzo", pedidos: 1156 },
  { period: "Abril", pedidos: 1523 },
  { period: "Mayo", pedidos: 1687 },
  { period: "Junio", pedidos: 1834 },
];

const chartConfig = {
  pedidos: {
    label: "Pedidos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type PeriodType = "daily" | "weekly" | "monthly";

export function ChartBarDefault() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");

  const getChartData = () => {
    switch (selectedPeriod) {
      case "daily":
        return chartDataDaily;
      case "weekly":
        return chartDataWeekly;
      case "monthly":
        return chartDataMonthly;
      default:
        return chartDataDaily;
    }
  };

  const getTitle = () => {
    switch (selectedPeriod) {
      case "daily":
        return "Pedidos por Día";
      case "weekly":
        return "Pedidos por Semana";
      case "monthly":
        return "Pedidos por Mes";
      default:
        return "Pedidos";
    }
  };

  const getDescription = () => {
    switch (selectedPeriod) {
      case "daily":
        return "Últimos 7 días";
      case "weekly":
        return "Últimas 8 semanas";
      case "monthly":
        return "Últimos 6 meses";
      default:
        return "";
    }
  };

  const getTrend = () => {
    const data = getChartData();
    const lastValue = data[data.length - 1]?.pedidos || 0;
    const previousValue = data[data.length - 2]?.pedidos || 0;
    const percentage =
      previousValue > 0
        ? (((lastValue - previousValue) / previousValue) * 100).toFixed(1)
        : 0;
    return { percentage, isPositive: lastValue >= previousValue };
  };

  const trend = getTrend();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("daily")}
            >
              Día
            </Button>
            <Button
              variant={selectedPeriod === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("weekly")}
            >
              Semana
            </Button>
            <Button
              variant={selectedPeriod === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("monthly")}
            >
              Mes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={getChartData()}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="pedidos" fill="var(--color-pedidos)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {trend.isPositive ? "Incremento" : "Disminución"} del{" "}
          {Math.abs(Number(trend.percentage))}% respecto al período anterior
          <TrendingUp
            className={`h-4 w-4 ${
              trend.isPositive ? "text-green-600" : "text-red-600 rotate-180"
            }`}
          />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando total de pedidos para el período seleccionado
        </div>
      </CardFooter>
    </Card>
  );
}
