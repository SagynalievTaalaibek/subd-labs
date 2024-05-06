--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: calculate_and_update_salary(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_and_update_salary(yearnumber integer, monthnumber integer) RETURNS TABLE(id integer, employee_id integer, full_name character varying, year integer, month integer, purchase_count integer, production_count integer, sales_count integer, common_count integer, salary numeric, bonus numeric, general numeric, issued boolean)
    LANGUAGE plpgsql
    AS $$
DECLARE
    bonus_value NUMERIC;
    main_bonus NUMERIC;
    employee_record RECORD;
    purchase_count_update INT;
    production_count_update INT;
    sales_count_update INT;
    common_count_update INT;
    general_update NUMERIC;
BEGIN
    -- Проверяем, существуют ли уже данные о зарплате для указанного года и месяца
    IF NOT EXISTS (
        SELECT 1
        FROM salary
        WHERE salary.year = yearNumber AND salary.month = monthNumber
    ) THEN
        -- Если данные о зарплате для указанного года и месяца отсутствуют, добавляем их
        FOR employee_record IN
            SELECT employees.employee_id, employees.full_name, employees.salary
            FROM employees
        LOOP
            -- Вычисляем бонус
            SELECT budget.bonus INTO bonus_value FROM budget;
            -- Вычисляем количество покупок, продаж и производства для сотрудника
            SELECT
                COUNT(*) INTO purchase_count
            FROM raw_material_purchase
            WHERE raw_material_purchase.employee_id = employee_record.employee_id
                AND EXTRACT(YEAR FROM purchase_date) = yearNumber
                AND EXTRACT(MONTH FROM purchase_date) = monthNumber;

            SELECT
                COUNT(*) INTO production_count
            FROM production
            WHERE production.employee_id = employee_record.employee_id
                AND EXTRACT(YEAR FROM production_date) = yearNumber
                AND EXTRACT(MONTH FROM production_date) = monthNumber;

            SELECT
                COUNT(*) INTO sales_count
            FROM product_sales
            WHERE product_sales.employee_id = employee_record.employee_id
                AND EXTRACT(YEAR FROM sale_date) = yearNumber
                AND EXTRACT(MONTH FROM sale_date) = monthNumber;

            -- Вычисляем общее количество
            common_count := purchase_count + production_count + sales_count;
            -- Вычисляем бонус
            main_bonus := (common_count * bonus_value * employee_record.salary) / 100;
            -- Вычисляем общую зарплату
            general := employee_record.salary + main_bonus;

            -- Добавляем данные о зарплате в таблицу
            INSERT INTO salary (employee_id, year, month, purchase_count, production_count, sales_count, common_count, salary, bonus, general)
            VALUES (employee_record.employee_id, yearNumber, monthNumber, purchase_count, production_count, sales_count, common_count, employee_record.salary, main_bonus, general);
        END LOOP;

        -- Возвращаем данные о зарплате для указанного года и месяца
        RETURN QUERY
        SELECT s.id,  s.employee_id, e.full_name, s.year, s.month, s.purchase_count, s.production_count, s.sales_count, s.common_count, s.salary, s.bonus, s.general, s.issued
        FROM salary s
        LEFT JOIN employees e ON s.employee_id = e.employee_id
        WHERE s.year = yearNumber AND s.month = monthNumber;
    ELSE
        IF NOT EXISTS (
            SELECT 1
            FROM salary
            WHERE salary.year = yearNumber AND salary.month = monthNumber AND salary.issued
        ) THEN
            -- Если зарплата еще не была выдана, обновляем данные
            FOR employee_record IN
                SELECT employees.employee_id, employees.full_name, employees.salary
                FROM employees
            LOOP
                -- Вычисляем бонус
                SELECT budget.bonus INTO bonus_value FROM budget;
                -- Вычисляем количество покупок, продаж и производства для сотрудника
                SELECT
                    COUNT(*) INTO purchase_count_update
                FROM raw_material_purchase
                WHERE raw_material_purchase.employee_id = employee_record.employee_id
                    AND EXTRACT(YEAR FROM purchase_date) = yearNumber
                    AND EXTRACT(MONTH FROM purchase_date) = monthNumber;

                SELECT
                    COUNT(*) INTO production_count_update
                FROM production
                WHERE production.employee_id = employee_record.employee_id
                    AND EXTRACT(YEAR FROM production_date) = yearNumber
                    AND EXTRACT(MONTH FROM production_date) = monthNumber;

                SELECT
                    COUNT(*) INTO sales_count_update
                FROM product_sales
                WHERE product_sales.employee_id = employee_record.employee_id
                    AND EXTRACT(YEAR FROM sale_date) = yearNumber
                    AND EXTRACT(MONTH FROM sale_date) = monthNumber;

                -- Вычисляем общее количество
                common_count_update := purchase_count_update + production_count_update + sales_count_update;
                -- Вычисляем бонус
                main_bonus := (common_count_update * bonus_value * employee_record.salary) / 100;
                -- Вычисляем общую зарплату
                general_update := employee_record.salary + main_bonus;

                -- Обновляем данные о зарплате в таблице
                UPDATE salary
                SET
                    purchase_count = purchase_count_update,
                    production_count = production_count_update,
                    sales_count = sales_count_update,
                    common_count = common_count_update,
                    salary = employee_record.salary,
                    bonus = main_bonus,
                    general = general_update
                WHERE salary.employee_id = employee_record.employee_id AND salary.year = yearNumber AND salary.month = monthNumber;
            END LOOP;
        END IF;
            -- Возвращаем обновленные данные о зарплате для указанного года и месяца
            RETURN QUERY
            SELECT s.id, s.employee_id, e.full_name, s.year, s.month, s.purchase_count, s.production_count, s.sales_count, s.common_count, s.salary, s.bonus, s.general, s.issued
            FROM salary s
            LEFT JOIN employees e ON s.employee_id = e.employee_id
            WHERE s.year = yearNumber AND s.month = monthNumber;
    END IF;
END
$$;


ALTER FUNCTION public.calculate_and_update_salary(yearnumber integer, monthnumber integer) OWNER TO postgres;

--
-- Name: check_existing_ingredient(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.check_existing_ingredient(IN raw_material_id integer, IN product_id integer)
    LANGUAGE plpgsql
    AS $_$
    DECLARE
        existing_count INT = 0;
    BEGIN
        SELECT COUNT(*) INTO existing_count
        FROM ingredients
        WHERE ingredients.raw_material_id = $1 AND ingredients.product_id = $2;

        IF existing_count > 0 THEN
            RAISE EXCEPTION 'Ingredient with specified raw material already exists';
        END IF;
    END;
$_$;


ALTER PROCEDURE public.check_existing_ingredient(IN raw_material_id integer, IN product_id integer) OWNER TO postgres;

--
-- Name: check_material_availability(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.check_material_availability(IN product_id integer, IN production_quantity integer, OUT result integer)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM ingredients
        INNER JOIN raw_materials ON ingredients.raw_material_id = raw_materials.id
        WHERE ingredients.product_id = ($1)
        AND ingredients.quantity * production_quantity > raw_materials.quantity
    ) THEN
        result := 0; -- Недостаточно сырья для производства
    ELSE
        result := 1; -- Достаточно сырья для производства
    END IF;
END;
$_$;


ALTER PROCEDURE public.check_material_availability(IN product_id integer, IN production_quantity integer, OUT result integer) OWNER TO postgres;

--
-- Name: create_finished_product(character varying, integer, numeric, numeric); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.create_finished_product(IN product_name character varying, IN unit_of_measure_id integer, IN product_quantity numeric, IN product_amount numeric)
    LANGUAGE sql
    AS $_$
    INSERT INTO finished_products (name, unit_of_measure_id, quantity, amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
$_$;


ALTER PROCEDURE public.create_finished_product(IN product_name character varying, IN unit_of_measure_id integer, IN product_quantity numeric, IN product_amount numeric) OWNER TO postgres;

--
-- Name: create_new_bank(date, numeric, numeric, integer, numeric, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_new_bank(loan_date date, loan_amount numeric, annual_interest_rate numeric, term_in_month integer, penalty numeric, budgetid integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_bank_id integer;
BEGIN
    INSERT INTO bank (loan_date, loan_amount, annual_interest_rate, term_in_month, penalty)
    VALUES (loan_date, loan_amount, annual_interest_rate, term_in_month, penalty)
    RETURNING id INTO new_bank_id;

    UPDATE budget
    SET budget_amount = budget_amount + loan_amount
    WHERE id = budgetId;

    RAISE NOTICE 'New credit added to bank!';
END;
$$;


ALTER FUNCTION public.create_new_bank(loan_date date, loan_amount numeric, annual_interest_rate numeric, term_in_month integer, penalty numeric, budgetid integer) OWNER TO postgres;

--
-- Name: create_new_ingredient(integer, integer, numeric); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.create_new_ingredient(IN product_id integer, IN raw_material_id integer, IN quantity numeric)
    LANGUAGE plpgsql
    AS $$
begin
    -- Вызываем процедуру check_existing_ingredient для проверки существующего ингредиента
    CALL check_existing_ingredient(raw_material_id, product_id);

    -- Если прошла проверка, выполняем вставку нового ингредиента
    INSERT INTO ingredients (product_id, raw_material_id, quantity)
    VALUES (product_id, raw_material_id, quantity);
end;
$$;


ALTER PROCEDURE public.create_new_ingredient(IN product_id integer, IN raw_material_id integer, IN quantity numeric) OWNER TO postgres;

--
-- Name: create_pay_credit(numeric, numeric, numeric, numeric, date, date, integer, numeric, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_pay_credit(loan_part_param numeric, percent_amount_param numeric, penalty_amount_param numeric, total_amount_param numeric, payment_date_param date, payment_received_date_param date, overdue_param integer, rest_money_param numeric, bank_id_param integer, budget_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Вставляем новую запись в таблицу платежей
    INSERT INTO payment (loan_part,
                         percent_amount,
                         penalty_amount,
                         total_amount,
                         payment_date,
                         payment_received_date,
                         overdue,
                         rest_money,
                         bank_id)
    VALUES (loan_part_param,
            percent_amount_param,
            penalty_amount_param,
            total_amount_param,
            payment_date_param,
            payment_received_date_param,
            overdue_param,
            rest_money_param,
            bank_id_param);

    IF (rest_money_param = loan_part_param) Then
        UPDATE bank
        set status = true
        WHERE id = bank_id_param;
    end if;

    UPDATE budget
    SET budget_amount = budget_amount - total_amount_param
    WHERE budget.id = budget_id;
END;
$$;


ALTER FUNCTION public.create_pay_credit(loan_part_param numeric, percent_amount_param numeric, penalty_amount_param numeric, total_amount_param numeric, payment_date_param date, payment_received_date_param date, overdue_param integer, rest_money_param numeric, bank_id_param integer, budget_id integer) OWNER TO postgres;

--
-- Name: create_production(integer, integer, date, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.create_production(IN product_id_in integer, IN production_quantity integer, IN production_date_in date, IN employee_id_in integer, OUT result integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    availability_result INT;
    total_material_amount NUMERIC; -- Переменная для хранения суммы материалов
BEGIN
    -- Проверяем наличие достаточного количества материалов
    CALL check_material_availability(product_id_in, production_quantity, availability_result);

    IF availability_result = 1 THEN
        -- Если материалы доступны, создаем производство
        INSERT INTO production (product_id, quantity, production_date, employee_id)
        VALUES (product_id_in, production_quantity, production_date_in, employee_id_in);

        -- Уменьшаем количество и сумму всех видов сырья и получаем сумму материалов
        SELECT update_raw_materials_after_production(product_id_in, production_quantity) INTO total_material_amount;

        -- Увеличиваем количество и сумму готовой продукции на сумму материалов
        UPDATE finished_products
        SET
            quantity = quantity + production_quantity,
            amount = amount + total_material_amount
        WHERE id = product_id_in;

        result := 1; -- Производство успешно создано
    ELSE
        result := 0; -- Недостаточно материалов для производства
    END IF;
END;
$$;


ALTER PROCEDURE public.create_production(IN product_id_in integer, IN production_quantity integer, IN production_date_in date, IN employee_id_in integer, OUT result integer) OWNER TO postgres;

--
-- Name: delete_finished_product(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.delete_finished_product(IN p_id integer)
    LANGUAGE sql
    AS $$
DELETE FROM finished_products
WHERE id = p_id;
$$;


ALTER PROCEDURE public.delete_finished_product(IN p_id integer) OWNER TO postgres;

--
-- Name: delete_ingredient_by_id(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.delete_ingredient_by_id(IN ingredient_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM ingredients
    WHERE id = ingredient_id;
END;
$$;


ALTER PROCEDURE public.delete_ingredient_by_id(IN ingredient_id integer) OWNER TO postgres;

--
-- Name: delete_production(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.delete_production(IN production_id integer)
    LANGUAGE sql
    AS $$
    DELETE FROM production WHERE id = production_id;
$$;


ALTER PROCEDURE public.delete_production(IN production_id integer) OWNER TO postgres;

--
-- Name: get_bank_calculate_credit(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_bank_calculate_credit(bank_id_param integer) RETURNS TABLE(loan_part numeric, percent_amount numeric, penalty numeric, total_amount numeric, payment_date date, payment_received_date date, overdue integer, rest_money numeric, bank_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    loan_amount_var      DECIMAL(15, 2);
    penalty_var          DECIMAL(5, 2);
    term_in_month        INT;
    annual_interest_rate DECIMAL(5, 2);
    loan_date            DATE;
    last_payment_data    RECORD;
    last_payment_date    DATE;
BEGIN
    SELECT bank.loan_amount,
           bank.term_in_month,
           bank.annual_interest_rate,
           bank.loan_date,
           bank.penalty
    INTO
        loan_amount_var, term_in_month, annual_interest_rate, loan_date, penalty_var
    FROM bank
    WHERE bank.id = bank_id_param;

    -- Проверяем наличие данных в таблице payment
    IF NOT EXISTS (
        SELECT 1
        FROM payment
        WHERE payment.bank_id = bank_id_param
    ) THEN
        -- Если нет данных в таблице payment, используем данные из банка
        loan_part := loan_amount_var / term_in_month;
        percent_amount := loan_amount_var * (annual_interest_rate / 100) / 12;
        total_amount := loan_part + percent_amount;
        payment_date := loan_date + interval '30 days';
        payment_received_date := loan_date + interval '30 days';
        overdue := 0;
        rest_money := loan_amount_var;
        penalty := penalty_var;
    ELSE
        SELECT * INTO last_payment_data
        FROM payment
        WHERE payment.bank_id = bank_id_param
        ORDER BY payment.payment_date DESC
        LIMIT 1;
        -- Если есть данные в таблице payment, используем последние данные
        loan_part := loan_amount_var / term_in_month;
        rest_money := last_payment_data.rest_money - last_payment_data.loan_part;
        percent_amount := rest_money * (annual_interest_rate / 100) / 12;
        total_amount := loan_part + percent_amount;

        -- Получаем дату последнего платежа
        last_payment_date := last_payment_data.payment_date;

        -- Вычисляем дату следующего платежа
        payment_date := last_payment_date + interval '30 days';

        -- Вычисляем дату получения платежа
        payment_received_date := last_payment_date + interval '30 days';

        overdue := 0;
        penalty := penalty_var;
    END IF;

    -- Возвращаем вычисленные значения
    RETURN QUERY
    SELECT
        loan_part, percent_amount, penalty, total_amount,
        payment_date, payment_received_date, overdue, rest_money, bank_id_param;
END;
$$;


ALTER FUNCTION public.get_bank_calculate_credit(bank_id_param integer) OWNER TO postgres;

--
-- Name: get_banks_date(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_banks_date(startdate date DEFAULT NULL::date, enddate date DEFAULT NULL::date) RETURNS TABLE(id integer, loan_date date, loan_amount numeric, annual_interest_rate numeric, term_in_month integer, penalty numeric, status boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF startDate IS NOT NULL AND endDate IS NOT NULL THEN
        RETURN QUERY
            SELECT *
            FROM bank
            WHERE bank.loan_date BETWEEN startDate AND endDate
            ORDER BY bank.loan_date DESC;
    ELSE
        RETURN QUERY
            SELECT *
            FROM bank
            ORDER BY bank.loan_date DESC;
    END IF;
END;
$$;


ALTER FUNCTION public.get_banks_date(startdate date, enddate date) OWNER TO postgres;

--
-- Name: get_credit_data(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_credit_data(get_bank_id integer) RETURNS TABLE(id integer, loan_part numeric, percent_amount numeric, penalty_amount numeric, total_amount numeric, payment_date date, payment_received_date date, overdue integer, rest_money numeric, bank_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    loan_amount_calc DECIMAL(15, 2);
    annual_interest_rate_calc DECIMAL(5, 2);
    term_in_month_calc INT;
    loan_date_calc DATE;
    penalty_calc DECIMAL(5, 2);
    bankData bank%ROWTYPE;
BEGIN
    -- Get loan details from the bank table
    SELECT * INTO bankData FROM bank WHERE public.bank.id = get_bank_id;

    -- Extract loan details into variables
    loan_amount_calc := bankData.loan_amount;
    annual_interest_rate_calc := bankData.annual_interest_rate;
    term_in_month_calc := bankData.term_in_month;
    loan_date_calc := bankData.loan_date;
    penalty_calc := bankData.penalty;

    -- Calculate loan part
    loan_part := loan_amount_calc / term_in_month_calc;

    -- Calculate percent amount
    percent_amount := loan_amount_calc * (annual_interest_rate_calc / 100) / 12;

    -- Calculate penalty amount
    penalty_amount := (loan_part + percent_amount) * (penalty_calc / 100);

    -- Calculate total amount
    total_amount := loan_part + percent_amount + penalty_amount;

    -- Calculate payment and payment received date
    payment_date := loan_date_calc + interval '30 days';
    payment_received_date := loan_date_calc + interval '30 days';

    -- Set overdue to 0
    overdue := 0;

    -- Set rest money to loan amount initially
    rest_money := loan_amount_calc;

    -- Return the calculated values as a single row
    RETURN QUERY SELECT get_bank_id, loan_part, percent_amount, penalty_amount, total_amount, payment_date, payment_received_date, overdue, rest_money;
END;
$$;


ALTER FUNCTION public.get_credit_data(get_bank_id integer) OWNER TO postgres;

--
-- Name: get_finished_product_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_finished_product_by_id(finished_product_id integer) RETURNS TABLE(id integer, name character varying, quantity numeric, amount numeric, unit_of_measure_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT finished_products.id, finished_products.name, finished_products.quantity, finished_products.amount, finished_products.unit_of_measure_id
    FROM finished_products
    WHERE finished_products.id = finished_product_id;
END;
$$;


ALTER FUNCTION public.get_finished_product_by_id(finished_product_id integer) OWNER TO postgres;

--
-- Name: get_finished_products(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_finished_products() RETURNS TABLE(id integer, name character varying, quantity numeric, amount numeric, units_of_measure_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT fp.id, fp.name, fp.quantity, fp.amount, uom.name AS units_of_measure_name
    FROM finished_products fp
    LEFT JOIN units_of_measure uom ON uom.id = fp.unit_of_measure_id;
END;
$$;


ALTER FUNCTION public.get_finished_products() OWNER TO postgres;

--
-- Name: get_ingredient_by_id(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.get_ingredient_by_id(IN ingredient_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    CREATE TEMP TABLE temp_ingredient AS
    SELECT i.id, i.quantity, i.product_id, i.raw_material_id
    FROM ingredients i
    WHERE i.id = ingredient_id;
END;
$$;


ALTER PROCEDURE public.get_ingredient_by_id(IN ingredient_id integer) OWNER TO postgres;

--
-- Name: get_ingredients_by_finished_product_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_ingredients_by_finished_product_id(in_product_id integer) RETURNS TABLE(id integer, quantity numeric, product_id integer, raw_material_id integer, raw_material_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT i.id, i.quantity, i.product_id, i.raw_material_id, rm.name AS raw_material_name
    FROM ingredients i
    LEFT JOIN raw_materials rm ON rm.id = i.raw_material_id
    WHERE i.product_id = in_product_id;
END;
$$;


ALTER FUNCTION public.get_ingredients_by_finished_product_id(in_product_id integer) OWNER TO postgres;

--
-- Name: get_payments_by_bank_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_payments_by_bank_id(bank_id_param integer) RETURNS TABLE(id integer, loan_part numeric, percent_amount numeric, penalty_amount numeric, total_amount numeric, payment_date date, payment_received_date date, overdue integer, rest_money numeric, bank_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        payment.id, payment.loan_part, payment.percent_amount, payment.penalty_amount, payment.total_amount,
        payment.payment_date, payment.payment_received_date, payment.overdue, payment.rest_money, payment.bank_id
    FROM payment
    WHERE payment.bank_id = bank_id_param;
END;
$$;


ALTER FUNCTION public.get_payments_by_bank_id(bank_id_param integer) OWNER TO postgres;

--
-- Name: get_product_sales_date(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_product_sales_date(startdate date DEFAULT NULL::date, enddate date DEFAULT NULL::date) RETURNS TABLE(id integer, quantity numeric, amount numeric, sale_date date, employee_full_name character varying, product_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF startDate IS NOT NULL AND endDate IS NOT NULL THEN
        RETURN QUERY
            SELECT
                ps.id,
                ps.quantity,
                ps.amount,
                ps.sale_date,
                e.full_name AS employee_full_name,
                fp.name AS product_name
            FROM
                product_sales ps
            LEFT JOIN
                employees e ON e.employee_id = ps.employee_id
            LEFT JOIN
                finished_products fp ON ps.product_id = fp.id
            WHERE
                ps.sale_date BETWEEN startDate AND endDate;
    ELSE
        RETURN QUERY
            SELECT
                ps.id,
                ps.quantity,
                ps.amount,
                ps.sale_date,
                e.full_name AS employee_full_name,
                fp.name AS product_name
            FROM
                product_sales ps
            LEFT JOIN
                employees e ON e.employee_id = ps.employee_id
            LEFT JOIN
                finished_products fp ON ps.product_id = fp.id;
    END IF;
END;
$$;


ALTER FUNCTION public.get_product_sales_date(startdate date, enddate date) OWNER TO postgres;

--
-- Name: get_productions(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_productions() RETURNS TABLE(id integer, quantity numeric, production_date date, employee_full_name character varying, product_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
        SELECT p.id, p.quantity, p.production_date, e.full_name as employee_full_name, fp.name as product_name FROM production p
      LEFT JOIN employees e on e.employee_id = p.employee_id
      LEFT JOIN finished_products fp on p.product_id = fp.id;
END;
$$;


ALTER FUNCTION public.get_productions() OWNER TO postgres;

--
-- Name: get_productions_date(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_productions_date(startdate date DEFAULT NULL::date, enddate date DEFAULT NULL::date) RETURNS TABLE(id integer, quantity numeric, production_date date, employee_full_name character varying, product_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF startDate IS NOT NULL AND endDate IS NOT NULL THEN
        RETURN QUERY
            SELECT p.id, p.quantity, p.production_date, e.full_name AS employee_full_name, fp.name AS product_name
            FROM production p
            LEFT JOIN employees e ON e.employee_id = p.employee_id
            LEFT JOIN finished_products fp ON p.product_id = fp.id
            WHERE p.production_date BETWEEN startDate AND endDate;
    ELSE
        RETURN QUERY
            SELECT p.id, p.quantity, p.production_date, e.full_name AS employee_full_name, fp.name AS product_name
            FROM production p
            LEFT JOIN employees e ON e.employee_id = p.employee_id
            LEFT JOIN finished_products fp ON p.product_id = fp.id;
    END IF;
END;
$$;


ALTER FUNCTION public.get_productions_date(startdate date, enddate date) OWNER TO postgres;

--
-- Name: get_raw_material_purchases_date(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_raw_material_purchases_date(startdate date DEFAULT NULL::date, enddate date DEFAULT NULL::date) RETURNS TABLE(id integer, quantity numeric, amount numeric, purchase_date date, employee_full_name character varying, raw_material_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF startDate IS NOT NULL AND endDate IS NOT NULL THEN
        RETURN QUERY
            SELECT
                rmp.id,
                rmp.quantity,
                rmp.amount,
                rmp.purchase_date,
                e.full_name AS employee_full_name,
                rm.name AS raw_material_name
            FROM
                raw_material_purchase rmp
            LEFT JOIN
                employees e ON e.employee_id = rmp.employee_id
            LEFT JOIN
                raw_materials rm ON rmp.raw_material_id = rm.id
            WHERE
                rmp.purchase_date BETWEEN startDate AND endDate;
    ELSE
        RETURN QUERY
            SELECT
                rmp.id,
                rmp.quantity,
                rmp.amount,
                rmp.purchase_date,
                e.full_name AS employee_full_name,
                rm.name AS raw_material_name
            FROM
                raw_material_purchase rmp
            LEFT JOIN
                employees e ON e.employee_id = rmp.employee_id
            LEFT JOIN
                raw_materials rm ON rmp.raw_material_id = rm.id;
    END IF;
END;
$$;


ALTER FUNCTION public.get_raw_material_purchases_date(startdate date, enddate date) OWNER TO postgres;

--
-- Name: get_salary_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_salary_by_id(salaryid integer) RETURNS TABLE(id integer, full_name character varying, year integer, month integer, production_count integer, purchase_count integer, sales_count integer, common_count integer, salary numeric, bonus numeric, general numeric, issued boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, e.full_name, s.year, s.month, s.production_count, s.purchase_count, s.sales_count, s.common_count, s.salary, s.bonus, s.general, s.issued
    FROM salary s
    LEFT JOIN employees e ON e.employee_id = s.employee_id
    WHERE s.id = salaryId;
END;
$$;


ALTER FUNCTION public.get_salary_by_id(salaryid integer) OWNER TO postgres;

--
-- Name: get_salary_date(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_salary_date(startdate date, enddate date) RETURNS TABLE(id integer, employee_id integer, full_name character varying, year integer, month integer, purchase_count integer, production_count integer, sales_count integer, common_count integer, salary numeric, bonus numeric, general numeric, issued boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY
    SELECT
        s.id,
        s.employee_id,
        e.full_name,
        s.year,
        s.month,
        s.purchase_count,
        s.production_count,
        s.sales_count,
        s.common_count,
        s.salary,
        s.bonus,
        s.general,
        s.issued
    FROM
        salary s
    LEFT JOIN
        employees e ON s.employee_id = e.employee_id
    WHERE
        s.year >= EXTRACT(YEAR FROM startDate) AND s.year <= EXTRACT(YEAR FROM endDate)
        AND s.month >= EXTRACT(MONTH FROM startDate) AND s.month <= EXTRACT(MONTH FROM endDate);
END;
$$;


ALTER FUNCTION public.get_salary_date(startdate date, enddate date) OWNER TO postgres;

--
-- Name: update_finished_product(integer, character varying, integer, numeric, numeric); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_finished_product(IN p_id integer, IN p_name character varying, IN p_unit_of_measure_id integer, IN p_quantity numeric, IN p_amount numeric)
    LANGUAGE sql
    AS $$
UPDATE finished_products
SET name = p_name,
    unit_of_measure_id = p_unit_of_measure_id,
    quantity = p_quantity,
    amount = p_amount
WHERE id = p_id
RETURNING *;
$$;


ALTER PROCEDURE public.update_finished_product(IN p_id integer, IN p_name character varying, IN p_unit_of_measure_id integer, IN p_quantity numeric, IN p_amount numeric) OWNER TO postgres;

--
-- Name: update_ingredient_quantity(integer, numeric); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_ingredient_quantity(IN ingredient_id integer, IN new_quantity numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE ingredients
    SET quantity = new_quantity
    WHERE id = ingredient_id;
END;
$$;


ALTER PROCEDURE public.update_ingredient_quantity(IN ingredient_id integer, IN new_quantity numeric) OWNER TO postgres;

--
-- Name: update_raw_materials_after_production(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_raw_materials_after_production(product_id_in integer, production_quantity integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_material_amount NUMERIC := 0;
    material_data RECORD;
BEGIN
    -- Получаем список материалов, необходимых для производства данного продукта
    FOR material_data IN
        SELECT ing.raw_material_id, ing.quantity AS ingredient_quantity, rm.amount, rm.quantity AS raw_material_quantity
        FROM ingredients ing
        JOIN raw_materials rm ON ing.raw_material_id = rm.id
        WHERE ing.product_id = product_id_in
    LOOP
        -- Вычисляем сумму, которую нужно вычесть из каждого материала
        -- на основе его количества и стоимости
        UPDATE raw_materials
        SET
            quantity = quantity - (material_data.ingredient_quantity * production_quantity),
            amount = amount - ((material_data.ingredient_quantity * material_data.amount / material_data.raw_material_quantity) * production_quantity)
        WHERE id = material_data.raw_material_id;

        -- Увеличиваем общую сумму
        total_material_amount := total_material_amount + ((material_data.ingredient_quantity * material_data.amount / material_data.raw_material_quantity) * production_quantity);
    END LOOP;

    RETURN total_material_amount;
END;
$$;


ALTER FUNCTION public.update_raw_materials_after_production(product_id_in integer, production_quantity integer) OWNER TO postgres;

--
-- Name: update_salary_general(integer, numeric); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_salary_general(IN salaryid integer, IN generalvalue numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE salary
    SET general = generalValue
    WHERE id = salaryId;
END;
$$;


ALTER PROCEDURE public.update_salary_general(IN salaryid integer, IN generalvalue numeric) OWNER TO postgres;

--
-- Name: update_salary_issued_and_budget(integer, numeric, integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_salary_issued_and_budget(IN budgetid integer, IN budget_amount_update numeric, IN yearnumber integer, IN monthnumber integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE budget
    SET budget_amount = budget_amount - budget_amount_update
    WHERE id = budgetId;

    UPDATE salary
    SET issued = true
    WHERE year = yearNumber AND month = monthNumber;
END;
$$;


ALTER PROCEDURE public.update_salary_issued_and_budget(IN budgetid integer, IN budget_amount_update numeric, IN yearnumber integer, IN monthnumber integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bank; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank (
    id integer NOT NULL,
    loan_date date NOT NULL,
    loan_amount numeric(15,2) NOT NULL,
    annual_interest_rate numeric(5,2) NOT NULL,
    term_in_month integer NOT NULL,
    penalty numeric(5,2) NOT NULL,
    status boolean DEFAULT false
);


ALTER TABLE public.bank OWNER TO postgres;

--
-- Name: bank_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bank_id_seq OWNER TO postgres;

--
-- Name: bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bank_id_seq OWNED BY public.bank.id;


--
-- Name: budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget (
    id integer NOT NULL,
    budget_amount numeric(20,2),
    bonus numeric(10,2),
    markup numeric(10,2)
);


ALTER TABLE public.budget OWNER TO postgres;

--
-- Name: budget_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.budget_id_seq OWNER TO postgres;

--
-- Name: budget_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budget_id_seq OWNED BY public.budget.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    employee_id integer NOT NULL,
    full_name character varying(255),
    position_id integer,
    salary numeric(10,2),
    address character varying(255),
    phone character varying(20),
    email character varying(255),
    password character varying(255),
    token character varying(255)
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employees_employee_id_seq OWNER TO postgres;

--
-- Name: employees_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_employee_id_seq OWNED BY public.employees.employee_id;


--
-- Name: finished_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finished_products (
    id integer NOT NULL,
    name character varying(255),
    unit_of_measure_id integer,
    quantity numeric(10,2),
    amount numeric(10,2)
);


ALTER TABLE public.finished_products OWNER TO postgres;

--
-- Name: finished_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finished_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.finished_products_id_seq OWNER TO postgres;

--
-- Name: finished_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finished_products_id_seq OWNED BY public.finished_products.id;


--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredients (
    id integer NOT NULL,
    product_id integer,
    raw_material_id integer,
    quantity numeric(10,2)
);


ALTER TABLE public.ingredients OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_id_seq OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.ingredients.id;


--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    id integer NOT NULL,
    loan_part numeric(10,2) NOT NULL,
    percent_amount numeric(10,2) NOT NULL,
    penalty_amount numeric(10,2) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    payment_date date NOT NULL,
    payment_received_date date NOT NULL,
    overdue integer NOT NULL,
    rest_money numeric(10,2) NOT NULL,
    bank_id integer
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_id_seq OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_id_seq OWNED BY public.payment.id;


--
-- Name: positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.positions (
    position_id integer NOT NULL,
    position_name character varying(255),
    role_id integer
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- Name: positions_position_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.positions_position_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.positions_position_id_seq OWNER TO postgres;

--
-- Name: positions_position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.positions_position_id_seq OWNED BY public.positions.position_id;


--
-- Name: product_sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_sales (
    id integer NOT NULL,
    product_id integer,
    quantity numeric(10,2),
    amount numeric(10,2),
    sale_date date,
    employee_id integer
);


ALTER TABLE public.product_sales OWNER TO postgres;

--
-- Name: product_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_sales_id_seq OWNER TO postgres;

--
-- Name: product_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_sales_id_seq OWNED BY public.product_sales.id;


--
-- Name: production; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production (
    id integer NOT NULL,
    product_id integer,
    quantity numeric(10,2),
    production_date date,
    employee_id integer
);


ALTER TABLE public.production OWNER TO postgres;

--
-- Name: production_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.production_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.production_id_seq OWNER TO postgres;

--
-- Name: production_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.production_id_seq OWNED BY public.production.id;


--
-- Name: raw_material_purchase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raw_material_purchase (
    id integer NOT NULL,
    quantity numeric(10,2),
    amount numeric(10,2),
    purchase_date date,
    raw_material_id integer NOT NULL,
    employee_id integer NOT NULL
);


ALTER TABLE public.raw_material_purchase OWNER TO postgres;

--
-- Name: raw_material_purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.raw_material_purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.raw_material_purchase_id_seq OWNER TO postgres;

--
-- Name: raw_material_purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.raw_material_purchase_id_seq OWNED BY public.raw_material_purchase.id;


--
-- Name: raw_materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raw_materials (
    id integer NOT NULL,
    name character varying(255),
    unit_of_measure_id integer,
    quantity numeric(10,2),
    amount numeric(10,2)
);


ALTER TABLE public.raw_materials OWNER TO postgres;

--
-- Name: raw_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.raw_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.raw_materials_id_seq OWNER TO postgres;

--
-- Name: raw_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.raw_materials_id_seq OWNED BY public.raw_materials.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(255)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: salary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary (
    id integer NOT NULL,
    employee_id integer,
    year integer,
    month integer,
    purchase_count integer DEFAULT 0,
    production_count integer DEFAULT 0,
    sales_count integer DEFAULT 0,
    common_count integer DEFAULT 0,
    salary numeric(10,2),
    bonus numeric(10,2),
    general numeric(10,2),
    issued boolean DEFAULT false
);


ALTER TABLE public.salary OWNER TO postgres;

--
-- Name: salary_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.salary_id_seq OWNER TO postgres;

--
-- Name: salary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salary_id_seq OWNED BY public.salary.id;


--
-- Name: units_of_measure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units_of_measure (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.units_of_measure OWNER TO postgres;

--
-- Name: units_of_measure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.units_of_measure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.units_of_measure_id_seq OWNER TO postgres;

--
-- Name: units_of_measure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.units_of_measure_id_seq OWNED BY public.units_of_measure.id;


--
-- Name: bank id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank ALTER COLUMN id SET DEFAULT nextval('public.bank_id_seq'::regclass);


--
-- Name: budget id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget ALTER COLUMN id SET DEFAULT nextval('public.budget_id_seq'::regclass);


--
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_employee_id_seq'::regclass);


--
-- Name: finished_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finished_products ALTER COLUMN id SET DEFAULT nextval('public.finished_products_id_seq'::regclass);


--
-- Name: ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
-- Name: payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment ALTER COLUMN id SET DEFAULT nextval('public.payment_id_seq'::regclass);


--
-- Name: positions position_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions ALTER COLUMN position_id SET DEFAULT nextval('public.positions_position_id_seq'::regclass);


--
-- Name: product_sales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales ALTER COLUMN id SET DEFAULT nextval('public.product_sales_id_seq'::regclass);


--
-- Name: production id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production ALTER COLUMN id SET DEFAULT nextval('public.production_id_seq'::regclass);


--
-- Name: raw_material_purchase id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_material_purchase ALTER COLUMN id SET DEFAULT nextval('public.raw_material_purchase_id_seq'::regclass);


--
-- Name: raw_materials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_materials ALTER COLUMN id SET DEFAULT nextval('public.raw_materials_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: salary id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary ALTER COLUMN id SET DEFAULT nextval('public.salary_id_seq'::regclass);


--
-- Name: units_of_measure id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units_of_measure ALTER COLUMN id SET DEFAULT nextval('public.units_of_measure_id_seq'::regclass);


--
-- Data for Name: bank; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank (id, loan_date, loan_amount, annual_interest_rate, term_in_month, penalty, status) FROM stdin;
1	2024-04-26	1000000.00	18.00	60	2.00	f
2	2024-05-06	2000000.00	18.00	60	2.00	f
\.


--
-- Data for Name: budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget (id, budget_amount, bonus, markup) FROM stdin;
1	13669860.66	2.00	40.00
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (employee_id, full_name, position_id, salary, address, phone, email, password, token) FROM stdin;
1	Sagynaliev Taalaibek	2	10000.00	Bishkek	505601100	admin@gmail.com	$2b$10$JCF2vE7svvx3pPihxc9LweHps42BprTU3el1Kt4ledxbyjo05daf.	\N
3	Azamat	4	100000.00	Bishkek	555666888	azamat@gmail.com	$2b$10$o.kbidQmLads7n.ipBFgO.uyH4BlwghW8XgQNbDmeTdN5z1thVYtK	\N
7	test	3	1000.00	Karakol	+996505601100	test@gmail.com	$2b$10$TN5y3I1kLV2f7ZU0G17J2.BZxlk6QKIwd2q3PflycYztK.VMBnuUa	\N
2	Adylbek	1	10000.00	Karakol	+99650560000	adylbek@gmail.com	$2b$10$oJyLOhCxaQJHrn2.IzmuBO1lVkKdCVXWRsadS1S76D9713gCGZ6T6	\N
4	Abulhair	5	100000.00	Bishkek	777888666	abulhair@gmail.com	$2b$10$RekXnqLUKf3IOu6wr2GJbekxgqv2hUYUUfqHULa4P2pHCUblGk1ye	\N
5	Mustafa	3	10000.00	Bishkek	9999777788	mustafa@gmail.com	$2b$10$f8jlQrlnseZrj0nckVFcAu3qGvD7klMdJNH7zInbDriRFk9FjpEm6	\N
\.


--
-- Data for Name: finished_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finished_products (id, name, unit_of_measure_id, quantity, amount) FROM stdin;
1	Каракум	3	9.00	9000.00
2	Бомба	3	14.00	3042.86
3	Эскимо	3	20.00	2000.00
\.


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredients (id, product_id, raw_material_id, quantity) FROM stdin;
1	2	2	2.00
2	2	3	3.40
3	1	2	3.00
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (id, loan_part, percent_amount, penalty_amount, total_amount, payment_date, payment_received_date, overdue, rest_money, bank_id) FROM stdin;
1	16666.67	15000.00	0.00	31666.67	2024-05-25	2024-04-26	0	1000000.00	1
2	16666.67	14750.00	0.00	31416.67	2024-06-23	2024-04-26	0	983333.33	1
3	16666.67	14500.00	6233.33	37400.00	2024-07-22	2024-08-02	10	966666.66	1
\.


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.positions (position_id, position_name, role_id) FROM stdin;
1	Director	2
2	Super Admin	1
3	Technologist	3
4	Manager Purchase	4
5	Main Accountant	5
\.


--
-- Data for Name: product_sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sales (id, product_id, quantity, amount, sale_date, employee_id) FROM stdin;
1	2	2.00	496.00	2024-04-26	2
2	1	1.00	1400.00	2024-04-26	2
3	2	1.00	248.00	2024-05-05	2
\.


--
-- Data for Name: production; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.production (id, product_id, quantity, production_date, employee_id) FROM stdin;
1	2	2.00	2024-04-26	2
2	2	1.00	2024-05-05	1
\.


--
-- Data for Name: raw_material_purchase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raw_material_purchase (id, quantity, amount, purchase_date, raw_material_id, employee_id) FROM stdin;
1	2.00	200.00	2024-04-26	3	1
2	10.00	1000.00	2024-05-05	3	2
\.


--
-- Data for Name: raw_materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raw_materials (id, name, unit_of_measure_id, quantity, amount) FROM stdin;
1	Молоко	2	10.00	700.00
2	Шоколад 	1	4.00	800.00
3	Ягоды 	1	6.80	680.00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role_name) FROM stdin;
1	admin
2	director
3	technologist
4	manager
5	accountant
\.


--
-- Data for Name: salary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary (id, employee_id, year, month, purchase_count, production_count, sales_count, common_count, salary, bonus, general, issued) FROM stdin;
3	4	2024	4	0	0	0	0	100000.00	0.00	100000.00	f
4	5	2024	4	0	0	0	0	10000.00	0.00	10000.00	f
2	3	2024	4	0	0	0	0	100000.00	0.00	100000.00	f
5	1	2024	4	1	0	0	1	10000.00	200.00	10200.00	f
1	2	2024	4	0	1	2	3	10000.00	600.00	10600.00	f
6	4	2024	6	0	0	0	0	100000.00	0.00	100000.00	f
7	5	2024	6	0	0	0	0	10000.00	0.00	10000.00	f
8	3	2024	6	0	0	0	0	100000.00	0.00	100000.00	f
9	1	2024	6	0	0	0	0	10000.00	0.00	10000.00	f
10	2	2024	6	0	0	0	0	10000.00	0.00	10000.00	f
13	3	2024	5	0	0	0	0	100000.00	0.00	100000.00	t
11	4	2024	5	0	0	0	0	100000.00	0.00	100000.00	t
12	5	2024	5	0	0	0	0	10000.00	0.00	10000.00	t
14	2	2024	5	1	0	1	2	10000.00	400.00	10400.00	t
15	1	2024	5	0	1	0	1	10000.00	200.00	10200.00	t
\.


--
-- Data for Name: units_of_measure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units_of_measure (id, name) FROM stdin;
1	KG
2	Литр
3	ШТ
\.


--
-- Name: bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bank_id_seq', 2, true);


--
-- Name: budget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budget_id_seq', 1, true);


--
-- Name: employees_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_employee_id_seq', 7, true);


--
-- Name: finished_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finished_products_id_seq', 3, true);


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 3, true);


--
-- Name: payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_id_seq', 3, true);


--
-- Name: positions_position_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.positions_position_id_seq', 5, true);


--
-- Name: product_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_sales_id_seq', 3, true);


--
-- Name: production_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_id_seq', 2, true);


--
-- Name: raw_material_purchase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raw_material_purchase_id_seq', 2, true);


--
-- Name: raw_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raw_materials_id_seq', 3, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: salary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salary_id_seq', 15, true);


--
-- Name: units_of_measure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.units_of_measure_id_seq', 3, true);


--
-- Name: bank bank_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT bank_pkey PRIMARY KEY (id);


--
-- Name: budget budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: finished_products finished_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finished_products
    ADD CONSTRAINT finished_products_pkey PRIMARY KEY (id);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (position_id);


--
-- Name: product_sales product_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales
    ADD CONSTRAINT product_sales_pkey PRIMARY KEY (id);


--
-- Name: production production_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production
    ADD CONSTRAINT production_pkey PRIMARY KEY (id);


--
-- Name: raw_material_purchase raw_material_purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_material_purchase
    ADD CONSTRAINT raw_material_purchase_pkey PRIMARY KEY (id);


--
-- Name: raw_materials raw_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: salary salary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_pkey PRIMARY KEY (id);


--
-- Name: units_of_measure units_of_measure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units_of_measure
    ADD CONSTRAINT units_of_measure_pkey PRIMARY KEY (id);


--
-- Name: finished_products finished_products_unit_of_measure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finished_products
    ADD CONSTRAINT finished_products_unit_of_measure_id_fkey FOREIGN KEY (unit_of_measure_id) REFERENCES public.units_of_measure(id);


--
-- Name: ingredients ingredients_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.finished_products(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: ingredients ingredients_raw_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: payment payment_bank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_bank_id_fkey FOREIGN KEY (bank_id) REFERENCES public.bank(id);


--
-- Name: product_sales product_sales_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales
    ADD CONSTRAINT product_sales_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- Name: product_sales product_sales_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales
    ADD CONSTRAINT product_sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.finished_products(id);


--
-- Name: production production_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production
    ADD CONSTRAINT production_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: production production_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production
    ADD CONSTRAINT production_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.finished_products(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: raw_material_purchase raw_material_purchase_employees_employee_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_material_purchase
    ADD CONSTRAINT raw_material_purchase_employees_employee_id_fk FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- Name: raw_material_purchase raw_material_purchase_raw_materials_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_material_purchase
    ADD CONSTRAINT raw_material_purchase_raw_materials_id_fk FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id);


--
-- Name: raw_materials raw_materials_unit_of_measure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_unit_of_measure_id_fkey FOREIGN KEY (unit_of_measure_id) REFERENCES public.units_of_measure(id);


--
-- Name: salary salary_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- PostgreSQL database dump complete
--

