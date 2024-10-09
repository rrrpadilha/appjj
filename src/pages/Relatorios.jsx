import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Relatorios = () => {
  const [alunosFilters, setAlunosFilters] = useState({});
  const [mensalidadesFilters, setMensalidadesFilters] = useState({ pago: '', periodo: '' });

  const { data: alunos, isLoading: alunosLoading } = useQuery({
    queryKey: ['alunos'],
    queryFn: () => api.getItems('alunos')
  });

  const { data: mensalidades, isLoading: mensalidadesLoading } = useQuery({
    queryKey: ['mensalidades'],
    queryFn: () => api.getItems('mensalidades')
  });

  const { data: graduacoes, isLoading: graduacoesLoading } = useQuery({
    queryKey: ['graduacoes'],
    queryFn: () => api.getItems('graduacoes')
  });

  const filteredAlunos = alunos?.filter(aluno => {
    return Object.entries(alunosFilters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'graduacaoAtualId' || key === 'graduacaoAnteriorId') {
        return aluno[key] === parseInt(value);
      }
      return aluno[key].toLowerCase().includes(value.toLowerCase());
    });
  });

  const filteredMensalidades = mensalidades?.filter(mensalidade => {
    if (mensalidadesFilters.pago && mensalidade.pago.toString() !== mensalidadesFilters.pago) {
      return false;
    }
    if (mensalidadesFilters.periodo) {
      const [start, end] = mensalidadesFilters.periodo.split(',');
      const dataVencimento = new Date(mensalidade.dataVencimento);
      return dataVencimento >= new Date(start) && dataVencimento <= new Date(end);
    }
    return true;
  });

  const aniversariantes = alunos?.filter(aluno => {
    const dataNascimento = new Date(aluno.dataNascimento);
    const currentMonth = new Date().getMonth();
    return dataNascimento.getMonth() === currentMonth;
  });

  if (alunosLoading || mensalidadesLoading || graduacoesLoading) {
    return <Layout><div>Carregando...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
      <Tabs defaultValue="alunos">
        <TabsList>
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
          <TabsTrigger value="aniversariantes">Aniversariantes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alunos">
          <h2 className="text-xl font-semibold mb-2">Relatório de Alunos</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Nome"
              onChange={(e) => setAlunosFilters({...alunosFilters, nome: e.target.value})}
            />
            <Input
              placeholder="Email"
              onChange={(e) => setAlunosFilters({...alunosFilters, email: e.target.value})}
            />
            <Input
              placeholder="CPF"
              onChange={(e) => setAlunosFilters({...alunosFilters, cpf: e.target.value})}
            />
            <Select onValueChange={(value) => setAlunosFilters({...alunosFilters, graduacaoAtualId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Graduação Atual" />
              </SelectTrigger>
              <SelectContent>
                {graduacoes.map((graduacao) => (
                  <SelectItem key={graduacao.id} value={graduacao.id.toString()}>{graduacao.cor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Graduação Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.nome}</TableCell>
                  <TableCell>{aluno.email}</TableCell>
                  <TableCell>{aluno.cpf}</TableCell>
                  <TableCell>{graduacoes.find(g => g.id === aluno.graduacaoAtualId)?.cor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="mensalidades">
          <h2 className="text-xl font-semibold mb-2">Relatório de Mensalidades</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select onValueChange={(value) => setMensalidadesFilters({...mensalidadesFilters, pago: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status de Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Pago</SelectItem>
                <SelectItem value="false">Não Pago</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="Período"
              onChange={(e) => {
                const endDate = new Date(e.target.value);
                endDate.setMonth(endDate.getMonth() + 1);
                setMensalidadesFilters({
                  ...mensalidadesFilters,
                  periodo: `${e.target.value},${endDate.toISOString().split('T')[0]}`
                });
              }}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMensalidades.map((mensalidade) => (
                <TableRow key={mensalidade.id}>
                  <TableCell>{alunos.find(a => a.id === mensalidade.alunoId)?.nome}</TableCell>
                  <TableCell>R$ {mensalidade.valor.toFixed(2)}</TableCell>
                  <TableCell>{mensalidade.dataVencimento}</TableCell>
                  <TableCell>{mensalidade.pago ? 'Pago' : 'Não Pago'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="aniversariantes">
          <h2 className="text-xl font-semibold mb-2">Aniversariantes do Mês</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Nascimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aniversariantes.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.nome}</TableCell>
                  <TableCell>{format(new Date(aluno.dataNascimento), "d 'de' MMMM", { locale: ptBR })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Relatorios;