import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

const PerfilAluno = () => {
  const { user } = useAuth();

  const { data: alunoData, isLoading } = useQuery({
    queryKey: ['alunoData', user.id],
    queryFn: () => api.getAlunoData(user.id),
    enabled: !!user && user.role === 'aluno'
  });

  if (isLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Nome:</strong> {alunoData.nome}</p>
            <p><strong>Email:</strong> {alunoData.email}</p>
            <p><strong>Graduação Atual:</strong> {alunoData.graduacao.cor}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data de Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunoData.mensalidades.map((mensalidade) => (
                  <TableRow key={mensalidade.id}>
                    <TableCell>{mensalidade.dataVencimento}</TableCell>
                    <TableCell>R$ {mensalidade.valor.toFixed(2)}</TableCell>
                    <TableCell>{mensalidade.pago ? 'Pago' : 'Em aberto'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presenças</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Presença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunoData.presencas.map((presenca) => (
                  <TableRow key={presenca.id}>
                    <TableCell>{presenca.data}</TableCell>
                    <TableCell>{presenca.presente ? 'Presente' : 'Ausente'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PerfilAluno;