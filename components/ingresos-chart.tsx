"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

export const description = "Distribución de ingresos por categoría de catering";

const chartData = [
  {
    category: "eventos_corporativos",
    ingresos: 4250,
    fill: "var(--color-eventos_corporativos)",
  },
  { category: "bodas", ingresos: 3800, fill: "var(--color-bodas)" },
  { category: "cumpleanos", ingresos: 2100, fill: "var(--color-cumpleanos)" },
  {
    category: "catering_domicilio",
    ingresos: 1650,
    fill: "var(--color-catering_domicilio)",
  },
  {
    category: "otros_eventos",
    ingresos: 1200,
    fill: "var(--color-otros_eventos)",
  },
];

const chartConfig = {
  ingresos: {
    label: "Ingresos (€)",
  },
  eventos_corporativos: {
    label: "Eventos Corporativos",
    color: "var(--chart-1)",
  },
  bodas: {
    label: "Bodas",
    color: "var(--chart-2)",
  },
  cumpleanos: {
    label: "Cumpleaños",
    color: "var(--chart-3)",
  },
  catering_domicilio: {
    label: "Catering a Domicilio",
    color: "var(--chart-4)",
  },
  otros_eventos: {
    label: "Otros Eventos",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function IngresosChart() {
  const totalIngresos = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.ingresos, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Ingresos por Categoría</CardTitle>
        <CardDescription>Distribución mensual - Julio 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="ingresos"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          €{totalIngresos.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Mensual
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Crecimiento del 8.3% este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Ingresos totales por categoría de catering
        </div>
      </CardFooter>
    </Card>
  );
}
