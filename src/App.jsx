import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Alunos from "./pages/Alunos";
import Professores from "./pages/Professores";
import Turmas from "./pages/Turmas";
import Graduacoes from "./pages/Graduacoes";
import Mensalidades from "./pages/Mensalidades";
import Presencas from "./pages/Presencas";
import Relatorios from "./pages/Relatorios";
import PerfilAluno from "./pages/PerfilAluno";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/alunos" element={<ProtectedRoute allowedRoles={['admin']}><Alunos /></ProtectedRoute>} />
    <Route path="/professores" element={<ProtectedRoute allowedRoles={['admin']}><Professores /></ProtectedRoute>} />
    <Route path="/turmas" element={<ProtectedRoute allowedRoles={['admin']}><Turmas /></ProtectedRoute>} />
    <Route path="/graduacoes" element={<ProtectedRoute allowedRoles={['admin']}><Graduacoes /></ProtectedRoute>} />
    <Route path="/mensalidades" element={<ProtectedRoute allowedRoles={['admin']}><Mensalidades /></ProtectedRoute>} />
    <Route path="/presencas" element={<ProtectedRoute allowedRoles={['admin']}><Presencas /></ProtectedRoute>} />
    <Route path="/relatorios" element={<ProtectedRoute allowedRoles={['admin']}><Relatorios /></ProtectedRoute>} />
    <Route path="/perfil" element={<ProtectedRoute allowedRoles={['aluno']}><PerfilAluno /></ProtectedRoute>} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;