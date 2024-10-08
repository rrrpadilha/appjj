import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Aqui você implementaria a lógica de autenticação real
    console.log('Login attempt:', data);
    // Por enquanto, vamos apenas redirecionar para a página inicial
    navigate('/');
  };

  return (
    <Layout>
      <div className="flex justify-center items-center h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username">Usuário</label>
                <Input id="username" {...register('username')} placeholder="Seu usuário" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Senha</label>
                <Input id="password" type="password" {...register('password')} placeholder="Sua senha" />
              </div>
              <Button type="submit" className="w-full">Entrar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;