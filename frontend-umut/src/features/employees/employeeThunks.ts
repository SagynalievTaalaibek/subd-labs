import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {
  EmployeeEditPasswordEmail,
  EmployeeMutation,
  EmployeeResponseOne,
  EmployeesI,
  EmployeesWithID,
} from '../../types';

export const createEmployees = createAsyncThunk<void, EmployeeMutation>(
  'employee/create',
  async (employee) => {
    try {
      const newEmployee = {
        full_name: employee.full_name,
        position_id: employee.position_id,
        salary: parseFloat(employee.salary),
        address: employee.address,
        phone: employee.phone,
        email: employee.email,
        password: employee.password,
      };

      await axiosApi.post('/employee', newEmployee);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else if (error.response.status === 422) {
        alert('This email is already registered!');
      }
    }
  },
);

export const fetchEmployees = createAsyncThunk<EmployeesI[], undefined>(
  'employee/fetchAll',
  async () => {
    const response = await axiosApi.get<EmployeesI[]>('/employee');
    return response.data;
  },
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
  },
);

export const editEmployee = createAsyncThunk<void, EmployeesWithID>(
  'employee/edit',
  async (employee) => {
    await axiosApi.put('/employee', employee);
  },
);


export const editPasswordEmail = createAsyncThunk<void, EmployeeEditPasswordEmail>(
  'employee/editPassword',
  async (employee) => {
    try {
      await axiosApi.put('/employee?password=true', employee);
    } catch (error: any) {
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error. message);
      } else if (error.response.status === 400) {
        alert('This employee is using in another table!');
      }
    }
  },
);

export const fetchOneEmployee = createAsyncThunk<EmployeeResponseOne, string>(
  'employee/fetchOne',
  async (id) => {
    const response = await axiosApi.get<EmployeesWithID>(`/employee/${id}`);
    const oneEmployee: EmployeeResponseOne = {
      full_name: response.data.full_name,
      address: response.data.address,
      salary: response.data.salary,
      position_id: response.data.position_id,
      phone: response.data.phone,
      email: response.data.email,
    };
    return oneEmployee;
  },
);