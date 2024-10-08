import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const auth = useAuth();

  const onSubmit = async (data) => {
    try {
      if (auth && auth.login) {
        await auth.login(data.username, data.password);
        toast.success('Login successful');
        navigate('/');
      } else {
        throw new Error('Login function not available');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
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