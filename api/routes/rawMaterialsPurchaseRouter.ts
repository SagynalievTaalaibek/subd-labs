import express from 'express';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const rawMaterialsPurchaseRouter = express.Router();

rawMaterialsPurchaseRouter.post('/raw-purchase', auth, permit('manager', 'admin'), async (req, res, next) => {
  try {
    const { raw_material_id, purchase_date, quantity, amount, employee_id } =
      req.body;
    const newRawMaterialPurchase = await pool.query(
      'INSERT INTO raw_material_purchase (raw_material_id, purchase_date, quantity, amount, employee_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [raw_material_id, purchase_date, quantity, amount, employee_id],
    );
    res.send(newRawMaterialPurchase.rows[0]);
  } catch (error) {
    console.error('Error creating raw_material_purchase:', error);
    next(error);
  }
});

rawMaterialsPurchaseRouter.get('/raw-purchase', async (_req, res, next) => {
  try {
    const RawMaterialPurchases = await pool.query(
      'SELECT rmp.id, rmp.quantity, rmp.amount, rmp.purchase_date, e.full_name as employee_full_name, rm.name as raw_material_name FROM raw_material_purchase rmp ' +
        'LEFT JOIN public.employees e on e.employee_id = rmp.employee_id ' +
        'LEFT JOIN public.raw_materials rm on rmp.raw_material_id = rm.id',
    );
    res.send(RawMaterialPurchases.rows);
  } catch (e) {
    next(e);
  }
});

rawMaterialsPurchaseRouter.delete(
  '/raw-purchase/:id',
  auth, permit('manager', 'admin'),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      await pool.query('DELETE FROM raw_material_purchase where id = $1', [id]);
      res.send('Raw material purchase deleted successfully id = ' + id);
    } catch (error) {
      res
        .status(400)
        .send(
          'Cannot delete Raw material Purchase because it is referenced in another table.',
        );
      next(error);
    }
  },
);

export default rawMaterialsPurchaseRouter;
