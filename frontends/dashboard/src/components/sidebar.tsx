import { BarChart3, CreditCard, DollarSign, Home, LogOut, Settings, TrendingUp } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id")
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/transactions", label: "Transações", icon: DollarSign },
    // { path: "/investments", label: "Investimentos", icon: TrendingUp },
    // { path: "/cards", label: "Cartões", icon: CreditCard },
    // { path: "/visual-analysis", label: "Análise Visual", icon: BarChart3 },
    { path: "/settings", label: "Configurações", icon: Settings },
    { label: "Sair", icon: LogOut, onClick: handleLogOut },
  ];

  return (
    <aside
      className="
        fixed inset-y-0 left-0 w-64
        bg-gray-950 border-r border-gray-800 shadow-2xl
        overflow-y-auto z-40
      "
    >
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-gray-100">Finance Dashboard</h1>
      </div>

      <nav className="mt-6 px-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon as any;
          const isActive = item.path ? location.pathname === item.path : false;

          if (!item.path) {
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center px-4 py-3 mb-1 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-gray-200 transition-all duration-200"
              >
                <Icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`w-full flex items-center px-4 py-3 mb-1 rounded-xl transition-all duration-200 group
                ${isActive
                  ? "bg-gray-800 text-gray-100 shadow-lg border border-gray-700"
                  : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
