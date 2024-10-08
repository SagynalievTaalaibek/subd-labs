export const apiURL = 'http://localhost:8000/api';
export const pages = [
  { id: crypto.randomUUID().toString(), name: 'Positions', allowed: ['admin', 'director'] },
  { id: crypto.randomUUID().toString(), name: 'Employees', allowed: ['admin', 'director'] },
  { id: crypto.randomUUID().toString(), name: 'Units', allowed: ['admin', 'director', 'technologist'] },
  { id: crypto.randomUUID().toString(), name: 'Products', allowed: ['admin', 'director', 'manager'] },
  { id: crypto.randomUUID().toString(), name: 'Materials', allowed: ['admin', 'director', 'manager', 'technologist'] },
  { id: crypto.randomUUID().toString(), name: 'Ingredients', allowed: ['admin', 'director', 'technologist'] },
  { id: crypto.randomUUID().toString(), name: 'Budget', allowed: ['admin', 'director', 'accountant'] },
  { id: crypto.randomUUID().toString(), name: 'Purchase', allowed: ['admin', 'director', 'manager'] },
  { id: crypto.randomUUID().toString(), name: 'Product-Sales', allowed: ['admin', 'director', 'manager'] },
  { id: crypto.randomUUID().toString(), name: 'Production', allowed: ['admin', 'director', 'technologist'] },
  { id: crypto.randomUUID().toString(), name: 'Salary', allowed: ['admin', 'accountant', 'director'] },
  { id: crypto.randomUUID().toString(), name: 'Bank', allowed: ['admin', 'director', 'accountant'] },
  { id: crypto.randomUUID().toString(), name: 'Report', allowed: ['admin', 'director', 'accountant', 'manager', 'technologist'] },
];

export const BUDGET_ID = '1';

export const years = [
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];
export const months = [
  { id: parseFloat(Math.random().toString()), month: 'January', value: 1 },
  { id: parseFloat(Math.random().toString()), month: 'February', value: 2 },
  { id: parseFloat(Math.random().toString()), month: 'March', value: 3 },
  { id: parseFloat(Math.random().toString()), month: 'April', value: 4 },
  { id: parseFloat(Math.random().toString()), month: 'May', value: 5 },
  { id: parseFloat(Math.random().toString()), month: 'June', value: 6 },
  { id: parseFloat(Math.random().toString()), month: 'July', value: 7 },
  { id: parseFloat(Math.random().toString()), month: 'August', value: 8 },
  { id: parseFloat(Math.random().toString()), month: 'September', value: 9 },
  { id: parseFloat(Math.random().toString()), month: 'October', value: 10 },
  { id: parseFloat(Math.random().toString()), month: 'November', value: 11 },
  { id: parseFloat(Math.random().toString()), month: 'December', value: 12 },
];


