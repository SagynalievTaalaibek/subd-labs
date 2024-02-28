import express from 'express';
import pool from '../db';

const rawMaterialsRouter = express.Router();

rawMaterialsRouter.post('/raw-materials', async (req, res, next) => {
  try {
    const { name, unit_of_measure_id, quantity, amount } = req.body;
    const newRawMaterial = await pool.query(
      'INSERT INTO raw_materials (name, unit_of_measure_id, quantity, amount) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, unit_of_measure_id, quantity, amount],
    );
    res.send(newRawMaterial.rows[0]);
  } catch (error) {
    console.error('Error creating raw material:', error);
    next(error);
  }
});

rawMaterialsRouter.get('/raw-materials', async (_req, res, next) => {
  try {
    const rawMaterials = await pool.query(
      'SELECT rm.id, rm.name, rm.quantity, rm.amount, uom.name units_of_measure_name FROM raw_materials rm ' +
        'LEFT JOIN public.units_of_measure uom on uom.id = rm.unit_of_measure_id',
    );
    res.send(rawMaterials.rows);
  } catch (e) {
    next(e);
  }
});

rawMaterialsRouter.get('/raw-materials/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const rawMaterials = await pool.query(
      'SELECT * FROM raw_materials where id = $1',
      [id],
    );
    res.send(rawMaterials.rows[0]);
  } catch (e) {
    next(e);
  }
});

rawMaterialsRouter.put('/raw-materials', async (req, res, next) => {
  try {
    const { id, name, unit_of_measure_id, quantity, amount } = req.body;
    const updatedRawMaterial = await pool.query(
      'UPDATE raw_materials SET name = $1, unit_of_measure_id = $2, quantity = $3, amount = $4 WHERE id = $5 RETURNING *',
      [name, unit_of_measure_id, quantity, amount, id],
    );
    res.send(updatedRawMaterial.rows[0]);
  } catch (e) {
    next(e);
  }
});

rawMaterialsRouter.put('/raw-materials-add', async (req, res, next) => {
  try {
    const { id, quantity, amount } = req.body;
    const updatedRawMaterial = await pool.query(
      'UPDATE raw_materials SET quantity = quantity + $1, amount = amount + $2 WHERE id = $3 RETURNING *',
      [quantity, amount, id],
    );
    res.send(updatedRawMaterial.rows[0]);
  } catch (e) {
    next(e);
  }
});

rawMaterialsRouter.put('/raw-materials-minus', async (req, res, next) => {
  try {
    const { id, quantity, amount } = req.body;
    const updatedRawMaterial = await pool.query(
      'UPDATE raw_materials SET quantity = quantity - $1, amount = amount - $2 WHERE id = $3 RETURNING *',
      [quantity, amount, id],
    );
    res.send(updatedRawMaterial.rows[0]);
  } catch (e) {
    next(e);
  }
});

rawMaterialsRouter.delete('/raw-materials/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM raw_materials where id = $1', [id]);
    res.send('Raw material deleted successfully id = ' + id);
  } catch (error) {
    res
      .status(400)
      .send(
        'Cannot delete Raw material because it is referenced in another table.',
      );
    next(error);
  }
});

export default rawMaterialsRouter;
