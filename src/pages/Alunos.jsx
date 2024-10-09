import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Alunos = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();

  const { data: alunos, isLoading: alunosLoading } = useQuery({
    queryKey: ['alunos'],
    queryFn: () => api.getItems('alunos')
  });

  const { data: turmas, isLoading: turmasLoading } = useQuery({
    queryKey: ['turmas'],
    queryFn: () => api.getItems('turmas')
  });

  const { data: graduacoes, isLoading: graduacoesLoading } = useQuery({
    queryKey: ['graduacoes'],
    queryFn: () => api.getItems('graduacoes')
  });

  const { data: professores, isLoading: professoresLoading } = useQuery({
    queryKey: ['professores'],
    queryFn: () => api.getItems('professores')
  });

  const createMutation = useMutation({
    mutationFn: (novoAluno) => api.createItem('alunos', novoAluno),
    onSuccess: () => {
      queryClient.invalidateQueries(['alunos']);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => api.updateItem('alunos', id, updates),
    onSuccess: () => queryClient.invalidateQueries(['alunos', 'professores'])
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('alunos', id),
    onSuccess: () => queryClient.invalidateQueries(['alunos'])
  });

  const onSubmit = (data) => {
    const novoAluno = {
      ...data,
      turmaId: parseInt(data.turmaId),
      graduacaoId: parseInt(data.graduacaoId),
      professorId: data.professorId ? parseInt(data.professorId) : null
    };
    createMutation.mutate(novoAluno);
  };

  const handleVincularProfessor = (alunoId, professorId) => {
    updateMutation.mutate({ id: alunoId, updates: { professorId: parseInt(professorId) } });
  };

  if (alunosLoading || turmasLoading || graduacoesLoading || professoresLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Alunos</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <Input {...register('nome')} placeholder="Nome do Aluno" />
        <Input {...register('email')} placeholder="Email" type="email" />
        <Select onValueChange={(value) => setValue('turmaId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent>
            {turmas.map((turma) => (
              <SelectItem key={turma.id} value={turma.id.toString()}>{turma.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setValue('graduacaoId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma graduação" />
          </SelectTrigger>
          <SelectContent>
            {graduacoes.map((graduacao) => (
              <SelectItem key={graduacao.id} value={graduacao.id.toString()}>{graduacao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setValue('professorId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um professor (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum professor</SelectItem>
            {professores.map((professor) => (
              <SelectItem key={professor.id} value={professor.id.toString()}>{professor.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Adicionar Aluno</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Graduação</TableHead>
            <TableHead>Professor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunos.map((aluno) => (
            <TableRow key={aluno.id}>
              <TableCell>{aluno.nome}</TableCell>
              <TableCell>{aluno.email}</TableCell>
              <TableCell>{turmas.find(t => t.id === aluno.turmaId)?.nome || 'N/A'}</TableCell>
              <TableCell>{graduacoes.find(g => g.id === aluno.graduacaoId)?.nome || 'N/A'}</TableCell>
              <TableCell>
                <Select 
                  defaultValue={aluno.professorId?.toString() || ''}
                  onValueChange={(value) => handleVincularProfessor(aluno.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum professor</SelectItem>
                    {professores.map((professor) => (
                      <SelectItem key={professor.id} value={professor.id.toString()}>{professor.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteMutation.mutate(aluno.id)}>
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

export default Alunos;