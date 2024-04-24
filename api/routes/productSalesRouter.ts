import express from 'express';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const productSalesRouter = express.Router();

productSalesRouter.post('/product-sales', auth, permit('manager', 'admin'), async (req, res, next) => {
  try {
    const { product_id, sale_date, quantity, amount, employee_id } = req.body;
    const newProductSales = await pool.query(
      'INSERT INTO product_sales (product_id, sale_date, quantity, amount, employee_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product_id, sale_date, quantity, amount, employee_id],
    );
    res.send(newProductSales.rows[0]);
  } catch (error) {
    console.error('Error creating product sale:', error);
    next(error);
  }
});

productSalesRouter.get('/product-sales', async (_req, res, next) => {
  try {
    const productSalesData = await pool.query(
      'SELECT ps.id, ps.quantity, ps.amount, ps.sale_date, e.full_name as employee_full_name, fp.name as product_name FROM product_sales ps ' +
        'LEFT JOIN public.employees e on e.employee_id = ps.employee_id ' +
        'LEFT JOIN public.finished_products fp on ps.product_id = fp.id',
    );
    res.send(productSalesData.rows);
  } catch (e) {
    next(e);
  }
});

productSalesRouter.delete('/product-sales/:id', auth, permit('manager', 'admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM product_sales where id = $1', [id]);
    res.send('Product Sales deleted successfully id = ' + id);
  } catch (error) {
    res
      .status(400)
      .send(
        'Cannot delete Product Sales deleted because it is referenced in another table.',
      );
    next(error);
  }
});

export default productSalesRouter;
