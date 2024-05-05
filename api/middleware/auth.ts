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
      'SELECT e.employee_id, e.full_name,  e.salary, e.address, e.phone, e.email, r.role_name as role FROM employees e ' +
      'LEFT JOIN public.positions p on p.position_id = e.position_id ' +
      'LEFT JOIN public.roles r on p.role_id = r.id WHERE token = $1', [token]
    );

    if (user.rows.length === 0) {
      return res.status(401).send({ error: 'Wrong token!' });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

export default auth;
