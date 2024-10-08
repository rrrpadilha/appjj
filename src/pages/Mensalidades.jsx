import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

const Mensalidades = () => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data: mensalidades, isLoading } = useQuery({
    queryKey: ['mensalidades'],
    queryFn: () => api.getItems('mensalidades')
  });

  const createMutation = useMutation({
    mutationFn: (novaMensalidade) => api.createItem('mensalidades', novaMensalidade),
    onSuccess: () => {
      queryClient.invalidateQueries(['mensalidades']);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('mensalidades', id),
    onSuccess: () => queryClient.invalidateQueries(['mensalidades'])
  });

  const onSubmit = (data) => createMutation.mutate(data);

  if (isLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Controle de Mensalidades</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <Input {...register('aluno')} placeholder="Nome do Aluno" />
        <Input {...register('valor')} placeholder="Valor" type="number" step="0.01" />
        <Input {...register('dataVencimento')} placeholder="Data de Vencimento" type="date" />
        <Button type="submit">Adicionar Mensalidade</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mensalidades.map((mensalidade) => (
            <TableRow key={mensalidade.id}>
              <TableCell>{mensalidade.aluno}</TableCell>
              <TableCell>R$ {mensalidade.valor}</TableCell>
              <TableCell>{mensalidade.dataVencimento}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteMutation.mutate(mensalidade.id)}>
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
};

export default Mensalidades;