import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo deslocado 16rem (w-64) para a direita */}
      <main className="ml-64 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
