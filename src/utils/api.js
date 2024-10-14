const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const storage = {
  alunos: [
    { id: 1, nome: 'João Silva', email: 'joao@example.com', senha: 'sys123', graduacaoAtualId: 1, dataNascimento: '1990-05-15', dataUltimaGraduacao: '2023-01-01' },
    { id: 2, nome: 'Maria Santos', email: 'maria@example.com', senha: 'sys123', graduacaoAtualId: 2, dataNascimento: '1995-03-20', dataUltimaGraduacao: '2023-02-15' },
  ],
  professores: [],
  turmas: [],
  graduacoes: [
    { id: 1, cor: 'Branca' },
    { id: 2, cor: 'Azul' },
  ],
  mensalidades: [
    { id: 1, alunoId: 1, valor: 100, dataVencimento: '2023-05-10', pago: true, dataPagamento: '2023-05-09' },
    { id: 2, alunoId: 1, valor: 100, dataVencimento: '2023-06-10', pago: false },
    { id: 3, alunoId: 2, valor: 100, dataVencimento: '2023-05-10', pago: true, dataPagamento: '2023-05-08' },
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
  if (category === 'alunos' && !newItem.dataUltimaGraduacao) {
    newItem.dataUltimaGraduacao = new Date().toISOString().split('T')[0];
  }
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

const getDashboardData = async () => {
  await delay(300);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const totalAlunos = storage.alunos.length;
  const mensalidadesVencidas = storage.mensalidades.filter(m => !m.pago && new Date(m.dataVencimento) < currentDate).length;
  const totalMensalidadesPagas = storage.mensalidades.filter(m => m.pago).reduce((total, m) => total + m.valor, 0);
  
  const totalPagoMes = storage.mensalidades.filter(m => {
    const pagamentoDate = new Date(m.dataPagamento);
    return m.pago && pagamentoDate.getMonth() === currentMonth && pagamentoDate.getFullYear() === currentYear;
  }).reduce((total, m) => total + m.valor, 0);

  const presencasPorAluno = storage.presencas.reduce((acc, p) => {
    acc[p.alunoId] = (acc[p.alunoId] || 0) + 1;
    return acc;
  }, {});
  
  const alunosMaisFrequentes = Object.entries(presencasPorAluno)
    .map(([alunoId, presencas]) => ({
      nome: storage.alunos.find(a => a.id === parseInt(alunoId)).nome,
      presencas
    }))
    .sort((a, b) => b.presencas - a.presencas)
    .slice(0, 5);

  const aniversariantesMes = storage.alunos.filter(aluno => {
    const nascimento = new Date(aluno.dataNascimento);
    return nascimento.getMonth() === currentMonth;
  }).map(aluno => ({
    nome: aluno.nome,
    data: new Date(aluno.dataNascimento).getDate()
  }));

  const aniversariantesDia = aniversariantesMes.filter(aniversariante => 
    aniversariante.data === currentDate.getDate()
  );

  return {
    totalAlunos,
    mensalidadesVencidas,
    totalMensalidadesPagas,
    totalPagoMes,
    alunosMaisFrequentes,
    aniversariantesMes,
    aniversariantesDia
  };
};

const getEligibleStudentsForGraduation = async () => {
  await delay(300);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const eligibleStudents = storage.alunos.filter(aluno => {
    const lastGraduationDate = new Date(aluno.dataUltimaGraduacao);
    if (lastGraduationDate > sixMonthsAgo) {
      return false;
    }

    const presencas = storage.presencas.filter(p => 
      p.alunoId === aluno.id && new Date(p.data) >= sixMonthsAgo
    );

    return presencas.length >= 30;
  });

  return eligibleStudents.map(aluno => ({
    id: aluno.id,
    nome: aluno.nome,
    dataUltimaGraduacao: aluno.dataUltimaGraduacao,
    presencas: storage.presencas.filter(p => 
      p.alunoId === aluno.id && new Date(p.data) >= new Date(aluno.dataUltimaGraduacao)
    ).length
  }));
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
  alterarSenhaAluno,
  getDashboardData,
  getEligibleStudentsForGraduation,
};
