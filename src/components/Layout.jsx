import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-secondary p-4">
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          {user && (
            <>
              <li><Link to="/alunos" className="hover:text-primary">Alunos</Link></li>
              <li><Link to="/professores" className="hover:text-primary">Professores</Link></li>
              <li><Link to="/turmas" className="hover:text-primary">Turmas</Link></li>
              <li><Link to="/graduacoes" className="hover:text-primary">Graduações</Link></li>
              <li><Link to="/mensalidades" className="hover:text-primary">Mensalidades</Link></li>
              <li><Link to="/presencas" className="hover:text-primary">Presenças</Link></li>
            </>
          )}
          <li className="ml-auto">
            {user ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <Link to="/login" className="hover:text-primary">Login</Link>
            )}
          </li>
        </ul>
      </nav>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;