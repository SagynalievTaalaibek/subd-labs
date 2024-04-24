export interface PositionI {
  position_id: string;
  position_name: string;
}

export interface EmployeesI {
  employee_id: string;
  full_name: string;
  position_name: string;
  salary: number;
  address: string;
  phone: string;
  email: string;
}

export interface EmployeesWithID {
  employee_id: string;
  full_name: string;
  position_id: string;
  salary: string;
  address: string;
  phone: string;
  email: string;
}

export interface EmployeeEditPasswordEmail {
  employee_id: string;
  full_name: string;
  position_id: string;
  salary: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface EmployeeMutation {
  full_name: string;
  position_id: string;
  salary: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface EmployeeResponseOne {
  full_name: string;
  position_id: string;
  salary: string;
  address: string;
  phone: string;
  email: string;
}

export interface UnitsI {
  id: string;
  name: string;
}

export interface FinishedProductI {
  id: string;
  name: string;
  units_of_measure_name: string;
  quantity: string;
  amount: string;
}

export interface FinishedProductWithId {
  id: string;
  name: string;
  unit_of_measure_id: string;
  quantity: string;
  amount: string;
}

export interface FinishedProductMutation {
  name: string;
  unit_of_measure_id: string;
  quantity: string;
  amount: string;
}

export interface RawMaterialI {
  id: string;
  name: string;
  units_of_measure_name: string;
  quantity: string;
  amount: string;
}

export interface RawMaterialMutation {
  name: string;
  unit_of_measure_id: string;
  quantity: string;
  amount: string;
}

export interface RawMaterialWithID {
  id: string;
  name: string;
  unit_of_measure_id: string;
  quantity: string;
  amount: string;
}

export interface IngredientI {
  id: string;
  product_id: string;
  raw_material_name: string;
  raw_material_id: string;
  quantity: string;
}

export interface IngredientMutation {
  product_id: string;
  raw_material_id: string;
  quantity: string;
}

export interface IngredientsWithID {
  id: string;
  quantity: string;
  product_id: string;
  raw_material_id: string;
}

export interface BudgetI {
  id: string;
  budget_amount: string;
  bonus: string;
  markup: string;
}

export interface BudgetMutation {
  budget_amount: string;
  bonus: string;
  markup: string;
}

export interface RawMaterialPurchaseI {
  id: string;
  employee_full_name: string;
  raw_material_name: string;
  purchase_date: string;
  quantity: string;
  amount: string;
}

export interface RawMaterialPurchaseMutation {
  raw_material_id: string;
  employee_id: string;
  purchase_date: string;
  quantity: string;
  amount: string;
}

export interface ProductSalesI {
  id: string;
  employee_full_name: string;
  product_name: string;
  sale_date: string;
  quantity: string;
  amount: string;
}

export interface ProductSalesMutation {
  employee_id: string;
  product_id: string;
  sale_date: string;
  quantity: string;
  amount: string;
}

export interface ProductionI {
  id: string;
  product_name: string;
  quantity: string;
  production_date: string;
  employee_full_name: string;
}

export interface ProductionMutation {
  product_id: string;
  quantity: string;
  production_date: string;
  employee_id: string;
}

export interface MinusMaterial {
  id: string;
  amount: string;
  quantity: string;
}

export interface ProductionSendData {
  materialsMinus: MinusMaterial[];
  productsSum: string;
  selectedQuantity: string;
}

// salary

export interface SalaryI {
  id: string;
  full_name: string;
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


// BANK

export interface IBank {
  id: string;
  loan_date: string;
  loan_amount: string;
  annual_interest_rate: string;
  term_in_month: string;
  penalty: string;
  status: boolean;
}

export interface BankMutation {
  loan_date: string;
  loan_amount: string;
  annual_interest_rate: string;
  term_in_month: string;
  penalty: string;
}

export interface PaymentResponse {
  id: string;
  loan_part: string;
  percent_amount: string;
  penalty_amount: string;
  total_amount: string;
  payment_date: string;
  payment_received_date: string;
  overdue: string;
  rest_money: string;
  bank_id: string;
}

export interface PaymentMutationWithoutPenalty {
  loan_part: string;
  percent_amount: string;
  penalty_amount: string;
  total_amount: string;
  payment_date: string;
  payment_received_date: string;
  overdue: string;
  rest_money: string;
  bank_id: string;
}

export interface PaymentMutation {
  loan_part: string;
  percent_amount: string;
  penalty: string;
  total_amount: string;
  payment_date: string;
  payment_received_date: string;
  overdue: string;
  rest_money: string;
  bank_id: string;
}

export interface PenaltyCalculate {
  total_amount: string;
  penalty_amount: string;
  overdue: string;
  payment_received_date: string;
}

export interface UserI {
  email: string;
  full_name: string;
  token: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  user: UserI;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface GlobalError {
  error: string;
}