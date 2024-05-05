import express from 'express';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const finishedProductRouter = express.Router();

/*finishedProductRouter.post('/finished-product', async (req, res, next) => {
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
*/

finishedProductRouter.post('/finished-product', auth, permit('admin', 'manager'),async (req, res, next) => {
  try {
    const { name, unit_of_measure_id, quantity, amount } = req.body;
    const newProduct = await pool.query(
      'CALL create_finished_product($1, $2, $3, $4)',
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
    const finishedProducts = await pool.query(
      'SELECT * FROM get_finished_products()',
    );
    res.send(finishedProducts.rows);
  } catch (error) {
    console.error('Error retrieving finished products:', error);
    next(error);
  }
});

finishedProductRouter.get('/finished-product/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      'SELECT * FROM get_finished_product_by_id($1)',
      [id],
    );
    res.send(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving finished product by id:', error);
    next(error);
  }
});

finishedProductRouter.put('/finished-product', auth, permit('admin', 'manager'), async (req, res, next) => {
  try {
    const { id, name, unit_of_measure_id, quantity, amount } = req.body;
    const updatedProduct = await pool.query(
      'CALL update_finished_product($1, $2, $3, $4, $5)',
      [id, name, unit_of_measure_id, quantity, amount],
    );
    res.send(updatedProduct.rows[0]);
  } catch (error) {
    next(error);
  }
});

finishedProductRouter.delete(
  '/finished-product/:id',
  auth, permit('admin', 'manager'),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      await pool.query('CALL delete_finished_product($1)', [id]);
      res.send('Finished product deleted successfully id = ' + id);
    } catch (error) {
      res.status(400).send({
        error:
          'Cannot delete Finished product because it is referenced in another table.',
      });
      next(error);
    }
  },
);

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

/*finishedProductRouter.put('/finished-product-minus', async (req, res, next) => {
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
});*/

export default finishedProductRouter;
