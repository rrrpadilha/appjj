import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

const Presencas = () => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data: presencas, isLoading } = useQuery({
    queryKey: ['presencas'],
    queryFn: () => api.getItems('presencas')
  });

  const createMutation = useMutation({
    mutationFn: (novaPresenca) => api.createItem('presencas', novaPresenca),
    onSuccess: () => {
      queryClient.invalidateQueries(['presencas']);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('presencas', id),
    onSuccess: () => queryClient.invalidateQueries(['presencas'])
  });

  const onSubmit = (data) => createMutation.mutate(data);

  if (isLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Controle de Presenças</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <Input {...register('aluno')} placeholder="Nome do Aluno" />
        <Input {...register('aula')} placeholder="Aula" />
        <Input {...register('data')} placeholder="Data" type="date" />
        <Button type="submit">Registrar Presença</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Aula</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {presencas.map((presenca) => (
            <TableRow key={presenca.id}>
              <TableCell>{presenca.aluno}</TableCell>
              <TableCell>{presenca.aula}</TableCell>
              <TableCell>{presenca.data}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteMutation.mutate(presenca.id)}>
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

export default Presencas;