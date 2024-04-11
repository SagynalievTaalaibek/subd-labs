import express from 'express';
import pool from '../db';

const budgetRouter = express.Router();

budgetRouter.get('/budget', async (_req, res, next) => {
  try {
    const budget = await pool.query('SELECT * FROM budget');
    res.send(budget.rows[0]);
  } catch (e) {
    next(e);
  }
});

budgetRouter.put('/budget', async (req, res, next) => {
  try {
    const { id, budget_amount, bonus, markup } = req.body;
    const budgetData = await pool.query(
      'UPDATE budget set budget_amount = $1, bonus = $2, markup = $3 where id = $4 RETURNING *',
      [budget_amount, bonus, markup, id],
    );
    res.send(budgetData.rows[0]);
  } catch (e) {
    next(e);
  }
});

budgetRouter.put('/budget-add', async (req, res, next) => {
  try {
    const { id, budget_amount } = req.body;
    const budgetData = await pool.query(
      'UPDATE budget set budget_amount = budget_amount + $1 where id = $2 RETURNING *',
      [budget_amount, id],
    );
    res.send(budgetData.rows[0]);
  } catch (e) {
    next(e);
  }
});

budgetRouter.put('/budget-minus', async (req, res, next) => {
  try {
    const { id, budget_amount } = req.body;
    const position = await pool.query(
      'UPDATE budget set budget_amount = budget_amount - $1 where id = $2 RETURNING *',
      [budget_amount, id],
    );
    res.send(position.rows[0]);
  } catch (e) {
    next(e);
  }
});

export default budgetRouter;
