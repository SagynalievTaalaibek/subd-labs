import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const employeeRouter = express.Router();

const findUserByEmail = async (email: string) => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM employees WHERE email = $1';
    const { rows } = await client.query(query, [email]);
    return rows;
  } finally {
    client.release();
  }
};

const generateTokenForUser = async (userId: string) => {
  const token = crypto.randomUUID().toString();
  const client = await pool.connect();

  try {
    await pool.query(
      'UPDATE employees SET token = $1 WHERE employee_id = $2 RETURNING *',
      [token, userId],
    );

    return token;
  } finally {
    client.release();
  }
};
employeeRouter.post('/employee', auth, permit('admin'), async (req, res) => {
  try {
    const { full_name, position_id, salary, address, phone, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await findUserByEmail(email);

    if (existingUser.length) {
      return res.status(422).send({ error: 'This user is already registered!' });
    }

    const newEmployee = await pool.query(
      'INSERT INTO employees (full_name, position_id, salary, address, phone, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [full_name, position_id, salary, address, phone, email, hashedPassword],
    );

    // Generate token for the user
    const token = await generateTokenForUser(newEmployee.rows[0].employee_id);
    return res.send({
      message: 'User created successfully!',
      user: { id: newEmployee.rows[0].employee_id, email, full_name, token },
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).send('Internal Server Error');
  }
});

employeeRouter.post('/employee/sessions', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      'SELECT employee_id, email, password, full_name, r.role_name FROM employees e ' +
      'LEFT JOIN public.positions p on p.position_id = e.position_id LEFT JOIN public.roles r on p.role_id = r.id ' +
      'WHERE email = $1',
      [email],
    );

    if (!user.rows.length) {
      return res.status(422).send({ error: 'User not found!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(422).send({ error: 'Password is wrong!' });
    }

    const token = await generateTokenForUser(user.rows[0].employee_id);

    /*await pool.query(
      'SELECT email, password, full_name,  r.role_name, token FROM employees e ' +
      'LEFT JOIN public.roles r on p.role_id = r.id ' +
      'WHERE email = $1',
      [email],
    );
*/
    return res.send({
      message: 'Email and password are correct!',
      user: {
        email: user.rows[0].email,
        full_name: user.rows[0].full_name,
        token,
        role: user.rows[0].role_name,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

employeeRouter.delete('/employee/sessions', async (req, res, next) => {
  try {
    const headerValue = req.get('Authorization');
    const successMessage = { message: 'Success!!' };

    if (!headerValue) {
      return res.send(successMessage);
    }

    const [_bearer, token] = headerValue.split(' ');

    if (!token) {
      return res.send(successMessage);
    }

    const user = await pool.query(
      'SELECT * FROM employees WHERE token = $1',
      [token],
    );

    if (!user.rows.length) {
      return res.send(successMessage);
    }

    await pool.query(
      'UPDATE employees SET token = null WHERE token = $1',
      [token],
    );
    return res.send(successMessage);
  } catch (error) {
    next(error);
  }
});

employeeRouter.get('/employee', async (_req, res, next) => {
  try {
    const employees = await pool.query(
      'SELECT e.employee_id, e.full_name,  e.salary, e.address, e.phone, p.position_name, e.email FROM employees e ' +
      'LEFT JOIN public.positions p on p.position_id = e.position_id',
    );
    res.send(employees.rows);
  } catch (e) {
    next(e);
  }
});

employeeRouter.get('/employee/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const employee = await pool.query(
      'SELECT * FROM employees where employee_id = $1',
      [id],
    );

    delete employee.rows[0].password;
    delete employee.rows[0].token;

    res.send(employee.rows[0]);
  } catch (e) {
    next(e);
  }
});

employeeRouter.put('/employee', async (req, res, next) => {
  const updatePassword = req.query.password;
  const { employee_id, full_name, position_id, salary, address, phone, password, email } =
    req.body;

  try {
    if (updatePassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const existingUser = await findUserByEmail(email);

      if (existingUser.length > 1) {
        return res.status(422).send({ error: 'This user is already registered!' });
      }

      await pool.query(
        'UPDATE employees SET full_name = $1, position_id = $2, salary = $3, address = $4, phone = $5, email = $6, password = $7 WHERE employee_id = $8 RETURNING *',
        [full_name, position_id, salary, address, phone, email, hashedPassword, employee_id],
      );

      return res.send({ message: 'User updated with password!' });
    }


    await pool.query(
      'UPDATE employees SET full_name = $1, position_id = $2, salary = $3, address = $4, phone = $5 WHERE employee_id = $6 RETURNING *',
      [full_name, position_id, salary, address, phone, employee_id],
    );

    return res.send({ message: 'User updated!' });
  } catch (e) {
    next(e);
  }
});

employeeRouter.delete('/employee/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM employees where employee_id = $1', [id]);
    res.send('Employee deleted successfully id = ' + id);
  } catch (e) {
    res
      .status(400)
      .send(
        'Cannot delete employee because it is referenced in another table.',
      );
    next(e);
  }
});

export default employeeRouter;
