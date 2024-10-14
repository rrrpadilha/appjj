import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const Turmas = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();
  const [editingTurma, setEditingTurma] = useState(null);

  const { data: turmas, isLoading } = useQuery({
    queryKey: ['turmas'],
    queryFn: () => api.getItems('turmas')
  });

  const createMutation = useMutation({
    mutationFn: (novaTurma) => api.createItem('turmas', novaTurma),
    onSuccess: () => {
      queryClient.invalidateQueries(['turmas']);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (turmaAtualizada) => api.updateItem('turmas', turmaAtualizada.id, turmaAtualizada),
    onSuccess: () => {
      queryClient.invalidateQueries(['turmas']);
      setEditingTurma(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('turmas', id),
    onSuccess: () => queryClient.invalidateQueries(['turmas'])
  });

  const onSubmit = (data) => {
    if (editingTurma) {
      updateMutation.mutate({ ...data, id: editingTurma.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (turma) => {
    setEditingTurma(turma);
    Object.keys(turma).forEach(key => {
      setValue(key, turma[key]);
    });
  };

  if (isLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Turmas</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <Input {...register('nome')} placeholder="Nome da Turma" />
        <Input {...register('periodo')} placeholder="Período" />
        <Button type="submit">{editingTurma ? 'Atualizar Turma' : 'Adicionar Turma'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {turmas.map((turma) => (
            <TableRow key={turma.id}>
              <TableCell>{turma.nome}</TableCell>
              <TableCell>{turma.periodo}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleEdit(turma)}>Editar</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Turma</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Input {...register('nome')} placeholder="Nome da Turma" />
                      <Input {...register('periodo')} placeholder="Período" />
                      <Button type="submit">Salvar Alterações</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => deleteMutation.mutate(turma.id)}>
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

export default Turmas;