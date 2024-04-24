import { NextFunction, Request, Response } from 'express';
import { UserFields } from '../types';
import pool from '../db';
export interface RequestWithUser extends Request {
  user?: UserFields;
}

const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const headerValue = req.get('Authorization');


  if (!headerValue) {
    return res.status(401).send({ error: 'No Authorization header present!' });
  }

  const [, token] = headerValue.split(' ');

  if (!token) {
    return res.status(401).send({ error: 'No token present!' });
  }

  try {
    const user = await pool.query(
      'SELECT employee_id, email, password, full_name, p.position_name as role, token FROM employees e ' +
      'LEFT JOIN public.positions p on p.position_id = e.position_id ' +
      'WHERE token = $1',
      [token],
    );
    console.log(user.rows);
    console.log(token);
    console.log('Length ',user.rows.length);
    if (user.rows.length === 0) {
      return res.status(401).send({ error: 'Wrong token!' });
    }
    console.log( user.rows[0]);
    req.user = user.rows[0];
    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

export default auth;
