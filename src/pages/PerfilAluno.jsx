import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const PerfilAluno = () => {
  const { user } = useAuth();
  const [novaSenha, setNovaSenha] = useState('');
  const queryClient = useQueryClient();

  const { data: alunoData, isLoading } = useQuery({
    queryKey: ['alunoData', user.id],
    queryFn: () => api.getAlunoData(user.id),
    enabled: !!user && user.role === 'aluno'
  });

  const alterarSenhaMutation = useMutation({
    mutationFn: (novaSenha) => api.alterarSenhaAluno(user.id, novaSenha),
    onSuccess: () => {
      queryClient.invalidateQueries(['alunoData', user.id]);
      toast.success('Senha alterada com sucesso!');
      setNovaSenha('');
    },
    onError: () => {
      toast.error('Erro ao alterar a senha. Tente novamente.');
    }
  });

  const handleAlterarSenha = (e) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    alterarSenhaMutation.mutate(novaSenha);
  };

  if (isLoading) return <Layout><div>Carregando...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Nome:</strong> {alunoData.nome}</p>
            <p><strong>Email:</strong> {alunoData.email}</p>
            <p><strong>Graduação Atual:</strong> {alunoData.graduacao.cor}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAlterarSenha} className="space-y-4">
              <Input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Nova senha"
              />
              <Button type="submit">Alterar Senha</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data de Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunoData.mensalidades.map((mensalidade) => (
                  <TableRow key={mensalidade.id}>
                    <TableCell>{mensalidade.dataVencimento}</TableCell>
                    <TableCell>R$ {mensalidade.valor.toFixed(2)}</TableCell>
                    <TableCell>{mensalidade.pago ? 'Pago' : 'Em aberto'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presenças</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Presença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunoData.presencas.map((presenca) => (
                  <TableRow key={presenca.id}>
                    <TableCell>{presenca.data}</TableCell>
                    <TableCell>{presenca.presente ? 'Presente' : 'Ausente'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PerfilAluno;