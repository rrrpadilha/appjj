import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const Mensalidades = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();
  const [editingMensalidade, setEditingMensalidade] = useState(null);

  const { data: mensalidades, isLoading: mensalidadesLoading } = useQuery({
    queryKey: ['mensalidades'],
    queryFn: () => api.getItems('mensalidades')
  });

  const { data: alunos, isLoading: alunosLoading } = useQuery({
    queryKey: ['alunos'],
    queryFn: () => api.getItems('alunos')
  });

  const createMutation = useMutation({
    mutationFn: (novaMensalidade) => api.createItem('mensalidades', { ...novaMensalidade, pago: false }),
    onSuccess: () => {
      queryClient.invalidateQueries(['mensalidades']);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => api.updateItem('mensalidades', id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['mensalidades']);
      setEditingMensalidade(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('mensalidades', id),
    onSuccess: () => queryClient.invalidateQueries(['mensalidades'])
  });

  const onSubmit = (data) => {
    const novaMensalidade = {
      ...data,
      alunoId: parseInt(data.alunoId),
      valor: parseFloat(data.valor)
    };
    if (editingMensalidade) {
      updateMutation.mutate({ id: editingMensalidade.id, updates: novaMensalidade });
    } else {
      createMutation.mutate(novaMensalidade);
    }
  };

  const handlePagamentoChange = (id, pago) => {
    updateMutation.mutate({ id, updates: { pago } });
  };

  const handleEdit = (mensalidade) => {
    setEditingMensalidade(mensalidade);
    Object.keys(mensalidade).forEach(key => {
      setValue(key, mensalidade[key]);
    });
  };

  if (mensalidadesLoading || alunosLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Controle de Mensalidades</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <Select onValueChange={(value) => setValue('alunoId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um aluno" />
          </SelectTrigger>
          <SelectContent>
            {alunos.map((aluno) => (
              <SelectItem key={aluno.id} value={aluno.id.toString()}>{aluno.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input {...register('valor')} placeholder="Valor" type="number" step="0.01" />
        <Input {...register('dataVencimento')} placeholder="Data de Vencimento" type="date" />
        <Button type="submit">{editingMensalidade ? 'Atualizar Mensalidade' : 'Adicionar Mensalidade'}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mensalidades.map((mensalidade) => (
            <TableRow key={mensalidade.id}>
              <TableCell>{alunos.find(a => a.id === mensalidade.alunoId)?.nome || 'N/A'}</TableCell>
              <TableCell>R$ {mensalidade.valor.toFixed(2)}</TableCell>
              <TableCell>{mensalidade.dataVencimento}</TableCell>
              <TableCell>
                <Checkbox
                  checked={mensalidade.pago}
                  onCheckedChange={(checked) => handlePagamentoChange(mensalidade.id, checked)}
                />
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleEdit(mensalidade)}>Editar</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Mensalidade</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Select onValueChange={(value) => setValue('alunoId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um aluno" />
                        </SelectTrigger>
                        <SelectContent>
                          {alunos.map((aluno) => (
                            <SelectItem key={aluno.id} value={aluno.id.toString()}>{aluno.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input {...register('valor')} placeholder="Valor" type="number" step="0.01" />
                      <Input {...register('dataVencimento')} placeholder="Data de Vencimento" type="date" />
                      <Button type="submit">Salvar Alterações</Button>
                    </form>
                  </DialogContent>
                </Dialog>
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