import express from 'express';
import pool from '../db';

const bankRouter = express.Router();

bankRouter.post('/bank', async (req, res, next) => {
  try {
    const { loan_date, loan_amount, annual_interest_rate, term_in_month, penalty, budgetId } = req.body;

    await pool.query('SELECT create_new_bank($1, $2, $3, $4, $5, $6)', [
      loan_date, loan_amount, annual_interest_rate, term_in_month, penalty, budgetId,
    ]);

    return res.send({ message: 'Bank created successfully' });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

bankRouter.post('/bank/pay', async (req, res, next) => {
  try {
    const { loan_part, percent_amount, penalty_amount, total_amount, payment_date, payment_received_date, overdue, rest_money, bank_id, budget_id } = req.body;

    await pool.query('SELECT create_pay_credit($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [
      loan_part, percent_amount, penalty_amount, total_amount, payment_date, payment_received_date, overdue, rest_money, bank_id, budget_id,
    ]);

    return res.send({ message: 'Credit created successfully' });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

bankRouter.get('/bank/list/:id', async (req, res, next) => {
  try {
    const bankId = req.params.id;

    const result = await pool.query('SELECT * FROM get_payments_by_bank_id($1)', [bankId]);
    res.send(result.rows);
  } catch (e) {
    next(e);
  }
})

bankRouter.get('/bank', async (req, res, next) => {
  try {
    const bank = await pool.query('SELECT * FROM get_banks()');
    return res.send(bank.rows);
  } catch (e) {
    console.log('Error getting bank', e);
    next(e);
  }
});

bankRouter.get('/bank/:id', async (req, res, next) => {
  try {
   const bankId = req.params.id;

   const result = await pool.query('SELECT * FROM get_bank_calculate_credit($1)', [bankId]);
   res.send(result.rows[0]);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

export default bankRouter;