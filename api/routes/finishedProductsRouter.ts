import express from 'express';
import pool from '../db';

const finishedProductRouter = express.Router();

finishedProductRouter.post('/finished-product', async (req, res, next) => {
  try {
    const { name, unit_of_measure_id, quantity, amount } = req.body;
    const newProduct = await pool.query(
      'INSERT INTO finished_products (name, unit_of_measure_id, quantity, amount) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, unit_of_measure_id, quantity, amount],
    );
    res.send(newProduct.rows[0]);
  } catch (error) {
    console.error('Error creating finished product:', error);
    next(error);
  }
});

finishedProductRouter.get('/finished-product', async (_req, res, next) => {
  try {
    const units = await pool.query(
      'SELECT fp.id, fp.name, fp.quantity, fp.amount, uom.name units_of_measure_name FROM finished_products fp ' +
        'LEFT JOIN public.units_of_measure uom on uom.id = fp.unit_of_measure_id',
    );
    res.send(units.rows);
  } catch (e) {
    next(e);
  }
});

finishedProductRouter.get('/finished-product/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const units = await pool.query(
      'SELECT * FROM finished_products where id = $1',
      [id],
    );
    res.send(units.rows[0]);
  } catch (e) {
    next(e);
  }
});

finishedProductRouter.put('/finished-product', async (req, res, next) => {
  try {
    const { id, name, unit_of_measure_id, quantity, amount } = req.body;
    const updatedUnits = await pool.query(
      'UPDATE finished_products SET name = $1, unit_of_measure_id = $2, quantity = $3, amount = $4 WHERE id = $5 RETURNING *',
      [name, unit_of_measure_id, quantity, amount, id],
    );
    res.send(updatedUnits.rows[0]);
  } catch (e) {
    next(e);
  }
});

finishedProductRouter.put('/finished-product-minus', async (req, res, next) => {
  try {
    const { id, quantity, amount } = req.body;
    const updatedUnits = await pool.query(
      'UPDATE finished_products SET  quantity = quantity - $1, amount = amount - $2 WHERE id = $3 RETURNING *',
      [quantity, amount, id],
    );
    res.send(updatedUnits.rows[0]);
  } catch (e) {
    next(e);
  }
});

finishedProductRouter.put('/finished-product-plus', async (req, res, next) => {
  try {
    const { id, quantity, amount } = req.body;
    const updatedUnits = await pool.query(
      'UPDATE finished_products SET  quantity = quantity + $1, amount = amount + $2 WHERE id = $3 RETURNING *',
      [quantity, amount, id],
    );
    res.send(updatedUnits.rows[0]);
  } catch (e) {
    next(e);
  }
});

finishedProductRouter.delete(
  '/finished-product/:id',
  async (req, res, next) => {
    try {
      const id = req.params.id;
      await pool.query('DELETE FROM finished_products where id = $1', [id]);
      res.send('Finished products deleted successfully id = ' + id);
    } catch (error) {
      res.status(400).send({
        error:
          'Cannot delete Finished products because it is referenced in another table.',
      });
      next(error);
    }
  },
);

export default finishedProductRouter;
