import express from 'express';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const positionRouter = express.Router();

positionRouter.post('/position',auth, permit('admin'), async (req, res, next) => {
  try {
    const position_name = req.body.name;
    const newPosition = await pool.query(
      'INSERT INTO positions (position_name) values ($1) RETURNING *',
      [position_name],
    );
    res.send(newPosition.rows[0]);
  } catch (e) {
    next(e);
  }
});

positionRouter.get('/position', async (_req, res, next) => {
  try {
    const positions = await pool.query('SELECT * FROM positions');
    res.send(positions.rows);
  } catch (e) {
    next(e);
  }
});

positionRouter.get('/position/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const position = await pool.query(
      'SELECT * FROM positions where position_id = $1',
      [id],
    );
    res.send(position.rows[0]);
  } catch (e) {
    next(e);
  }
});

positionRouter.put('/position', auth, permit('admin'), async (req, res, next) => {
  try {
    const { position_id, position_name } = req.body;
    const position = await pool.query(
      'UPDATE positions set position_name = $1 where position_id = $2 RETURNING *',
      [position_name, position_id],
    );
    res.send(position.rows[0]);
  } catch (e) {
    next(e);
  }
});

positionRouter.delete('/position/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM positions WHERE position_id = $1', [id]);
    res.send('Position deleted successfully.');
  } catch (error) {
    res
      .status(400)
      .send(
        'Cannot delete position because it is referenced in another table.',
      );
    next(error);
  }
});

export default positionRouter;
