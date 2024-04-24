export interface EmployeeSalaryTable {
  employee_id: string;
  salary: string;
}

export interface SalaryI {
  id: string;
  employee_id: string;
  year: number;
  month: number;
  purchase_count: number;
  production_count: number;
  sales_count: number;
  common_count: number;
  salary: string;
  bonus: string;
  general: string;
  issued: boolean;
}

export interface UserFields {
  email: string;
  password: string;
  full_name: string;
  token: string;
  role: string;
}