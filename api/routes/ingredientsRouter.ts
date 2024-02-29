import express from 'express';
import pool from '../db';

const ingredientsRouter = express.Router();

ingredientsRouter.post('/ingredients', async (req, res, next) => {
  try {
    const { product_id, raw_material_id, quantity } = req.body;
    const existingIngredient = await pool.query(
      'SELECT i.id, i.product_id, i.raw_material_id, i.quantity ' +
        'FROM ingredients i ' +
        'WHERE raw_material_id = $1 AND product_id = $2',
      [raw_material_id, product_id],
    );

    if (existingIngredient.rows.length > 0) {
      res
        .status(400)
        .send({ error: 'Запись с указанным сырьем уже существует' });
    } else {
      const newIngredients = await pool.query(
        'INSERT INTO ingredients (product_id, raw_material_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [product_id, raw_material_id, quantity],
      );
      res.send(newIngredients.rows[0]);
    }
  } catch (error) {
    next(error);
  }
});

ingredientsRouter.get('/ingredients-by-fp/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const ingredients = await pool.query(
      'SELECT i.id, i.quantity, i.product_id, rm.name AS raw_material_name ' +
        'FROM ingredients i ' +
        'LEFT JOIN raw_materials rm ON rm.id = i.raw_material_id ' +
        'LEFT JOIN finished_products fp ON fp.id = i.product_id WHERE i.product_id = $1',
      [id],
    );
    res.send(ingredients.rows);
  } catch (e) {
    next(e);
  }
});

ingredientsRouter.get('/ingredients/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const ingredient = await pool.query(
      'SELECT i.id, i.quantity, i.product_id, i.raw_material_id ' +
        'FROM ingredients i WHERE i.id = $1',
      [id],
    );
    res.send(ingredient.rows[0]);
  } catch (e) {
    next(e);
  }
});

ingredientsRouter.put('/ingredients', async (req, res, next) => {
  try {
    const { id, product_id, raw_material_id, quantity } = req.body as {
      id: string;
      product_id: string;
      raw_material_id: string;
      quantity: string;
    };

    const existingIngredient = await pool.query(
      'SELECT i.id, i.product_id, i.raw_material_id, i.quantity ' +
        'FROM ingredients i ' +
        'WHERE raw_material_id = $1 AND product_id = $2',
      [raw_material_id, product_id],
    );

    if (existingIngredient.rows.length > 0) {
      const existingQuantity = existingIngredient.rows[0].quantity;

      if (existingQuantity !== quantity) {
        const updatedIngredient = await pool.query(
          'UPDATE ingredients SET quantity = $1 WHERE id = $2 RETURNING *',
          [quantity, id],
        );
        return res.send({ message: 'OK', date: updatedIngredient.rows[0] });
      } else {
        return res
          .status(400)
          .send({ error: 'Запись с указанным сырьем уже существует' });
      }
    } else {
      return res
        .status(400)
        .send({ error: 'Запись с указанным сырьем уже существует' });
    }
  } catch (e) {
    next(e);
  }
});

ingredientsRouter.delete('/ingredients/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM ingredients where id = $1', [id]);
    res.send('Ingredients deleted successfully id = ' + id);
  } catch (error) {
    console.error('Error deleting Ingredients:', error);
    next(error);
  }
});

export default ingredientsRouter;
