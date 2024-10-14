import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const Dashboard = () => {
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: api.getDashboardData,
  });

  const { data: eligibleStudents, isLoading: isEligibleStudentsLoading } = useQuery({
    queryKey: ['eligibleStudentsForGraduation'],
    queryFn: api.getEligibleStudentsForGraduation,
  });

  if (isDashboardLoading || isEligibleStudentsLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alunos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalAlunos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mensalidades Vencidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.mensalidadesVencidas}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Mensalidades Pagas (Ano)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {dashboardData.totalMensalidadesPagas.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pago (Mês Atual)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {dashboardData.totalPagoMes.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aniversariantes do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm">
            {dashboardData.aniversariantesMes.map((aniversariante, index) => (
              <li key={index}>{aniversariante.nome} (Dia {aniversariante.data})</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aniversariantes do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm">
            {dashboardData.aniversariantesDia.map((aniversariante, index) => (
              <li key={index}>{aniversariante.nome}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alunos Mais Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.alunosMaisFrequentes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="presencas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      </div>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Alunos Elegíveis para Graduação</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Última Graduação</TableHead>
                <TableHead>Presenças (últimos 6 meses)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eligibleStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.nome}</TableCell>
                  <TableCell>{new Date(student.dataUltimaGraduacao).toLocaleDateString()}</TableCell>
                  <TableCell>{student.presencas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
