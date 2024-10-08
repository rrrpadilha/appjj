// Simula um atraso de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simula o armazenamento local
const storage = {
  alunos: [],
  professores: [],
  turmas: [],
  graduacoes: [],
  mensalidades: [],
  presencas: []
};

// Funções genéricas CRUD
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

export const api = {
  createItem,
  getItems,
  updateItem,
  deleteItem
};