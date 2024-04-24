import express from 'express';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const ingredientsRouter = express.Router();

/*
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
      'SELECT i.id, i.quantity, i.product_id, i.raw_material_id, rm.name AS raw_material_name ' +
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
    const { id, quantity } = req.body;
    await pool.query(
      'UPDATE ingredients SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id],
    );

    return res.send({ message: 'Edit Ok' });
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

*/

ingredientsRouter.post('/ingredients', auth, permit('admin', 'technologist'), async (req, res, next) => {
  try {
    const { product_id, raw_material_id, quantity } = req.body;
    await pool.query('CALL create_new_ingredient($1, $2, $3)', [
      product_id,
      raw_material_id,
      quantity,
    ]);

    res.send({ message: 'Create ingredients OK' });
  } catch (error) {
    res.status(400).send({ error: 'Запись с указанным сырьем уже существует' });
    next(error);
  }
});

ingredientsRouter.get('/ingredients-by-fp/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;

    const result = await pool.query(
      'SELECT * FROM get_ingredients_by_finished_product_id($1)',
      [productId],
    );
    const ingredients = result.rows;

    res.send(ingredients);
  } catch (e) {
    next(e);
  }
});

ingredientsRouter.get('/ingredients/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('CALL get_ingredient_by_id($1)', [id]);
    const ingredient = await pool.query('SELECT * FROM temp_ingredient');
    res.send(ingredient.rows[0]);
  } catch (e) {
    next(e);
  }
});

ingredientsRouter.put('/ingredients', auth, permit('admin', 'technologist'), async (req, res, next) => {
  try {
    const { id, quantity } = req.body;
    await pool.query('CALL update_ingredient_quantity($1, $2)', [id, quantity]);

    return res.send({ message: 'Edit Ok' });
  } catch (e) {
    next(e);
  }
});

ingredientsRouter.delete('/ingredients/:id', auth, permit('admin', 'technologist'), async (req, res, next) => {
  try {
    const id = req.params.id;
    await pool.query('CALL delete_ingredient_by_id($1)', [id]);
    res.send('Ingredients deleted successfully id = ' + id);
  } catch (error) {
    console.error('Error deleting Ingredients:', error);
    next(error);
  }
});

export default ingredientsRouter;
