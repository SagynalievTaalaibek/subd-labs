CREATE TABLE positions (
    position_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    position_name VARCHAR(255)
);

-- Создание таблицы employees
CREATE TABLE employees (
    employee_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name VARCHAR(255),
    position_id UUID REFERENCES positions(position_id),
    salary DECIMAL(10, 2),
    address VARCHAR(255),
    phone VARCHAR(20)
);