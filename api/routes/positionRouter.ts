import express from 'express';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const positionRouter = express.Router();

positionRouter.post('/position',auth, permit('admin'), async (req, res, next) => {
  try {
    const {position_name, role_id} = req.body;
    const newPosition = await pool.query(
      'INSERT INTO positions (position_name, role_id) values ($1, $2) RETURNING *',
      [position_name, role_id],
    );
    res.send(newPosition.rows[0]);
  } catch (e) {
    next(e);
  }
});

positionRouter.get('/position', async (_req, res, next) => {
  try {
    const positions = await pool.query(
      'SELECT p.position_id, p.position_name, r.role_name FROM positions p ' +
      'LEFT JOIN public.roles r on p.role_id = r.id'
    );
    res.send(positions.rows);
  } catch (e) {
    next(e);
  }
});

positionRouter.get('/roles', async (_req, res, next) => {
  try {
    const roles = await pool.query(
      'SELECT * FROM roles'
    );
    res.send(roles.rows);
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
    const { position_id, position_name, role_id } = req.body;
    const position = await pool.query(
      'UPDATE positions set position_name = $1, role_id = $2 where position_id = $3 RETURNING *',
      [position_name, role_id, position_id],
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
