import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

const Graduacoes = () => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data: graduacoes, isLoading } = useQuery({
    queryKey: ['graduacoes'],
    queryFn: () => api.getItems('graduacoes')
  });

  const createMutation = useMutation({
    mutationFn: (novaGraduacao) => api.createItem('graduacoes', novaGraduacao),
    onSuccess: () => {
      queryClient.invalidateQueries(['graduacoes']);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('graduacoes', id),
    onSuccess: () => queryClient.invalidateQueries(['graduacoes'])
  });

  const onSubmit = (data) => createMutation.mutate(data);

  if (isLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Graduações</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <Input {...register('nome')} placeholder="Nome da Graduação" />
        <Input {...register('duracao')} placeholder="Duração (em anos)" type="number" />
        <Button type="submit">Adicionar Graduação</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {graduacoes.map((graduacao) => (
            <TableRow key={graduacao.id}>
              <TableCell>{graduacao.nome}</TableCell>
              <TableCell>{graduacao.duracao} anos</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteMutation.mutate(graduacao.id)}>
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

export default Graduacoes;