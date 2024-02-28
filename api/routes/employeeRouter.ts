import express from 'express';
import pool from '../db';

const employeeRouter = express.Router();

employeeRouter.post('/employee', async (req, res) => {
  try {
    const { full_name, position_id, salary, address, phone } = req.body;
    const newEmployee = await pool.query(
      'INSERT INTO employees (full_name, position_id, salary, address, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [full_name, position_id, salary, address, phone],
    );
    res.send(newEmployee.rows[0]);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).send('Internal Server Error');
  }
});

employeeRouter.get('/employee', async (_req, res, next) => {
  try {
    const employees = await pool.query(
      'SELECT e.employee_id, e.full_name,  e.salary, e.address, e.phone, position_name FROM employees e ' +
        'LEFT JOIN public.positions p on p.position_id = e.position_id',
    );
    res.send(employees.rows);
  } catch (e) {
    next(e);
  }
});

employeeRouter.get('/employee/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const employee = await pool.query(
      'SELECT * FROM employees where employee_id = $1',
      [id],
    );
    res.send(employee.rows[0]);
  } catch (e) {
    next(e);
  }
});

employeeRouter.put('/employee', async (req, res, next) => {
  try {
    const { employee_id, full_name, position_id, salary, address, phone } =
      req.body;
    const updatedEmployee = await pool.query(
      'UPDATE employees SET full_name = $1, position_id = $2, salary = $3, address = $4, phone = $5 WHERE employee_id = $6 RETURNING *',
      [full_name, position_id, salary, address, phone, employee_id],
    );
    res.send(updatedEmployee.rows[0]);
  } catch (e) {
    next(e);
  }
});

employeeRouter.delete('/employee/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM employees where employee_id = $1', [id]);
    res.send('Employee deleted successfully id = ' + id);
  } catch (e) {
    res
      .status(400)
      .send(
        'Cannot delete employee because it is referenced in another table.',
      );
    next(e);
  }
});

export default employeeRouter;
