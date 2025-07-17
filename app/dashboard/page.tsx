import { ChartAreaInteractive } from "@/components/clients-chart";
import { ChartBarDefault } from "@/components/pedidos-chart";
import { IngresosChart } from "@/components/ingresos-chart";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <ChartAreaInteractive />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
        <ChartBarDefault />
        <IngresosChart />
      </div>
    </div>
  );
}
