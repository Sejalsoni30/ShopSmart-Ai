const API_URL = 'http://localhost:5000/api';

export const getProducts = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}/products?${query}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const compareProducts = async (ids) => {
  const response = await fetch(`${API_URL}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  if (!response.ok) throw new Error('Failed to fetch comparison');
  return response.json();
};

export const sendChatMessage = async (message, history) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};
