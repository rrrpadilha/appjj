import React from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Controle de Escolas de BJJ</h1>
      {user && user.role === 'admin' ? (
        <Dashboard />
      ) : (
        <p>Selecione uma opção no menu para começar.</p>
      )}
    </Layout>
  );
};

export default Home;