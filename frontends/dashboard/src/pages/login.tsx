import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserService } from "../services/user_service";
// import { Link } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate();
 

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3001/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              });
              

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Erro ao fazer login")
            }

            

            console.log(data)
            localStorage.setItem("token", data.data);
            const me = await UserService.me();
            localStorage.setItem("user_id", me.id)
            navigate("/")

        } catch (err: any){
            
         } finally{
            setIsLoading(false)
         }
    }

    if (localStorage.getItem("token")) {
        return <Navigate to="/" replace />;
    }

    return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            {/* Background subtle texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 opacity-50"></div>

            <div className="relative w-full max-w-md">
                {/* Main login card */}
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-8 transition-all duration-300 hover:shadow-blue-600/10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-black text-3xl text-white mb-2 font-sans tracking-tight">
                            Bem-vindo de volta ao Moneto
                        </h1>
                        <p className="text-gray-400 font-sans text-sm"> Faça login para acessar seu painel financeiro personalizado.</p>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 font-sans">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 font-sans"
                                    placeholder="Digite seu email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 font-sans">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 font-sans"
                                    placeholder="Digite sua senha"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}

                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password link */}
                        <div className="text-right">
                            <a
                                href="/forgot-password"
                                className=" cursor-not-allowed text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-sans"
                            >
                                Esqueceu sua senha?
                            </a>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-600/25 font-sans group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Log In</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm font-sans">
                            Não tem conta ainda?{" "}
                            <a
                                href="/signup"
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                            >
                                Registre aqui
                            </a>
                        </p>
                    </div>
                </div>

                {/* Additional decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl"></div>
            </div>
        </main>
    )
}
export default LoginPage;