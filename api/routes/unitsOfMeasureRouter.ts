import express from 'express';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const unitsOfMeasureRouter = express.Router();

unitsOfMeasureRouter.post('/units', auth, permit('technologist', 'admin'), async (req, res, next) => {
  try {
    const name = req.body.name;
    const newUnits = await pool.query(
      'INSERT INTO units_of_measure (name) values ($1) RETURNING *',
      [name],
    );
    res.send(newUnits.rows[0]);
  } catch (error) {
    console.error('Error creating units of measure:', error);
    next(error);
  }
});

unitsOfMeasureRouter.get('/units', async (_req, res, next) => {
  try {
    const units = await pool.query('SELECT * FROM units_of_measure');
    res.send(units.rows);
  } catch (e) {
    next(e);
  }
});

unitsOfMeasureRouter.get('/units/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const units = await pool.query(
      'SELECT * FROM units_of_measure where id = $1',
      [id],
    );
    res.send(units.rows[0]);
  } catch (e) {
    next(e);
  }
});

unitsOfMeasureRouter.put('/units', auth, permit('technologist', 'admin'), async (req, res, next) => {
  try {
    const { id, name } = req.body;
    const units = await pool.query(
      'UPDATE units_of_measure SET name = $1 where id = $2 RETURNING *',
      [name, id],
    );
    res.send(units.rows[0]);
  } catch (e) {
    next(e);
  }
});

unitsOfMeasureRouter.delete('/units/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM units_of_measure where id = $1', [id]);
    res.send('Units of measure deleted successfully id = ' + id);
  } catch (error) {
    res
      .status(400)
      .send(
        'Cannot delete Units of measure because it is referenced in another table.',
      );
    next(error);
  }
});

export default unitsOfMeasureRouter;
