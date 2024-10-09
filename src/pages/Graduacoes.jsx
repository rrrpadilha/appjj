import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const beltColors = [
  'Branca', 'Cinza', 'Amarela', 'Laranja', 'Verde', 
  'Azul', 'Roxa', 'Marrom', 'Preta', 'Coral'
];

const Graduacoes = () => {
  const { handleSubmit, reset, setValue } = useForm();
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
        <Select onValueChange={(value) => setValue('cor', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a cor da faixa" />
          </SelectTrigger>
          <SelectContent>
            {beltColors.map((color) => (
              <SelectItem key={color} value={color}>{color}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Adicionar Graduação</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cor da Faixa</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {graduacoes.map((graduacao) => (
            <TableRow key={graduacao.id}>
              <TableCell>{graduacao.cor}</TableCell>
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