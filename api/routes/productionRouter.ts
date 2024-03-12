import express from 'express';
import pool from '../db';

const productionRouter = express.Router();


productionRouter.post('/production', async (req, res, next) => {
  try {
    const { product_id, production_date, quantity, employee_id } = req.body;
    const newProduction = await pool.query(
      'INSERT INTO production (product_id, production_date, quantity, employee_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_id, production_date, quantity, employee_id],
    );
    res.send(newProduction.rows[0]);
  } catch (error) {
    console.error('Error creating production:', error);
    next(error);
  }
});

productionRouter.get('/production', async (_req, res, next) => {
  try {
    const productionData = await pool.query(
      'SELECT p.id, p.quantity, p.production_date, e.full_name as employee_full_name, fp.name as product_name FROM production p ' +
      'LEFT JOIN public.employees e on e.employee_id = p.employee_id ' +
      'LEFT JOIN public.finished_products fp on p.product_id = fp.id',
    );
    res.send(productionData.rows);
  } catch (e) {
    next(e);
  }
});

productionRouter.delete('/production/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM production where id = $1', [id]);
    res.send('Production deleted successfully id = ' + id);
  } catch (error) {
    res
      .status(400)
      .send(
        'Cannot delete Production deleted because it is referenced in another table.',
      );
    next(error);
  }
});

export default productionRouter;