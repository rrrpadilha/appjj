const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const storage = {
  alunos: [],
  professores: [],
  turmas: [],
  graduacoes: [],
  mensalidades: [],
  presencas: []
};

// Simulated user data
const users = [
  { id: 1, username: 'admin', password: 'password123' }
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

const login = async (username, password) => {
  await delay(300);
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = btoa(JSON.stringify({ id: user.id, username: user.username }));
    return { user: { id: user.id, username: user.username }, token };
  }
  throw new Error('Invalid credentials');
};

const validateToken = async (token) => {
  await delay(300);
  try {
    const userData = JSON.parse(atob(token));
    const user = users.find(u => u.id === userData.id && u.username === userData.username);
    if (user) {
      return { id: user.id, username: user.username };
    }
    throw new Error('Invalid token');
  } catch {
    throw new Error('Invalid token');
  }
};

export const api = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  getRelatedItems,
  login,
  validateToken
};