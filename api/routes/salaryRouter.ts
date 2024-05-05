import express from 'express';
import pool from '../db';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const salaryRouter = express.Router();

/*const fetchCountsForEmployee = async (
  employeeData: EmployeeSalaryTable,
  yearNumber: number,
  monthNumber: number,
  bonus: string,
) => {
  try {
    const promises = [];

    const purchasesCountPromise = pool.query(
      'SELECT COUNT(*) as count FROM raw_material_purchase WHERE employee_id = $1 AND EXTRACT(YEAR FROM purchase_date) = $2 AND EXTRACT(MONTH FROM purchase_date) = $3',
      [employeeData.employee_id, yearNumber, monthNumber],
    );
    promises.push(purchasesCountPromise);

    const salesCountPromise = pool.query(
      'SELECT COUNT(*) as count FROM product_sales WHERE employee_id = $1 AND EXTRACT(YEAR FROM sale_date) = $2 AND EXTRACT(MONTH FROM sale_date) = $3',
      [employeeData.employee_id, yearNumber, monthNumber],
    );
    promises.push(salesCountPromise);

    const productionCountPromise = pool.query(
      'SELECT COUNT(*) as count FROM production WHERE employee_id = $1 AND EXTRACT(YEAR FROM production_date) = $2 AND EXTRACT(MONTH FROM production_date) = $3',
      [employeeData.employee_id, yearNumber, monthNumber],
    );
    promises.push(productionCountPromise);

    const [purchasesCountResult, salesCountResult, productionCountResult] =
      await Promise.all(promises);

    const countPurchase = purchasesCountResult.rows[0].count;
    const countSales = salesCountResult.rows[0].count;
    const countProduction = productionCountResult.rows[0].count;
    const common_count =
      parseInt(countPurchase) +
      parseInt(countSales) +
      parseInt(countProduction);
    const mainBonus =
      (common_count * parseFloat(bonus) * parseFloat(employeeData.salary)) /
      100;
    const employeeSalary = parseFloat(employeeData.salary);
    const general = employeeSalary + mainBonus;

    return {
      countPurchase,
      countProduction,
      countSales,
      common_count,
      mainBonus,
      employeeSalary,
      general,
    };
  } catch (error) {
    console.error('Error in fetchCountsForEmployee:', error);
    throw error;
  }
};

salaryRouter.get('/salary', async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const yearNumber = parseInt(year as string, 10);
    const monthNumber = parseInt(month as string, 10);

    // Проверяем, существуют ли уже данные о зарплате для указанного года и месяца
    const result = await pool.query(
      'SELECT COUNT(*) > 0 AS exists FROM salary WHERE Year = $1 AND Month = $2;',
      [yearNumber, monthNumber],
    );

    const exists = result.rows[0].exists;

    if (!exists) {
      // Если данные о зарплате для указанного года и месяца отсутствуют, добавляем их
      const resultEmployee = await pool.query(
        'SELECT employee_id, full_name, salary FROM employees',
      );

      const bonusResult = await pool.query('SELECT bonus FROM budget');

      const bonus = bonusResult.rows[0].bonus;

      const employees: EmployeeSalaryTable[] = resultEmployee.rows;

      const promises = employees.map((employee) =>
        fetchCountsForEmployee(employee, yearNumber, monthNumber, bonus),
      );

      const employeeResults = await Promise.all(promises);

      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const {
          countPurchase,
          countProduction,
          countSales,
          common_count,
          employeeSalary,
          mainBonus,
          general,
        } = employeeResults[i];

        // Create new table with new data

        await pool.query(
          'INSERT INTO salary (employee_id, year, month, purchase_count, production_count, sales_count, common_count, salary, bonus, general) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [
            employee.employee_id,
            yearNumber,
            monthNumber,
            countPurchase,
            countProduction,
            countSales,
            common_count,
            employeeSalary,
            mainBonus,
            general,
          ],
        );
      }

      const data = await pool.query(
        'SELECT id, e.full_name , year, month, production_count, purchase_count, sales_count, common_count, salary.salary, bonus, general, issued FROM salary LEFT JOIN public.employees e on e.employee_id = salary.employee_id  WHERE year = $1 AND month = $2',
        [yearNumber, monthNumber],
      );

      return res.send(data.rows);
    } else {
      // Если данные о зарплате уже существуют, обновляем их
      const data = await pool.query(
        'SELECT * FROM salary WHERE year = $1 AND month = $2',
        [yearNumber, monthNumber],
      );

      const salaryData: SalaryI[] = data.rows;

      if (salaryData[0].issued) {
        const dataResult = await pool.query(
          'SELECT id, e.full_name , year, month, production_count, purchase_count, sales_count, common_count, salary.salary, bonus, general, issued FROM salary LEFT JOIN public.employees e on e.employee_id = salary.employee_id  WHERE year = $1 AND month = $2',
          [yearNumber, monthNumber],
        );

        // Если зарплата уже была выдана, отправляем данные клиенту
        return res.send(dataResult.rows);
      } else {
        // Если зарплата еще не была выдана, обновляем данные
        const employeesResult = await pool.query(
          'SELECT employee_id, full_name, salary FROM employees',
        );

        const employees: EmployeeSalaryTable[] = employeesResult.rows;
        const bonusResult = await pool.query('SELECT bonus FROM budget');

        const bonus = bonusResult.rows[0].bonus;

        for (const value of salaryData) {
          const employeeNewData = employees.findIndex(
            (employee) => employee.employee_id === value.employee_id,
          );

          const {
            countPurchase,
            countProduction,
            countSales,
            common_count,
            employeeSalary,
            mainBonus,
            general,
          } = await fetchCountsForEmployee(
            {
              employee_id: value.employee_id,
              salary: employees[employeeNewData].salary,
            },
            yearNumber,
            monthNumber,
            bonus,
          );

          const salaryId = value.id;
          await pool.query(
            'UPDATE salary set purchase_count = $1, production_count = $2, sales_count = $3, common_count = $4, salary = $5, bonus = $6, general = $7 WHERE id = $8 RETURNING *',
            [
              countPurchase,
              countProduction,
              countSales,
              common_count,
              employeeSalary,
              mainBonus,
              general,
              salaryId,
            ],
          );
        }

        const updatedData = await pool.query(
          'SELECT id, e.full_name , year, month, production_count, purchase_count, sales_count, common_count, salary.salary, bonus, general, issued FROM salary LEFT JOIN public.employees e on e.employee_id = salary.employee_id  WHERE year = $1 AND month = $2',
          [yearNumber, monthNumber],
        );

        return res.send(updatedData.rows);
      }
    }
  } catch (e) {
    console.error("Error in salaryRouter.get('/salary'):", e);
    next(e);
  }
});*/

salaryRouter.get('/salary', auth, permit('accountant', 'admin', 'director'), async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const yearNumber = parseInt(year as string, 10);
    const monthNumber = parseInt(month as string, 10);

    const result = await pool.query(
      'SELECT * FROM  calculate_and_update_salary($1, $2)',
      [yearNumber, monthNumber],
    );

    res.send(result.rows);
  } catch (e) {
    console.error("Error in salaryRouter.get('/salary'):", e);
    next(e);
  }
});

salaryRouter.put('/salary/update_issued_budget', auth, permit('accountant', 'admin'), async (req, res, next) => {
  try {
    const { budgetId, budgetAmountUpdate, yearNumber, monthNumber } = req.body;

    await pool.query('CALL update_salary_issued_and_budget($1, $2, $3, $4)', [
      budgetId,
      budgetAmountUpdate,
      yearNumber,
      monthNumber,
    ]);

    res
      .status(200)
      .json({ message: 'Salary and budget updated successfully.' });
  } catch (error) {
    console.error('Error updating salary and budget:', error);
    next(error);
  }
});

salaryRouter.put('/salary', auth, permit('accountant', 'admin'), async (req, res, next) => {
  try {
    const { id, general } = req.body;

    await pool.query('CALL update_salary_general($1, $2)', [id, general]);

    res.status(200).json({ message: 'Salary general updated successfully.' });
  } catch (error) {
    console.error('Error updating salary general:', error);
    next(error);
  }
});

/*salaryRouter.patch('/salary', async (req, res, next) => {
  try {
    const { year, month } = req.body;
    const yearNumber = parseInt(year, 10);
    const monthNumber = parseInt(month, 10);

    const result = await pool.query(
      'UPDATE salary SET issued = true WHERE year = $1 AND month = $2 RETURNING *',
      [yearNumber, monthNumber],
    );

    const updatedRows = result.rows;

    if (updatedRows.length === 0) {
      return res.status(404).json({ message: 'Not found salary fields' });
    }

    return res.json(updatedRows);
  } catch (error) {
    next(error);
  }
});*/

/*salaryRouter.put('/salary', async (req, res, next) => {
  try {
    const { id, general } = req.body;
    const updatedSalary = await pool.query(
      'UPDATE salary SET general = $1 WHERE id = $2 RETURNING *',
      [general, id],
    );

    res.send(updatedSalary.rows[0]);
  } catch (e) {
    next(e);
  }
});*/

salaryRouter.get('/salary/update', async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const yearNumber = parseInt(year as string, 10);
    const monthNumber = parseInt(month as string, 10);

    const updatedData = await pool.query(
      'SELECT id, e.full_name , year, month, production_count, purchase_count, sales_count, common_count, salary.salary, bonus, general, issued FROM salary LEFT JOIN public.employees e on e.employee_id = salary.employee_id  WHERE year = $1 AND month = $2',
      [yearNumber, monthNumber],
    );

    return res.send(updatedData.rows);
  } catch (e) {
    next(e);
  }
});

salaryRouter.get('/salary/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    /*const salaryData = await pool.query(
      'SELECT id, e.full_name , year, month, production_count, purchase_count, sales_count, common_count, salary.salary, bonus, general, issued ' +
        'FROM salary ' +
        'LEFT JOIN public.employees e on e.employee_id = salary.employee_id where id = $1',
      [id],
    );*/

    const salaryData = await pool.query('SELECT * FROM get_salary_by_id($1)', [
      id,
    ]);
    res.send(salaryData.rows[0]);
  } catch (e) {
    next(e);
  }
});

export default salaryRouter;
