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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/alunos" element={<ProtectedRoute><Alunos /></ProtectedRoute>} />
            <Route path="/professores" element={<ProtectedRoute><Professores /></ProtectedRoute>} />
            <Route path="/turmas" element={<ProtectedRoute><Turmas /></ProtectedRoute>} />
            <Route path="/graduacoes" element={<ProtectedRoute><Graduacoes /></ProtectedRoute>} />
            <Route path="/mensalidades" element={<ProtectedRoute><Mensalidades /></ProtectedRoute>} />
            <Route path="/presencas" element={<ProtectedRoute><Presencas /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;