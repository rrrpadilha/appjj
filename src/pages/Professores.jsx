import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Professores = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
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
    mutationFn: (novoProfessor) => api.createItem('professores', { ...novoProfessor, alunosIds: [] }),
    onSuccess: () => {
      queryClient.invalidateQueries(['professores']);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => api.updateItem('professores', id, updates),
    onSuccess: () => queryClient.invalidateQueries(['professores'])
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('professores', id),
    onSuccess: () => queryClient.invalidateQueries(['professores'])
  });

  const onSubmit = (data) => createMutation.mutate(data);

  const handleVincularAluno = (professorId, alunoId) => {
    const professor = professores.find(p => p.id === professorId);
    const alunosIds = [...(professor.alunosIds || []), alunoId];
    updateMutation.mutate({ id: professorId, updates: { alunosIds } });
  };

  const handleDesvincularAluno = (professorId, alunoId) => {
    const professor = professores.find(p => p.id === professorId);
    const alunosIds = (professor.alunosIds || []).filter(id => id !== alunoId);
    updateMutation.mutate({ id: professorId, updates: { alunosIds } });
  };

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
                <Select onValueChange={(alunoId) => handleVincularAluno(professor.id, alunoId)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vincular aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos
                      .filter(aluno => !(professor.alunosIds || []).includes(aluno.id))
                      .map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id.toString()}>{aluno.nome}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <ul className="mt-2">
                  {(professor.alunosIds || []).map(alunoId => {
                    const aluno = alunos.find(a => a.id === alunoId);
                    return aluno ? (
                      <li key={aluno.id} className="flex justify-between items-center">
                        {aluno.nome}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDesvincularAluno(professor.id, aluno.id)}
                        >
                          Desvincular
                        </Button>
                      </li>
                    ) : null;
                  })}
                </ul>
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