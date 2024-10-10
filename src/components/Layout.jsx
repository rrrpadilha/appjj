import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { to: "/", label: "Home" },
    ...(auth && auth.user && auth.user.role === 'admin' ? [
      { to: "/alunos", label: "Alunos" },
      { to: "/professores", label: "Professores" },
      { to: "/turmas", label: "Turmas" },
      { to: "/graduacoes", label: "Graduações" },
      { to: "/mensalidades", label: "Mensalidades" },
      { to: "/presencas", label: "Presenças" },
      { to: "/relatorios", label: "Relatórios" },
    ] : []),
    ...(auth && auth.user && auth.user.role === 'aluno' ? [
      { to: "/perfil", label: "Meu Perfil" },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-secondary p-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Controle de Escolas de BJJ</Link>
          <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <ul className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-primary">{item.label}</Link>
              </li>
            ))}
            {auth && auth.user ? (
              <li>
                <Button onClick={handleLogout}>Logout</Button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="hover:text-primary">Login</Link>
              </li>
            )}
          </ul>
        </div>
        {isMenuOpen && (
          <ul className="md:hidden mt-4 space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="block hover:text-primary" onClick={toggleMenu}>{item.label}</Link>
              </li>
            ))}
            {auth && auth.user ? (
              <li>
                <Button onClick={() => { handleLogout(); toggleMenu(); }}>Logout</Button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="block hover:text-primary" onClick={toggleMenu}>Login</Link>
              </li>
            )}
          </ul>
        )}
      </nav>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;