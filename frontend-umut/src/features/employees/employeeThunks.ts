import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { EmployeeMutation, EmployeesI, EmployeesWithID } from '../../types';

export const createEmployees = createAsyncThunk<void, EmployeeMutation>(
  'employee/create',
  async (employee) => {
    const newEmployee = {
      full_name: employee.full_name,
      position_id: employee.position_id,
      salary: parseFloat(employee.salary),
      address: employee.address,
      phone: employee.phone
    };

    await axiosApi.post('/employee', newEmployee);
  }
);

export const fetchEmployees = createAsyncThunk<EmployeesI[], undefined>(
  'employee/fetchAll',
  async () => {
    const response = await axiosApi.get<EmployeesI[]>('/employee');
    return response.data;
  }
);

export const deleteEmployees = createAsyncThunk<void, string>(
  'employee/delete',
  async (id) => {
    try {
      await axiosApi.delete(`/employee/${id}`);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 400) {
        alert('This employee is using in another table!');
      }
    }
  }
);

export const editEmployee = createAsyncThunk<void, EmployeesWithID>(
  'employee/edit',
  async (employee) => {
    await axiosApi.put('/employee', employee);
  },
);

export const fetchOneEmployee = createAsyncThunk<EmployeeMutation, string>(
  'employee/fetchOne',
  async (id) => {
    const response = await axiosApi.get<EmployeesWithID>(`/employee/${id}`);
    const oneEmployee: EmployeeMutation = {
      full_name: response.data.full_name,
      address: response.data.address,
      salary: response.data.salary,
      position_id: response.data.position_id,
      phone: response.data.phone,
    };
    return oneEmployee;
  },
);