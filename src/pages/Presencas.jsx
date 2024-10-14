import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Presencas = () => {
  const [selectedAlunos, setSelectedAlunos] = useState([]);
  const [aula, setAula] = useState('');
  const [data, setData] = useState('');
  const [editingPresenca, setEditingPresenca] = useState(null);
  const queryClient = useQueryClient();

  const { data: presencas, isLoading: presencasLoading } = useQuery({
    queryKey: ['presencas'],
    queryFn: () => api.getItems('presencas')
  });

  const { data: alunos, isLoading: alunosLoading } = useQuery({
    queryKey: ['alunos'],
    queryFn: () => api.getItems('alunos')
  });

  const createMutation = useMutation({
    mutationFn: (novasPresencas) => Promise.all(novasPresencas.map(presenca => api.createItem('presencas', presenca))),
    onSuccess: () => {
      queryClient.invalidateQueries(['presencas']);
      setSelectedAlunos([]);
      setAula('');
      setData('');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (presencaAtualizada) => api.updateItem('presencas', presencaAtualizada.id, presencaAtualizada),
    onSuccess: () => {
      queryClient.invalidateQueries(['presencas']);
      setEditingPresenca(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteItem('presencas', id),
    onSuccess: () => queryClient.invalidateQueries(['presencas'])
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const novasPresencas = selectedAlunos.map(alunoId => ({
      alunoId: parseInt(alunoId),
      aula,
      data
    }));
    createMutation.mutate(novasPresencas);
  };

  const handleAlunoToggle = (alunoId) => {
    setSelectedAlunos(prev => 
      prev.includes(alunoId)
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
  };

  const handleEdit = (presenca) => {
    setEditingPresenca(presenca);
  };

  const handleUpdatePresenca = (e) => {
    e.preventDefault();
    if (editingPresenca) {
      updateMutation.mutate({
        ...editingPresenca,
        aula: aula || editingPresenca.aula,
        data: data || editingPresenca.data,
      });
    }
  };

  if (presencasLoading || alunosLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Controle de Presenças</h1>
      
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div className="space-y-2">
          <label className="font-medium">Selecione os alunos:</label>
          {alunos.map((aluno) => (
            <div key={aluno.id} className="flex items-center space-x-2">
              <Checkbox
                id={`aluno-${aluno.id}`}
                checked={selectedAlunos.includes(aluno.id.toString())}
                onCheckedChange={() => handleAlunoToggle(aluno.id.toString())}
              />
              <label htmlFor={`aluno-${aluno.id}`}>{aluno.nome}</label>
            </div>
          ))}
        </div>
        <Input
          value={aula}
          onChange={(e) => setAula(e.target.value)}
          placeholder="Aula"
        />
        <Input
          value={data}
          onChange={(e) => setData(e.target.value)}
          type="date"
        />
        <Button type="submit">Registrar Presenças</Button>
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
              <TableCell>{alunos.find(a => a.id === presenca.alunoId)?.nome || 'N/A'}</TableCell>
              <TableCell>{presenca.aula}</TableCell>
              <TableCell>{presenca.data}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleEdit(presenca)}>Editar</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Presença</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdatePresenca} className="space-y-4">
                      <Select onValueChange={(value) => setEditingPresenca({...editingPresenca, alunoId: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um aluno" />
                        </SelectTrigger>
                        <SelectContent>
                          {alunos.map((aluno) => (
                            <SelectItem key={aluno.id} value={aluno.id.toString()}>{aluno.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={aula}
                        onChange={(e) => setAula(e.target.value)}
                        placeholder="Aula"
                      />
                      <Input
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        type="date"
                      />
                      <Button type="submit">Salvar Alterações</Button>
                    </form>
                  </DialogContent>
                </Dialog>
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