const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const storage = {
  alunos: [
    { id: 1, nome: 'João Silva', email: 'joao@example.com', senha: '123456', graduacaoAtualId: 1 },
    { id: 2, nome: 'Maria Santos', email: 'maria@example.com', senha: '123456', graduacaoAtualId: 2 },
  ],
  professores: [],
  turmas: [],
  graduacoes: [
    { id: 1, cor: 'Branca' },
    { id: 2, cor: 'Azul' },
  ],
  mensalidades: [
    { id: 1, alunoId: 1, valor: 100, dataVencimento: '2023-05-10', pago: true },
    { id: 2, alunoId: 1, valor: 100, dataVencimento: '2023-06-10', pago: false },
    { id: 3, alunoId: 2, valor: 100, dataVencimento: '2023-05-10', pago: true },
  ],
  presencas: [
    { id: 1, alunoId: 1, data: '2023-05-01', presente: true },
    { id: 2, alunoId: 1, data: '2023-05-03', presente: true },
    { id: 3, alunoId: 2, data: '2023-05-01', presente: true },
  ]
};

const users = [
  { id: 1, username: 'admin@admin.com.br', password: 'admin123', role: 'admin' }
];

const createItem = async (category, item) => {
  await delay(300);
  const newItem = { ...item, id: Date.now() };
  storage[category].push(newItem);
  return newItem;
};

const getItems = async (category) => {
  await delay(300);
  return storage[category];
};

const updateItem = async (category, id, updates) => {
  await delay(300);
  const index = storage[category].findIndex(item => item.id === id);
  if (index !== -1) {
    storage[category][index] = { ...storage[category][index], ...updates };
    return storage[category][index];
  }
  throw new Error('Item não encontrado');
};

const deleteItem = async (category, id) => {
  await delay(300);
  const index = storage[category].findIndex(item => item.id === id);
  if (index !== -1) {
    storage[category].splice(index, 1);
    return true;
  }
  throw new Error('Item não encontrado');
};

const getRelatedItems = async (category, relatedCategory, id) => {
  await delay(300);
  return storage[relatedCategory].filter(item => item[category + 'Id'] === id);
};

const login = async (email, password) => {
  await delay(300);
  const adminUser = users.find(u => u.username === email && u.password === password);
  if (adminUser) {
    return { user: { id: adminUser.id, username: adminUser.username, role: 'admin' }, token: 'admin-token' };
  }
  
  const aluno = storage.alunos.find(a => a.email === email && a.senha === password);
  if (aluno) {
    return { user: { id: aluno.id, nome: aluno.nome, email: aluno.email, role: 'aluno' }, token: `aluno-token-${aluno.id}` };
  }
  
  throw new Error('Credenciais inválidas');
};

const validateToken = async (token) => {
  await delay(300);
  if (token === 'admin-token') {
    return { id: 1, username: 'admin@admin.com.br', role: 'admin' };
  }
  
  const alunoId = token.split('-')[2];
  const aluno = storage.alunos.find(a => a.id === parseInt(alunoId));
  if (aluno) {
    return { id: aluno.id, nome: aluno.nome, email: aluno.email, role: 'aluno' };
  }
  
  throw new Error('Token inválido');
};

const getAlunoData = async (alunoId) => {
  await delay(300);
  const aluno = storage.alunos.find(a => a.id === alunoId);
  if (!aluno) throw new Error('Aluno não encontrado');
  
  const mensalidades = storage.mensalidades.filter(m => m.alunoId === alunoId);
  const presencas = storage.presencas.filter(p => p.alunoId === alunoId);
  const graduacao = storage.graduacoes.find(g => g.id === aluno.graduacaoAtualId);
  
  return {
    ...aluno,
    mensalidades,
    presencas,
    graduacao
  };
};

const alterarSenhaAluno = async (alunoId, novaSenha) => {
  await delay(300);
  const index = storage.alunos.findIndex(a => a.id === alunoId);
  if (index !== -1) {
    storage.alunos[index].senha = novaSenha;
    return true;
  }
  throw new Error('Aluno não encontrado');
};

export const api = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  getRelatedItems,
  login,
  validateToken,
  getAlunoData,
  alterarSenhaAluno
};