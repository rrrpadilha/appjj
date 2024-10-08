const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const storage = {
  alunos: [],
  professores: [],
  turmas: [],
  graduacoes: [],
  mensalidades: [],
  presencas: []
};

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

export const api = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  getRelatedItems
};