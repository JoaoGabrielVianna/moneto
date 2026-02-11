import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"


// ⚙️ Força o Vite a carregar o .env da raiz do monorepo (../../.env)
export default defineConfig(({ mode }) => {
  // 🔹 loadEnv lê o .env manualmente
  const env = loadEnv(mode, path.resolve(__dirname, "../../"), "")

  return {
    plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    define: {
      // 🔸 Expõe as variáveis como import.meta.env
      "import.meta.env.VITE_ENV_MODE": JSON.stringify(env.ENV_MODE),
      "import.meta.env.VITE_USER_SERVICE_PORT": JSON.stringify(env.USER_SERVICE_PORT),
      "import.meta.env.VITE_INCOME_SERVICE_PORT": JSON.stringify(env.INCOME_SERVICE_PORT),
      "import.meta.env.VITE_EXPENSE_SERVICE_PORT": JSON.stringify(env.EXPENSE_SERVICE_PORT),
      "import.meta.env.VITE_CATEGORY_SERVICE_PORT": JSON.stringify(env.CATEGORY_SERVICE_PORT),
      "import.meta.env.VITE_DATABASE_URL": JSON.stringify(env.DATABASE_URL),
      "import.meta.env.VITE_DASHBOARD_SERVICE_PORT": JSON.stringify(env.DASHBOARD_SERVICE_PORT),
      "import.meta.env.VITE_IMPORT_SERVICE_PORT": JSON.stringify(env.IMPORT_SERVICE_PORT),
    },
  }
})