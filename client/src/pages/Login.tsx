import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Lock, LogIn } from "lucide-react";

export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [, setLocation] = useLocation();
  
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
      // O cookie httpOnly será definido pelo servidor
      window.location.href = "/";
    },
    onError: (err) => {
      toast.error(err.message || "Credenciais inválidas");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }
    loginMutation.mutate({ login, senha });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Header */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-500 text-white p-4 rounded-full">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Aluguel Manager
          </h1>
          <p className="text-center text-gray-600 text-sm mb-8">
            Sistema de Gerenciamento de Aluguéis
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuário
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loginMutation.isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loginMutation.isPending}
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            Sistema protegido • Informações confidenciais
          </p>
        </div>
      </div>
    </div>
  );
}
