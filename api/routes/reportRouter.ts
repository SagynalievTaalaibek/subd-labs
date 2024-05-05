import express from 'express';
import pool from '../db';

const reportRouter = express.Router();

reportRouter.get('/report/salary', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const salaryData = await pool.query('SELECT * FROM get_salary_date($1, $2)', [startDate, endDate]);
    res.send(salaryData.rows);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

export default reportRouter;
