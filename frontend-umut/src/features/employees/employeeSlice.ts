import { createSlice } from '@reduxjs/toolkit';
import { EmployeeMutation, EmployeesI } from '../../types';
import { createEmployees, deleteEmployees, editEmployee, fetchEmployees, fetchOneEmployee } from './employeeThunks';
import { RootState } from '../../app/store';


interface EmployeesState {
  employees: EmployeesI[],
  oneEmployee: EmployeeMutation | null;
  createEmployeeLoading: boolean;
  fetchEmployeeLoading: boolean;
  fetchOneEmployeeLoading: boolean;
  editEmployeeLoading: boolean;
  deleteEmployeeLoading: false;
}

const initialState: EmployeesState = {
  employees: [],
  oneEmployee: null,
  createEmployeeLoading: false,
  fetchEmployeeLoading: false,
  fetchOneEmployeeLoading: false,
  editEmployeeLoading: false,
  deleteEmployeeLoading: false,
};

export const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createEmployees.pending, (state) => {
      state.createEmployeeLoading = true;
    }).addCase(createEmployees.fulfilled, state => {
      state.createEmployeeLoading = false;
    }).addCase(createEmployees.rejected, state => {
      state.createEmployeeLoading = false;
    });

    builder.addCase(fetchEmployees.pending, (state) => {
      state.createEmployeeLoading = true;
    }).addCase(fetchEmployees.fulfilled, (state, {payload}) => {
      state.createEmployeeLoading = false;
      state.employees = payload;
    }).addCase(fetchEmployees.rejected, state => {
      state.createEmployeeLoading = false;
    });

    builder.addCase(fetchOneEmployee.pending, (state) => {
      state.fetchOneEmployeeLoading = true;
    }).addCase(fetchOneEmployee.fulfilled, (state, {payload}) => {
      state.fetchOneEmployeeLoading = false;
      state.oneEmployee = payload;
    }).addCase(fetchOneEmployee.rejected, state => {
      state.fetchOneEmployeeLoading = false;
    });

    builder.addCase(editEmployee.pending, (state) => {
      state.editEmployeeLoading = true;
    }).addCase(editEmployee.fulfilled, (state) => {
      state.editEmployeeLoading = false;
    }).addCase(editEmployee.rejected, state => {
      state.editEmployeeLoading = false;
    });

    builder.addCase(deleteEmployees.pending, (state) => {
      state.deleteEmployeeLoading = false;
    }).addCase(deleteEmployees.fulfilled, (state) => {
      state.deleteEmployeeLoading = false;
    }).addCase(deleteEmployees.rejected, (state) => {
      state.deleteEmployeeLoading = false;
    });
  }
});

export const employeesReducer = employeeSlice.reducer;

export const selectEmployees = (state: RootState) => state.employees.employees;
export const selectOneEmployee = (state: RootState) => state.employees.oneEmployee;
export const selectCreateEmployeeLoading = (state: RootState) => state.employees.createEmployeeLoading;
export const selectFetchEmployeeLoading = (state: RootState) => state.employees.fetchEmployeeLoading;
export const selectFetchOneEmployeeLoading = (state: RootState) => state.employees.fetchOneEmployeeLoading;
export const selectEditEmployeeLoading = (state: RootState) => state.employees.deleteEmployeeLoading;
export const selectDeleteEmployeeLoading = (state: RootState) => state.employees.deleteEmployeeLoading;