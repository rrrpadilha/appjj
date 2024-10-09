import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

const Professores = () => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data: professores, isLoading: professoresLoading } = useQuery({
    queryKey: ['professores'],
    queryFn: () => api.getItems('professores')
  });

  const { data: alunos, isLoading: alunosLoading } = useQuery({
    queryKey: ['alunos'],
    queryFn: () => api.getItems('alunos')
  });

  const createMutation = useMutation({
    mutationFn: (novoProfessor) => api.createItem('professores', novoProfessor),
    onSuccess: () => {
      queryClient.invalidateQueries(['professores']);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('professores', id),
    onSuccess: () => queryClient.invalidateQueries(['professores'])
  });

  const onSubmit = (data) => createMutation.mutate(data);

  if (professoresLoading || alunosLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Professores</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <Input {...register('nome')} placeholder="Nome do Professor" />
        <Input {...register('disciplina')} placeholder="Disciplina" />
        <Button type="submit">Adicionar Professor</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Disciplina</TableHead>
            <TableHead>Alunos</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professores.map((professor) => (
            <TableRow key={professor.id}>
              <TableCell>{professor.nome}</TableCell>
              <TableCell>{professor.disciplina}</TableCell>
              <TableCell>
                {alunos.filter(aluno => aluno.professorId === professor.id).map(aluno => aluno.nome).join(', ')}
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteMutation.mutate(professor.id)}>
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

export default Professores;