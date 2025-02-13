import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const Alunos = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();
  const [editingAluno, setEditingAluno] = useState(null);

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

  const createMutation = useMutation({
    mutationFn: (novoAluno) => api.createItem('alunos', novoAluno),
    onSuccess: () => {
      queryClient.invalidateQueries(['alunos']);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (alunoAtualizado) => api.updateItem('alunos', alunoAtualizado.id, alunoAtualizado),
    onSuccess: () => {
      queryClient.invalidateQueries(['alunos']);
      setEditingAluno(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('alunos', id),
    onSuccess: () => queryClient.invalidateQueries(['alunos'])
  });

  const onSubmit = (data) => {
    const novoAluno = {
      ...data,
      turmaId: parseInt(data.turmaId),
      graduacaoAtualId: parseInt(data.graduacaoAtualId),
      graduacaoAnteriorId: data.graduacaoAnteriorId === 'none' ? null : parseInt(data.graduacaoAnteriorId),
      senha: 'sys123', // Senha padrão definida aqui
      dataUltimaGraduacao: data.dataUltimaGraduacao || new Date().toISOString().split('T')[0]
    };
    if (editingAluno) {
      updateMutation.mutate({ ...novoAluno, id: editingAluno.id });
    } else {
      createMutation.mutate(novoAluno);
    }
  };

  const handleEdit = (aluno) => {
    setEditingAluno(aluno);
    Object.keys(aluno).forEach(key => {
      setValue(key, aluno[key]);
    });
  };

  if (alunosLoading || turmasLoading || graduacoesLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Alunos</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <Input {...register('nome')} placeholder="Nome do Aluno" />
        <Input {...register('email')} placeholder="Email" type="email" />
        <Input {...register('cpf')} placeholder="CPF" />
        <Input {...register('dataNascimento')} placeholder="Data de Nascimento (DD/MM/AAAA)" type="text" />
        <Input {...register('dataInicio')} placeholder="Data de Início na Academia (DD/MM/AAAA)" type="text" />
        <Select onValueChange={(value) => setValue('graduacaoAtualId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Graduação Atual" />
          </SelectTrigger>
          <SelectContent>
            {graduacoes.map((graduacao) => (
              <SelectItem key={graduacao.id} value={graduacao.id.toString()}>{graduacao.cor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setValue('graduacaoAnteriorId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Graduação Anterior" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma</SelectItem>
            {graduacoes.map((graduacao) => (
              <SelectItem key={graduacao.id} value={graduacao.id.toString()}>{graduacao.cor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input {...register('nomePai')} placeholder="Nome do Pai" />
        <Input {...register('nomeMae')} placeholder="Nome da Mãe" />
        <Input {...register('telefone')} placeholder="Telefone" />
        <Input {...register('celular')} placeholder="Celular" />
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
        <div>
          <label htmlFor="dataUltimaGraduacao" className="block text-sm font-medium text-gray-700">
            Data da Última Graduação
          </label>
          <Input
            id="dataUltimaGraduacao"
            {...register('dataUltimaGraduacao')}
            type="date"
            placeholder="Data da Última Graduação (DD/MM/AAAA)"
          />
        </div>
        <Button type="submit">{editingAluno ? 'Atualizar Aluno' : 'Adicionar Aluno'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>Data de Início</TableHead>
            <TableHead>Graduação Atual</TableHead>
            <TableHead>Graduação Anterior</TableHead>
            <TableHead>Nome do Pai</TableHead>
            <TableHead>Nome da Mãe</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Celular</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Data da Última Graduação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunos.map((aluno) => (
            <TableRow key={aluno.id}>
              <TableCell>{aluno.nome}</TableCell>
              <TableCell>{aluno.email}</TableCell>
              <TableCell>{aluno.cpf}</TableCell>
              <TableCell>{aluno.dataNascimento}</TableCell>
              <TableCell>{aluno.dataInicio}</TableCell>
              <TableCell>{graduacoes.find(g => g.id === aluno.graduacaoAtualId)?.cor}</TableCell>
              <TableCell>{aluno.graduacaoAnteriorId ? graduacoes.find(g => g.id === aluno.graduacaoAnteriorId)?.cor : 'Nenhuma'}</TableCell>
              <TableCell>{aluno.nomePai}</TableCell>
              <TableCell>{aluno.nomeMae}</TableCell>
              <TableCell>{aluno.telefone}</TableCell>
              <TableCell>{aluno.celular}</TableCell>
              <TableCell>{turmas.find(t => t.id === aluno.turmaId)?.nome || 'N/A'}</TableCell>
              <TableCell>{aluno.dataUltimaGraduacao}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleEdit(aluno)}>Editar</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Aluno</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Input {...register('nome')} placeholder="Nome do Aluno" />
                      <Input {...register('email')} placeholder="Email" type="email" />
                      <Input {...register('cpf')} placeholder="CPF" />
                      <Input {...register('dataNascimento')} placeholder="Data de Nascimento (DD/MM/AAAA)" type="text" />
                      <Input {...register('dataInicio')} placeholder="Data de Início na Academia (DD/MM/AAAA)" type="text" />
                      <Select onValueChange={(value) => setValue('graduacaoAtualId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Graduação Atual" />
                        </SelectTrigger>
                        <SelectContent>
                          {graduacoes.map((graduacao) => (
                            <SelectItem key={graduacao.id} value={graduacao.id.toString()}>{graduacao.cor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select onValueChange={(value) => setValue('graduacaoAnteriorId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Graduação Anterior" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma</SelectItem>
                          {graduacoes.map((graduacao) => (
                            <SelectItem key={graduacao.id} value={graduacao.id.toString()}>{graduacao.cor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input {...register('nomePai')} placeholder="Nome do Pai" />
                      <Input {...register('nomeMae')} placeholder="Nome da Mãe" />
                      <Input {...register('telefone')} placeholder="Telefone" />
                      <Input {...register('celular')} placeholder="Celular" />
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
                      <div>
                        <label htmlFor="editDataUltimaGraduacao" className="block text-sm font-medium text-gray-700">
                          Data da Última Graduação
                        </label>
                        <Input
                          id="editDataUltimaGraduacao"
                          {...register('dataUltimaGraduacao')}
                          type="date"
                          placeholder="Data da Última Graduação (DD/MM/AAAA)"
                        />
                      </div>
                      <Button type="submit">Salvar Alterações</Button>
                    </form>
                  </DialogContent>
                </Dialog>
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
